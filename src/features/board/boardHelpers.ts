import { type CoverTone, coverToneOf } from "@/components/music/Cover";
import { INSTRUMENT_LABEL } from "@/lib/domain/labels";
import type { RecruitPost, TargetType, WantedSlot } from "@/lib/domain/types";
import {
  getPostableTargets,
  getTeam,
  isPerformanceTeam,
} from "@/mocks/selectors";

// 게시판 화면들이 같이 쓰는 조합 — 모집글 커버색·세션 표기·쓸 수 있는 대상.

/** 모집글 커버는 대상(팀·모임)의 커버다 */
export function postTone(post: Pick<RecruitPost, "targetType" | "targetId">) {
  return targetTone(post.targetType, post.targetId);
}

export function targetTone(
  targetType: TargetType,
  targetId: number,
): CoverTone {
  return coverToneOf(targetType === "TEAM" ? "team" : "group", targetId);
}

/** 드럼 1명 · 키보드 1명 */
export function formatSlots(slots: Pick<WantedSlot, "instrument" | "count">[]) {
  return slots
    .map((slot) => `${INSTRUMENT_LABEL[slot.instrument]} ${slot.count}명`)
    .join(" · ");
}

/**
 * 모집글을 쓸 수 있는 대상 — 내가 모임장인 모임, 팀장인 독립 팀. 공연 팀은 팀장이어도 서버가 409
 * (PERFORMANCE_TEAM_RECRUIT_NOT_ALLOWED)로 막아서 뺀다(공연 팀원은 초대로 모은다).
 */
export function getWritableTargets() {
  return getPostableTargets().filter((target) => {
    if (target.targetType !== "TEAM") return true;
    const team = getTeam(target.id);
    return team !== undefined && !isPerformanceTeam(team);
  });
}
