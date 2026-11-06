import type { Performance, Team } from "@/lib/domain/types";
import { getGroup, getMyTeams } from "@/mocks/selectors";

// 서버 PerformanceDetail의 canEdit·myTeamIds와 모임원 여부를 목업에서 대신 계산한다 — 공연 화면 여러 곳이
// 같은 기준으로 버튼을 숨기고 막아야 해서 한곳에 모았다. API가 붙으면 응답 값을 그대로 쓴다.

/** 공연 수정·상태 변경·셋리스트 확정 — 공연이 속한 모임의 모임장만(서버 canEdit) */
export function canManagePerformance(performance: Performance): boolean {
  return getGroup(performance.groupId)?.myRole === "OWNER";
}

/** 공연 팀 만들기 — 공연이 속한 모임의 모임원이면 누구나 */
export function isPerformanceGroupMember(performance: Performance): boolean {
  return Boolean(getGroup(performance.groupId)?.myRole);
}

/** 이 공연에 나가는 내 팀(서버 myTeamIds) */
export function getMyPerformanceTeams(performance: Performance): Team[] {
  return getMyTeams().filter((team) => performance.teamIds.includes(team.id));
}
