import type { RouteObject } from "react-router-dom";

import type { ScreenRouteHandle } from "@/app/ScreenLayoutRoute";
import NotificationsScreen from "@/features/home/NotificationsScreen";

// 홈 섹션(홈 대시보드 외) 라우트 — src/app/router.tsx가 이 배열을 가져다 합친다.
export const homeRoutes: RouteObject[] = [
  {
    element: <NotificationsScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/notifications",
  },
];
