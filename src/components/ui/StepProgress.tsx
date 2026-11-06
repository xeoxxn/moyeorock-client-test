import { ProgressIndicator } from "@wanteddev/wds";

// 여러 단계 플로우(온보딩 3단계, 모임 만들기 2단계) 상단의 진행 바 — WDS `ProgressIndicator`.
// 단계 수만 넘기면 비율은 여기서 계산한다.
interface StepProgressProps {
  total: number;
  /** 1부터 세는 현재 단계 */
  current: number;
}

function StepProgress({ current, total }: StepProgressProps) {
  return (
    <ProgressIndicator
      aria-label={`${total}단계 중 ${current}단계`}
      percent={(current / total) * 100}
      sx={{ borderRadius: "9999px", height: "0.25rem" }}
    />
  );
}

export default StepProgress;
