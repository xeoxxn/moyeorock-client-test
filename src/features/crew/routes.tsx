import type { RouteObject } from "react-router-dom";

import type { ScreenRouteHandle } from "@/app/ScreenLayoutRoute";
import CrewApplicationsScreen from "@/features/crew/CrewApplicationsScreen";
import CrewHomeScreen from "@/features/crew/CrewHomeScreen";
import CrewListScreen from "@/features/crew/CrewListScreen";
import CrewManageScreen from "@/features/crew/CrewManageScreen";
import CrewMembersScreen from "@/features/crew/CrewMembersScreen";
import CrewNewCompleteScreen from "@/features/crew/CrewNewCompleteScreen";
import CrewNewStep1Screen from "@/features/crew/CrewNewStep1Screen";
import CrewNewStep2Screen from "@/features/crew/CrewNewStep2Screen";
import CrewNoticeEditScreen from "@/features/crew/CrewNoticeEditScreen";
import CrewNoticeNewScreen from "@/features/crew/CrewNoticeNewScreen";
import CrewShowScreen from "@/features/crew/CrewShowScreen";
import ShowCreateScreen from "@/features/show/ShowCreateScreen";

const noBottomNav = { hasBottomNav: false } satisfies ScreenRouteHandle;

// 모임(Bottom Nav "모임" 탭). /crew는 "모임 | 팀" 탭을 가진 탭 루트이고 ?tab=team이면 팀 목록을
// 연다 — 예전에는 /crew와 /team이 각자 헤더·탭을 따로 그려서 탭을 누를 때마다 화면 전체가 바뀌었다.
//
// 서버에는 전체 모임 검색이 없다(내 모임만 보이고, 모임에 들어가는 길은 공고·초대뿐 — 2026-10-29
// 결정). 그래서 "모임 찾기"는 별도 화면 대신 게시판의 모임 모집 탭(/board?type=group)으로 보낸다.
//
// 공연은 모임에 속하므로 공연 만들기는 /crew/:crewId/show/new다(공연 상세 이후는 /show/*).
export const crewRoutes: RouteObject[] = [
  { element: <CrewListScreen />, path: "/crew" },
  {
    element: <CrewNewStep1Screen />,
    handle: noBottomNav,
    path: "/crew/create/step1",
  },
  {
    element: <CrewNewStep2Screen />,
    handle: noBottomNav,
    path: "/crew/create/step2",
  },
  {
    element: <CrewNewCompleteScreen />,
    handle: noBottomNav,
    path: "/crew/create/complete",
  },
  { element: <CrewHomeScreen />, handle: noBottomNav, path: "/crew/:crewId" },
  {
    element: <CrewShowScreen />,
    handle: noBottomNav,
    path: "/crew/:crewId/show",
  },
  {
    element: <ShowCreateScreen />,
    handle: noBottomNav,
    path: "/crew/:crewId/show/new",
  },
  {
    element: <CrewMembersScreen />,
    handle: noBottomNav,
    path: "/crew/:crewId/members",
  },
  {
    element: <CrewManageScreen />,
    handle: noBottomNav,
    path: "/crew/:crewId/manage",
  },
  {
    element: <CrewApplicationsScreen />,
    handle: noBottomNav,
    path: "/crew/:crewId/applications",
  },
  {
    element: <CrewNoticeNewScreen />,
    handle: noBottomNav,
    path: "/crew/:crewId/notice/new",
  },
  {
    element: <CrewNoticeEditScreen />,
    handle: noBottomNav,
    path: "/crew/:crewId/notice/:noticeId/edit",
  },
];
