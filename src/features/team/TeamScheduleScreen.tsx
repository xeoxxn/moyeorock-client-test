import { Button, Typography } from "@wanteddev/wds";
import {
  IconClock,
  IconLocation,
  IconMusicMicrophone,
} from "@wanteddev/wds-icon";
import { useNavigate } from "react-router-dom";

import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import MetaItem from "@/components/ui/MetaItem";
import PressableCard from "@/components/ui/PressableCard";
import SectionHeader from "@/components/ui/SectionHeader";
import TeamFallback from "@/features/team/components/TeamFallback";
import TeamHeroTabs from "@/features/team/components/TeamHeroTabs";
import {
  getTeamPerformance,
  isTeamMember,
  useTeamParam,
} from "@/features/team/components/teamHelpers";
import {
  formatDate,
  formatDateTime,
  formatDday,
  formatTimeRange,
} from "@/lib/domain/format";
import type { Rehearsal, Team } from "@/lib/domain/types";
import { getTeamRehearsals, isUpcoming } from "@/mocks/selectors";

// Figma: 팀/05 팀 일정 (nodeId 101:22543). 서버 GET /teams/{id}/rehearsals를 날짜별로 묶어 보여준다.
// 합주는 팀원 누구나 만들 수 있어서(서버 규칙) 추가 버튼은 팀원 모두에게 보이고, 일정 추가 화면에는
// teamId를 넘겨 팀 선택을 건너뛰게 한다.
function TeamScheduleScreen() {
  const team = useTeamParam();
  if (!team) return <TeamFallback kind="notFound" />;
  if (!isTeamMember(team))
    return <TeamFallback kind="memberOnly" team={team} />;
  return <TeamScheduleContent team={team} />;
}

/** 시작 시각의 날짜(로컬)별로 묶는다 — 입력은 시작 시각 순으로 정렬돼 있다. */
function groupByDate(rehearsals: Rehearsal[]) {
  const groups: { key: string; items: Rehearsal[] }[] = [];
  for (const rehearsal of rehearsals) {
    const key = new Date(rehearsal.startsAt).toDateString();
    const last = groups.at(-1);
    if (last?.key === key) last.items.push(rehearsal);
    else groups.push({ items: [rehearsal], key });
  }
  return groups;
}

function TeamScheduleContent({ team }: { team: Team }) {
  const navigate = useNavigate();
  const rehearsals = getTeamRehearsals(team.id);
  const performance = getTeamPerformance(team);
  const addRehearsal = () => navigate(`/schedule/add?teamId=${team.id}`);

  return (
    <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto">
      <TeamHeroTabs active="schedule" team={team} />

      <div className="flex flex-col gap-4 px-5 pt-6 pb-8">
        {/* 공연 팀은 합주 일정 위에 공연 날짜를 함께 둔다 — 합주를 공연일에 맞춰 잡게 */}
        {performance && isUpcoming(performance) && (
          <PressableCard onClick={() => navigate(`/show/${performance.id}`)}>
            <div className="flex items-center gap-1.5">
              <Badge glow tone="solid">
                {formatDday(performance.performedAt)}
              </Badge>
              <Typography
                className="min-w-0 truncate"
                color="semantic.label.strong"
                variant="body1"
                weight="bold"
              >
                {performance.title}
              </Typography>
            </div>
            <MetaItem icon={<IconMusicMicrophone />}>
              {formatDateTime(performance.performedAt)} · {performance.venue}
            </MetaItem>
          </PressableCard>
        )}

        <SectionHeader count={rehearsals.length} title="합주 일정" />

        {rehearsals.length === 0 ? (
          <EmptyState
            action={{ label: "일정 추가", onClick: addRehearsal }}
            description="팀원 누구나 합주 일정을 잡을 수 있어요."
            title="잡힌 합주가 없어요"
          />
        ) : (
          <>
            {groupByDate(rehearsals).map((group) => (
              <div className="flex flex-col gap-2" key={group.key}>
                <Typography
                  color="semantic.label.alternative"
                  variant="label1"
                  weight="bold"
                >
                  {formatDate(group.items[0].startsAt)}
                </Typography>
                {group.items.map((rehearsal) => (
                  <PressableCard key={rehearsal.id}>
                    <Typography
                      color="semantic.label.strong"
                      variant="body1"
                      weight="bold"
                    >
                      {rehearsal.title}
                    </Typography>
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                      <MetaItem icon={<IconClock />}>
                        {formatTimeRange(rehearsal.startsAt, rehearsal.endsAt)}
                      </MetaItem>
                      <MetaItem icon={<IconLocation />}>
                        {rehearsal.place}
                      </MetaItem>
                    </div>
                  </PressableCard>
                ))}
              </div>
            ))}
            <Button
              color="assistive"
              fullWidth
              onClick={addRehearsal}
              size="large"
              variant="outlined"
            >
              일정 추가
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default TeamScheduleScreen;
