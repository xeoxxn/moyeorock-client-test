import {
  PICK_BAR_RADIUS,
  PICK_BAR_WIDTH,
  PICK_BARS,
  PICK_OUTLINE_PATH,
} from "@/components/music/brandPaths";
import { cn } from "@/lib/cn";

// Figma "Loader/Logo"(589:24247) — 큰 로딩 표시. 주홍 피크 안의 진한 막대 3개가 왼쪽부터 차례로
// 늘었다 돌아온다(index.css loader-logo-bars). 피크와 막대를 따로 그려서 막대만 늘린다.
// AI 곡 추천 고르는 중(26)·연습 분석 비교 중(29)처럼 기다리는 화면의 주인공 자리에 쓴다.
// 크기는 size로 고른다 — large 120(29 비교 중), medium 96(26 AI 곡 추천 시트). cn은 클래스를 합치기만
// 해서 className으로 넘긴 size-*가 기본 크기를 이기지 못한다. 뜻은 옆 문구가 전하므로 스크린 리더에선 숨긴다.

/** Figma 120 상자 안 피크 자리(9.47, 4.09 · 101×112)를 심볼 좌표로 옮긴 viewBox */
const VIEWBOX = "-4.88 -1.52 93.75 93.75";

const SIZE_CLASS = { large: "size-30", medium: "size-24" } as const;

interface LoaderLogoProps {
  size?: keyof typeof SIZE_CLASS;
  /** 여백 등 크기 말고 덧붙일 클래스 */
  className?: string;
}

function LoaderLogo({ className, size = "large" }: LoaderLogoProps) {
  return (
    <svg
      aria-hidden
      className={cn("shrink-0", SIZE_CLASS[size], className)}
      fill="none"
      viewBox={VIEWBOX}
    >
      <path className="fill-accent" d={PICK_OUTLINE_PATH} />
      <g className="loader-logo-bars fill-background">
        {PICK_BARS.map((bar) => (
          <rect
            height={bar.height}
            key={bar.x}
            rx={PICK_BAR_RADIUS}
            width={PICK_BAR_WIDTH}
            x={bar.x}
            y={bar.y}
          />
        ))}
      </g>
    </svg>
  );
}

export default LoaderLogo;
