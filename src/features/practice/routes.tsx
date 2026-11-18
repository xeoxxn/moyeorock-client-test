import type { RouteObject } from "react-router-dom";

import type { ScreenRouteHandle } from "@/app/ScreenLayoutRoute";
import PracticeDetailScreen from "@/features/practice/PracticeDetailScreen";
import PracticeListScreen from "@/features/practice/PracticeListScreen";
import PracticeNewScreen from "@/features/practice/PracticeNewScreen";

// 연습 분석(서버 §13 practice) — 개인 연습 녹음을 올려 원곡과 비교한 AI 피드백을 받는다. 녹음은 올린
// 본인만 본다. 홈 '다시 듣기'·미니 플레이어에서 들어온다(하단 탭은 홈).
// - /practice(Figma 10, 비었을 때 15): 내 녹음 목록 + 새 연습 분석. 분석 중인 녹음이 있으면 5초마다 다시 읽는다.
// - /practice/new(Figma 11, 파트 고르기는 25 시트): 곡 · 내 파트 · 녹음 파일 → 분석하기(업로드 → 202
//   SUBMITTED) → 그 녹음 상세로 replace
// - /practice/:recordingId: 서버 상태로 그린다. SUBMITTED·ANALYZING = 29 비교 중(5초마다 다시 조회하다
//   DONE·FAILED면 멈춘다), DONE = 05 결과(바닥 패널을 누르면 18 구간 피드백 시트), FAILED = 30 실패
//   (다시 분석 = retry 202 → 29)
// 진행 중인 분석은 한 사람당 하나라 분석 요청·다시 요청이 409 PRACTICE_ANALYSIS_IN_PROGRESS일 수 있다 —
// 시트로 알리고 목록에서 찾은 진행 중인 녹음으로 보낸다.
export const practiceRoutes: RouteObject[] = [
  {
    element: <PracticeListScreen />,
    handle: { hasMiniPlayer: true } satisfies ScreenRouteHandle,
    path: "/practice",
  },
  {
    element: <PracticeNewScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/practice/new",
  },
  {
    element: <PracticeDetailScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/practice/:recordingId",
  },
];
