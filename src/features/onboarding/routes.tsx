import type { RouteObject } from "react-router-dom";

import type { ScreenRouteHandle } from "@/app/ScreenLayoutRoute";
import OnboardingCompleteScreen from "@/features/onboarding/OnboardingCompleteScreen";
import OnboardingEmailLoginScreen from "@/features/onboarding/OnboardingEmailLoginScreen";
import OnboardingLoginScreen from "@/features/onboarding/OnboardingLoginScreen";
import OnboardingNicknameScreen from "@/features/onboarding/OnboardingNicknameScreen";
import OnboardingPreferenceScreen from "@/features/onboarding/OnboardingPreferenceScreen";
import OnboardingSessionScreen from "@/features/onboarding/OnboardingSessionScreen";
import OnboardingSignupScreen from "@/features/onboarding/OnboardingSignupScreen";
import OnboardingTermsScreen from "@/features/onboarding/OnboardingTermsScreen";

const noBottomNav = { hasBottomNav: false } satisfies ScreenRouteHandle;

// 진입·온보딩(Figma 00 스플래시 · 08 로그인 · 22 세션 선택 · 09 가입 완료). 서버 기준 흐름:
// - 앱 첫 진입: 스플래시(src/app/AppSplash, 라우트 없음)가 인증을 확인한다 — 로그인 전이면 /login으로
//   로고가 옮겨 가며 이어지고, 로그인했으면 열려던 화면(기본 /)으로 페이드한다.
// - 카카오: /login → (신규) /login/terms 약관 동의 → /onboarding/nickname → /onboarding/session →
//          /onboarding/preference → /onboarding/complete → /
//          (기존 회원) onboardingCompleted면 / , 아니면 /onboarding/nickname
// - 이메일 로그인(/login의 "이메일로 로그인"): /login/email → onboardingCompleted면 / , 아니면 /onboarding/nickname
// - 이메일 가입(/login의 "회원가입" 링크): /login/email-signup(개인정보 동의 포함) → /onboarding/nickname
// 온보딩 3단계(닉네임 · 세션 · 지역·장르)는 마지막에 POST /users/me/onboarding 한 번으로 저장한다.
export const onboardingRoutes: RouteObject[] = [
  {
    element: <OnboardingLoginScreen />,
    handle: { fullBleed: true, hasBottomNav: false },
    path: "/login",
  },
  {
    element: <OnboardingEmailLoginScreen />,
    handle: noBottomNav,
    path: "/login/email",
  },
  {
    element: <OnboardingSignupScreen />,
    handle: noBottomNav,
    path: "/login/email-signup",
  },
  {
    element: <OnboardingTermsScreen />,
    handle: noBottomNav,
    path: "/login/terms",
  },
  {
    element: <OnboardingNicknameScreen />,
    handle: noBottomNav,
    path: "/onboarding/nickname",
  },
  {
    element: <OnboardingSessionScreen />,
    handle: noBottomNav,
    path: "/onboarding/session",
  },
  {
    element: <OnboardingPreferenceScreen />,
    handle: noBottomNav,
    path: "/onboarding/preference",
  },
  {
    element: <OnboardingCompleteScreen />,
    handle: noBottomNav,
    path: "/onboarding/complete",
  },
];
