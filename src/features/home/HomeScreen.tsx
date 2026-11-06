import {
  List,
  ListCell,
  ListCellContent,
  PushBadge,
  TopNavigationButton,
  Typography,
} from "@wanteddev/wds";
import {
  IconBell,
  IconChevronRight,
  IconMusicMicrophone,
} from "@wanteddev/wds-icon";
import { useNavigate } from "react-router-dom";

import logoWordmark from "@/assets/logo/moyeorock-wordmark.png";
import mascotMusic from "@/assets/mascot/music.png";
import mascotPeace from "@/assets/mascot/peace.png";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import PressableCard from "@/components/ui/PressableCard";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SectionHeader from "@/components/ui/SectionHeader";
import Tag from "@/components/ui/Tag";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import HomeRecruitCarousel from "@/features/home/components/HomeRecruitCarousel";
import HomeWeekSchedule from "@/features/home/components/HomeWeekSchedule";
import { formatDateTime, formatDday } from "@/lib/domain/format";
import {
  formatInstruments,
  GENRE_LABEL,
  GROUP_ROLE_LABEL,
  PERFORMANCE_STATUS_LABEL,
  REGION_LABEL,
  TEAM_KIND_LABEL,
  TEAM_ROLE_LABEL,
} from "@/lib/domain/labels";
import type { Song } from "@/lib/domain/types";
import { NOTIFICATIONS } from "@/mocks/data";
import {
  getAllSongs,
  getGroup,
  getMe,
  getMyGroups,
  getMyTeams,
  getMyUpcomingPerformances,
  getPerformance,
  getPosts,
  isPerformanceTeam,
} from "@/mocks/selectors";

const RECOMMENDED_SONG_COUNT = 2;
// 대시보드 openRecruitPosts는 최신 5개만 내려온다.
const OPEN_POST_COUNT = 5;

interface CrewEntry {
  key: string;
  /** "모임 · 모임장", "공연 팀 · 팀장" */
  category: string;
  name: string;
  meta: string;
  to: string;
}

// 내 모임(GET /groups/my)과 내 팀(GET /users/me/teams)을 한 목록으로 — 모임은 /crew/:id, 팀은 /team/:id.
function getMyCrewEntries(): CrewEntry[] {
  const groups = getMyGroups().map((group) => ({
    category: group.myRole
      ? `모임 · ${GROUP_ROLE_LABEL[group.myRole]}`
      : "모임",
    key: `group-${group.id}`,
    meta: `멤버 ${group.memberCount}명 · ${REGION_LABEL[group.region]}`,
    name: group.name,
    to: `/crew/${group.id}`,
  }));
  const teams = getMyTeams().map((team) => {
    const kind = isPerformanceTeam(team)
      ? TEAM_KIND_LABEL.performance
      : TEAM_KIND_LABEL.independent;
    const performance =
      team.performanceId !== null
        ? getPerformance(team.performanceId)
        : undefined;
    return {
      category: team.myRole
        ? `${kind} · ${TEAM_ROLE_LABEL[team.myRole]}`
        : kind,
      key: `team-${team.id}`,
      // 공연 팀은 어느 공연 팀인지가 지역보다 중요하다.
      meta: `멤버 ${team.members.length}명 · ${performance?.title ?? REGION_LABEL[team.region]}`,
      name: team.name,
      to: `/team/${team.id}`,
    };
  });
  return [...groups, ...teams];
}

// 서버 대시보드의 recommendedSongs는 AI 추천이 붙기 전까지 null이다. 그동안은 곡 목록에서 날짜마다
// 다른 곡을 골라 "오늘의" 추천 자리를 채운다.
function pickTodaySongs(count: number): Song[] {
  const songs = getAllSongs();
  if (songs.length === 0) return [];
  const start = new Date().getDate() % songs.length;
  return Array.from(
    { length: Math.min(count, songs.length) },
    (_, offset) => songs[(start + offset) % songs.length],
  );
}

