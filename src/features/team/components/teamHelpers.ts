import { useParams } from "react-router-dom";

import type { Performance, Team } from "@/lib/domain/types";
import { getPerformance, getTeam, toId } from "@/mocks/selectors";

// 팀 화면들이 함께 쓰는 작은 셀렉터·권한 판정. 공통 selectors에 없는 것만 여기 둔다
// (백엔드가 붙으면 TeamDetail.performance·myRole 응답으로 바로 대체된다).

/** /team/:teamId 의 팀. 없는 id면 undefined — 화면이 "없는 팀이에요"를 그린다. */
export function useTeamParam(): Team | undefined {
  const { teamId } = useParams();
  return getTeam(toId(teamId));
}

export function isTeamMember(team: Team): boolean {
  return team.myRole !== null;
}

export function isTeamLeader(team: Team): boolean {
  return team.myRole === "LEADER";
}

/** 공연 팀이면 소속 공연, 독립 팀이면 undefined */
export function getTeamPerformance(team: Team): Performance | undefined {
  return team.performanceId !== null
    ? getPerformance(team.performanceId)
    : undefined;
}

/** 이 팀이 공연 셋리스트로 넘긴 곡 */
export function getSubmittedSongIds(
  performance: Performance,
  teamId: number,
): number[] {
  return performance.setlist
    .filter((item) => item.teamId === teamId)
    .map((item) => item.songId);
}

/**
 * 같은 공연의 다른 팀이 이미 셋리스트로 넘긴 곡 → 그 팀 이름.
 * 한 곡은 한 팀만 넘길 수 있어서(서버 규칙) 넘기기 시트에서 막는다.
 */
export function getSongsSubmittedByOtherTeams(
  performance: Performance,
  teamId: number,
): Map<number, string> {
  return new Map(
    performance.setlist
      .filter((item) => item.teamId !== teamId)
      .map((item) => [item.songId, getTeam(item.teamId)?.name ?? ""]),
  );
}

/**
 * 같은 공연의 다른 팀이 선택곡으로 고른 곡. 선택곡 단계에서는 서버가 막지 않고 "다른 팀이 이미
 * 골랐어요"로 알려 주기만 한다.
 */
export function getSongsSelectedByOtherTeams(
  performance: Performance,
  teamId: number,
): Set<number> {
  return new Set(
    performance.teamIds
      .filter((id) => id !== teamId)
      .flatMap((id) => getTeam(id)?.songIds ?? []),
  );
}
