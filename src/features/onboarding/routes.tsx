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

// 진입·온보딩(Figma 플로우 S1). 서버 기준 흐름:
// - 카카오: /login → (신규) /login/terms 약관 동의 → /onboarding/nickname … → /onboarding/complete → /
//          (기존 회원) onboardingCompleted면 / , 아니면 /onboarding/nickname
// - 이메일 로그인: /login/email → onboardingCompleted면 / , 아니면 /onboarding/nickname
// - 이메일 가입: /login/email-signup(개인정보 동의 포함) → /onboarding/nickname
export const onboardingRoutes: RouteObject[] = [
  { element: <OnboardingLoginScreen />, handle: noBottomNav, path: "/login" },
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
