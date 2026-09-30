import {
  ContentBadge,
  Tab,
  TabList,
  TabListItem,
  Typography,
} from "@wanteddev/wds";
import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconLocation,
  IconPersons,
  IconSearch,
} from "@wanteddev/wds-icon";
import { useNavigate, useParams } from "react-router-dom";

import mascotFlag from "@/assets/mascot/flag.png";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

// Figma: 모임/03 모임 공연 (nodeId 101:19327). 헤더/히어로/Tab 구조는 CrewHomeScreen과 동일한
// 모임 공통 셸이라 컴포넌트로 분리하지 않고 화면마다 복제했다(각 화면이 자기 히어로 데이터를
// 독립적으로 갖고 있어 공용화 이득이 크지 않음 — 실 API 연동 시 재검토).
// 카드/히스토리 목록의 상세 라우트(공연 상세, 공연 만들기)는 이 작업 범위 밖(공연 담당 에이전트가
// 별도로 붙이는 중)이라 지금은 표시만 하고 onClick을 달지 않았다.

interface UpcomingShow {
  id: string;
  title: string;
  datetime: string;
  place: string;
  teamCount: number;
}

const UPCOMING_SHOWS: UpcomingShow[] = [
  {
    datetime: "2026.10.17 18:00",
    id: "s1",
    place: "홍대 롤링홀",
    teamCount: 3,
    title: "2026 가을 정기공연",
  },
  {
    datetime: "2026.12.19 17:00",
    id: "s2",
    place: "웨스트브릿지 라이브홀",
    teamCount: 0,
    title: "연말 합동 공연",
  },
];

interface ShowHistory {
  id: string;
  title: string;
  meta: string;
}

const SHOW_HISTORY: ShowHistory[] = [
  {
    id: "h1",
    meta: "2025.05.18 · 국민대 · 총 8곡",
    title: "2025 국민대 대동제",
  },
];

function CrewShowScreen() {
  const navigate = useNavigate();
  const { crewId = "" } = useParams();

  useScreenHeader(
    <div className="flex w-full items-center justify-between px-5 py-4">
      <button onClick={() => navigate(`/crew/${crewId}`)} type="button">
        <IconChevronLeft className="size-6 text-label-normal" />
      </button>
      <button aria-label="검색" type="button">
        <IconSearch className="size-6 text-label-normal" />
      </button>
    </div>,
  );

  return (
    <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto">
      <div className="flex flex-col gap-3 px-5 pt-1 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="flex size-[72px] shrink-0 items-center justify-center rounded-[18px] bg-surface">
            <img
              alt=""
              className="size-[62px] object-contain"
              src={mascotFlag}
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <Typography
                color="semantic.label.normal"
                variant="title3"
                weight="bold"
              >
                프로젝트 모임
              </Typography>
              <ContentBadge
                accentColor="semantic.primary.normal"
                color="accent"
                size="small"
              >
                프로젝트형
              </ContentBadge>
            </div>
            <Typography
              color="semantic.label.alternative"
              variant="label1"
              weight="medium"
            >
              좋아하는 음악으로 함께 무대를 만드는 모임
            </Typography>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1">
            <IconLocation className="size-3.5 text-label-alternative" />
            <Typography
              color="semantic.label.alternative"
              variant="label2"
              weight="medium"
            >
              서울
            </Typography>
          </div>
          <div className="flex items-center gap-1">
            <IconPersons className="size-3.5 text-label-alternative" />
            <Typography
              color="semantic.label.alternative"
              variant="label2"
              weight="medium"
            >
              멤버 11명
            </Typography>
          </div>
        </div>
      </div>

      <Tab
        onValueChange={(value) => {
          if (value === "home") navigate(`/crew/${crewId}`);
          if (value === "members") navigate(`/crew/${crewId}/members`);
          if (value === "manage") navigate(`/crew/${crewId}/manage`);
        }}
        value="show"
      >
        <TabList resize="hug" size="medium">
          <TabListItem value="home">홈</TabListItem>
          <TabListItem value="show">공연</TabListItem>
          <TabListItem value="members">멤버</TabListItem>
          <TabListItem value="manage">관리</TabListItem>
        </TabList>
      </Tab>

      <div className="flex flex-col gap-3 px-5 pt-6 pb-8">
        <div className="flex items-center gap-1.5">
          <Typography
            className="flex-1"
            color="semantic.label.normal"
            variant="headline1"
            weight="bold"
          >
            예정된 공연
          </Typography>
          <Typography
            color="semantic.label.alternative"
            variant="label1"
            weight="bold"
          >
            공연 추가
          </Typography>
        </div>
        {UPCOMING_SHOWS.map((show) => (
          <div
            className="flex flex-col gap-2 rounded-2xl bg-surface p-5"
            key={show.id}
          >
            <ContentBadge
              accentColor="semantic.primary.normal"
              color="accent"
              size="small"
            >
              공연 예정
            </ContentBadge>
            <Typography
              color="semantic.label.normal"
              variant="headline1"
              weight="bold"
            >
              {show.title}
            </Typography>
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1">
                <IconCalendar className="size-3.5 text-label-alternative" />
                <Typography
                  color="semantic.label.alternative"
                  variant="label2"
                  weight="medium"
                >
                  {show.datetime}
                </Typography>
              </div>
              <div className="flex items-center gap-1">
                <IconLocation className="size-3.5 text-label-alternative" />
                <Typography
                  color="semantic.label.alternative"
                  variant="label2"
                  weight="medium"
                >
                  {show.place}
                </Typography>
              </div>
            </div>
            <Typography
              color="semantic.label.alternative"
              variant="label2"
              weight="medium"
            >
              참가 팀 {show.teamCount}팀
            </Typography>
          </div>
        ))}

        <div className="flex flex-col gap-1 pt-4">
          <Typography
            color="semantic.label.normal"
            variant="headline1"
            weight="bold"
          >
            공연 히스토리
          </Typography>
          {SHOW_HISTORY.map((history) => (
            <div className="flex items-center gap-2 py-3" key={history.id}>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Typography
                  color="semantic.label.normal"
                  variant="body1"
                  weight="regular"
                >
                  {history.title}
                </Typography>
                <Typography
                  color="semantic.label.alternative"
                  variant="label2"
                  weight="regular"
                >
                  {history.meta}
                </Typography>
              </div>
              <IconChevronRight className="size-4 shrink-0 text-label-assistive" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CrewShowScreen;
