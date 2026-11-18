import { IconBell } from "@wanteddev/wds-icon";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import PracticeTile from "@/components/card/PracticeTile";
import EmptyState from "@/components/ui/EmptyState";
import HeaderIconButton from "@/components/ui/HeaderIconButton";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  useScreenBackdrop,
  useScreenHeader,
} from "@/components/ui/useScreenHeader";
import TeamCard from "@/features/home/components/TeamCard";
import TodayCard from "@/features/home/components/TodayCard";
import { listPracticeRecordings } from "@/features/practice/practiceStore";
import { formatDayShort, formatTime, isSameDay } from "@/lib/domain/format";
import {
  INSTRUMENT_LABEL,
  PRACTICE_STATUS_LABEL,
  TEAM_KIND_LABEL,
} from "@/lib/domain/labels";
import type { Rehearsal, Team } from "@/lib/domain/types";
import {
  getMyInstrumentInTeam,
  getMyTeams,
  getNowPlayingRecording,
  getPerformance,
  getRehearsals,
  getTeam,
  hasUnreadNotifications,
  isPerformanceTeam,
} from "@/mocks/selectors";

// Figma 01 홈(411:11056) — 다가오는 합주(오늘 합주 카드) → 내 팀(옆으로 넘기는 카드) → 다시 듣기(연습 녹음
// 선반). 서버 대시보드(GET /v1/dashboard)의 합주·내 팀과 연습 녹음 목록을 화면 순서대로 놓는다.

/** 내 팀의 아직 끝나지 않은 합주 — 시작 시각 순 */
function getMyUpcomingRehearsals(now: Date): Rehearsal[] {
  const myTeamIds = new Set(getMyTeams().map((team) => team.id));
  return getRehearsals().filter(
    (rehearsal) =>
      myTeamIds.has(rehearsal.teamId) && new Date(rehearsal.endsAt) >= now,
  );
}

function teamKicker(team: Team): string {
  if (!isPerformanceTeam(team)) return TEAM_KIND_LABEL.independent;
  const performance =
    team.performanceId !== null ? getPerformance(team.performanceId) : null;
  return performance
    ? `${TEAM_KIND_LABEL.performance} · ${performance.title}`
    : TEAM_KIND_LABEL.performance;
}

function teamMeta(team: Team): string {
  const part = getMyInstrumentInTeam(team);
  const count = `멤버 ${team.members.length}명`;
  return part ? `${INSTRUMENT_LABEL[part]} · ${count}` : count;
}

function UpcomingRehearsal() {
  const navigate = useNavigate();
  const now = new Date();
  const [featured, next] = getMyUpcomingRehearsals(now);

  if (!featured) {
    return (
      <EmptyState
        description="팀에서 합주 일정을 잡으면 여기에 보여 드려요."
        title="다가오는 합주가 없어요"
      />
    );
  }

  const team = getTeam(featured.teamId);
  const isToday = isSameDay(new Date(featured.startsAt), now);
  const nextTeam = next ? getTeam(next.teamId) : undefined;

  return (
    <div className="px-5">
      <TodayCard
        label={
          isToday
            ? "오늘 합주"
            : `다음 합주 · ${formatDayShort(featured.startsAt)}`
        }
        meta={
          team
            ? `${featured.place} · 멤버 ${team.members.length}명`
            : featured.place
        }
        next={
          next
            ? `${formatDayShort(next.startsAt)} ${formatTime(next.startsAt)}${nextTeam ? ` · ${nextTeam.name}` : ""}`
            : undefined
        }
        onClick={() => navigate(`/team/${featured.teamId}/schedule`)}
        teamName={team?.name ?? featured.title}
        time={formatTime(featured.startsAt)}
      />
    </div>
  );
}

function HomeScreen() {
  const navigate = useNavigate();
  const unread = hasUnreadNotifications();

  useScreenHeader(
    useMemo(
      () => (
        <ScreenHeader
          trailing={
            <HeaderIconButton
              dot={unread}
              icon={<IconBell />}
              label="알림"
              onClick={() => navigate("/notifications")}
            />
          }
          variant="home"
        />
      ),
      [navigate, unread],
    ),
  );
  useScreenBackdrop("stage");

  const teams = getMyTeams();
  const recordings = listPracticeRecordings();
  const nowPlayingId = getNowPlayingRecording()?.id;

  return (
    <ScreenBody>
      <SectionHeader
        actionLabel="전체 보기"
        first
        onAction={() => navigate("/schedule")}
        title="다가오는 합주"
      />
      <UpcomingRehearsal />

      <SectionHeader
        actionLabel="전체 보기"
        onAction={() => navigate("/crew?tab=team")}
        title="내 팀"
      />
      {teams.length > 0 ? (
        <div className="scrollbar-hidden flex snap-x snap-mandatory scroll-px-5 gap-2.5 overflow-x-auto px-5">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              kicker={teamKicker(team)}
              members={team.members.map((member) => member.user)}
              meta={teamMeta(team)}
              name={team.name}
              onClick={() => navigate(`/team/${team.id}`)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          action={{ label: "팀 찾기", onClick: () => navigate("/board") }}
          description="게시판에서 함께할 팀을 찾아보세요."
          title="아직 함께하는 팀이 없어요"
        />
      )}

      <SectionHeader
        actionLabel="전체 보기"
        onAction={() => navigate("/practice")}
        title="다시 듣기"
      />
      {recordings.length > 0 ? (
        <div className="scrollbar-hidden flex gap-3 overflow-x-auto px-5">
          {recordings.map((recording) => (
            <PracticeTile
              key={recording.id}
              meta={`${INSTRUMENT_LABEL[recording.part]} · ${PRACTICE_STATUS_LABEL[recording.status]}`}
              onClick={() => navigate(`/practice/${recording.id}`)}
              part={recording.part}
              playing={recording.id === nowPlayingId}
              title={recording.song.title}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          action={{
            label: "녹음 올리기",
            onClick: () => navigate("/practice/new"),
          }}
          description={"녹음을 올리면 원곡과 비교해\n다른 구간을 짚어 드려요."}
          title="아직 분석한 연습이 없어요"
        />
      )}
    </ScreenBody>
  );
}

export default HomeScreen;
