import { ContentBadge } from "@wanteddev/wds";
import type { ReactNode } from "react";

// Figma "Status"(549:22608) — 같은 의미의 상태 표시는 화면마다 따로 칠하지 않고 이것 하나로 쓴다.
// WDS ContentBadge(Solid · Small)에 배경·글자색만 모여락 상태색으로 덮는다.
//
// | tone     | Figma State | 쓰는 곳                         |
// |----------|-------------|---------------------------------|
// | positive | 완료        | 분석 완료 · 확정                |
// | progress | 진행        | 분석 중 · 모집 중               |
// | negative | 실패        | 분석 실패                       |
// | neutral  | 대기        | 후보                            |
// | accent   | 강조        | 공연 예정 · 고정 · 공연(일정)   |
export type StatusTone =
  | "positive"
  | "progress"
  | "negative"
  | "neutral"
  | "accent";

const TONE: Record<StatusTone, { color: string; background: string }> = {
  accent: {
    background: "color-mix(in srgb, var(--color-accent) 20%, transparent)",
    color: "var(--color-accent-text)",
  },
  negative: {
    background:
      "color-mix(in srgb, var(--color-status-negative) 16%, transparent)",
    color: "var(--color-status-negative)",
  },
  neutral: {
    background: "color-mix(in srgb, var(--color-label-strong) 8%, transparent)",
    color: "var(--color-label-alternative)",
  },
  positive: {
    background:
      "color-mix(in srgb, var(--color-status-positive) 16%, transparent)",
    color: "var(--color-status-positive)",
  },
  progress: {
    background:
      "color-mix(in srgb, var(--color-status-progress) 16%, transparent)",
    color: "var(--color-status-progress)",
  },
};

interface StatusProps {
  tone: StatusTone;
  children: ReactNode;
}

function Status({ children, tone }: StatusProps) {
  return (
    <ContentBadge
      size="small"
      sx={{
        backgroundColor: TONE[tone].background,
        borderRadius: "0.375rem",
        color: TONE[tone].color,
        flexShrink: 0,
        fontWeight: 500,
      }}
      variant="solid"
    >
      {children}
    </ContentBadge>
  );
}

export default Status;
