import { Typography } from "@wanteddev/wds";
import { useNavigate } from "react-router-dom";

import EventRow from "@/components/list/EventRow";
import TrackRow from "@/components/list/TrackRow";
import LabeledAvatar from "@/components/ui/LabeledAvatar";
import SectionHeader from "@/components/ui/SectionHeader";
import Status from "@/components/ui/Status";
import EmptyNote from "@/features/team/components/EmptyNote";
import { songStatus } from "@/features/team/components/songStatus";
import TeamFallback from "@/features/team/components/TeamFallback";
import TeamScreenFrame from "@/features/team/components/TeamScreenFrame";
import {
  getSubmittedSongIds,
  getTeamPerformance,
  isTeamMember,
  useTeamParam,
} from "@/features/team/components/teamHelpers";
import { formatDday, formatTime, formatTimeRange } from "@/lib/domain/format";
import { PERFORMANCE_STATUS_LABEL } from "@/lib/domain/labels";
import type { Team } from "@/lib/domain/types";
import { getNextTeamRehearsal, getSong, isUpcoming } from "@/mocks/selectors";

// 팀 홈 미리보기 선택곡 수 — 나머지는 "전체 보기"(선택곡 탭)
const SONG_PREVIEW_COUNT = 3;

// 팀 홈 `/team/:teamId` — Figma에 따로 그린 프레임이 없어 04·12·19(모임 홈)와 같은 부품으로 짰다.
// 소개 · 다음 합주 · (공연 팀이면) 공연 · 선택곡 미리보기 · 멤버. 따로 두던 팀 공연 탭은 여기 "공연"
// 한 줄로 합쳤다. 팀원이 아닌 사람(공연 상세에서 들어온 남의 팀 등)은 공개 정보(소개 · 공연 · 멤버)만
// 본다 — 합주·선택곡은 팀원 전용 API다.
function TeamHomeScreen() {
  const team = useTeamParam();
  if (!team) return <TeamFallback kind="notFound" />;
  return <TeamHomeContent team={team} />;
}

function TeamHomeContent({ team }: { team: Team }) {
  const navigate = useNavigate();
  const isMember = isTeamMember(team);
  const performance = getTeamPerformance(team);
  const nextRehearsal = isMember ? getNextTeamRehearsal(team.id) : undefined;
  const submittedIds = performance
    ? getSubmittedSongIds(performance, team.id)
    : [];
  const songs = team.songIds
    .map((id) => getSong(id))
    .filter((song) => song !== undefined);

  // 탭(비회원은 히어로) 바로 아래 첫 구역만 위 여백이 좁다(SectionHeader first).
  const hasIntro = team.description !== "";
  const scheduleFirst = !hasIntro;
  const performanceFirst = !hasIntro && !isMember;
  const membersFirst = !hasIntro && !isMember && !performance;

  // 같은 팀 안의 탭 이동이라 히스토리를 쌓지 않는다(HeroTabs와 같게).
  const goTab = (path: string) =>
    navigate(`/team/${team.id}${path}`, { replace: true });

  return (
    <TeamScreenFrame tab="home" team={team}>
      {hasIntro && (
        <>
          <SectionHeader first title="소개" />
          <Typography
            as="p"
            className="whitespace-pre-line px-5"
            color="semantic.label.normal"
            variant="body2"
          >
            {team.description}
          </Typography>
        </>
      )}

      {isMember && (
        <>
          <SectionHeader
            actionLabel="전체 보기"
            first={scheduleFirst}
            onAction={() => goTab("/schedule")}
            title="다음 합주"
          />
          {nextRehearsal ? (
            <EventRow
              date={new Date(nextRehearsal.startsAt)}
              meta={`${formatTimeRange(nextRehearsal.startsAt, nextRehearsal.endsAt)} · ${nextRehearsal.place}`}
              onClick={() => goTab("/schedule")}
              title={nextRehearsal.title}
            />
          ) : (
            <EmptyNote>잡힌 합주가 없어요</EmptyNote>
          )}
        </>
      )}

      {performance && (
        <>
          <SectionHeader first={performanceFirst} title="공연" />
          <EventRow
            date={new Date(performance.performedAt)}
            label={
              isUpcoming(performance) ? (
                <Status tone="accent">
                  {PERFORMANCE_STATUS_LABEL[performance.status]} ·{" "}
                  {formatDday(performance.performedAt)}
                </Status>
              ) : (
                <Status tone="neutral">
                  {PERFORMANCE_STATUS_LABEL[performance.status]}
                </Status>
              )
            }
            meta={`${formatTime(performance.performedAt)} · ${performance.venue}`}
            onClick={() => navigate(`/show/${performance.id}`)}
            title={performance.title}
          />
        </>
      )}

      {isMember && (
        <>
          <SectionHeader
            actionLabel="전체 보기"
            onAction={() => goTab("/songs")}
            title={`선택곡 · ${songs.length}곡`}
          />
          {songs.length === 0 ? (
            <EmptyNote>아직 고른 곡이 없어요</EmptyNote>
          ) : (
            songs
              .slice(0, SONG_PREVIEW_COUNT)
              .map((song, index) => (
                <TrackRow
                  artist={song.artist}
                  index={index + 1}
                  key={song.id}
                  status={
                    performance
                      ? songStatus(
                          submittedIds.includes(song.id),
                          performance.setlistConfirmed,
                        )
                      : undefined
                  }
                  title={song.title}
                />
              ))
          )}
        </>
      )}

      <SectionHeader
        actionLabel="전체 보기"
        first={membersFirst}
        onAction={isMember ? () => goTab("/members") : undefined}
        title={`멤버 ${team.members.length}명`}
      />
      <div className="scrollbar-hidden flex gap-3 overflow-x-auto px-5">
        {team.members.map((member) => (
          <LabeledAvatar
            key={member.user.id}
            name={member.user.nickname}
            onClick={() => navigate(`/users/${member.user.id}`)}
            profileImage={member.user.profileImage}
          />
        ))}
      </div>
    </TeamScreenFrame>
  );
}

export default TeamHomeScreen;
