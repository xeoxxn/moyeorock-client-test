import type { RouteObject } from "react-router-dom";

import type { ScreenRouteHandle } from "@/app/ScreenLayoutRoute";
import HomeScreen from "@/features/home/HomeScreen";
import NotificationsScreen from "@/features/home/NotificationsScreen";

// 홈(Bottom Nav "홈" 탭 루트)과 알림.
export const homeRoutes: RouteObject[] = [
  { element: <HomeScreen />, path: "/" },
  {
    element: <NotificationsScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/notifications",
  },
];