// Figma: 홈/01 홈 대시보드 (nodeId 101:11527). 서버 GET /dashboard {upcomingRehearsals, openRecruitPosts,
// recommendedSongs, unreadNotificationCount}에 내 프로필·내 모임·팀·다음 공연을 더해 그린다.
// "Status Bar"(9:41)는 목업 장식이라 구현하지 않는다.
//
// 워드마크 로고를 히어로에 크게 쓰면서 Figma의 배경 레드 그라데이션은 걷어냈다(사용자 요청 — 배경까지
// 붉으면 지저분하다). 히어로의 날짜 줄도 아래 "오늘의 일정"이 날짜를 보여 줘서 뺐다.
function HomeScreen() {
  const navigate = useNavigate();
  const me = getMe();
  const unreadCount = NOTIFICATIONS.filter(
    (notification) => !notification.isRead,
  ).length;
  const nextPerformance = getMyUpcomingPerformances()[0];
  const nextPerformanceGroup = nextPerformance
    ? getGroup(nextPerformance.groupId)
    : undefined;
  const songs = pickTodaySongs(RECOMMENDED_SONG_COUNT);
  const crewEntries = getMyCrewEntries();
  const openPosts = getPosts()
    .filter((post) => post.status === "OPEN")
    .slice(0, OPEN_POST_COUNT);

  useScreenHeader(
    <ScreenHeader
      trailing={
        <TopNavigationButton
          aria-label={
            unreadCount > 0 ? `알림, 안 읽은 알림 ${unreadCount}개` : "알림"
          }
          onClick={() => navigate("/notifications")}
        >
          <PushBadge invisible={unreadCount === 0} variant="dot">
            <IconBell />
          </PushBadge>
        </TopNavigationButton>
      }
      variant="home"
    />,
  );

  return (
    <div className="scrollbar-hidden relative flex-1 overflow-y-auto">
      <div className="relative flex flex-col gap-6 px-5 pb-8">
        <section className="flex items-center gap-2.5">
          <div className="flex min-w-0 flex-1 flex-col gap-2.5">
            {/* 로고는 돌 질감(균열·파편)을 입힌 누끼 PNG — 네온 글로우를 넣으면 실루엣이 묻혀서 뺐다. */}
            <img
              alt="모여락"
              className="h-auto w-3/4 max-w-52 self-start object-contain"
              src={logoWordmark}
            />
            <div className="flex flex-wrap items-baseline gap-x-1.5">
              <Typography
                color="semantic.label.strong"
                variant="headline2"
                weight="bold"
              >
                {me.nickname}님,
              </Typography>
              <Typography
                className="text-glow-sm"
                color="semantic.primary.normal"
                variant="headline2"
                weight="bold"
              >
                오늘도 무대 위로
              </Typography>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Tag>{REGION_LABEL[me.region]}</Tag>
              {me.instruments.map((item) => (
                <Tag key={item.instrument}>
                  {formatInstruments([item], true)}
                </Tag>
              ))}
            </div>
          </div>
          <img
            alt=""
            className="h-auto w-1/4 max-w-28 shrink-0 drop-shadow-neon-md"
            src={mascotPeace}
          />
        </section>

        <section className="flex flex-col gap-3">
          <SectionHeader
            actionLabel="전체보기"
            onAction={() => navigate("/schedule")}
            title="오늘의 일정"
          />
          <HomeWeekSchedule />
        </section>

        <section className="flex flex-col gap-3">
          <SectionHeader
            actionLabel="공연 전체"
            onAction={
              nextPerformance
                ? () => navigate(`/crew/${nextPerformance.groupId}/show`)
                : undefined
            }
            title="다음 공연"
          />
          {nextPerformance ? (
            <PressableCard
              onClick={() => navigate(`/show/${nextPerformance.id}`)}
            >
              <div className="flex items-start">
                <Badge glow size="md" tone="solid">
                  {`${formatDday(nextPerformance.performedAt)} · ${PERFORMANCE_STATUS_LABEL[nextPerformance.status]}`}
                </Badge>
                <div className="flex-1" />
                <img
                  alt=""
                  className="size-16 drop-shadow-neon-md"
                  src={mascotMusic}
                />
              </div>
              <Typography
                color="semantic.label.strong"
                variant="heading1"
                weight="bold"
              >
                {nextPerformance.title}
              </Typography>
              <Typography
                color="semantic.label.alternative"
                variant="label2"
                weight="medium"
              >
                {`${formatDateTime(nextPerformance.performedAt)} · ${nextPerformance.venue}`}
              </Typography>
              <Typography
                color="semantic.label.assistive"
                variant="caption1"
                weight="medium"
              >
                {nextPerformanceGroup
                  ? `${nextPerformanceGroup.name} · 참가 팀 ${nextPerformance.teamIds.length}팀`
                  : `참가 팀 ${nextPerformance.teamIds.length}팀`}
              </Typography>
            </PressableCard>
          ) : (
            <EmptyState description="내 팀이 참가하는 공연이 아직 없어요" />
          )}
        </section>

        {songs.length > 0 && (
          <section className="flex flex-col gap-1">
            <SectionHeader title="오늘의 추천곡" />
            <List>
              {songs.map((song) => (
                <ListCell
                  alignItems="center"
                  disableInteraction
                  key={song.id}
                  leadingContent={
                    <ListCellContent variant="large-icon">
                      <IconMusicMicrophone />
                    </ListCellContent>
                  }
                  textProps={{
                    caption: `${song.artist} · ${GENRE_LABEL[song.genre]}`,
                    captionProps: {
                      color: "semantic.label.assistive",
                      variant: "label2",
                    },
                    weight: "bold",
                  }}
                >
                  {song.title}
                </ListCell>
              ))}
            </List>
          </section>
        )}

        <section className="flex flex-col gap-2.5">
          <SectionHeader
            actionLabel="전체보기"
            onAction={() => navigate("/crew")}
            title="나의 모임·팀"
          />
          {crewEntries.length > 0 ? (
            crewEntries.map((entry) => (
              <PressableCard key={entry.key} onClick={() => navigate(entry.to)}>
                <div className="flex items-center gap-3.5">
                  <div className="flex min-w-0 flex-1 flex-col gap-px">
                    <Typography
                      color="semantic.primary.normal"
                      variant="caption2"
                      weight="bold"
                    >
                      {entry.category}
                    </Typography>
                    <Typography
                      color="semantic.label.strong"
                      variant="body2"
                      weight="bold"
                    >
                      {entry.name}
                    </Typography>
                    <Typography
                      className="truncate"
                      color="semantic.label.assistive"
                      variant="caption1"
                      weight="regular"
                    >
                      {entry.meta}
                    </Typography>
                  </div>
                  <IconChevronRight className="size-4.5 shrink-0 text-label-assistive" />
                </div>
              </PressableCard>
            ))
          ) : (
            <EmptyState
              action={{
                label: "모집 공고 보기",
                onClick: () => navigate("/board"),
              }}
              description="아직 함께하는 모임·팀이 없어요"
            />
          )}
        </section>

        <section className="flex flex-col gap-2.5">
          <SectionHeader
            actionLabel="더보기"
            onAction={() => navigate("/board")}
            title="함께할 멤버를 찾고 있어요"
          />
          {openPosts.length > 0 ? (
            <HomeRecruitCarousel posts={openPosts} />
          ) : (
            <EmptyState description="지금 모집 중인 공고가 없어요" />
          )}
        </section>
      </div>
    </div>
  );
}

export default HomeScreen;
