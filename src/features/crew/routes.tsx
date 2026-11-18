import type { RouteObject } from "react-router-dom";

import type { ScreenRouteHandle } from "@/app/ScreenLayoutRoute";
import CrewApplicationsScreen from "@/features/crew/CrewApplicationsScreen";
import CrewCreateScreen from "@/features/crew/CrewCreateScreen";
import CrewHomeScreen from "@/features/crew/CrewHomeScreen";
import CrewListScreen from "@/features/crew/CrewListScreen";
import CrewManageScreen from "@/features/crew/CrewManageScreen";
import CrewMembersScreen from "@/features/crew/CrewMembersScreen";
import CrewNoticeEditScreen from "@/features/crew/CrewNoticeEditScreen";
import CrewNoticeNewScreen from "@/features/crew/CrewNoticeNewScreen";
import CrewShowScreen from "@/features/crew/CrewShowScreen";
import ShowCreateScreen from "@/features/show/ShowCreateScreen";

const noBottomNav = { hasBottomNav: false } satisfies ScreenRouteHandle;

// 모임(Bottom Nav "모임" 탭, Figma 03). /crew는 "모임 | 팀" 글자 탭을 가진 탭 루트이고 ?tab=team이면
// 팀 목록을 연다.
//
// 서버에는 전체 모임 검색이 없다(내 모임만 보이고, 모임에 들어가는 길은 공고·초대뿐). 그래서 "모임
// 찾아보기"는 게시판의 모임 모집 탭(/board?type=group)으로 보낸다.
//
// 모임 홈(Figma 19)은 히어로 + 탭 "홈 · 공연 · 멤버"(각각 /crew/:id, /crew/:id/show, /crew/:id/members).
// 헤더 ⋮ 는 모임원에게만 보이고 /crew/:id/manage(모임 설정)로 간다 — 모임장은 받은 신청·공지 쓰기·
// 정보 수정·해체, 그 밖의 모임원은 나가기. 공지 쓰기·수정·가입 승인은 서버 기준 현재 모임장만 한다.
// 모임 만들기(/crew/new)는 한 화면 폼이고 만들면 새 모임 홈으로 replace(완료 화면 없음).
// 공연은 모임에 속하므로 공연 만들기는 /crew/:crewId/show/new다(공연 상세 이후는 /show/*).
export const crewRoutes: RouteObject[] = [
  {
    element: <CrewListScreen />,
    handle: { hasMiniPlayer: true } satisfies ScreenRouteHandle,
    path: "/crew",
  },
  { element: <CrewCreateScreen />, handle: noBottomNav, path: "/crew/new" },
  { element: <CrewHomeScreen />, path: "/crew/:crewId" },
  { element: <CrewShowScreen />, path: "/crew/:crewId/show" },
  {
    element: <ShowCreateScreen />,
    handle: noBottomNav,
    path: "/crew/:crewId/show/new",
  },
  { element: <CrewMembersScreen />, path: "/crew/:crewId/members" },
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
