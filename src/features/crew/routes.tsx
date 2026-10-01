import type { RouteObject } from "react-router-dom";

import type { ScreenRouteHandle } from "@/app/ScreenLayoutRoute";
import CrewHomeScreen from "@/features/crew/CrewHomeScreen";
import CrewListScreen from "@/features/crew/CrewListScreen";
import CrewManageScreen from "@/features/crew/CrewManageScreen";
import CrewMembersScreen from "@/features/crew/CrewMembersScreen";
import CrewNewCompleteScreen from "@/features/crew/CrewNewCompleteScreen";
import CrewNewStep1Screen from "@/features/crew/CrewNewStep1Screen";
import CrewNewStep2Screen from "@/features/crew/CrewNewStep2Screen";
import CrewShowScreen from "@/features/crew/CrewShowScreen";

// 모임 섹션 라우트. /crew는 Bottom Nav "모임" 탭의 루트라 hasBottomNav를 기본값(true)으로 둔다.
// 나머지는 전부 하위 화면이라 hasBottomNav: false.
export const crewRoutes: RouteObject[] = [
  { element: <CrewListScreen />, path: "/crew" },
  {
    element: <CrewHomeScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/crew/:crewId",
  },
  {
    element: <CrewShowScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/crew/:crewId/show",
  },
  {
    element: <CrewMembersScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/crew/:crewId/members",
  },
  {
    element: <CrewManageScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/crew/:crewId/manage",
  },
  {
    element: <CrewNewStep1Screen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/crew/create/step1",
  },
  {
    element: <CrewNewStep2Screen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/crew/create/step2",
  },
  {
    element: <CrewNewCompleteScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/crew/create/complete",
  },
];
