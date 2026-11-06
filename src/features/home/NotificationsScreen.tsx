import {
  Button,
  Divider,
  List,
  ListCell,
  ListCellContent,
  TopNavigationButton,
  Typography,
} from "@wanteddev/wds";
import { IconBell } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import EmptyState from "@/components/ui/EmptyState";
import PressableCard from "@/components/ui/PressableCard";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SectionHeader from "@/components/ui/SectionHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import { formatRelative } from "@/lib/domain/format";
import { INSTRUMENT_LABEL } from "@/lib/domain/labels";
import type {
  AppNotification,
  Instrument,
  NotificationType,
} from "@/lib/domain/types";
import { INVITATIONS, JOIN_REQUESTS, NOTIFICATIONS } from "@/mocks/data";
import {
  getGroup,
  getNotice,
  getPerformance,
  getTargetName,
  getTeam,
  getUser,
} from "@/mocks/selectors";

// 받은 사람이 직접 처리해야 하는 알림 — 안 읽은 동안 "처리 대기"에 버튼과 함께 올린다.
// 모임 가입 신청은 서버에 모임 전용 타입이 없어 RECRUIT_POST_APPLIED로 온다.
const ACTION_LABEL: Partial<Record<NotificationType, string>> = {
  GROUP_INVITE: "초대 보기",
  RECRUIT_POST_APPLIED: "확인하기",
  TEAM_APPLY: "확인하기",
  TEAM_INVITE: "초대 보기",
};

interface NotificationTarget {
  /** 눌렀을 때 갈 화면. 대상을 못 찾으면 없다(누를 수 없는 알림). */
  to?: string;
  /** 신청·초대를 보낸 사람과 세션 — "이보컬 · 보컬" */
  actor?: string;
  /** 알림이 가리키는 모임·팀·공연 이름 */
  context?: string;
}

function personLabel(userId: number, instrument: Instrument | null): string {
  return [getUser(userId)?.nickname, instrument && INSTRUMENT_LABEL[instrument]]
    .filter(Boolean)
    .join(" · ");
}

// 알림의 targetType·targetId만으로 갈 곳을 정한다. 신청(JOIN_REQUEST)은 대상이 모임이면 모임의 가입
// 신청 관리, 팀이면 팀 멤버 화면(팀 지원 승인은 거기서 한다)으로 보낸다.
// TODO 서버 연동 시 JOIN_REQUESTS·INVITATIONS 대신 단건 조회 셀렉터로 바꾼다.
function resolveTarget(notification: AppNotification): NotificationTarget {
  const { targetId, targetType } = notification;
  switch (targetType) {
    case "JOIN_REQUEST": {
      const request = JOIN_REQUESTS.find((item) => item.id === targetId);
      if (!request) return {};
      return {
        actor: personLabel(request.applicantId, request.instrument),
        context: getTargetName(request.targetType, request.targetId),
        to:
          request.targetType === "GROUP"
            ? `/crew/${request.targetId}/applications`
            : `/team/${request.targetId}/members`,
      };
    }
    case "INVITATION": {
      const invitation = INVITATIONS.find((item) => item.id === targetId);
      return {
        actor: invitation
          ? personLabel(invitation.inviterId, invitation.instrument)
          : undefined,
        context: invitation
          ? getTargetName(invitation.targetType, invitation.targetId)
          : undefined,
        to: "/mine/invitations?tab=received",
      };
    }
    case "PERFORMANCE": {
      const performance = getPerformance(targetId);
      return performance
        ? { context: performance.title, to: `/show/${performance.id}` }
        : {};
    }
    case "NOTICE": {
      const notice = getNotice(targetId);
      return notice
        ? {
            context: getGroup(notice.groupId)?.name,
            to: `/crew/${notice.groupId}`,
          }
        : {};
    }
    case "GROUP": {
      const group = getGroup(targetId);
      return group ? { context: group.name, to: `/crew/${group.id}` } : {};
    }
    case "TEAM": {
      const team = getTeam(targetId);
      return team ? { context: team.name, to: `/team/${team.id}` } : {};
    }
  }
}

function joinMeta(...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(" · ");
}

