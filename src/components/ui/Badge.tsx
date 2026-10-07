import { Typography } from "@wanteddev/wds";
import type { ReactNode } from "react";

// Figma 전반에서 쓰이는 작은 상태 라벨(모집중 / 운영진 / D-30 · 팀 모집 중 …).
//
// 화면마다 따로 마크업하다 보니 radius(rounded-md·lg·xl·[10px])와 padding(py-0.5·py-1),
// 타이포(caption1·caption2), weight(medium·bold)가 제각각이었고, 무엇보다 컨테이너에 flex가
// 없어서 라벨이 뱃지 안에서 세로 가운데에 안 맞았다. 여기로 모아 전부 같은 규칙을 쓴다.
//
// 새 상태 라벨이 필요하면 화면에서 div+Typography를 새로 만들지 말고 tone/size를 여기에 추가한다.
type BadgeTone = "accent" | "solid" | "outline";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: ReactNode;
  /**
   * accent: 레드 틴트 배경(모집중·운영진 등 기본 강조)
   * solid: 꽉 찬 레드 배경 + 흰 글자(D-day처럼 가장 강한 강조)
   * outline: 테두리만(모집 완료·멤버처럼 중립 상태)
   */
  tone?: BadgeTone;
  size?: BadgeSize;
  /** 네온 글로우. 카드 안에서 한 번 더 튀어야 하는 뱃지에만 켠다. */
  glow?: boolean;
}

const TONE_CLASS: Record<BadgeTone, string> = {
  accent: "bg-accent-subtle",
  outline: "border border-line-solid",
  solid: "bg-accent",
};

const TONE_GLOW_CLASS: Record<BadgeTone, string> = {
  accent: "shadow-neon-sm",
  outline: "",
  solid: "shadow-neon-sm",
};

// WDS Typography의 color는 토큰 리터럴 유니온이라 as const가 필요하다(string으로 넓어지면 거부된다).
const TONE_COLOR = {
  accent: "semantic.primary.normal",
  outline: "semantic.label.alternative",
  solid: "semantic.static.white",
} as const;

const SIZE_CLASS: Record<BadgeSize, string> = {
  md: "rounded-lg px-2 py-1",
  sm: "rounded-md px-1.5 py-0.5",
};

const SIZE_VARIANT = {
  md: "caption1",
  sm: "caption2",
} as const;

function Badge({
  children,
  glow = false,
  size = "sm",
  tone = "accent",
}: BadgeProps) {
  // inline-flex + items-center + justify-center가 핵심 — 이게 없어서 라벨이 위로 쏠려 있었다.
  const className = [
    "inline-flex w-fit shrink-0 items-center justify-center",
    SIZE_CLASS[size],
    TONE_CLASS[tone],
    glow ? TONE_GLOW_CLASS[tone] : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={className}>
      <Typography
        as="span"
        color={TONE_COLOR[tone]}
        variant={SIZE_VARIANT[size]}
        weight="bold"
      >
        {children}
      </Typography>
    </span>
  );
}

export default Badge;
