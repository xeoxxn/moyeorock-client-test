import type { RouteObject } from "react-router-dom";

import type { ScreenRouteHandle } from "@/app/ScreenLayoutRoute";
import BoardPostDetailScreen from "@/features/board/BoardPostDetailScreen";
import BoardScreen from "@/features/board/BoardScreen";
import BoardWriteScreen from "@/features/board/BoardWriteScreen";

const noBottomNav = { hasBottomNav: false } satisfies ScreenRouteHandle;

// 게시판(Bottom Nav "게시판" 탭, Figma 06) = 모집 공고(recruit-post). 서버 공고 대상은 모임·팀 둘뿐이라
// 글자 탭도 "모임 | 팀"이다(?type=group|team). 공연 팀은 공고를 올릴 수 없다(서버 409).
// 모집글 상세(Figma 13) → 지원하기 시트, 모집글 쓰기(Figma 24). 서버 RecruitPost에는 일정·장르·
// 조회수가 없어 그런 정보는 본문에 쓴다.
export const boardRoutes: RouteObject[] = [
  {
    element: <BoardScreen />,
    handle: { hasMiniPlayer: true } satisfies ScreenRouteHandle,
    path: "/board",
  },
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
