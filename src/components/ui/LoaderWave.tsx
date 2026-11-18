import { cn } from "@/lib/cn";

// Figma "Loader/Wave"(589:24272) — 작은 로딩 표시. 녹음 파형처럼 막대 5개가 차례로 늘었다 줄었다
// 한다(index.css loader-wave). 버튼 안·목록 줄·단계 표시처럼 좁은 자리에 쓴다.
// 크기는 size로 고른다 — medium 36×24(버튼·목록), small 18×12(29 단계 표시처럼 24 칸 안). 막대 폭과
// 간격은 전체 폭의 1/9씩이라 크기가 달라도 비율이 같다. 색은 currentColor — 부모 글자색을 따른다.
const SIZE_CLASS = { medium: "h-6 w-9", small: "h-3 w-4.5" } as const;

interface LoaderWaveProps {
  size?: keyof typeof SIZE_CLASS;
  /** 색·여백 등 크기 말고 덧붙일 클래스 */
  className?: string;
}

function LoaderWave({ className, size = "medium" }: LoaderWaveProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "loader-wave flex shrink-0 items-stretch justify-between",
        SIZE_CLASS[size],
        className,
      )}
    >
      {[1, 2, 3, 4, 5].map((bar) => (
        <span className="w-1/9 rounded-full bg-current" key={bar} />
      ))}
    </span>
  );
}

export default LoaderWave;
