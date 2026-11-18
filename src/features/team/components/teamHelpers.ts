import { useParams } from "react-router-dom";

import {
  GENRE_LABEL,
  REGION_LABEL,
  TEAM_KIND_LABEL,
} from "@/lib/domain/labels";
import type { Performance, Song, Team } from "@/lib/domain/types";
import {
  getAllSongs,
  getPerformance,
  getTeam,
  isPerformanceTeam,
  toId,
} from "@/mocks/selectors";

// 팀 화면들이 함께 쓰는 작은 셀렉터·권한 판정·문구. 공통 selectors에 없는 것만 여기 둔다
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

/** 히어로 위 작은 글자 — "독립 팀" / "공연 팀" */
export function teamKindLabel(team: Team): string {
  return isPerformanceTeam(team)
    ? TEAM_KIND_LABEL.performance
    : TEAM_KIND_LABEL.independent;
}

/** 히어로 정보 줄 — "서울 · 멤버 2명 · 팝, R&B" */
export function teamMetaLine(team: Team): string {
  return [
    REGION_LABEL[team.region],
    `멤버 ${team.members.length}명`,
    team.genres.map((genre) => GENRE_LABEL[genre]).join(", "),
  ]
    .filter((part) => part !== "")
    .join(" · ");
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
 * 한 곡은 한 팀만 넘길 수 있어서(서버 409 SONG_ALREADY_IN_SETLIST) 넘기기 시트에서 막는다.
 * 선택곡에 담는 것은 막지 않는다.
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
 * GET /teams/{teamId}/songs/recommendations(AI, 팀원 누구나) 자리. 서버는 팀 장르·팀원 실력으로
 * 최대 10곡을 점수 순으로 준다 — 목업은 팀 장르와 맞는 곡을 앞에 둔다.
 */
export function getTeamSongRecommendations(team: Team): Song[] {
  const genres = new Set(team.genres);
  return [...getAllSongs()]
    .sort((a, b) => Number(genres.has(b.genre)) - Number(genres.has(a.genre)))
    .slice(0, 10);
}

/** 받침이 있으면 "을", 없으면(영문 포함) "를" — "Antifreeze를", "사건의 지평선을" */
export function withObjectParticle(word: string): string {
  const code = word.charCodeAt(word.length - 1);
  const isHangul = code >= 0xac00 && code <= 0xd7a3;
  const hasFinal = isHangul && (code - 0xac00) % 28 !== 0;
  return `${word}${hasFinal ? "을" : "를"}`;
}
