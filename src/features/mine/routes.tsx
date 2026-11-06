import type { RouteObject } from "react-router-dom";

import type { ScreenRouteHandle } from "@/app/ScreenLayoutRoute";
import MineInterestsScreen from "@/features/mine/MineInterestsScreen";
import MineInvitationsScreen from "@/features/mine/MineInvitationsScreen";
import MineProfileEditScreen from "@/features/mine/MineProfileEditScreen";
import MineScreen from "@/features/mine/MineScreen";
import MineSessionEditScreen from "@/features/mine/MineSessionEditScreen";
import UserProfileScreen from "@/features/mine/UserProfileScreen";

const noBottomNav = { hasBottomNav: false } satisfies ScreenRouteHandle;

// 마이(Bottom Nav "마이" 탭, Figma 플로우 S7).
// - 저장 목록(/mine/interests?tab=user|team|song): 서버 북마크 대상이 유저·팀·곡이다.
// - 초대·신청(/mine/invitations?tab=received|applied): "마이/05 받은 초대"와 "마이/06 내 신청"은
//   같은 화면의 두 탭이다. 가입 신청 직후에는 ?tab=applied로 바로 내 신청 탭을 연다.
// - 다른 사용자 프로필은 마이가 아니라 /users/:userId다(팀원 찾기·멤버 목록 등 여러 곳에서 들어온다).
export const mineRoutes: RouteObject[] = [
  { element: <MineScreen />, path: "/mine" },
  {
    element: <MineProfileEditScreen />,
    handle: noBottomNav,
    path: "/mine/profile",
  },
  {
    element: <MineSessionEditScreen />,
    handle: noBottomNav,
    path: "/mine/session",
  },
  {
    element: <MineInterestsScreen />,
    handle: noBottomNav,
    path: "/mine/interests",
  },
  {
    element: <MineInvitationsScreen />,
    handle: noBottomNav,
    path: "/mine/invitations",
  },
  {
    element: <UserProfileScreen />,
    handle: noBottomNav,
    path: "/users/:userId",
  },
];
