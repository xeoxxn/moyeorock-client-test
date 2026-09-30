import { createBrowserRouter, type RouteObject } from "react-router-dom";

import App from "@/app/App";
import ComingSoonScreen from "@/app/ComingSoonScreen";
import ScreenLayoutRoute, {
  type ScreenRouteHandle,
} from "@/app/ScreenLayoutRoute";
import HomeScreen from "@/features/home/HomeScreen";
import { homeRoutes } from "@/features/home/routes";
import OnboardingLoginScreen from "@/features/onboarding/OnboardingLoginScreen";
import { onboardingRoutes } from "@/features/onboarding/routes";

// 앱의 모든 라우트는 이 객체 배열 한곳에서 정의한다 — 새 화면은 여기에 라우트를 추가한다.
// satisfies로 선언 시점에 RouteObject 형태를 검사한다.
//
// 각 섹션(온보딩/홈/일정/모임/팀/공연/게시판/마이)의 세부 라우트는 병렬로 작업하는 동안 충돌을
// 피하려고 `src/features/<섹션>/routes.tsx`에 따로 두고 여기서 가져와 합친다.
//
// 주의: Figma의 "화면"이 전부 별도 라우트가 되는 건 아니다. "버튼 눌림", "일정 없는 날" 같은
// 상태 변형(state variant)은 같은 화면 컴포넌트 안의 조건부 렌더링으로 흡수하고, 새 라우트를
// 만들지 않는다 — 실제 사용자 흐름에서 별도 URL로 존재하지 않는 상태이기 때문이다.
const routes = [
  {
    children: [
      {
        children: [
          { element: <HomeScreen />, path: "/" },
          {
            element: <OnboardingLoginScreen />,
            handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
            path: "/login",
          },
          ...onboardingRoutes,
          ...homeRoutes,
          // 라우트가 없는 경로 — 레이아웃 안에 둬서 하단 탭이 유지되고, 탭 경로면 그 탭이 활성으로 보인다
          { element: <ComingSoonScreen />, path: "*" },
        ],
        element: <ScreenLayoutRoute />,
      },
    ],
    element: <App />,
  },
] satisfies RouteObject[];

export const router = createBrowserRouter(routes);
