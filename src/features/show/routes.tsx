import type { RouteObject } from "react-router-dom";

import type { ScreenRouteHandle } from "@/app/ScreenLayoutRoute";
import ShowCreateCompleteScreen from "@/features/show/ShowCreateCompleteScreen";
import ShowDetailScreen from "@/features/show/ShowDetailScreen";
import ShowManageScreen from "@/features/show/ShowManageScreen";
import ShowSetlistConfirmScreen from "@/features/show/ShowSetlistConfirmScreen";
import ShowTeamCreateScreen from "@/features/show/ShowTeamCreateScreen";

const noBottomNav = { hasBottomNav: false } satisfies ScreenRouteHandle;

// 공연(Figma 플로우 S6). 공연은 모임에 속해서 만들기만 /crew/:crewId/show/new(crew/routes.tsx)이고,
// 만든 뒤의 화면은 공연 id로 바로 찾아간다.
// - 모임장: 공연 정보 → 관리(정보 수정·상태 변경) → 셋리스트 확정
// - 모임원: 공연 정보 → 공연 팀 만들기 → 팀 홈
export const showRoutes: RouteObject[] = [
  { element: <ShowDetailScreen />, handle: noBottomNav, path: "/show/:showId" },
  {
    element: <ShowCreateCompleteScreen />,
    handle: noBottomNav,
    path: "/show/:showId/complete",
  },
  {
    element: <ShowManageScreen />,
    handle: noBottomNav,
    path: "/show/:showId/manage",
  },
  {
    element: <ShowTeamCreateScreen />,
    handle: noBottomNav,
    path: "/show/:showId/team/new",
  },
  {
    element: <ShowSetlistConfirmScreen />,
    handle: noBottomNav,
    path: "/show/:showId/setlist/confirm",
  },
];
