import { List, ListCell, Typography, useToast } from "@wanteddev/wds";
import { IconMoreVertical } from "@wanteddev/wds-icon";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { PART_COVER_TONE } from "@/components/music/Cover";
import BottomSheet from "@/components/ui/BottomSheet";
import ConfirmSheet from "@/components/ui/ConfirmSheet";
import EmptyState from "@/components/ui/EmptyState";
import HeaderIconButton from "@/components/ui/HeaderIconButton";
import { rowClick } from "@/components/ui/listCellEvents";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import {
  useScreenBackdrop,
  useScreenHeader,
} from "@/components/ui/useScreenHeader";
import AnalysisFailedView from "@/features/practice/components/AnalysisFailedView";
import AnalysisInProgressSheet from "@/features/practice/components/AnalysisInProgressSheet";
import AnalysisProgressView from "@/features/practice/components/AnalysisProgressView";
import PracticeResultView from "@/features/practice/components/PracticeResultView";
import {
  isAnalysisInProgress,
  newAnalysisPath,
} from "@/features/practice/practiceHelpers";
import {
  deletePracticeRecording,
  retryPracticeAnalysis,
} from "@/features/practice/practiceStore";
import { usePracticeRecording } from "@/features/practice/usePracticeRecording";
import { toId } from "@/mocks/selectors";

// 연습 녹음 상세(/practice/:recordingId) — 한 라우트가 서버 상태로 그린다.
// - SUBMITTED·ANALYZING: 29 비교 중(593:26152). 상세를 5초마다 다시 읽는다(usePracticeRecording).
// - DONE: 05 결과(418:12518) + 바닥 패널 → 18 구간 피드백 시트.
// - FAILED: 30 실패(593:26342). "다시 분석"은 retry(202 SUBMITTED)라 바로 29로 바뀐다.
// 분석 요청·다시 요청이 409 PRACTICE_ANALYSIS_IN_PROGRESS면 진행 중인 녹음으로 가는 시트를 띄운다.
// ⋮(다시 녹음 · 녹음 삭제)는 결과에서만, 실패에선 삭제만 — 29는 Figma대로 헤더를 비운다.

function PracticeDetailScreen() {
  const navigate = useNavigate();
  const toast = useToast();
  const { recordingId } = useParams();
  const id = toId(recordingId);
  const { recording, refresh } = usePracticeRecording(id);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [inProgressOpen, setInProgressOpen] = useState(false);
  const status = recording?.status;
  const hasMenu = status === "DONE" || status === "FAILED";

  useScreenHeader(
    useMemo(
      () => (
        <ScreenHeader
          title="연습 분석"
          trailing={
            hasMenu ? (
              <HeaderIconButton
                icon={<IconMoreVertical />}
                label="더보기"
                onClick={() => setMenuOpen(true)}
              />
            ) : undefined
          }
        />
      ),
      [hasMenu],
    ),
  );
  // 05만 파트 커버색 그라데이션을 깔고, 29·30은 바탕 그대로(Figma).
  useScreenBackdrop(
    recording && status === "DONE"
      ? (`cover-${PART_COVER_TONE[recording.part]}` as const)
      : null,
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
    const result = retryPracticeAnalysis(recording.id);
    if (!result.ok && result.code === "PRACTICE_ANALYSIS_IN_PROGRESS") {
      setInProgressOpen(true);
      return;
    }
    // 202면 SUBMITTED(29)로, 그새 상태가 바뀌어 409 INVALID_STATE면 지금 상태로 다시 그린다.
    refresh();
  };

  const remove = () => {
    deletePracticeRecording(recording.id);
    toast({ content: "녹음을 지웠어요", variant: "positive" });
    navigate("/practice", { replace: true });
  };

  return (
    <>
      {isAnalysisInProgress(recording.status) ? (
        <AnalysisProgressView
          // 기다리는 화면을 목록이 넘겨받는다 — 결과는 목록에서도 보인다.
          onWaitInList={() => navigate("/practice", { replace: true })}
          recording={recording}
        />
      ) : recording.status === "FAILED" ? (
        <AnalysisFailedView
          onRerecord={() => navigate(newAnalysisPath(recording))}
          onRetry={retry}
          recording={recording}
        />
      ) : (
        <PracticeResultView key={recording.id} recording={recording} />
      )}

      <BottomSheet onOpenChange={setMenuOpen} open={menuOpen}>
        <div className="-mx-5">
          <List>
            {recording.status === "DONE" && (
              <ListCell
                fillWidth
                onClick={rowClick(() => {
                  setMenuOpen(false);
                  navigate(newAnalysisPath(recording));
                })}
              >
                <Typography color="semantic.label.strong" variant="body1">
                  다시 녹음
                </Typography>
              </ListCell>
            )}
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
        </div>
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

      <AnalysisInProgressSheet
        onOpenChange={setInProgressOpen}
        open={inProgressOpen}
      />
    </>
  );
}

export default PracticeDetailScreen;
