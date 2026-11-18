import { Button, List, ListCell, Typography, useToast } from "@wanteddev/wds";
import { IconMoreVertical } from "@wanteddev/wds-icon";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { PART_COVER_TONE } from "@/components/music/Cover";
import BottomSheet from "@/components/ui/BottomSheet";
import ConfirmSheet from "@/components/ui/ConfirmSheet";
import EmptyState from "@/components/ui/EmptyState";
import FeedbackLine from "@/components/ui/FeedbackLine";
import HeaderIconButton from "@/components/ui/HeaderIconButton";
import { rowClick } from "@/components/ui/listCellEvents";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SectionHeader from "@/components/ui/SectionHeader";
import Status from "@/components/ui/Status";
import {
  useScreenBackdrop,
  useScreenHeader,
} from "@/components/ui/useScreenHeader";
import FeedbackSheet from "@/features/practice/components/FeedbackSheet";
import PlayerArt from "@/features/practice/components/PlayerArt";
import PlayerControls from "@/features/practice/components/PlayerControls";
import {
  formatSpan,
  isAnalysisInProgress,
  PRACTICE_STATUS_TONE,
  reachedFeedbackIndex,
} from "@/features/practice/practiceHelpers";
import {
  deletePracticeRecording,
  retryPracticeAnalysis,
} from "@/features/practice/practiceStore";
import { usePlayback } from "@/features/practice/usePlayback";
import { usePracticeRecording } from "@/features/practice/usePracticeRecording";
import { formatMonthDay } from "@/lib/domain/format";
import { INSTRUMENT_LABEL, PRACTICE_STATUS_LABEL } from "@/lib/domain/labels";
import type { PracticeRecording } from "@/lib/domain/types";
import { toId } from "@/mocks/selectors";

// Figma 05 연습 분석 결과(418:12518) + 18 구간 피드백 시트. 녹음 재생(아직 타이머로 흉내) + 원곡과 다르게
// 연주한 구간. 분석 중이면 상세를 5초마다 다시 조회하고(usePracticeRecording), 실패면 사유와 다시 요청.

const DEFAULT_VOLUME = 70;
/** 이전 구간을 누를 때 이 초 안쪽이면 지금 구간의 처음이 아니라 그 앞 구간으로 간다(음악 앱 관례) */
const PREVIOUS_GRACE_SEC = 1;

function rerecordPath(recording: PracticeRecording): string {
  const query = new URLSearchParams({
    part: recording.part,
    songId: String(recording.song.id),
  });
  return `/practice/new?${query.toString()}`;
}

interface PracticeDetailBodyProps {
  recording: PracticeRecording;
  onRetry: () => void;
  feedbackSheetOpen: boolean;
  onFeedbackSheetOpenChange: (open: boolean) => void;
}

function PracticeDetailBody({
  feedbackSheetOpen,
  onFeedbackSheetOpenChange,
  onRetry,
  recording,
}: PracticeDetailBodyProps) {
  const navigate = useNavigate();
  const { playing, positionSec, seek, toggle } = usePlayback(
    recording.durationSec,
  );
  const [volume, setVolume] = useState(DEFAULT_VOLUME);

  const feedbacks = [...recording.feedbacks].sort(
    (a, b) => a.startSec - b.startSec,
  );
  const reached = reachedFeedbackIndex(feedbacks, positionSec);
  // 아직 첫 피드백 전이면 다가올 첫 줄을 밝힌다.
  const currentIndex = Math.max(reached, 0);
  const previousStart = feedbacks
    .map((feedback) => feedback.startSec)
    .filter((start) => start < positionSec - PREVIOUS_GRACE_SEC)
    .pop();
  const nextStart = feedbacks
    .map((feedback) => feedback.startSec)
    .find((start) => start > positionSec);

  return (
    <>
      <ScreenBody>
        <div className="px-5 pt-3">
          <PlayerArt
            durationSec={recording.durationSec}
            feedbacks={recording.status === "DONE" ? feedbacks : []}
            onSeek={seek}
            positionSec={positionSec}
          />
        </div>

        <div className="flex flex-col gap-1 px-5 pt-5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <Typography
              as="h1"
              color="semantic.label.strong"
              variant="heading1"
              weight="bold"
            >
              {recording.title}
            </Typography>
            <Status tone={PRACTICE_STATUS_TONE[recording.status]}>
              {PRACTICE_STATUS_LABEL[recording.status]}
            </Status>
          </div>
          <Typography color="semantic.label.alternative" variant="label2">
            {recording.song.artist} · {INSTRUMENT_LABEL[recording.part]} ·{" "}
            {formatMonthDay(recording.createdAt)}
          </Typography>
        </div>

        <PlayerControls
          hasNext={nextStart !== undefined}
          hasPrevious={positionSec > 0}
          onNext={() => {
            if (nextStart !== undefined) seek(nextStart);
          }}
          onPrevious={() => seek(previousStart ?? 0)}
          onToggle={toggle}
          onVolumeChange={setVolume}
          playing={playing}
          volume={volume}
        />

        {recording.status === "DONE" ? (
          <>
            <SectionHeader
              actionLabel="전체 보기"
              onAction={() => onFeedbackSheetOpenChange(true)}
              title="구간 피드백"
            />
            <div className="flex flex-col gap-4.5 px-5 pt-2">
              {feedbacks.length === 0 ? (
                <FeedbackLine
                  current
                  ok
                  text=""
                  time={formatSpan(0, Math.floor(recording.durationSec))}
                />
              ) : (
                feedbacks.map((feedback, index) => (
                  <FeedbackLine
                    current={index === currentIndex}
                    key={`${feedback.startSec}-${feedback.endSec}`}
                    onClick={() => seek(feedback.startSec)}
                    text={feedback.content}
                    time={formatSpan(feedback.startSec, feedback.endSec)}
                  />
                ))
              )}
            </div>
          </>
        ) : (
          <>
            <SectionHeader title="구간 피드백" />
            <div className="flex flex-col items-start gap-3 px-5 pt-1">
              <Typography
                className="whitespace-pre-line"
                color="semantic.label.alternative"
                variant="body2"
              >
                {isAnalysisInProgress(recording.status)
                  ? "원곡과 비교하고 있어요.\n분석이 끝나면 다르게 연주한 구간을 짚어 드려요."
                  : (recording.failureReason ?? "분석하지 못했어요.")}
              </Typography>
              {recording.status === "FAILED" && (
                <Button
                  color="primary"
                  onClick={onRetry}
                  size="small"
                  variant="solid"
                >
                  다시 요청
                </Button>
              )}
            </div>
          </>
        )}
      </ScreenBody>

      {recording.status === "DONE" && (
        <FeedbackSheet
          onOpenChange={onFeedbackSheetOpenChange}
          onRerecord={() => navigate(rerecordPath(recording))}
          onSeek={seek}
          open={feedbackSheetOpen}
          positionSec={positionSec}
          recording={recording}
        />
      )}
    </>
  );
}

