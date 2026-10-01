import { Tab, TabList, TabListItem, Typography } from "@wanteddev/wds";
import {
  IconChevronLeft,
  IconChevronRight,
  IconMusicMicrophone,
  IconPersons,
  IconSearch,
} from "@wanteddev/wds-icon";
import { useNavigate } from "react-router-dom";

import mascotMusic from "@/assets/mascot/music.png";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

export type TeamTabValue =
  | "home"
  | "show"
  | "setlist"
  | "schedule"
  | "members"
  | "manage";

const TAB_PATH: Record<TeamTabValue, (teamId: string) => string> = {
  home: (teamId) => `/team/${teamId}`,
  manage: (teamId) => `/team/${teamId}/manage`,
  members: (teamId) => `/team/${teamId}/members`,
  schedule: (teamId) => `/team/${teamId}/schedule`,
  setlist: (teamId) => `/team/${teamId}/setlist`,
  show: (teamId) => `/team/${teamId}/show`,
};

// 팀/02~07 (홈·공연·셋리스트·일정·멤버·관리) 6개 화면이 공유하는 상단 뒤로가기 헤더 + 팀
// 히어로(아이콘·이름·소속 모임·소개·장르/인원) + 탭바. CrewHomeScreen과 같은 이유로 Tab의
// onValueChange는 내부 패널 전환이 아니라 실제 라우트 네비게이션이다. 지금은 모든 데이터가
// "블루 웨이브" 목업 하나뿐이라 teamId로 분기하지 않는다 — 실제 API가 붙으면 teamId로 조회한다.
interface TeamHeroTabsProps {
  active: TeamTabValue;
  teamId: string;
}

function TeamHeroTabs({ active, teamId }: TeamHeroTabsProps) {
  const navigate = useNavigate();

  useScreenHeader(
    <div className="flex w-full items-center justify-between px-5 py-4">
      <button onClick={() => navigate("/team")} type="button">
        <IconChevronLeft className="size-6 text-label-normal" />
      </button>
      <button aria-label="검색" type="button">
        <IconSearch className="size-6 text-label-normal" />
      </button>
    </div>,
  );

  return (
    <>
      <div className="flex flex-col gap-2.5 px-5 pt-1 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="flex size-[72px] shrink-0 items-center justify-center rounded-[18px] bg-surface">
            <img
              alt=""
              className="size-[62px] object-contain"
              src={mascotMusic}
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Typography
              color="semantic.label.normal"
              variant="title3"
              weight="bold"
            >
              블루 웨이브
            </Typography>
            <button
              className="flex items-center gap-0.5"
              onClick={() => navigate("/crew/1")}
              type="button"
            >
              <Typography
                className="text-glow-sm"
                color="semantic.primary.normal"
                variant="label2"
                weight="bold"
              >
                소속 모임 · 프로젝트 모임
              </Typography>
              <IconChevronRight className="size-3.5 text-accent" />
            </button>
          </div>
        </div>
        <Typography
          color="semantic.label.alternative"
          variant="body2"
          weight="medium"
        >
          인디 록 사운드를 함께 만드는 밴드
        </Typography>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1">
            <IconMusicMicrophone className="size-3.5 text-label-assistive" />
            <Typography
              color="semantic.label.alternative"
              variant="label2"
              weight="medium"
            >
              봄날 록 페스티벌
            </Typography>
          </div>
          <div className="flex items-center gap-1">
            <IconPersons className="size-3.5 text-label-assistive" />
            <Typography
              color="semantic.label.alternative"
              variant="label2"
              weight="medium"
            >
              멤버 9명
            </Typography>
          </div>
        </div>
      </div>

      <Tab
        onValueChange={(value) => {
          if (value !== active) {
            navigate(TAB_PATH[value as TeamTabValue](teamId));
          }
        }}
        value={active}
      >
        <TabList resize="hug" size="medium">
          <TabListItem value="home">홈</TabListItem>
          <TabListItem value="show">공연</TabListItem>
          <TabListItem value="setlist">셋리스트</TabListItem>
          <TabListItem value="schedule">일정</TabListItem>
          <TabListItem value="members">멤버</TabListItem>
          <TabListItem value="manage">관리</TabListItem>
        </TabList>
      </Tab>
    </>
  );
}

export default TeamHeroTabs;