// Figma: 홈/03 알림 (nodeId 101:11760). GET /notifications.
// "처리 대기" = 안 읽은 신청·초대 알림(버튼으로 바로 처리 화면), "지난 알림" = 나머지. 알림을 열면 읽음
// 처리(PATCH /notifications/read {ids})되어 처리 대기에서 내려간다. "모두 읽음"은 ids 없이 보내는
// 같은 API다. 목업이라 읽음 상태는 이 화면 안에서만 유지된다.
function NotificationsScreen() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(() =>
    [...NOTIFICATIONS].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  );

  const markRead = (ids?: number[]) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        ids === undefined || ids.includes(notification.id)
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  useScreenHeader(
    <ScreenHeader
      title="알림"
      trailing={
        <TopNavigationButton
          disabled={unreadCount === 0}
          onClick={() => markRead()}
          variant="text"
        >
          모두 읽음
        </TopNavigationButton>
      }
    />,
  );

  const items = notifications.map((notification) => ({
    notification,
    ...resolveTarget(notification),
  }));
  const isPending = (item: (typeof items)[number]) =>
    !item.notification.isRead &&
    ACTION_LABEL[item.notification.type] !== undefined &&
    item.to !== undefined;
  const pending = items.filter(isPending);
  const past = items.filter((item) => !isPending(item));

  const open = (notification: AppNotification, to: string) => {
    markRead([notification.id]);
    navigate(to);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col justify-center">
        <EmptyState description="아직 받은 알림이 없어요" />
      </div>
    );
  }

  return (
    <div className="scrollbar-hidden flex-1 overflow-y-auto">
      <div className="flex flex-col gap-3 px-5 pt-2 pb-6">
        {pending.length > 0 && (
          <>
            <SectionHeader count={pending.length} title="처리 대기" />
            {pending.map(({ actor, notification, to }) => (
              <PressableCard key={notification.id}>
                <div className="flex items-start gap-2">
                  <span
                    aria-hidden
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                  />
                  <Typography
                    color="semantic.label.strong"
                    variant="body2"
                    weight="bold"
                  >
                    {notification.message}
                  </Typography>
                </div>
                <Typography
                  color="semantic.label.assistive"
                  variant="label2"
                  weight="regular"
                >
                  {joinMeta(actor, formatRelative(notification.createdAt))}
                </Typography>
                <div className="flex pt-1">
                  <Button
                    color="primary"
                    onClick={() => to && open(notification, to)}
                    size="small"
                    variant="solid"
                  >
                    {ACTION_LABEL[notification.type]}
                  </Button>
                </div>
              </PressableCard>
            ))}
          </>
        )}

        {pending.length > 0 && past.length > 0 && <Divider />}

        {past.length > 0 && (
          <>
            <SectionHeader title="지난 알림" />
            <List>
              {past.map(({ context, notification, to }) => (
                <ListCell
                  alignItems="center"
                  disableInteraction={to === undefined}
                  key={notification.id}
                  leadingContent={
                    <ListCellContent>
                      <span className="flex size-10 items-center justify-center rounded-xl bg-surface text-label-assistive [&>svg]:size-4.5">
                        <IconBell />
                      </span>
                    </ListCellContent>
                  }
                  onClick={to ? () => open(notification, to) : undefined}
                  textProps={{
                    caption: joinMeta(
                      context,
                      formatRelative(notification.createdAt),
                    ),
                    captionProps: {
                      color: "semantic.label.assistive",
                      variant: "caption1",
                    },
                    color: notification.isRead
                      ? "semantic.label.alternative"
                      : "semantic.label.strong",
                    variant: "label1",
                    weight: notification.isRead ? "medium" : "bold",
                  }}
                  trailingContent={
                    notification.isRead ? undefined : (
                      <ListCellContent>
                        <span
                          aria-label="안 읽음"
                          className="size-1.5 rounded-full bg-accent"
                          role="img"
                        />
                      </ListCellContent>
                    )
                  }
                >
                  {notification.message}
                </ListCell>
              ))}
            </List>
          </>
        )}
      </div>
    </div>
  );
}

export default NotificationsScreen;
