import type { StatusTone } from "@/components/ui/Status";
import { formatDday, formatMonthDay, formatTime } from "@/lib/domain/format";
import {
  GROUP_ROLE_LABEL,
  GROUP_TYPE_LABEL,
  PERFORMANCE_STATUS_LABEL,
  REGION_LABEL,
} from "@/lib/domain/labels";
import type { Group, GroupMember, Performance } from "@/lib/domain/types";
import { ME_ID } from "@/mocks/data";
import { isUpcoming } from "@/mocks/selectors";

// 모임 화면들이 같이 쓰는 문구 조합. 날짜 표기는 format.ts, 라벨은 labels.ts에서만 가져와 이어 붙인다.

/** 프로필로 가는 경로 — 나는 마이 탭, 다른 사람은 멤버 프로필 */
export function profilePath(userId: number): string {
  return userId === ME_ID ? "/mine" : `/users/${userId}`;
}

/** 모임 목록 한 줄 — "정기 모임 · 멤버 12명 · 모임장" */
export function groupRowMeta(group: Group): string {
  const parts = [GROUP_TYPE_LABEL[group.type], `멤버 ${group.memberCount}명`];
  if (group.myRole) parts.push(GROUP_ROLE_LABEL[group.myRole]);
  return parts.join(" · ");
}

/** 모임 히어로 — "서울 · 멤버 8명 · 2024년부터" */
export function groupHeroMeta(group: Group): string {
  const since = new Date(group.createdAt).getFullYear();
  return `${REGION_LABEL[group.region]} · 멤버 ${group.memberCount}명 · ${since}년부터`;
}

const ROLE_RANK = { MANAGER: 1, MEMBER: 2, OWNER: 0 } as const;

/** 모임장 → 운영진 → 멤버 순(같은 역할 안에서는 원래 순서) */
export function sortByRole(members: GroupMember[]): GroupMember[] {
  return [...members].sort((a, b) => ROLE_RANK[a.role] - ROLE_RANK[b.role]);
}

/** 공연 상태 배지 — 진행 중이면 D-day를 붙인다("공연 예정 · D-8") */
export function performanceStatus(performance: Performance): {
  tone: StatusTone;
  label: string;
} {
  const label = PERFORMANCE_STATUS_LABEL[performance.status];
  if (performance.status === "PLANNED") {
    return {
      label: `${label} · ${formatDday(performance.performedAt)}`,
      tone: "accent",
    };
  }
  if (performance.status === "RECRUITING") {
    return {
      label: `${label} · ${formatDday(performance.performedAt)}`,
      tone: "progress",
    };
  }
  return { label, tone: "neutral" };
}

/**
 * 공연 행 보조 줄 — "18:00 · 홍대 롤링홀". 왼쪽 날짜 칸은 일·요일만 보여서, 이번 달이 아닌 공연은
 * 앞에 월·일을 붙인다("3월 21일 · 17:00 · 난지 한강공원").
 */
export function performanceMeta(performance: Performance, now = new Date()) {
  const date = new Date(performance.performedAt);
  const base = `${formatTime(performance.performedAt)} · ${performance.venue}`;
  const sameMonth =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth();
  return sameMonth
    ? base
    : `${formatMonthDay(performance.performedAt)} · ${base}`;
}

/** 다가오는 공연은 가까운 순, 지난 공연은 최근 순 */
export function splitPerformances(performances: Performance[]) {
  const upcoming = performances
    .filter(isUpcoming)
    .sort((a, b) => a.performedAt.localeCompare(b.performedAt));
  const past = performances
    .filter((performance) => !isUpcoming(performance))
    .sort((a, b) => b.performedAt.localeCompare(a.performedAt));
  return { past, upcoming };
}
