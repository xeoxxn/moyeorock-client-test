import { Navigate, type RouteObject } from "react-router-dom";

import type { ScreenRouteHandle } from "@/app/ScreenLayoutRoute";
import TeamHomeScreen from "@/features/team/TeamHomeScreen";
import TeamManageScreen from "@/features/team/TeamManageScreen";
import TeamMembersFindScreen from "@/features/team/TeamMembersFindScreen";
import TeamMembersScreen from "@/features/team/TeamMembersScreen";
import TeamNewIndependentScreen from "@/features/team/TeamNewIndependentScreen";
import TeamNewShowSelectScreen from "@/features/team/TeamNewShowSelectScreen";
import TeamNewTypeScreen from "@/features/team/TeamNewTypeScreen";
import TeamScheduleScreen from "@/features/team/TeamScheduleScreen";
import TeamShowScreen from "@/features/team/TeamShowScreen";
import TeamSongsAddScreen from "@/features/team/TeamSongsAddScreen";
import TeamSongsScreen from "@/features/team/TeamSongsScreen";

const noBottomNav = { hasBottomNav: false } satisfies ScreenRouteHandle;

// 팀. 팀 목록은 모임 탭(/crew?tab=team) 안의 패널이라 /team 자체는 그쪽으로 돌려보낸다.
//
// 팀 종류는 서버 기준 두 가지다 — 공연 팀(공연에 속함, TeamDetail.performance 있음)과 독립 팀.
// /team/:teamId/show(팀 공연)는 공연 팀에만 있다.
//
// 팀 쪽에서는 "셋리스트"라는 말을 쓰지 않는다(서버 결정, 이슈 #85) — 팀은 "선택곡"을 고르고
// (/team/:teamId/songs), 공연 팀 팀장이 그중 일부를 공연 셋리스트로 넘기면 모임장이 확정한다.
export const teamRoutes: RouteObject[] = [
  { element: <Navigate replace to="/crew?tab=team" />, path: "/team" },
  {
    element: <TeamNewTypeScreen />,
    handle: noBottomNav,
    path: "/team/create/type",
  },
  {
    element: <TeamNewIndependentScreen />,
    handle: noBottomNav,
    path: "/team/create/independent",
  },
  {
    element: <TeamNewShowSelectScreen />,
    handle: noBottomNav,
    path: "/team/create/show",
  },
  { element: <TeamHomeScreen />, handle: noBottomNav, path: "/team/:teamId" },
  {
    element: <TeamShowScreen />,
    handle: noBottomNav,
    path: "/team/:teamId/show",
  },
  {
    element: <TeamSongsScreen />,
    handle: noBottomNav,
    path: "/team/:teamId/songs",
  },
  {
    element: <TeamSongsAddScreen />,
    handle: noBottomNav,
    path: "/team/:teamId/songs/add",
  },
  {
    element: <TeamScheduleScreen />,
    handle: noBottomNav,
    path: "/team/:teamId/schedule",
  },
  {
    element: <TeamMembersScreen />,
    handle: noBottomNav,
    path: "/team/:teamId/members",
  },
  {
    element: <TeamMembersFindScreen />,
    handle: noBottomNav,
    path: "/team/:teamId/members/find",
  },
  {
    element: <TeamManageScreen />,
    handle: noBottomNav,
    path: "/team/:teamId/manage",
  },
];
