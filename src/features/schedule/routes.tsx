import type { RouteObject } from "react-router-dom";

import type { ScreenRouteHandle } from "@/app/ScreenLayoutRoute";
import ScheduleAddScreen from "@/features/schedule/ScheduleAddScreen";
import ScheduleScreen from "@/features/schedule/ScheduleScreen";

// 일정(Bottom Nav "일정" 탭 루트) — 내 합주 일정(GET /users/me/rehearsals).
//
// /schedule/add는 일정 탭과 팀 일정(/team/:teamId/schedule) 양쪽에서 들어온다. 합주는 팀 단위라
// (POST /teams/{teamId}/rehearsals) 팀에서 들어오면 ?teamId=로 팀이 정해져 있고, 일정 탭에서
// 들어오면 폼에서 팀을 고른다. "일정/05 날짜 선택"·"일정/06 시간 선택"은 이 폼 안의 상태다.
export const scheduleRoutes: RouteObject[] = [
  { element: <ScheduleScreen />, path: "/schedule" },
  {
    element: <ScheduleAddScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/schedule/add",
  },
];
