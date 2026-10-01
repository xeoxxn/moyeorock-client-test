import type { RouteObject } from "react-router-dom";

import type { ScreenRouteHandle } from "@/app/ScreenLayoutRoute";
import BoardPostDetailScreen from "@/features/board/BoardPostDetailScreen";
import BoardScreen from "@/features/board/BoardScreen";
import BoardWriteScreen from "@/features/board/BoardWriteScreen";

// 게시판 섹션 라우트. /board는 Bottom Nav "게시판" 탭의 루트라 hasBottomNav를 기본값(true)으로 둔다.
export const boardRoutes: RouteObject[] = [
  { element: <BoardScreen />, path: "/board" },
  {
    element: <BoardPostDetailScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/board/:postId",
  },
  {
    element: <BoardWriteScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/board/write",
  },
];
