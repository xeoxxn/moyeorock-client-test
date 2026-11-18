import type { RouteObject } from "react-router-dom";

import type { ScreenRouteHandle } from "@/app/ScreenLayoutRoute";
import MineAccountScreen from "@/features/mine/MineAccountScreen";
import MineInterestsScreen from "@/features/mine/MineInterestsScreen";
import MineInvitationsScreen from "@/features/mine/MineInvitationsScreen";
import MineNotificationSettingsScreen from "@/features/mine/MineNotificationSettingsScreen";
import MineProfileEditScreen from "@/features/mine/MineProfileEditScreen";
import MineScreen from "@/features/mine/MineScreen";
import MineSessionEditScreen from "@/features/mine/MineSessionEditScreen";
import UserProfileScreen from "@/features/mine/UserProfileScreen";

const noBottomNav = { hasBottomNav: false } satisfies ScreenRouteHandle;

// 마이(Bottom Nav "마이" 탭, Figma 07) — 프로필 + 통계(연습 분석 · 팔로잉 · 저장한 곡) + 내 세션 + 내 팀 + 메뉴
// (받은 신청·초대 · 알림 설정 · 계정).
// - 통계: 연습 분석 → /practice, 팔로잉 → /mine/interests?tab=user, 저장한 곡 → ?tab=song
//   (서버 북마크 대상은 유저·팀·곡이고, 유저 북마크가 화면의 "팔로우"다)
// - /mine/invitations?tab=received|applied: 받은 초대와 내 신청은 같은 화면의 두 탭
// - 프로필 아래 "프로필 편집" → /mine/profile, "내 세션" 구역의 "수정" → /mine/session(세션은
//   PUT /users/me/instruments로 따로 저장)
// - /mine/notifications: 알림 설정 — 서버에 API가 없어 화면 상태로만
// - /mine/account(메뉴 "계정"·헤더 설정 아이콘): 공개 설정 · 로그아웃 · 회원 탈퇴(팀장·모임장이면 서버가 막는다)
// - 다른 사용자 프로필(Figma 23)은 마이가 아니라 /users/:userId다(멤버·모집글 등 여러 곳에서 들어온다).
export const mineRoutes: RouteObject[] = [
  {
    element: <MineScreen />,
    handle: { hasMiniPlayer: true } satisfies ScreenRouteHandle,
    path: "/mine",
  },
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
    element: <MineNotificationSettingsScreen />,
    handle: noBottomNav,
    path: "/mine/notifications",
  },
  {
    element: <MineAccountScreen />,
    handle: noBottomNav,
    path: "/mine/account",
  },
  { element: <UserProfileScreen />, path: "/users/:userId" },
];
