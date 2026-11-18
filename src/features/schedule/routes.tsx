import type { RouteObject } from "react-router-dom";

import type { ScreenRouteHandle } from "@/app/ScreenLayoutRoute";
import ScheduleAddScreen from "@/features/schedule/ScheduleAddScreen";
import ScheduleScreen from "@/features/schedule/ScheduleScreen";

// 일정(Bottom Nav "일정" 탭 루트, Figma 02) — 이번 주 날짜 줄 + 고른 날의 합주 + 다가오는 일정(합주·공연).
// 내 합주 일정은 GET /users/me/rehearsals, 공연은 내 팀이 참가하는 진행 중 공연.
//
// /schedule/add(Figma 21)는 일정 탭과 팀 합주 탭 양쪽에서 들어온다. 합주는 팀 단위라
// (POST /teams/{teamId}/rehearsals) 팀에서 들어오면 ?teamId=로 팀이 정해져 있고, 일정 탭에서
// 들어오면 폼 맨 위에서 팀을 고른다.
export const scheduleRoutes: RouteObject[] = [
  {
    element: <ScheduleScreen />,
    handle: { hasMiniPlayer: true } satisfies ScreenRouteHandle,
    path: "/schedule",
  },
  {
    element: <ScheduleAddScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/schedule/add",
  },
];
