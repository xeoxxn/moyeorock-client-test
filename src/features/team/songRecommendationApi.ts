import type { TeamSongRecommendation } from "@/lib/domain/types";
import { getTeamSongRecommendationResponse } from "@/mocks/recommendations";

// GET /v1/teams/{teamId}/songs/recommendations(서버 §12, 활성 팀원 누구나) 자리. 백엔드가 부를 때마다
// AI 서버를 동기로 불러서(읽기 최대 30초) 점수 높은 순 최대 10곡을 돌려준다.
// - AI가 실패하면 503 SONG_RECOMMENDATION_UNAVAILABLE → SongRecommendationUnavailableError로 끝난다.
// - AI가 아무 곡도 고르지 못하면 200 + 빈 songs.
// 목업은 1.8초 뒤에 답한다. signal로 취소하면(시트를 닫거나 다시 부를 때) 타이머를 멈추고 AbortError로
// 끝나서 늦은 응답이 화면에 들어오지 않는다.
//
// 상태를 다 확인할 수 있게 팀 1 블루 웨이브(공연 팀)는 새로고침 뒤 응답 차례마다 결과가 바뀐다 —
// 첫 응답 503 → 둘째 빈 결과 → 셋째부터 8곡(다른 팀이 고른 곡 포함). 끝까지 기다린 응답만 차례를
// 넘기고, 도중에 취소한 요청은 세지 않는다. 팀 2 나이트 드라이브(독립 팀)는 늘 10곡이다.

const MOCK_DELAY_MS = 1800;
const CYCLING_TEAM_ID = 1;

/** 503 SONG_RECOMMENDATION_UNAVAILABLE — AI 서버 호출 실패 */
export class SongRecommendationUnavailableError extends Error {
  readonly status = 503;
  readonly code = "SONG_RECOMMENDATION_UNAVAILABLE";

  constructor() {
    super("SONG_RECOMMENDATION_UNAVAILABLE");
    this.name = "SongRecommendationUnavailableError";
  }
}

/** 팀 1이 지금까지 받은 응답 수(새로고침하면 처음부터) */
let cyclingTeamResponses = 0;

function respond(teamId: number): TeamSongRecommendation[] {
  const { songs } = getTeamSongRecommendationResponse(teamId);
  if (teamId !== CYCLING_TEAM_ID) return songs;
  const turn = cyclingTeamResponses;
  cyclingTeamResponses += 1;
  if (turn === 0) throw new SongRecommendationUnavailableError();
  if (turn === 1) return [];
  return songs;
}

export function fetchTeamSongRecommendations(
  teamId: number,
  signal?: AbortSignal,
): Promise<TeamSongRecommendation[]> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError());
      return;
    }
    const timer = window.setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      try {
        resolve(respond(teamId));
      } catch (error) {
        reject(error);
      }
    }, MOCK_DELAY_MS);
    const onAbort = () => {
      window.clearTimeout(timer);
      reject(abortError());
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

function abortError(): DOMException {
  return new DOMException("추천 요청을 취소했어요", "AbortError");
}
