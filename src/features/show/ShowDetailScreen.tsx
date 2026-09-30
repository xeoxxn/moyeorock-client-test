import { ContentBadge, Typography } from "@wanteddev/wds";
import {
  IconCalendar,
  IconChevronLeft,
  IconLocation,
  IconPersons,
} from "@wanteddev/wds-icon";
import { useNavigate, useParams } from "react-router-dom";

import mascotMusic from "@/assets/mascot/music.png";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import ShowSectionTabBar from "@/features/show/components/ShowSectionTabBar";

// Figma: 공연/01 공연 정보 (nodeId 101:23690). 같은 프레임에 있는 공연/02 공연 관리
// (101:23868)는 모임 관리자 전용 편집 폼이라 콘텐츠가 크게 달라 별도 라우트
// (`/show/:showId/manage`, ShowManageScreen.tsx)로 뺐다 — 상단 "공연 정보 | 공연 관리" 탭
// 바는 ShowSectionTabBar가 두 화면에서 공유한다.

interface InfoRow {
  Icon: typeof IconCalendar;
  label: string;
  value: string;
}

const INFO_ROWS: InfoRow[] = [
  { Icon: IconCalendar, label: "일시", value: "2026.10.17 (토) 18:00" },
  { Icon: IconLocation, label: "장소", value: "홍대 롤링홀" },
  { Icon: IconPersons, label: "참가 팀", value: "3팀" },
];

interface JoinedTeam {
  name: string;
  meta: string;
}

const JOINED_TEAMS: JoinedTeam[] = [
  { meta: "인디 · 9명", name: "블루 웨이브" },
  { meta: "메탈 · 5명", name: "RED NOISE" },
  { meta: "펑크 · 4명", name: "문샷" },
];

function ShowInfoPanel() {
  return (
    <div className="flex flex-col">
      <div className="relative flex h-60 w-full flex-col justify-end gap-1.5 overflow-hidden rounded-[20px] bg-[#424245] p-6">
        <div className="flex justify-end">
          <img alt="" className="size-[100px]" src={mascotMusic} />
        </div>
        <ContentBadge
          accentColor="semantic.primary.normal"
          color="accent"
          size="small"
        >
          공연 예정
        </ContentBadge>
        <Typography
          color="semantic.static.white"
          variant="title3"
          weight="bold"
        >
          2026 가을 정기공연
        </Typography>
        <Typography
          color="semantic.static.white"
          variant="label2"
          weight="medium"
        >
          프로젝트 모임 · 여섯 번째 정기공연
        </Typography>
      </div>

      <div className="flex flex-col py-4">
        {INFO_ROWS.map((row) => (
          <div className="flex items-center gap-2.5 py-1.5" key={row.label}>
            <row.Icon className="size-[18px] shrink-0 text-label-assistive" />
            <Typography
              color="semantic.label.assistive"
              variant="label1"
              weight="medium"
            >
              {row.label}
            </Typography>
            <div className="flex-1" />
            <Typography
              color="semantic.label.normal"
              variant="label1"
              weight="medium"
            >
              {row.value}
            </Typography>
          </div>
        ))}
      </div>

      <div className="h-3 w-full bg-surface" />

      <div className="flex flex-col gap-2.5 px-5 py-6">
        <Typography
          color="semantic.label.normal"
          variant="headline1"
          weight="bold"
        >
          공연 소개
        </Typography>
        <Typography
          color="semantic.label.normal"
          variant="body1"
          weight="regular"
        >
          프로젝트 모임의 여섯 번째 정기공연입니다. 장르와 경력에 관계없이 함께
          무대를 만들어요.
        </Typography>
      </div>

      <div className="h-3 w-full bg-surface" />

      <div className="flex flex-col gap-3 px-5 py-6">
        <div className="flex items-center gap-1.5">
          <Typography
            color="semantic.label.normal"
            variant="headline1"
            weight="bold"
          >
            참가 팀
          </Typography>
          <Typography
            className="text-glow-sm"
            color="semantic.primary.normal"
            variant="label1"
            weight="bold"
          >
            {JOINED_TEAMS.length}
          </Typography>
        </div>
        {JOINED_TEAMS.map((team) => (
          <div className="flex flex-col" key={team.name}>
            <Typography
              color="semantic.label.normal"
              variant="body1"
              weight="bold"
            >
              {team.name}
            </Typography>
            <Typography
              color="semantic.label.assistive"
              variant="label2"
              weight="medium"
            >
              {team.meta}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShowDetailScreen() {
  const navigate = useNavigate();
  const { showId = "" } = useParams();

  useScreenHeader(
    <ScreenHeader
      leading={
        <button onClick={() => navigate(-1)} type="button">
          <IconChevronLeft className="size-6 text-label-normal" />
        </button>
      }
      title="공연"
      variant="normal"
    />,
  );

  return (
    <>
      <ShowSectionTabBar active="info" showId={showId} />
      <div className="scrollbar-hidden flex-1 overflow-y-auto">
        <ShowInfoPanel />
      </div>
    </>
  );
}

export default ShowDetailScreen;
