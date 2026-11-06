import type { RouteObject } from "react-router-dom";

import type { ScreenRouteHandle } from "@/app/ScreenLayoutRoute";
import BoardPostDetailScreen from "@/features/board/BoardPostDetailScreen";
import BoardScreen from "@/features/board/BoardScreen";
import BoardWriteScreen from "@/features/board/BoardWriteScreen";

const noBottomNav = { hasBottomNav: false } satisfies ScreenRouteHandle;

// 게시판(Bottom Nav "게시판" 탭) = 모집 공고(recruit-post). 서버 공고 대상은 모임(GROUP)·팀(TEAM)
// 둘뿐이라 탭도 둘이다(?type=group|team). 공연은 공고 대상이 아니다 — 공연 팀은 공연 정보에서
// 직접 만든다. 모임·팀에 새로 들어가는 길이 공고와 초대뿐이라, "모임 찾기"·"팀 찾기"는 여기로 온다.
export const boardRoutes: RouteObject[] = [
  { element: <BoardScreen />, path: "/board" },
  { element: <BoardWriteScreen />, handle: noBottomNav, path: "/board/write" },
  {
    element: <BoardPostDetailScreen />,
    handle: noBottomNav,
    path: "/board/:postId",
  },
  {
    element: <BoardWriteScreen />,
    handle: noBottomNav,
    path: "/board/:postId/edit",
  },
];
