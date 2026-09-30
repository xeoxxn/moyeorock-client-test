import type { RouteObject } from "react-router-dom";

import type { ScreenRouteHandle } from "@/app/ScreenLayoutRoute";
import ShowCreateCompleteScreen from "@/features/show/ShowCreateCompleteScreen";
import ShowCreateScreen from "@/features/show/ShowCreateScreen";
import ShowDetailScreen from "@/features/show/ShowDetailScreen";
import ShowManageScreen from "@/features/show/ShowManageScreen";
import ShowSetlistConfirmScreen from "@/features/show/ShowSetlistConfirmScreen";
import ShowTeamCreateScreen from "@/features/show/ShowTeamCreateScreen";

// 공연 섹션 라우트. 공연/01 공연 정보와 공연/02 공연 관리는 Figma에서 같은 탭 바를 공유하지만
// 콘텐츠가 크게 달라(열람용 vs. 모임 관리자 전용 편집 폼) 별도 라우트로 분리했다 — 탭 바는
// ShowSectionTabBar(components/)가 두 화면에서 공유한다.
export const showRoutes: RouteObject[] = [
  {
    element: <ShowDetailScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/show/:showId",
  },
  {
    element: <ShowManageScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/show/:showId/manage",
  },
  {
    element: <ShowCreateScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/show/new",
  },
  {
    element: <ShowCreateCompleteScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/show/:showId/complete",
  },
  {
    element: <ShowTeamCreateScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/show/:showId/team/new",
  },
  {
    element: <ShowSetlistConfirmScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/show/:showId/setlist/confirm",
  },
];
