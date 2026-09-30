import {
  ContentBadge,
  Tab,
  TabList,
  TabListItem,
  Typography,
} from "@wanteddev/wds";
import {
  IconChevronLeft,
  IconChevronRight,
  IconLocation,
  IconPersons,
  IconSearch,
} from "@wanteddev/wds-icon";
import { useNavigate, useParams } from "react-router-dom";

import mascotFlag from "@/assets/mascot/flag.png";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

// Figma: 모임/02 모임 홈 (nodeId 101:18968). 상단 "홈 | 공연 | 멤버 | 관리" Tab은 이 화면 내부
// 패널 전환이 아니라 /crew/:crewId, /crew/:crewId/show, /crew/:crewId/members, /crew/:crewId/manage
// 네 개의 실제 라우트를 가리키는 탭바라 onValueChange에서 navigate로 처리한다.

interface Notice {
  id: string;
  title: string;
  date: string;
}

const RECENT_NOTICES: Notice[] = [
  { date: "09.02", id: "n1", title: "가을 정기공연 참가 신청 안내" },
  { date: "08.28", id: "n2", title: "9월 합주실 이용 시간 변경" },
];

function CrewHomeScreen() {
  const navigate = useNavigate();
  const { crewId = "" } = useParams();

  useScreenHeader(
    <div className="flex w-full items-center justify-between px-5 py-4">
      <button onClick={() => navigate("/crew")} type="button">
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
          if (value === "show") navigate(`/crew/${crewId}/show`);
          if (value === "members") navigate(`/crew/${crewId}/members`);
          if (value === "manage") navigate(`/crew/${crewId}/manage`);
        }}
        value="home"
      >
        <TabList resize="hug" size="medium">
          <TabListItem value="home">홈</TabListItem>
          <TabListItem value="show">공연</TabListItem>
          <TabListItem value="members">멤버</TabListItem>
          <TabListItem value="manage">관리</TabListItem>
        </TabList>
      </Tab>

      <div className="flex flex-col gap-3 px-5 py-6">
        <div className="flex items-center gap-1.5">
          <Typography
            className="flex-1"
            color="semantic.label.normal"
            variant="headline1"
            weight="bold"
          >
            다음 공연
          </Typography>
          <button
            onClick={() => navigate(`/crew/${crewId}/show`)}
            type="button"
          >
            <Typography
              color="semantic.label.alternative"
              variant="label1"
              weight="bold"
            >
              공연 전체
            </Typography>
          </button>
        </div>
        <button
          className="flex flex-col gap-2.5 rounded-2xl bg-surface p-5 text-left"
          onClick={() => navigate(`/crew/${crewId}/show`)}
          type="button"
        >
          <div className="flex items-center gap-1.5">
            <ContentBadge
              accentColor="semantic.primary.normal"
              color="accent"
              size="small"
            >
              공연 예정
            </ContentBadge>
            <ContentBadge
              color="neutral"
              neutralColor="semantic.label.alternative"
              size="small"
              variant="outlined"
            >
              10월 17일 18:00
            </ContentBadge>
          </div>
          <Typography
            color="semantic.label.normal"
            variant="headline1"
            weight="bold"
          >
            2026 가을 정기공연
          </Typography>
          <div className="flex items-center gap-1">
            <IconLocation className="size-3.5 text-label-alternative" />
            <Typography
              color="semantic.label.alternative"
              variant="label2"
              weight="medium"
            >
              홍대 롤링홀
            </Typography>
          </div>
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="medium"
          >
            참가 팀 3팀
          </Typography>
        </button>
      </div>

      <div className="h-3 w-full bg-surface" />

      <div className="flex flex-col gap-1 px-5 pt-6 pb-8">
        <div className="flex items-center gap-1.5 pb-2">
          <Typography
            className="flex-1"
            color="semantic.label.normal"
            variant="headline1"
            weight="bold"
          >
            최근 공지
          </Typography>
          <Typography
            color="semantic.label.alternative"
            variant="label1"
            weight="bold"
          >
            전체 보기
          </Typography>
        </div>
        {RECENT_NOTICES.map((notice) => (
          <div className="flex items-center gap-2 py-3" key={notice.id}>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <Typography
                color="semantic.label.normal"
                variant="body1"
                weight="regular"
              >
                {notice.title}
              </Typography>
              <Typography
                color="semantic.label.alternative"
                variant="label2"
                weight="regular"
              >
                {notice.date}
              </Typography>
            </div>
            <IconChevronRight className="size-4 shrink-0 text-label-assistive" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CrewHomeScreen;
