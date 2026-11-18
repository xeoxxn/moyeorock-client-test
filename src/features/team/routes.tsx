import { Navigate, type RouteObject } from "react-router-dom";

import type { ScreenRouteHandle } from "@/app/ScreenLayoutRoute";
import TeamHomeScreen from "@/features/team/TeamHomeScreen";
import TeamManageScreen from "@/features/team/TeamManageScreen";
import TeamMembersScreen from "@/features/team/TeamMembersScreen";
import TeamNewIndependentScreen from "@/features/team/TeamNewIndependentScreen";
import TeamNewShowSelectScreen from "@/features/team/TeamNewShowSelectScreen";
import TeamNewTypeScreen from "@/features/team/TeamNewTypeScreen";
import TeamScheduleScreen from "@/features/team/TeamScheduleScreen";
import TeamSongsScreen from "@/features/team/TeamSongsScreen";

const noBottomNav = { hasBottomNav: false } satisfies ScreenRouteHandle;

// 팀. 팀 목록은 모임 탭(/crew?tab=team) 안의 패널이라 /team 자체는 그쪽으로 돌려보낸다.
//
// 팀 화면(Figma 04 · 12)은 히어로 + 탭 "홈 · 합주 · 선택곡 · 멤버". 팀 종류는 서버 기준 두 가지다 —
// 공연 팀(공연에 속함)과 독립 팀. 팀의 공연은 홈 탭에서 보여 준다(따로 공연 탭을 두지 않는다).
//
// 팀 쪽에서는 "셋리스트"라는 말을 쓰지 않는다(서버 결정, 이슈 #85) — Figma의 '셋리스트' 탭은
// "선택곡"이다. 팀장이 곡 추가 시트(Figma 16)로 선택곡을 고르고(PUT /teams/{id}/songs), 공연 팀이면
// 그중 일부를 공연에 넘긴다(확정 시트 Figma 17, PUT /performances/{pid}/setlist/teams/{tid}).
// 넘긴 곡은 "후보", 모임장이 셋리스트를 확정하면 "확정"이다. 팀원 추천(AI)은 멤버 탭 안에 있다.
// 헤더 더보기: 팀장은 팀 관리(/manage), 팀원은 팀 나가기. 팀원이 아니면 팀 홈의 공개 정보만 보고
// 팀원 전용 탭(합주 · 선택곡 · 멤버)은 팀 홈으로 돌려보낸다. 팀을 만들면 완료 화면 없이 새 팀으로 replace.
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
  { element: <TeamHomeScreen />, path: "/team/:teamId" },
  { element: <TeamScheduleScreen />, path: "/team/:teamId/schedule" },
  { element: <TeamSongsScreen />, path: "/team/:teamId/songs" },
  { element: <TeamMembersScreen />, path: "/team/:teamId/members" },
  {
    element: <TeamManageScreen />,
    handle: noBottomNav,
    path: "/team/:teamId/manage",
  },
];
