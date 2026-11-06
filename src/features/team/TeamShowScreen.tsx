import { Button, List, Typography } from "@wanteddev/wds";
import { IconCalendar, IconLocation } from "@wanteddev/wds-icon";
import { useNavigate } from "react-router-dom";

import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import MetaItem from "@/components/ui/MetaItem";
import PressableCard from "@/components/ui/PressableCard";
import SectionHeader from "@/components/ui/SectionHeader";
import ConfirmedSetlist from "@/features/team/components/ConfirmedSetlist";
import SongCell from "@/features/team/components/SongCell";
import TeamFallback from "@/features/team/components/TeamFallback";
import TeamHeroTabs from "@/features/team/components/TeamHeroTabs";
import {
  getTeamPerformance,
  isTeamLeader,
  isTeamMember,
  useTeamParam,
} from "@/features/team/components/teamHelpers";
import { formatDateTime, formatDday } from "@/lib/domain/format";
import { PERFORMANCE_STATUS_LABEL } from "@/lib/domain/labels";
import type { Performance, Team } from "@/lib/domain/types";
import { getGroup, getSong, isUpcoming } from "@/mocks/selectors";

// Figma: 팀/03 팀 공연 (nodeId 101:21978) — 공연 팀만. 이 팀이 나가는 공연 정보와 공연 셋리스트.
// 셋리스트는 모임장이 확정하기 전에는 "우리 팀이 넘긴 곡"만, 확정 뒤에는 공연 전체 순서를 보여준다
// (서버: 팀 페이지는 확정곡을 공연 셋리스트에서 조회).
function TeamShowScreen() {
  const team = useTeamParam();
  if (!team) return <TeamFallback kind="notFound" />;
  if (!isTeamMember(team))
    return <TeamFallback kind="memberOnly" team={team} />;
  const performance = getTeamPerformance(team);
  if (!performance) return <TeamFallback kind="noPerformance" team={team} />;
  return <TeamShowContent performance={performance} team={team} />;
}

function TeamShowContent({
  performance,
  team,
}: {
  performance: Performance;
  team: Team;
}) {
  const navigate = useNavigate();
  const group = getGroup(performance.groupId);
  const upcoming = isUpcoming(performance);

  const submitted = performance.setlist.filter(
    (item) => item.teamId === team.id,
  );

  return (
    <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto">
      <TeamHeroTabs active="show" team={team} />

      <div className="flex flex-col gap-6 px-5 pt-6 pb-8">
        <PressableCard onClick={() => navigate(`/show/${performance.id}`)}>
          <div className="flex items-center gap-1.5">
            <Badge tone={upcoming ? "accent" : "outline"}>
              {PERFORMANCE_STATUS_LABEL[performance.status]}
            </Badge>
            {upcoming && (
              <Badge glow tone="solid">
                {formatDday(performance.performedAt)}
              </Badge>
            )}
          </div>
          <Typography
            color="semantic.label.strong"
            variant="headline2"
            weight="bold"
          >
            {performance.title}
          </Typography>
          {group && (
            <Typography
              color="semantic.label.alternative"
              variant="label2"
              weight="medium"
            >
              {group.name}
            </Typography>
          )}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <MetaItem icon={<IconCalendar />}>
              {formatDateTime(performance.performedAt)}
            </MetaItem>
            <MetaItem icon={<IconLocation />}>{performance.venue}</MetaItem>
          </div>
        </PressableCard>

        <section className="flex flex-col gap-1">
          <SectionHeader
            count={
              performance.setlistConfirmed
                ? performance.setlist.length
                : submitted.length
            }
            title="공연 셋리스트"
          />
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="medium"
          >
            {performance.setlistConfirmed
              ? "모임장이 확정한 공연 순서예요."
              : "모임장이 아직 셋리스트를 확정하지 않았어요. 우리 팀이 넘긴 곡이에요."}
          </Typography>

          {performance.setlistConfirmed ? (
            <ConfirmedSetlist performance={performance} teamId={team.id} />
          ) : submitted.length === 0 ? (
            <EmptyState
              description={
                isTeamLeader(team)
                  ? "선택곡 중에서 공연에 올릴 곡을 넘겨 주세요."
                  : "팀장이 선택곡 중에서 공연에 올릴 곡을 넘기면 여기에 보여요."
              }
              title="아직 넘긴 곡이 없어요"
            />
          ) : (
            <List>
              {submitted.map((item, index) => {
                const song = getSong(item.songId);
                if (!song) return null;
                return (
                  <SongCell key={item.songId} order={index + 1} song={song} />
                );
              })}
            </List>
          )}
        </section>

        {/* 확정된 뒤에는 넘길 수 없다(모임장이 확정을 풀어야 다시 가능) — 팀장에게만, 확정 전에만 보인다 */}
        {isTeamLeader(team) && !performance.setlistConfirmed && upcoming && (
          <Button
            color="assistive"
            fullWidth
            onClick={() =>
              navigate(`/team/${team.id}/songs`, { replace: true })
            }
            size="large"
            variant="outlined"
          >
            셋리스트로 넘길 곡 고르기
          </Button>
        )}
      </div>
    </div>
  );
}

export default TeamShowScreen;
