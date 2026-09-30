import type { RouteObject } from "react-router-dom";

import type { ScreenRouteHandle } from "@/app/ScreenLayoutRoute";
import OnboardingCompleteScreen from "@/features/onboarding/OnboardingCompleteScreen";
import OnboardingEmailLoginScreen from "@/features/onboarding/OnboardingEmailLoginScreen";
import OnboardingNicknameScreen from "@/features/onboarding/OnboardingNicknameScreen";
import OnboardingPreferenceScreen from "@/features/onboarding/OnboardingPreferenceScreen";
import OnboardingSessionScreen from "@/features/onboarding/OnboardingSessionScreen";
import OnboardingSignupScreen from "@/features/onboarding/OnboardingSignupScreen";

// 온보딩 섹션 라우트 — src/app/router.tsx가 이 배열을 가져다 합친다.
export const onboardingRoutes: RouteObject[] = [
  {
    element: <OnboardingEmailLoginScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/login/email",
  },
  {
    element: <OnboardingSignupScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/login/email-signup",
  },
  {
    element: <OnboardingNicknameScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/onboarding/nickname",
  },
  {
    element: <OnboardingSessionScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/onboarding/session",
  },
  {
    element: <OnboardingPreferenceScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/onboarding/preference",
  },
  {
    element: <OnboardingCompleteScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/onboarding/complete",
  },
];