function PracticeDetailScreen() {
  const navigate = useNavigate();
  const toast = useToast();
  const { recordingId } = useParams();
  const id = toId(recordingId);
  const { recording, refresh } = usePracticeRecording(id);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [feedbackSheetOpen, setFeedbackSheetOpen] = useState(false);
  const found = recording !== undefined;

  useScreenHeader(
    useMemo(
      () => (
        <ScreenHeader
          title="연습 분석"
          trailing={
            found ? (
              <HeaderIconButton
                icon={<IconMoreVertical />}
                label="더보기"
                onClick={() => setMenuOpen(true)}
              />
            ) : undefined
          }
        />
      ),
      [found],
    ),
  );
  useScreenBackdrop(
    recording ? (`cover-${PART_COVER_TONE[recording.part]}` as const) : null,
  );

  if (!recording) {
    return (
      <ScreenBody className="flex flex-col justify-center">
        <EmptyState
          action={{
            label: "목록 보기",
            onClick: () => navigate("/practice", { replace: true }),
          }}
          description="지웠거나 없는 녹음이에요."
          title="녹음을 찾을 수 없어요"
        />
      </ScreenBody>
    );
  }

  const retry = () => {
    retryPracticeAnalysis(recording.id);
    refresh();
    toast({ content: "다시 분석을 요청했어요", variant: "positive" });
  };

  const remove = () => {
    deletePracticeRecording(recording.id);
    toast({ content: "녹음을 지웠어요", variant: "positive" });
    navigate("/practice", { replace: true });
  };

  return (
    <>
      <PracticeDetailBody
        feedbackSheetOpen={feedbackSheetOpen}
        key={recording.id}
        onFeedbackSheetOpenChange={setFeedbackSheetOpen}
        onRetry={retry}
        recording={recording}
      />

      <BottomSheet onOpenChange={setMenuOpen} open={menuOpen}>
        <List className="-mx-5">
          <ListCell
            fillWidth
            onClick={rowClick(() => {
              setMenuOpen(false);
              navigate(rerecordPath(recording));
            })}
          >
            <Typography color="semantic.label.strong" variant="body1">
              다시 녹음
            </Typography>
          </ListCell>
          <ListCell
            fillWidth
            onClick={rowClick(() => {
              setMenuOpen(false);
              setConfirmOpen(true);
            })}
          >
            <Typography color="semantic.label.strong" variant="body1">
              녹음 삭제
            </Typography>
          </ListCell>
        </List>
      </BottomSheet>

      <ConfirmSheet
        confirmLabel="삭제"
        description={
          "녹음과 분석 결과를 함께 지워요.\n지운 뒤엔 되돌릴 수 없어요."
        }
        onConfirm={remove}
        onOpenChange={setConfirmOpen}
        open={confirmOpen}
        title="이 녹음을 지울까요?"
      />
    </>
  );
}

export default PracticeDetailScreen;
