// Figma "Waveform"(410:10921) — 녹음 파형 모티프. 막대 104개의 높이(%)를 Figma에서 그대로 옮겼다.
// 인스턴스 크기를 바꾸면 막대가 같이 늘어나도록 SVG를 preserveAspectRatio="none"으로 그린다.
// 색은 currentColor — 배경 장식엔 흐리게(4~8%), 녹음 표지엔 30~55%로 쓴다.
const BAR_HEIGHTS = [
  16, 22, 17, 23, 30, 34, 25, 52, 45, 41, 39, 58, 55, 34, 52, 41, 59, 39, 55,
  52, 38, 33, 64, 62, 31, 41, 55, 30, 33, 41, 47, 38, 36, 70, 52, 45, 62, 55,
  47, 80, 61, 61, 48, 94, 58, 92, 70, 56, 75, 64, 81, 73, 45, 48, 56, 39, 34,
  47, 53, 48, 55, 36, 42, 47, 47, 66, 53, 55, 48, 48, 73, 45, 53, 77, 81, 88,
  84, 80, 73, 67, 61, 36, 48, 47, 39, 44, 52, 50, 33, 48, 20, 27, 30, 25, 19,
  39, 28, 38, 31, 28, 20, 34, 33, 17,
];

const STEP = 1;
const BAR_WIDTH = 0.64;

interface WaveformProps {
  className?: string;
  /** 재생 위치(0~1). 주면 지난 부분은 진하게, 남은 부분은 흐리게 그린다. */
  progress?: number;
}

function Waveform({ className, progress }: WaveformProps) {
  const playedBars =
    progress === undefined ? BAR_HEIGHTS.length : progress * BAR_HEIGHTS.length;
  return (
    <svg
      aria-hidden
      className={className}
      preserveAspectRatio="none"
      viewBox={`0 0 ${BAR_HEIGHTS.length * STEP} 100`}
    >
      {BAR_HEIGHTS.map((height, index) => (
        <rect
          fill="currentColor"
          height={height}
          // biome-ignore lint/suspicious/noArrayIndexKey: 고정 길이 장식 배열
          key={index}
          opacity={index < playedBars ? 1 : 0.35}
          width={BAR_WIDTH}
          x={index * STEP}
          y={(100 - height) / 2}
        />
      ))}
    </svg>
  );
}

export default Waveform;
