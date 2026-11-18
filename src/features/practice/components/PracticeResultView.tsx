import { Typography } from "@wanteddev/wds";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenBody from "@/components/ui/ScreenBody";
import Status from "@/components/ui/Status";
import FeedbackPeek from "@/features/practice/components/FeedbackPeek";
import FeedbackSheet from "@/features/practice/components/FeedbackSheet";
import PlayerArt from "@/features/practice/components/PlayerArt";
import PlayerControls from "@/features/practice/components/PlayerControls";
import {
  newAnalysisPath,
  PRACTICE_STATUS_TONE,
  reachedFeedbackIndex,
} from "@/features/practice/practiceHelpers";
import { usePlayback } from "@/features/practice/usePlayback";
import { formatMonthDay } from "@/lib/domain/format";
import { INSTRUMENT_LABEL, PRACTICE_STATUS_LABEL } from "@/lib/domain/labels";
import type { PracticeRecording } from "@/lib/domain/types";

// Figma 05 연습 분석 결과(418:12518) — 분석이 끝난(DONE) 상세가 그리는 모습. 위에서부터 큰 파형(다르게
// 연주한 구간 띠) · 시간 · 제목 + 상태 · 메타, 남는 자리를 비우고 재생 컨트롤 · 음량을 바닥 패널 바로
// 위에 둔다. 바닥 패널(구간 피드백 N곳 + 지금 구간 한 줄)을 누르면 18 구간 피드백 시트가 열린다.
// 녹음 재생은 아직 타이머로 흉내 낸다(usePlayback).

const DEFAULT_VOLUME = 70;
/** 이전 구간을 누를 때 이 초 안쪽이면 지금 구간의 처음이 아니라 그 앞 구간으로 간다(음악 앱 관례) */
const PREVIOUS_GRACE_SEC = 1;

function PracticeResultView({ recording }: { recording: PracticeRecording }) {
  const navigate = useNavigate();
  const { playing, positionSec, seek, toggle } = usePlayback(
    recording.durationSec,
  );
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [sheetOpen, setSheetOpen] = useState(false);

  const feedbacks = [...recording.feedbacks].sort(
    (a, b) => a.startSec - b.startSec,
  );
  // 아직 첫 피드백 전이면 다가올 첫 구간을 보여 준다.
  const currentIndex = Math.max(
    reachedFeedbackIndex(feedbacks, positionSec),
    0,
  );
  const starts = feedbacks.map((feedback) => feedback.startSec);
  const previousStart = starts
    .filter((start) => start < positionSec - PREVIOUS_GRACE_SEC)
    .pop();
  const nextStart = starts.find((start) => start > positionSec);

  return (
    <>
      <ScreenBody className="flex flex-col">
        <div className="px-5 pt-3">
          <PlayerArt
            durationSec={recording.durationSec}
            feedbacks={feedbacks}
            onSeek={seek}
            positionSec={positionSec}
          />
        </div>

        <div className="flex flex-col gap-1 px-5 pt-8">
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

        {/* 제목과 컨트롤 사이를 비워 컨트롤을 바닥 패널 쪽으로 민다(화면이 작으면 최소 여백만) */}
        <div className="min-h-6 flex-1" />

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
      </ScreenBody>

      <FeedbackPeek
        currentIndex={currentIndex}
        durationSec={recording.durationSec}
        feedbacks={feedbacks}
        onOpen={() => setSheetOpen(true)}
      />

      <FeedbackSheet
        onOpenChange={setSheetOpen}
        onRerecord={() => navigate(newAnalysisPath(recording))}
        onSeek={seek}
        open={sheetOpen}
        positionSec={positionSec}
        recording={recording}
      />
    </>
  );
}

export default PracticeResultView;
