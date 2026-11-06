import { createBrowserRouter, type RouteObject } from "react-router-dom";

import App from "@/app/App";
import ComingSoonScreen from "@/app/ComingSoonScreen";
import ScreenLayoutRoute from "@/app/ScreenLayoutRoute";
import { boardRoutes } from "@/features/board/routes";
import { crewRoutes } from "@/features/crew/routes";
import { homeRoutes } from "@/features/home/routes";
import { mineRoutes } from "@/features/mine/routes";
import { onboardingRoutes } from "@/features/onboarding/routes";
import { scheduleRoutes } from "@/features/schedule/routes";
import { showRoutes } from "@/features/show/routes";
import { teamRoutes } from "@/features/team/routes";

// 앱의 모든 라우트는 여기서 합친다. 섹션별 세부 라우트는 `src/features/<섹션>/routes.tsx`에 있고,
// 각 파일 머리 주석에 그 섹션의 화면 흐름(서버 moyeorock-server 기준)을 적어 둔다.
//
// 섹션 = 서버 도메인: 온보딩(auth·user) · 홈(dashboard·notification) · 일정(rehearsal) ·
// 모임(group·notice) · 팀(team·setlist 선택곡) · 공연(performance·setlist) · 게시판(recruit·join) ·
// 마이(user·bookmark·join).
//
// Figma의 "화면"이 전부 라우트가 되는 건 아니다. "버튼 눌림"·"일정 없는 날" 같은 상태 변형은 같은
// 화면 안의 조건부 렌더링으로 흡수한다.
const routes = [
  {
    children: [
      {
        children: [
          ...homeRoutes,
          ...onboardingRoutes,
          ...scheduleRoutes,
          ...crewRoutes,
          ...teamRoutes,
          ...showRoutes,
          ...boardRoutes,
          ...mineRoutes,
          // 라우트가 없는 경로 — 레이아웃 안에 둬서 하단 탭이 유지된다
          { element: <ComingSoonScreen />, path: "*" },
        ],
        element: <ScreenLayoutRoute />,
      },
    ],
    element: <App />,
  },
] satisfies RouteObject[];

export const router = createBrowserRouter(routes);
