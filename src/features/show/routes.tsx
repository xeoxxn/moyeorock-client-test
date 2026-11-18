import type { RouteObject } from "react-router-dom";

import type { ScreenRouteHandle } from "@/app/ScreenLayoutRoute";
import ShowDetailScreen from "@/features/show/ShowDetailScreen";
import ShowManageScreen from "@/features/show/ShowManageScreen";
import ShowSetlistConfirmScreen from "@/features/show/ShowSetlistConfirmScreen";
import ShowTeamCreateScreen from "@/features/show/ShowTeamCreateScreen";

const noBottomNav = { hasBottomNav: false } satisfies ScreenRouteHandle;

// 공연. 공연은 모임에 속해서 만들기만 /crew/:crewId/show/new(crew/routes.tsx)이고, 만든 뒤에는 공연
// id로 바로 찾아간다(만든 직후엔 완료 화면 없이 공연 상세로 간다).
// - 공연 상세(Figma 20): 히어로 + 일시·장소 + 소개 + 참가 팀. 하단 버튼은 내 팀이 있으면 "내 팀 보기",
//   없으면 공연 팀 만들기.
// - 모임장: ⋮ → 관리(정보 수정·상태 변경) · 셋리스트 확정
export const showRoutes: RouteObject[] = [
  { element: <ShowDetailScreen />, path: "/show/:showId" },
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
