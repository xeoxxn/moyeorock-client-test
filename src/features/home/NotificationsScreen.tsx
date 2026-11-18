import { List, Typography, useToast } from "@wanteddev/wds";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import NotificationRow from "@/components/list/NotificationRow";
import EmptyState from "@/components/ui/EmptyState";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import {
  getNotificationTarget,
  getPendingInvitation,
  groupOf,
  NOTIFICATION_GROUPS,
} from "@/features/home/notificationHelpers";
import { formatRelative } from "@/lib/domain/format";
import type { AppNotification } from "@/lib/domain/types";
import { getNotifications } from "@/mocks/selectors";

// Figma 14 알림(428:15306) — 최신순 알림을 오늘 · 이번 주 · 이전으로 묶는다. 문장은 서버가 만든 그대로,
// 보조 줄은 관련 대상(모집글 · 공지 · 팀 · 공연) · 시간. 초대는 여기서 바로 거절·수락하고(처리하면 버튼이
// 사라진다), 행을 누르면 읽음으로 바꾸고 관련 화면으로 간다. 쓰기는 아직 화면 상태 + 토스트로만.

function NotificationsScreen() {
  const navigate = useNavigate();
  const toast = useToast();
  const [notifications] = useState(getNotifications);
  const [readIds, setReadIds] = useState(
    () => new Set(notifications.filter((n) => n.isRead).map((n) => n.id)),
  );
  /** 알림에서 거절·수락을 마친 초대 알림 */
  const [respondedIds, setRespondedIds] = useState(() => new Set<number>());

  useScreenHeader(useMemo(() => <ScreenHeader title="알림" />, []));

  if (notifications.length === 0) {
    return (
      <ScreenBody className="flex flex-col justify-center">
        <EmptyState
          description="모집 지원 · 초대 · 공지 소식이 오면 여기에 알려 드려요."
          title="아직 알림이 없어요"
        />
      </ScreenBody>
    );
  }

  const markRead = (id: number) => setReadIds((prev) => new Set(prev).add(id));

  const respond = (
    notification: AppNotification,
    targetName: string | undefined,
    accepted: boolean,
  ) => {
    setRespondedIds((prev) => new Set(prev).add(notification.id));
    markRead(notification.id);
    toast({
      content: accepted
        ? `${targetName ? `${targetName} ` : ""}초대를 수락했어요`
        : "초대를 거절했어요",
      variant: accepted ? "positive" : "normal",
    });
  };

  const now = new Date();
  const groups = NOTIFICATION_GROUPS.map((group) => ({
    ...group,
    items: notifications.filter((n) => groupOf(n, now) === group.value),
  })).filter((group) => group.items.length > 0);

  return (
    <ScreenBody>
      {groups.map((group) => (
        <section key={group.value}>
          <Typography
            as="h2"
            className="px-5 pt-4 pb-1"
            color="semantic.label.assistive"
            variant="label1"
            weight="medium"
          >
            {group.label}
          </Typography>
          <List>
            {group.items.map((notification) => {
              const target = getNotificationTarget(notification);
              const invitation = respondedIds.has(notification.id)
                ? undefined
                : getPendingInvitation(notification);
              return (
                <NotificationRow
                  actions={
                    invitation
                      ? {
                          onAccept: () =>
                            respond(notification, target.name, true),
                          onDecline: () =>
                            respond(notification, target.name, false),
                        }
                      : undefined
                  }
                  key={notification.id}
                  message={notification.message}
                  meta={[target.name, formatRelative(notification.createdAt)]
                    .filter(Boolean)
                    .join(" · ")}
                  onClick={() => {
                    markRead(notification.id);
                    if (target.path) navigate(target.path);
                  }}
                  type={notification.type}
                  unread={!readIds.has(notification.id)}
                />
              );
            })}
          </List>
        </section>
      ))}
    </ScreenBody>
  );
}

export default NotificationsScreen;
