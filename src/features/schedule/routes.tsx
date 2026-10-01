import type { RouteObject } from "react-router-dom";

import type { ScreenRouteHandle } from "@/app/ScreenLayoutRoute";
import ScheduleAddScreen from "@/features/schedule/ScheduleAddScreen";
import ScheduleScreen from "@/features/schedule/ScheduleScreen";

// 일정 섹션 라우트. /schedule은 Bottom Nav "일정" 탭의 루트라 hasBottomNav를 기본값(true)으로 둔다.
//
// 주의: "일정/05 날짜 선택"(101:13144)과 "일정/06 시간 선택"(101:13396)은 /schedule/add 폼
// 안에서 시작/종료 행을 누르면 펼쳐지는 같은 화면의 상태라 별도 라우트를 만들지 않았다
// (ScheduleAddScreen.tsx 참고).
export const scheduleRoutes: RouteObject[] = [
  { element: <ScheduleScreen />, path: "/schedule" },
  {
    element: <ScheduleAddScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/schedule/add",
  },
];
