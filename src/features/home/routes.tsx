import type { RouteObject } from "react-router-dom";

import type { ScreenRouteHandle } from "@/app/ScreenLayoutRoute";
import HomeScreen from "@/features/home/HomeScreen";
import NotificationsScreen from "@/features/home/NotificationsScreen";

// 홈(Bottom Nav "홈" 탭 루트, Figma 01)과 알림(Figma 14).
// 홈은 다가오는 합주(오늘 합주 카드 + 다음 합주) → 내 팀(한 장씩 넘기는 카드) → 다시 듣기(연습 녹음 선반).
// 알림은 서버 NotificationType 그대로 — 초대는 알림에서 바로 거절·수락한다.
export const homeRoutes: RouteObject[] = [
  {
    element: <HomeScreen />,
    handle: { hasMiniPlayer: true } satisfies ScreenRouteHandle,
    path: "/",
  },
  {
    element: <NotificationsScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/notifications",
  },
];
