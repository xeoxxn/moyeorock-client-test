import type { TeamSongRecommendation } from "@/lib/domain/types";
import { SONGS } from "@/mocks/data";

// AI 곡 추천 목업 — 서버 TeamSongRecommendationResponse(dto-spec, GET /v1/teams/{teamId}/songs/recommendations)
// 모양 그대로. songs는 점수 높은 순 최대 10곡이고, reasons는 백엔드가 만든 문장이다: 팀 장르에 곡 장르가
// 있으면 "팀 장르 일치: {장르}", 팀이 가진 세션마다(팀원 순서) 곡 난이도와 그 세션 팀원의 가장 높은 실력을
// 견줘 "{세션} 실력 충족" 또는 "{세션} 난이도 초과". 곡에 그 세션 난이도가 없으면 문구가 없고, 근거가
// 하나도 없으면 빈 배열이다. 아래 문장은 data.ts의 곡 난이도·팀원 실력에 맞춰 손으로 적었다.
// selectedByOtherTeam은 같은 공연의 다른 팀이 이미 고른 곡 — 독립 팀은 항상 false.

/** 서버 TeamSongRecommendationResponse */
export interface TeamSongRecommendationResponse {
  teamId: number;
  songs: TeamSongRecommendation[];
}

function recommend(
  songId: number,
  score: number,
  reasons: string[],
  selectedByOtherTeam = false,
): TeamSongRecommendation {
  const song = SONGS.find((item) => item.id === songId);
  if (!song) throw new Error(`목업 곡 ${songId}이 SONGS에 없어요`);
  return { reasons, score, selectedByOtherTeam, song };
}

/** 팀 1 블루 웨이브(공연 팀, 팝·록) — 보컬·일렉 기타·베이스·드럼 모두 중급 */
const BLUE_WAVE: TeamSongRecommendationResponse = {
  songs: [
    recommend(113, 0.91, [
      "팀 장르 일치: 팝",
      "보컬 실력 충족",
      "일렉 기타 실력 충족",
      "베이스 실력 충족",
      "드럼 실력 충족",
    ]),
    // 새벽 세션(팀 3)이 고른 곡
    recommend(
      109,
      0.88,
      [
        "팀 장르 일치: 록",
        "보컬 실력 충족",
        "일렉 기타 실력 충족",
        "베이스 실력 충족",
        "드럼 실력 충족",
      ],
      true,
    ),
    recommend(106, 0.84, [
      "팀 장르 일치: 록",
      "보컬 실력 충족",
      "일렉 기타 실력 충족",
      "베이스 실력 충족",
      "드럼 실력 충족",
    ]),
    recommend(
      110,
      0.8,
      [
        "팀 장르 일치: 록",
        "보컬 실력 충족",
        "일렉 기타 실력 충족",
        "베이스 실력 충족",
        "드럼 실력 충족",
      ],
      true,
    ),
    recommend(105, 0.76, [
      "팀 장르 일치: 팝",
      "보컬 실력 충족",
      "일렉 기타 실력 충족",
      "베이스 실력 충족",
      "드럼 실력 충족",
    ]),
    recommend(116, 0.71, [
      "보컬 실력 충족",
      "일렉 기타 실력 충족",
      "베이스 실력 충족",
      "드럼 난이도 초과",
    ]),
    recommend(
      112,
      0.67,
      [
        "팀 장르 일치: 록",
        "보컬 실력 충족",
        "일렉 기타 실력 충족",
        "베이스 실력 충족",
        "드럼 실력 충족",
      ],
      true,
    ),
    // 펑크 클럽(팀 4)이 고른 곡
    recommend(
      111,
      0.6,
      [
        "보컬 실력 충족",
        "일렉 기타 실력 충족",
        "베이스 실력 충족",
        "드럼 실력 충족",
      ],
      true,
    ),
  ],
  teamId: 1,
};

/** 팀 2 나이트 드라이브(독립 팀, 팝·R&B) — 보컬 중급 · 어쿠스틱 기타 초급 */
const NIGHT_DRIVE: TeamSongRecommendationResponse = {
  songs: [
    recommend(113, 0.93, [
      "팀 장르 일치: 팝",
      "보컬 실력 충족",
      "어쿠스틱 기타 실력 충족",
    ]),
    recommend(114, 0.9, ["팀 장르 일치: R&B", "보컬 실력 충족"]),
    recommend(115, 0.87, [
      "팀 장르 일치: 팝",
      "보컬 실력 충족",
      "어쿠스틱 기타 실력 충족",
    ]),
    recommend(116, 0.83, [
      "팀 장르 일치: R&B",
      "보컬 실력 충족",
      "어쿠스틱 기타 난이도 초과",
    ]),
    recommend(117, 0.79, ["보컬 실력 충족"]),
    recommend(118, 0.76, [
      "팀 장르 일치: R&B",
      "보컬 난이도 초과",
      "어쿠스틱 기타 실력 충족",
    ]),
    recommend(105, 0.71, ["팀 장르 일치: 팝", "보컬 실력 충족"]),
    recommend(108, 0.64, ["보컬 실력 충족"]),
    recommend(107, 0.58, ["보컬 실력 충족"]),
    recommend(119, 0.51, []),
  ],
  teamId: 2,
};

const RESPONSES = [BLUE_WAVE, NIGHT_DRIVE];

/** 팀의 추천 응답. 목업에 없는 팀이면 AI가 고른 곡이 없을 때처럼 빈 songs. */
export function getTeamSongRecommendationResponse(
  teamId: number,
): TeamSongRecommendationResponse {
  return (
    RESPONSES.find((response) => response.teamId === teamId) ?? {
      songs: [],
      teamId,
    }
  );
}
