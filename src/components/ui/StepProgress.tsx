// 여러 단계 플로우(온보딩 3단계, 모임 만들기 3단계) 상단의 진행 바. 원래 온보딩에는
// OnboardingProgress가, 모임 만들기에는 화면마다 손으로 깐 div 세 개가 따로 있었고 채운 막대
// 색(bg-accent vs bg-accent-strong+글로우)과 트랙 색(white/10 vs white/5)도 달랐다. 하나로 합쳤다.
interface StepProgressProps {
  total: number;
  /** 1부터 세는 현재 단계. current번째까지의 막대가 채워진다. */
  current: number;
}

function StepProgress({ current, total }: StepProgressProps) {
  return (
    <div className="flex w-full items-center gap-1">
      {Array.from({ length: total }, (_, i) => (
        <div
          className={
            i < current
              ? "h-1 flex-1 rounded-full bg-accent-strong shadow-neon-sm"
              : "h-1 flex-1 rounded-full bg-white/10"
          }
          // 막대는 순서 자체가 정체성이라 인덱스를 키로 쓰는 게 맞다.
          key={`step-${i}`}
        />
      ))}
    </div>
  );
}

export default StepProgress;
