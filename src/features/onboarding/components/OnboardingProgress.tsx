interface OnboardingProgressProps {
  step: number;
  total: number;
}

// Figma "Progress"(예: nodeId 101:11386) — 프로필 설정 3단계(닉네임/세션/지역·장르) 상단에
// 반복되는 진행 바. 현재 단계까지 accent, 나머지는 흰색 10% 트랙.
function OnboardingProgress({ step, total }: OnboardingProgressProps) {
  return (
    <div className="flex w-full gap-1">
      {Array.from({ length: total }, (_, index) => (
        <div
          className={
            index < step
              ? "h-1 flex-1 rounded-full bg-accent"
              : "h-1 flex-1 rounded-full bg-white/10"
          }
          // biome-ignore lint/suspicious/noArrayIndexKey: 고정 길이 세그먼트라 순서가 바뀌지 않는다
          key={index}
        />
      ))}
    </div>
  );
}

export default OnboardingProgress;
