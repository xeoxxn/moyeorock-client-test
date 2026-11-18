import { List } from "@wanteddev/wds";
import { useNavigate } from "react-router-dom";

import ActionRow from "@/components/list/ActionRow";
import CoverRow from "@/components/list/CoverRow";
import { coverToneOf } from "@/components/music/Cover";
import EmptyState from "@/components/ui/EmptyState";
import { INSTRUMENT_LABEL, TEAM_KIND_LABEL } from "@/lib/domain/labels";
import type { Team } from "@/lib/domain/types";
import {
  getMyInstrumentInTeam,
  getMyTeams,
  isPerformanceTeam,
} from "@/mocks/selectors";

// Figma 03 모임의 "팀" 탭(/crew?tab=team) — 서버 GET /users/me/teams(공연 팀·독립 팀 모두).
// 한 줄에 팀 종류 · 내 세션 · 인원을 보여 준다. 다른 팀에 들어가는 길은 팀 모집 공고와 초대뿐이라
// "팀 찾아보기"는 게시판의 팀 모집 탭으로 보낸다. 헤더의 + 는 팀 만들기(/team/create/type).
function teamRowMeta(team: Team): string {
  const instrument = getMyInstrumentInTeam(team);
  return [
    isPerformanceTeam(team)
      ? TEAM_KIND_LABEL.performance
      : TEAM_KIND_LABEL.independent,
    instrument && INSTRUMENT_LABEL[instrument],
    `멤버 ${team.members.length}명`,
  ]
    .filter(Boolean)
    .join(" · ");
}

function TeamListPanel() {
  const navigate = useNavigate();
  const teams = getMyTeams();

  return (
    <>
      {teams.length === 0 && (
        <EmptyState description="공고에 지원하거나 초대를 받으면 여기에 팀이 보여요" />
      )}
      <List>
        {teams.map((team) => (
          <CoverRow
            key={team.id}
            meta={teamRowMeta(team)}
            onClick={() => navigate(`/team/${team.id}`)}
            title={team.name}
            tone={coverToneOf("team", team.id)}
          />
        ))}
        <ActionRow
          icon="search"
          meta="지역·세션으로 맞는 팀을 찾아요"
          onClick={() => navigate("/board?type=team")}
          title="팀 찾아보기"
        />
      </List>
    </>
  );
}

export default TeamListPanel;
