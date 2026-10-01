import type { RouteObject } from "react-router-dom";

import type { ScreenRouteHandle } from "@/app/ScreenLayoutRoute";
import MineInterestsScreen from "@/features/mine/MineInterestsScreen";
import MineInvitationsScreen from "@/features/mine/MineInvitationsScreen";
import MineProfileEditScreen from "@/features/mine/MineProfileEditScreen";
import MineScreen from "@/features/mine/MineScreen";
import MineSessionEditScreen from "@/features/mine/MineSessionEditScreen";
import MineUserProfileScreen from "@/features/mine/MineUserProfileScreen";

// 마이 섹션 라우트. /mine은 Bottom Nav "마이" 탭의 루트라 hasBottomNav를 기본값(true)으로 둔다.
//
// 주의: Figma의 "마이/05 받은 초대"(142:19702)와 "마이/06 내 신청"(142:19826)은 각각 별도
// 화면처럼 보이지만, 실제로는 동일한 "초대 · 신청" 헤더+탭바 안의 탭 2개(받은 초대/내 신청)다
// — 상태 변형은 새 라우트를 만들지 않는다는 컨벤션에 따라 `/mine/invitations` 하나로 합쳤다.
// MineScreen.tsx의 "초대 · 신청" 버튼도 이미 이 경로 하나로만 navigate한다.
export const mineRoutes: RouteObject[] = [
  { element: <MineScreen />, path: "/mine" },
  {
    element: <MineProfileEditScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/mine/profile",
  },
  {
    element: <MineSessionEditScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/mine/session",
  },
  {
    element: <MineInterestsScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/mine/interests",
  },
  {
    element: <MineInvitationsScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/mine/invitations",
  },
  {
    element: <MineUserProfileScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/mine/users/:userId",
  },
];
