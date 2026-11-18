import { useNavigate } from "react-router-dom";

import ConfirmSheet from "@/components/ui/ConfirmSheet";
import { findInProgressRecording } from "@/features/practice/practiceStore";

// 분석 요청 · 다시 요청이 409 PRACTICE_ANALYSIS_IN_PROGRESS로 막혔을 때 — 한 사람당 진행 중인 분석은
// 하나뿐이다(서버 §13). 응답엔 그 녹음 id가 없어서 "보러 가기"를 누를 때 목록에서 진행 중인 녹음을
// 찾아 그 비교 중(29) 화면으로 간다. 그새 끝났으면 목록으로.
interface AnalysisInProgressSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 새 연습 분석(11)에서 막혔으면 폼을 버리고 가도록 replace로 옮긴다 */
  replace?: boolean;
}

function AnalysisInProgressSheet({
  onOpenChange,
  open,
  replace = false,
}: AnalysisInProgressSheetProps) {
  const navigate = useNavigate();

  const goToInProgress = () => {
    const recording = findInProgressRecording();
    navigate(recording ? `/practice/${recording.id}` : "/practice", {
      replace,
    });
  };

  return (
    <ConfirmSheet
      confirmLabel="보러 가기"
      description={"분석은 한 번에 하나씩 해요.\n끝난 뒤에 다시 요청해 주세요."}
      onConfirm={goToInProgress}
      onOpenChange={onOpenChange}
      open={open}
      title="이미 분석 중인 녹음이 있어요"
    />
  );
}

export default AnalysisInProgressSheet;
