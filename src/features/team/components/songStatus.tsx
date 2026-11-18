import type { ReactNode } from "react";

import Status from "@/components/ui/Status";

/**
 * 공연 팀 선택곡 한 줄의 상태 — 공연에 넘긴 곡은 모임장이 확정하기 전엔 "후보", 확정하면 "확정".
 * 넘기지 않은 곡과 독립 팀 곡은 상태가 없다(undefined).
 */
export function songStatus(
  submitted: boolean,
  setlistConfirmed: boolean,
): ReactNode {
  if (!submitted) return undefined;
  return setlistConfirmed ? (
    <Status tone="positive">확정</Status>
  ) : (
    <Status tone="neutral">후보</Status>
  );
}
