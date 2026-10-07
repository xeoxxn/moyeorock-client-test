import { Button, Typography } from "@wanteddev/wds";
import { IconBell, IconChevronLeft } from "@wanteddev/wds-icon";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

interface PendingNotification {
  title: string;
  meta: string;
  actionLabel: string;
  /** 액션 버튼이 여는 화면 — 알림 종류마다 다르다. */
  to: string;
}

const PENDING: PendingNotification[] = [
  {
    actionLabel: "확인하기",
    meta: "이보컬 · 보컬 · 5분 전",
    title: "홍대 주말 합주에 참가 신청이 왔어요",
    to: "/crew/project-crew/applications",
  },
  {
    actionLabel: "초대 보기",
    meta: "팀장 서비스 2팀 · 10분 전",
    title: "블루 웨이브에서 팀 초대가 왔어요",
    to: "/mine/invitations",
  },
];

interface PastNotification {
  title: string;
  meta: string;
}

const PAST: PastNotification[] = [
  {
    meta: "프로젝트 모임 · 1일 전",
    title: "가을 정기공연 참가 신청이 시작됐어요",
  },
  {
    meta: "블루 웨이브 · 2일 전",
    title: "블루 웨이브 셋리스트에 새 곡이 추가됐어요",
  },
  { meta: "8월 7일 · 홍대 연습실 A", title: "정기 합주 일정이 등록됐어요" },
];

// Figma: 홈/03 알림 (nodeId 101:11760)
function NotificationsScreen() {
  const navigate = useNavigate();

  useScreenHeader(
    <ScreenHeader
      leading={
        <button onClick={() => navigate(-1)} type="button">
          <IconChevronLeft className="size-6 text-label-strong" />
        </button>
      }
      title="알림"
      variant="normal"
    />,
  );

  return (
    <div className="scrollbar-hidden flex-1 overflow-y-auto">
      <div className="flex flex-col gap-3 px-5 pt-2 pb-6">
        <div className="flex items-center gap-1.5">
          <Typography
            color="semantic.label.strong"
            variant="headline1"
            weight="bold"
          >
            처리 대기
          </Typography>
          <Typography
            className="text-glow"
            color="semantic.primary.normal"
            variant="headline1"
            weight="bold"
          >
            {PENDING.length}
          </Typography>
        </div>
        {PENDING.map((item) => (
          <div
            className="flex flex-col gap-2.5 rounded-[20px] border border-line-solid bg-surface p-4"
            key={item.title}
          >
            <div className="flex items-start gap-2">
              <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
              <Typography
                color="semantic.label.strong"
                variant="body2"
                weight="bold"
              >
                {item.title}
              </Typography>
            </div>
            <Typography
              color="semantic.label.assistive"
              variant="label2"
              weight="regular"
            >
              {item.meta}
            </Typography>
            <Button
              color="primary"
              onClick={() => navigate(item.to)}
              size="small"
              variant="solid"
            >
              {item.actionLabel}
            </Button>
          </div>
        ))}

        <div className="h-px w-full bg-line-neutral" />

        <Typography
          color="semantic.label.strong"
          variant="headline1"
          weight="bold"
        >
          지난 알림
        </Typography>
        {PAST.map((item) => (
          <div className="flex items-center gap-3 py-2.5" key={item.title}>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/6">
              <IconBell className="size-[18px] text-label-assistive" />
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <Typography
                color="semantic.label.alternative"
                variant="label1"
                weight="medium"
              >
                {item.title}
              </Typography>
              <Typography
                color="semantic.label.assistive"
                variant="caption1"
                weight="regular"
              >
                {item.meta}
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationsScreen;
