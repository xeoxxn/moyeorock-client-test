import type { Ref } from "react";
import logoUrl from "@/assets/brand/logo.svg";

import {
  PICK_BAR_RADIUS,
  PICK_BAR_WIDTH,
  PICK_BARS,
  PICK_OUTLINE_PATH,
  STACKED_LOGO_VIEWBOX,
  STACKED_SYMBOL_TRANSFORM,
  STACKED_WORDMARK_PATHS,
} from "@/components/music/brandPaths";
import { cn } from "@/lib/cn";

// Figma "Brand · System"(445:17595) — 모여락 로고. 기본 글꼴로 친 이름 대신 벡터 로고를 쓴다.
// - BrandLogo(446:17602): 가로형(주홍 심볼 + 흰 소문자 워드마크). 홈 헤더에서 높이 24px.
// - BrandLogoStacked(452:17877): 세로형. 스플래시·시작 화면처럼 로고가 주인공인 곳.
// - BrandSymbol(446:17599): 기타 피크에 녹음 막대 3줄을 뚫은 심볼. 오늘 합주 카드 워터마크 등.

export function BrandLogo({ className }: { className?: string }) {
  return (
    <img alt="moyeorock" className={cn("w-auto", className)} src={logoUrl} />
  );
}

interface BrandLogoStackedProps {
  className?: string;
  /** 피크 색(기본 주홍). 스플래시에선 검정에서 주홍으로 바뀐다. */
  pickClassName?: string;
  /** 피크 안 막대 색(기본 진한 bg/base) */
  barClassName?: string;
  /** 워드마크 색(기본 흰색) */
  wordmarkClassName?: string;
  /** 막대 움직임(스플래시의 splash-logo-bars) — 막대 <rect>를 담은 묶음에 붙는다 */
  barsMotionClassName?: string;
  ref?: Ref<SVGSVGElement>;
}

// 세로형 로고는 피크·막대·워드마크를 따로 칠할 수 있게 인라인 SVG로 그린다 — 스플래시(00)에서
// 로그인(08) 로고 자리로 옮겨 가며 색이 바뀌고, 막대만 따로 늘었다 줄어든다.
export function BrandLogoStacked({
  barClassName = "fill-background",
  barsMotionClassName,
  className,
  pickClassName = "fill-accent",
  ref,
  wordmarkClassName = "fill-label-strong",
}: BrandLogoStackedProps) {
  return (
    <svg
      aria-label="moyeorock"
      className={cn("h-auto", className)}
      fill="none"
      ref={ref}
      role="img"
      viewBox={STACKED_LOGO_VIEWBOX}
    >
      <g transform={STACKED_SYMBOL_TRANSFORM}>
        <path className={pickClassName} d={PICK_OUTLINE_PATH} />
        <g className={cn(barClassName, barsMotionClassName)}>
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
      </g>
      <g className={wordmarkClassName}>
        {STACKED_WORDMARK_PATHS.map((path) => (
          <path d={path} key={path} />
        ))}
      </g>
    </svg>
  );
}

// 심볼은 바탕에 따라 색을 바꿔 쓴다(어두운 바탕엔 주홍, 주홍 바탕엔 stage/ink) — currentColor로
// 그리도록 src/assets/brand/symbol.svg의 패스를 그대로 옮겼다.
const SYMBOL_PATH =
  "M42 89.04C36.12 89.04 31.08 83.16 24.36 73.92C13.44 58.8 2.52 42 2.52 26.04C2.52 9.24 19.32 1.68 42 1.68C64.68 1.68 81.48 9.24 81.48 26.04C81.48 42 70.56 58.8 59.64 73.92C52.92 83.16 47.88 89.04 42 89.04ZM25.2 25.2H28.56C29.2283 25.2 29.8693 25.4655 30.3419 25.9381C30.8145 26.4107 31.08 27.0517 31.08 27.72V46.2C31.08 46.8683 30.8145 47.5093 30.3419 47.9819C29.8693 48.4545 29.2283 48.72 28.56 48.72H25.2C24.5317 48.72 23.8907 48.4545 23.4181 47.9819C22.9455 47.5093 22.68 46.8683 22.68 46.2V27.72C22.68 27.0517 22.9455 26.4107 23.4181 25.9381C23.8907 25.4655 24.5317 25.2 25.2 25.2ZM40.32 14.28H43.68C44.3483 14.28 44.9893 14.5455 45.4619 15.0181C45.9345 15.4907 46.2 16.1317 46.2 16.8V57.12C46.2 57.7883 45.9345 58.4293 45.4619 58.9019C44.9893 59.3745 44.3483 59.64 43.68 59.64H40.32C39.6517 59.64 39.0107 59.3745 38.5381 58.9019C38.0655 58.4293 37.8 57.7883 37.8 57.12V16.8C37.8 16.1317 38.0655 15.4907 38.5381 15.0181C39.0107 14.5455 39.6517 14.28 40.32 14.28ZM55.44 20.16H58.8C59.4683 20.16 60.1093 20.4255 60.5819 20.8981C61.0545 21.3707 61.32 22.0117 61.32 22.68V51.24C61.32 51.9083 61.0545 52.5493 60.5819 53.0219C60.1093 53.4945 59.4683 53.76 58.8 53.76H55.44C54.7717 53.76 54.1307 53.4945 53.6581 53.0219C53.1855 52.5493 52.92 51.9083 52.92 51.24V22.68C52.92 22.0117 53.1855 21.3707 53.6581 20.8981C54.1307 20.4255 54.7717 20.16 55.44 20.16Z";

export function BrandSymbol({ className }: { className?: string }) {
  return (
    <svg aria-hidden className={className} fill="none" viewBox="0 0 84 90.72">
      <path
        clipRule="evenodd"
        d={SYMBOL_PATH}
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}
