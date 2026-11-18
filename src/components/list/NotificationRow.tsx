import { Button, Typography } from "@wanteddev/wds";
import applyIcon from "@/assets/notify/apply.svg";
import approvedIcon from "@/assets/notify/approved.svg";
import inviteIcon from "@/assets/notify/invite.svg";
import noticeIcon from "@/assets/notify/notice.svg";
import performanceIcon from "@/assets/notify/performance.svg";
import MediaRow from "@/components/list/MediaRow";
import { innerClick } from "@/components/ui/listCellEvents";
import type { NotificationType } from "@/lib/domain/types";

// Figma "List/Notification"(552:22846) — 알림 아이콘(로고 피크 실루엣에 글리프를 오려 낸 Icon/Notify/*,
// 보드 509:21535) + 서버가 만든 문장 + 관련 대상·시간 + (초대면) 거절·수락 + 안 읽음 점.
// 아이콘은 서버 NotificationType으로 고른다.
const ICON: Record<NotificationType, string> = {
  GROUP_INVITE: inviteIcon,
  GROUP_MEMBER_REMOVED: noticeIcon,
  INVITATION_ACCEPTED: approvedIcon,
  INVITATION_DECLINED: noticeIcon,
  JOIN_REQUEST_APPROVED: approvedIcon,
  JOIN_REQUEST_REJECTED: noticeIcon,
  NOTICE_CREATED: noticeIcon,
  PERFORMANCE_CREATED: performanceIcon,
  RECRUIT_POST_APPLIED: applyIcon,
  TEAM_APPLY: applyIcon,
  TEAM_INVITE: inviteIcon,
  TEAM_MEMBER_REMOVED: noticeIcon,
};

interface NotificationRowProps {
  type: NotificationType;
  message: string;
  meta: string;
  unread: boolean;
  onClick?: () => void;
  /** 초대처럼 알림에서 바로 처리할 수 있으면 거절·수락 */
  actions?: { onDecline: () => void; onAccept: () => void };
}

function NotificationRow({
  actions,
  message,
  meta,
  onClick,
  type,
  unread,
}: NotificationRowProps) {
  return (
    <MediaRow
      alignTop
      // 읽은 알림은 흐리게(Figma 14 '이번 주')
      dimmed={!unread}
      footer={
        actions && (
          <span className="flex gap-2 pt-1.5">
            <Button
              color="assistive"
              onClick={innerClick(actions.onDecline)}
              size="small"
              variant="solid"
            >
              거절
            </Button>
            <Button
              color="primary"
              onClick={innerClick(actions.onAccept)}
              size="small"
              variant="solid"
            >
              수락
            </Button>
          </span>
        )
      }
      leading={
        <span className="flex size-10 shrink-0 items-center justify-center">
          <img alt="" className="size-7" src={ICON[type]} />
        </span>
      }
      meta={
        <Typography
          as="span"
          color="semantic.label.assistive"
          variant="caption1"
          weight="medium"
        >
          {meta}
        </Typography>
      }
      onClick={onClick}
      padding="compact"
      title={message}
      titleWeight="regular"
      trailing={
        <span className="flex w-1.5 shrink-0 justify-center pt-2">
          {unread && (
            <span
              aria-label="안 읽음"
              className="size-1.5 rounded-full bg-accent"
              role="img"
            />
          )}
        </span>
      }
    />
  );
}

export default NotificationRow;
