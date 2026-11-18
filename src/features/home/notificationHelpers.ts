import { daysUntil } from "@/lib/domain/format";
import type { AppNotification } from "@/lib/domain/types";
import {
  getGroup,
  getInvitation,
  getJoinRequest,
  getNotice,
  getPerformance,
  getPost,
  getTargetName,
  getTeam,
} from "@/mocks/selectors";

// 알림(서버 NotificationResponse)의 targetType·targetId로 관련 대상 이름(행 보조 줄)과 누르면 갈 화면을
// 정한다. 서버 문장(message)은 그대로 쓰고, 이름은 셀렉터로 찾는다.

interface NotificationTarget {
  /** 보조 줄의 관련 대상 — 모집글 제목 · 공지 제목 · 팀/모임 이름 · 공연 제목 */
  name?: string;
  path?: string;
}

export function getNotificationTarget(
  notification: AppNotification,
): NotificationTarget {
  const { targetId } = notification;
  switch (notification.targetType) {
    case "JOIN_REQUEST": {
      // 받은 가입 신청 → 팀은 멤버 탭(대기 신청), 모임은 가입 신청 관리
      const request = getJoinRequest(targetId);
      if (!request) return {};
      const post =
        request.recruitPostId !== null
          ? getPost(request.recruitPostId)
          : undefined;
      return {
        name:
          post?.title ?? getTargetName(request.targetType, request.targetId),
        path:
          request.targetType === "TEAM"
            ? `/team/${request.targetId}/members`
            : `/crew/${request.targetId}/applications`,
      };
    }
    case "NOTICE": {
      const notice = getNotice(targetId);
      return notice
        ? { name: notice.title, path: `/crew/${notice.groupId}` }
        : {};
    }
    case "INVITATION": {
      const invitation = getInvitation(targetId);
      return {
        name: invitation
          ? getTargetName(invitation.targetType, invitation.targetId)
          : undefined,
        path: "/mine/invitations",
      };
    }
    case "TEAM":
      return { name: getTeam(targetId)?.name, path: `/team/${targetId}` };
    case "GROUP":
      return { name: getGroup(targetId)?.name, path: `/crew/${targetId}` };
    case "PERFORMANCE":
      return {
        name: getPerformance(targetId)?.title,
        path: `/show/${targetId}`,
      };
  }
}

/** 알림에서 바로 거절·수락하는 초대(대기 중인 것만) */
export function getPendingInvitation(notification: AppNotification) {
  if (notification.targetType !== "INVITATION") return undefined;
  const invitation = getInvitation(notification.targetId);
  return invitation?.status === "PENDING" ? invitation : undefined;
}

export type NotificationGroup = "today" | "week" | "earlier";

export const NOTIFICATION_GROUPS: {
  value: NotificationGroup;
  label: string;
}[] = [
  { label: "오늘", value: "today" },
  { label: "이번 주", value: "week" },
  { label: "이전", value: "earlier" },
];

/** 오늘 · 이번 주(7일 안) · 이전 */
export function groupOf(
  notification: AppNotification,
  now = new Date(),
): NotificationGroup {
  const daysAgo = -daysUntil(notification.createdAt, now);
  if (daysAgo <= 0) return "today";
  if (daysAgo < 7) return "week";
  return "earlier";
}
