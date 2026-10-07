import { Typography } from "@wanteddev/wds";
import {
  IconBell,
  IconChevronRight,
  IconMusicMicrophone,
} from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import mascotPeace from "@/assets/mascot/peace.png";
import Chip from "@/components/ui/Chip";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import WithdrawConfirmModal from "@/features/mine/components/WithdrawConfirmModal";

// Figma: 마이/01 마이 (nodeId 101:25091, Bottom Nav "마이" 탭 루트).
// "마이/07 회원 탈퇴 확인"(142:20559)은 이 화면 위에 뜨는 팝업 모달이라 별도 라우트가 아니라
// WithdrawConfirmModal 컴포넌트로 아래에서 연다.

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

interface RecommendedTrack {
  title: string;
  artist: string;
}

const RECOMMENDED_TRACKS: RecommendedTrack[] = [
  { artist: "CORTIS", title: "BIRDS" },
  { artist: "DAY6", title: "한 페이지가 될 수 있게" },
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

function MineScreen() {
  const navigate = useNavigate();
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  useScreenHeader(
    <div className="flex items-center justify-between px-5 py-2">
      <Typography
        as="h1"
        color="semantic.label.normal"
        variant="title3"
        weight="bold"
      >
        마이
      </Typography>
      <button
        aria-label="알림"
        onClick={() => navigate("/notifications")}
        type="button"
      >
        <IconBell className="size-6 text-label-strong" />
      </button>
    </div>,
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
              김광철
            </Typography>
            <Typography
              color="semantic.label.normal"
              variant="body2"
              weight="medium"
            >
              잘 부탁드립니다.
            </Typography>
          </div>
        </div>

        <button
          className="rounded-[10px] border border-line-solid py-2.5"
          onClick={() => navigate("/mine/profile")}
          type="button"
        >
          <Typography
            color="semantic.label.normal"
            variant="body2"
            weight="medium"
          >
            프로필 수정
          </Typography>
        </button>

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
          내 활동
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

      <div className="h-3 w-full bg-surface" />

      <div className="flex flex-col gap-1 px-5 py-6">
        <Typography
          color="semantic.label.normal"
          variant="headline1"
          weight="bold"
        >
          내 취향 추천곡
        </Typography>
        {RECOMMENDED_TRACKS.map((track) => (
          <div className="flex items-center gap-3 py-2.5" key={track.title}>
            <div className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-surface">
              <IconMusicMicrophone className="size-5 text-label-normal" />
            </div>
            <div className="flex min-w-0 flex-col">
              <Typography
                color="semantic.label.normal"
                variant="body1"
                weight="bold"
              >
                {track.title}
              </Typography>
              <Typography
                color="semantic.label.assistive"
                variant="label2"
                weight="medium"
              >
                {track.artist}
              </Typography>
            </div>
          </div>
        ))}
      </div>

      <div className="h-3 w-full bg-surface" />

      <div className="flex flex-col gap-1 px-5 py-6">
        <div className="flex items-center justify-between">
          <Typography
            color="semantic.label.normal"
            variant="headline1"
            weight="bold"
          >
            저장 목록
          </Typography>
          <Typography
            color="semantic.label.assistive"
            variant="label1"
            weight="bold"
          >
            전체보기
          </Typography>
        </div>
        <button
          className="flex items-center gap-2 py-3"
          onClick={() => navigate("/mine/interests")}
          type="button"
        >
          <div className="flex min-w-0 flex-1 flex-col">
            <Typography
              color="semantic.label.normal"
              variant="body1"
              weight="regular"
            >
              저장한 항목
            </Typography>
            <Typography
              color="semantic.label.assistive"
              variant="label2"
              weight="regular"
            >
              유저 3 · 팀 2 · 곡 1
            </Typography>
          </div>
          <IconChevronRight className="size-4 shrink-0 text-label-assistive" />
        </button>
      </div>

      <div className="h-3 w-full bg-surface" />

      <div className="flex flex-col gap-1 px-5 pt-6 pb-8">
        <Typography
          color="semantic.label.normal"
          variant="headline1"
          weight="bold"
        >
          설정
        </Typography>
        <div className="flex items-center gap-3 py-3">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <Typography
              color="semantic.label.normal"
              variant="body1"
              weight="medium"
            >
              활동 기록 공개
            </Typography>
            <Typography
              color="semantic.label.assistive"
              variant="label2"
              weight="regular"
            >
              다른 사용자가 내 모임·팀·공연 기록을 볼 수 있어요
            </Typography>
          </div>
          <MineSwitch defaultChecked />
        </div>
        <div className="flex items-center gap-3 py-3">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <Typography
              color="semantic.label.normal"
              variant="body1"
              weight="medium"
            >
              팀원 추천 받기
            </Typography>
            <Typography
              color="semantic.label.assistive"
              variant="label2"
              weight="regular"
            >
              팀장이 AI 팀원 추천에서 나를 찾을 수 있어요
            </Typography>
          </div>
          <MineSwitch defaultChecked />
        </div>
        <button
          className="flex flex-col items-start gap-0.5 py-3"
          onClick={() => navigate("/mine/invitations")}
          type="button"
        >
          <Typography
            color="semantic.label.normal"
            variant="body1"
            weight="medium"
          >
            초대 · 신청
          </Typography>
          <Typography
            color="semantic.label.assistive"
            variant="label2"
            weight="regular"
          >
            받은 초대와 보낸 가입 신청을 확인해요
          </Typography>
        </button>
        <button
          className="flex flex-col items-start gap-0.5 py-3"
          onClick={() => setWithdrawOpen(true)}
          type="button"
        >
          <Typography
            color="semantic.label.normal"
            variant="body1"
            weight="medium"
          >
            회원 탈퇴
          </Typography>
          <Typography
            color="semantic.label.assistive"
            variant="label2"
            weight="regular"
          >
            계정과 활동 기록이 모두 삭제돼요
          </Typography>
        </button>
      </div>

      <WithdrawConfirmModal
        onConfirm={() => {
          setWithdrawOpen(false);
          navigate("/login", { replace: true });
        }}
        onOpenChange={setWithdrawOpen}
        open={withdrawOpen}
      />
    </div>
  );
}

// Figma Switch/Switch — WDS `Switch` 컴포넌트가 없어(패키지에 미포함) 로컬로 만들었다.
// 켜짐 배경은 브랜드 레드 + 네온 글로우(Figma shadow 0 0 10px rgba(255,59,51,.5)).
function MineSwitch({ defaultChecked }: { defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(Boolean(defaultChecked));
  return (
    <button
      aria-checked={checked}
      className={
        checked
          ? "flex h-8 w-[52px] shrink-0 items-center justify-end rounded-full bg-accent-strong p-1 shadow-neon-sm"
          : "flex h-8 w-[52px] shrink-0 items-center justify-start rounded-full bg-white/10 p-1"
      }
      onClick={() => setChecked((v) => !v)}
      role="switch"
      type="button"
    >
      <span className="size-6 rounded-full bg-static-white" />
    </button>
  );
}

export default MineScreen;
