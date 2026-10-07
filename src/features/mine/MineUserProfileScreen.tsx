import { Button, Typography } from "@wanteddev/wds";
import {
  IconBell,
  IconChevronLeft,
  IconChevronRight,
} from "@wanteddev/wds-icon";
import { useNavigate } from "react-router-dom";
import mascotPeace from "@/assets/mascot/peace.png";
import Chip from "@/components/ui/Chip";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

// Figma: 마이/08 다른 사용자 프로필 (nodeId 142:21411). Figma는 뒤로가기 없이 Bottom Nav가 떠
// 있는 상태로 그려졌지만(마이 탭을 다른 사람 프로필로 바꿔치기한 목업), 실제로는 모임 멤버
// 목록 등에서 drill-in하는 하위 화면이라 뒤로가기 헤더 + hasBottomNav: false로 구현했다 —
// 다른 하위 화면들과 일관된 네비게이션 패턴을 유지하기 위한 판단.
const SESSION_BADGES = ["어쿠스틱", "입문", "키보드"];
const TASTE_BADGES = ["펑크"];
const REGION_BADGES = ["서울"];

interface ActivityStat {
  label: string;
  count: number;
}

const ACTIVITY_STATS: ActivityStat[] = [
  { count: 1, label: "소속 모임" },
  { count: 1, label: "소속 팀" },
  { count: 1, label: "참여 중인 공연" },
];

interface ActivityItem {
  name: string;
  meta: string;
  /** 탭하면 열리는 상세 화면. */
  to: string;
}

const ACTIVITY_ITEMS: ActivityItem[] = [
  { meta: "모임 · 운영진", name: "프로젝트 모임", to: "/crew/project-crew" },
  { meta: "팀 · 멤버", name: "블루 웨이브", to: "/team/1" },
  {
    meta: "공연 · 10월 17일",
    name: "2026 가을 정기공연",
    to: "/show/fall-2026",
  },
];

function InfoRow({ label, badges }: { label: string; badges: string[] }) {
  return (
    <div className="flex items-center gap-2">
      <Typography
        color="semantic.label.assistive"
        variant="label1"
        weight="bold"
      >
        {label}
      </Typography>
      <div className="flex-1" />
      <div className="flex flex-wrap justify-end gap-1.5">
        {badges.map((badge) => (
          <Chip key={badge}>{badge}</Chip>
        ))}
      </div>
    </div>
  );
}

function MineUserProfileScreen() {
  const navigate = useNavigate();

  useScreenHeader(
    <ScreenHeader
      leading={
        <button onClick={() => navigate(-1)} type="button">
          <IconChevronLeft className="size-6 text-label-normal" />
        </button>
      }
      title="프로필"
      trailing={<IconBell className="size-6 text-label-strong" />}
      variant="normal"
    />,
  );

  return (
    <div className="scrollbar-hidden flex-1 overflow-y-auto">
      <div className="flex flex-col gap-4 px-5 pt-2 pb-6">
        <div className="flex items-center gap-4">
          <div className="flex size-[72px] shrink-0 items-center justify-center rounded-full bg-surface">
            <img alt="" className="size-16" src={mascotPeace} />
          </div>
          <div className="flex min-w-0 flex-col gap-0.5">
            <Typography
              color="semantic.label.normal"
              variant="title3"
              weight="bold"
            >
              이보컬
            </Typography>
            <Typography
              color="semantic.label.normal"
              variant="body2"
              weight="medium"
            >
              주말마다 홍대에서 노래해요.
            </Typography>
          </div>
        </div>

        <Button
          color="assistive"
          fullWidth
          // 초대 전용 화면이 따로 없어, 팀 멤버 찾기(초대) 화면으로 보낸다.
          onClick={() => navigate("/team/1/members/find")}
          size="medium"
          variant="outlined"
        >
          팀에 초대하기
        </Button>

        <div className="flex flex-col gap-3 rounded-2xl bg-surface p-4">
          <InfoRow badges={SESSION_BADGES} label="내 세션" />
          <InfoRow badges={TASTE_BADGES} label="음악 취향" />
          <InfoRow badges={REGION_BADGES} label="활동 지역" />
        </div>
      </div>

      <div className="h-3 w-full bg-surface" />

      <div className="flex flex-col gap-3 px-5 py-6">
        <Typography
          color="semantic.label.normal"
          variant="headline1"
          weight="bold"
        >
          활동
        </Typography>
        <div className="flex gap-2">
          {ACTIVITY_STATS.map((stat) => (
            <div
              className="flex flex-1 flex-col items-center gap-0.5 rounded-2xl bg-surface px-3 py-4"
              key={stat.label}
            >
              <Typography
                className="text-glow"
                color="semantic.primary.normal"
                variant="title3"
                weight="bold"
              >
                {stat.count}
              </Typography>
              <Typography
                color="semantic.label.assistive"
                variant="label2"
                weight="medium"
              >
                {stat.label}
              </Typography>
            </div>
          ))}
        </div>
        <div className="flex flex-col">
          {ACTIVITY_ITEMS.map((item) => (
            <button
              className="flex items-center gap-2 py-3"
              key={item.name}
              onClick={() => navigate(item.to)}
              type="button"
            >
              <div className="flex min-w-0 flex-1 flex-col">
                <Typography
                  color="semantic.label.normal"
                  variant="body1"
                  weight="regular"
                >
                  {item.name}
                </Typography>
                <Typography
                  color="semantic.label.assistive"
                  variant="label2"
                  weight="regular"
                >
                  {item.meta}
                </Typography>
              </div>
              <IconChevronRight className="size-4 shrink-0 text-label-assistive" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MineUserProfileScreen;
