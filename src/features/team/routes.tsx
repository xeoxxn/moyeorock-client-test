import type { RouteObject } from "react-router-dom";

import type { ScreenRouteHandle } from "@/app/ScreenLayoutRoute";
import TeamHomeScreen from "@/features/team/TeamHomeScreen";
import TeamListScreen from "@/features/team/TeamListScreen";
import TeamManageScreen from "@/features/team/TeamManageScreen";
import TeamMembersFindScreen from "@/features/team/TeamMembersFindScreen";
import TeamMembersScreen from "@/features/team/TeamMembersScreen";
import TeamNewIndependentScreen from "@/features/team/TeamNewIndependentScreen";
import TeamNewTypeScreen from "@/features/team/TeamNewTypeScreen";
import TeamScheduleScreen from "@/features/team/TeamScheduleScreen";
import TeamSetlistAddScreen from "@/features/team/TeamSetlistAddScreen";
import TeamSetlistScreen from "@/features/team/TeamSetlistScreen";
import TeamShowScreen from "@/features/team/TeamShowScreen";

// 팀 섹션 라우트. TeamListScreen은 "모임" 탭(/crew)과 세그먼트로 묶인 화면이라 하단 탭을
// 그대로 둔다(TeamListScreen.tsx 주석 참고). 나머지는 전부 하위 화면이라 hasBottomNav: false.
//
// 팀 만들기 흐름은 모임(crew)의 "/crew/create/stepN" 명명 규칙을 따라 "/team/create/*"로 뺐다
// — TeamListScreen이 이미 "/team/create/type"으로 navigate하고 있어 그 경로에 맞췄다.
// "공연 참가 팀" 선택지(/team/create/show)는 이번 범위의 Figma 화면 목록에 없어 아직
// 미구현 — ComingSoonScreen으로 자연스럽게 떨어진다.
export const teamRoutes: RouteObject[] = [
  { element: <TeamListScreen />, path: "/team" },
  {
    element: <TeamHomeScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/team/:teamId",
  },
  {
    element: <TeamShowScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/team/:teamId/show",
  },
  {
    element: <TeamSetlistScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/team/:teamId/setlist",
  },
  {
    element: <TeamSetlistAddScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/team/:teamId/setlist/add",
  },
  {
    element: <TeamScheduleScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/team/:teamId/schedule",
  },
  {
    element: <TeamMembersScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/team/:teamId/members",
  },
  {
    element: <TeamMembersFindScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/team/:teamId/members/find",
  },
  {
    element: <TeamManageScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/team/:teamId/manage",
  },
  {
    element: <TeamNewTypeScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/team/create/type",
  },
  {
    element: <TeamNewIndependentScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/team/create/independent",
  },
];
