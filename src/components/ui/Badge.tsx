import { ContentBadge } from "@wanteddev/wds";
import type { ReactNode } from "react";

// 상태 라벨(모집중 / 모임장 / D-30 …) — WDS `ContentBadge`를 모여락 톤 3가지로만 고정해서 쓴다.
// 화면에서 ContentBadge의 색 조합을 매번 고르지 않도록 여기서 정한다. 새 톤이 필요하면 여기에 추가한다.
type BadgeTone = "accent" | "solid" | "outline";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: ReactNode;
  /**
   * accent: 레드 틴트 배경(모집중·모임장 등 기본 강조)
   * solid: 꽉 찬 레드 배경 + 흰 글자(D-day처럼 가장 강한 강조)
   * outline: 테두리만(모집 완료·멤버처럼 중립 상태)
   */
  tone?: BadgeTone;
  size?: BadgeSize;
  /** 네온 글로우. 카드 안에서 한 번 더 튀어야 하는 뱃지에만 켠다. */
  glow?: boolean;
}

function Badge({
  children,
  glow = false,
  size = "sm",
  tone = "accent",
}: BadgeProps) {
  return (
    <ContentBadge
      accentColor="semantic.primary.normal"
      className={glow ? "shadow-neon-sm" : undefined}
      color={tone === "outline" ? "neutral" : "accent"}
      neutralColor="semantic.label.alternative"
      size={size === "md" ? "small" : "xsmall"}
      sx={
        tone === "solid"
          ? {
              backgroundColor: "var(--semantic-primary-normal)",
              color: "var(--semantic-static-white)",
              fontWeight: 700,
            }
          : { fontWeight: 700 }
      }
      variant={tone === "outline" ? "outlined" : "solid"}
    >
      {children}
    </ContentBadge>
  );
}

export default Badge;
