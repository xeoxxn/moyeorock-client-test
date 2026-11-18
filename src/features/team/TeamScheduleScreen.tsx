import { Navigate, useNavigate } from "react-router-dom";

import ActionRow from "@/components/list/ActionRow";
import EventRow from "@/components/list/EventRow";
import SectionHeader from "@/components/ui/SectionHeader";
import EmptyNote from "@/features/team/components/EmptyNote";
import TeamFallback from "@/features/team/components/TeamFallback";
import TeamScreenFrame from "@/features/team/components/TeamScreenFrame";
import {
  isTeamMember,
  useTeamParam,
} from "@/features/team/components/teamHelpers";
import { formatTimeRange } from "@/lib/domain/format";
import type { Rehearsal, Team } from "@/lib/domain/types";
import { getTeamRehearsals } from "@/mocks/selectors";

// 팀 합주 탭 `/team/:teamId/schedule` — GET /teams/{teamId}/rehearsals. Figma 프레임이 없어 일정(02)의
// List/Event와 List/Action Row로 짰다. 다가오는 합주는 가까운 순, 지난 합주는 최근 순으로 흐리게.
// 합주는 팀원 누구나 잡을 수 있어서(서버 규칙) 추가 행은 팀원 모두에게 보이고, 일정 추가 화면에
// teamId를 넘겨 팀 고르기를 건너뛴다.
function TeamScheduleScreen() {
  const team = useTeamParam();
  if (!team) return <TeamFallback kind="notFound" />;
  if (!isTeamMember(team)) return <Navigate replace to={`/team/${team.id}`} />;
  return <TeamScheduleContent team={team} />;
}

function rehearsalMeta(rehearsal: Rehearsal) {
  return `${formatTimeRange(rehearsal.startsAt, rehearsal.endsAt)} · ${rehearsal.place}`;
}

function TeamScheduleContent({ team }: { team: Team }) {
  const navigate = useNavigate();
  const now = new Date();
  const rehearsals = getTeamRehearsals(team.id);
  const upcoming = rehearsals.filter(
    (rehearsal) => new Date(rehearsal.endsAt) >= now,
  );
  const past = rehearsals
    .filter((rehearsal) => new Date(rehearsal.endsAt) < now)
    .reverse();

  return (
    <TeamScreenFrame tab="schedule" team={team}>
      <SectionHeader first title="다가오는 합주" />
      <ActionRow
        meta="팀원 누구나 잡을 수 있어요"
        onClick={() => navigate(`/schedule/add?teamId=${team.id}`)}
        title="합주 일정 추가"
      />
      {upcoming.length === 0 ? (
        <EmptyNote>잡힌 합주가 없어요</EmptyNote>
      ) : (
        upcoming.map((rehearsal) => (
          <EventRow
            date={new Date(rehearsal.startsAt)}
            key={rehearsal.id}
            meta={rehearsalMeta(rehearsal)}
            title={rehearsal.title}
          />
        ))
      )}

      {past.length > 0 && (
        <>
          <SectionHeader title="지난 합주" />
          {past.map((rehearsal) => (
            <EventRow
              date={new Date(rehearsal.startsAt)}
              dimmed
              key={rehearsal.id}
              meta={rehearsalMeta(rehearsal)}
              title={rehearsal.title}
            />
          ))}
        </>
      )}
    </TeamScreenFrame>
  );
}

export default TeamScheduleScreen;
