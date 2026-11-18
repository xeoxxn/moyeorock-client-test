import {
  formatMonthDay,
  formatTime,
  formatTimeRange,
} from "@/lib/domain/format";
import type { Performance, Rehearsal } from "@/lib/domain/types";
import { getMyUpcomingPerformances, getRehearsals } from "@/mocks/selectors";

// 일정 탭이 한 줄로 늘어놓는 일정 — 내 팀 합주(GET /users/me/rehearsals)와 내 팀이 참가하는 진행 중 공연.
// 공연은 끝나는 시각이 없어 시작 시각을 끝으로 본다. startsAt은 서버가 준 ISO(format.ts 입력)다.
interface ScheduleEventBase {
  key: string;
  startsAt: string;
  start: Date;
  end: Date;
}

export type ScheduleEvent =
  | (ScheduleEventBase & { kind: "rehearsal"; item: Rehearsal })
  | (ScheduleEventBase & { kind: "performance"; item: Performance });

export function getScheduleEvents(): ScheduleEvent[] {
  const rehearsals: ScheduleEvent[] = getRehearsals().map((item) => ({
    end: new Date(item.endsAt),
    item,
    key: `rehearsal-${item.id}`,
    kind: "rehearsal",
    start: new Date(item.startsAt),
    startsAt: item.startsAt,
  }));
  const performances: ScheduleEvent[] = getMyUpcomingPerformances().map(
    (item) => ({
      end: new Date(item.performedAt),
      item,
      key: `performance-${item.id}`,
      kind: "performance",
      start: new Date(item.performedAt),
      startsAt: item.performedAt,
    }),
  );
  return [...rehearsals, ...performances].sort(
    (a, b) => a.start.getTime() - b.start.getTime(),
  );
}

export function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/** date가 든 주의 월요일~일요일 */
export function weekOf(date: Date): Date[] {
  const monday = startOfDay(date);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + index);
    return day;
  });
}

/**
 * 일정 행 보조 줄 — 합주 "19:00–21:00 · 합주실 A", 공연 "18:00 · 홍대 롤링홀". 왼쪽 날짜 칸은 일·요일만
 * 보여서, now를 주면 그달이 아닌 일정 앞에 월·일을 붙인다(고른 날 구역처럼 날짜가 제목에 있으면 안 준다).
 */
export function eventMeta(event: ScheduleEvent, now?: Date): string {
  const base =
    event.kind === "rehearsal"
      ? [
          formatTimeRange(event.item.startsAt, event.item.endsAt),
          event.item.place,
        ]
          .filter(Boolean)
          .join(" · ")
      : `${formatTime(event.startsAt)} · ${event.item.venue}`;
  const sameMonth =
    now === undefined ||
    (event.start.getFullYear() === now.getFullYear() &&
      event.start.getMonth() === now.getMonth());
  return sameMonth ? base : `${formatMonthDay(event.startsAt)} · ${base}`;
}

export function eventPath(event: ScheduleEvent): string {
  // 합주 상세 화면은 없다(서버에도 단건 조회 흐름이 없다) — 그 팀의 합주 탭으로 간다.
  return event.kind === "rehearsal"
    ? `/team/${event.item.teamId}/schedule`
    : `/show/${event.item.id}`;
}
