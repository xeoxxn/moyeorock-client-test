// 화면마다 "10월 17일 (토) 18:00"·"10.17"·"D-30"을 손으로 적던 것을 여기로 모았다. 입력은 서버가
// 내려주는 ISO 문자열(`2026-12-12T18:00:00`)이다.

const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/** 10월 17일(토) — Figma 표기처럼 괄호 앞에 띄어쓰기를 두지 않는다. */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  return `${date.getMonth() + 1}월 ${date.getDate()}일(${WEEKDAY[date.getDay()]})`;
}

/** 11월 12일 */
export function formatMonthDay(iso: string): string {
  const date = new Date(iso);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

/** 15일(일) — 이번 달 안의 가까운 날을 짧게 */
export function formatDayShort(iso: string): string {
  const date = new Date(iso);
  return `${date.getDate()}일(${WEEKDAY[date.getDay()]})`;
}

/** 13일 금요일 — 일정 화면의 고른 날 제목 */
export function formatDayHeading(date: Date): string {
  return `${date.getDate()}일 ${WEEKDAY[date.getDay()]}요일`;
}

/** 0:58 · 3:01 — 녹음 길이·재생 위치(초) */
export function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  return `${Math.floor(seconds / 60)}:${pad(seconds % 60)}`;
}

/** 18:00 */
export function formatTime(iso: string): string {
  const date = new Date(iso);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** 10월 17일 (토) 18:00 */
export function formatDateTime(iso: string): string {
  return `${formatDate(iso)} ${formatTime(iso)}`;
}

/** 19:00–21:00 */
export function formatTimeRange(startIso: string, endIso: string): string {
  return `${formatTime(startIso)}–${formatTime(endIso)}`;
}

/** 2026.10.17 */
export function formatDotDate(iso: string): string {
  const date = new Date(iso);
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
}

/** 10.17 */
export function formatShortDate(iso: string): string {
  const date = new Date(iso);
  return `${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
}

/** 오늘 기준 남은 날 수. 오늘이면 0, 지났으면 음수. */
export function daysUntil(iso: string, now = new Date()): number {
  const diff = startOfDay(new Date(iso)).getTime() - startOfDay(now).getTime();
  return Math.round(diff / (24 * 60 * 60 * 1000));
}

/** D-30 · D-DAY · D+3 */
export function formatDday(iso: string, now = new Date()): string {
  const days = daysUntil(iso, now);
  if (days === 0) return "D-DAY";
  return days > 0 ? `D-${days}` : `D+${-days}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** 5분 전 · 3시간 전 · 2일 전 · 1주 전 · 10월 17일 */
export function formatRelative(iso: string, now = new Date()): string {
  const diffMinutes = Math.floor(
    (now.getTime() - new Date(iso).getTime()) / 60000,
  );
  if (diffMinutes < 1) return "방금 전";
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffDays < 28) return `${Math.floor(diffDays / 7)}주 전`;
  return formatMonthDay(iso);
}

export function weekdayLabel(date: Date): string {
  return WEEKDAY[date.getDay()];
}
