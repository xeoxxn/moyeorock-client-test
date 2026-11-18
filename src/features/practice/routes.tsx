import type { RouteObject } from "react-router-dom";

import type { ScreenRouteHandle } from "@/app/ScreenLayoutRoute";
import PracticeDetailScreen from "@/features/practice/PracticeDetailScreen";
import PracticeListScreen from "@/features/practice/PracticeListScreen";
import PracticeNewScreen from "@/features/practice/PracticeNewScreen";

// 연습 분석(서버 §13 practice) — 개인 연습 녹음을 올려 원곡과 비교한 AI 피드백을 받는다. 녹음은 올린
// 본인만 본다. 홈 '다시 듣기'·미니 플레이어에서 들어온다(하단 탭은 홈).
// - /practice(Figma 10, 비었을 때 15): 내 녹음 목록 + 새 연습 분석
// - /practice/new(Figma 11, 파트 고르기는 25 시트): 곡 · 내 파트 · 녹음 파일 → 분석하기(202)
// - /practice/:recordingId(Figma 05, 전체 피드백은 18 시트): 재생 + 구간 피드백. 분석 중이면 5초마다
//   다시 조회하다 DONE·FAILED면 멈춘다(서버 흐름). 실패면 다시 요청.
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
