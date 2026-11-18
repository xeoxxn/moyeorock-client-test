import { List } from "@wanteddev/wds";
import { useNavigate, useParams } from "react-router-dom";

import ActionRow from "@/components/list/ActionRow";
import EventRow from "@/components/list/EventRow";
import EmptyState from "@/components/ui/EmptyState";
import ScreenBody from "@/components/ui/ScreenBody";
import SectionHeader from "@/components/ui/SectionHeader";
import Status from "@/components/ui/Status";
import { CrewNotFound } from "@/features/crew/components/CrewFallback";
import CrewHero from "@/features/crew/components/CrewHero";
import {
  performanceMeta,
  performanceStatus,
  splitPerformances,
} from "@/features/crew/components/crewHelpers";
import type { Group, Performance } from "@/lib/domain/types";
import { getGroup, getGroupPerformances, toId } from "@/mocks/selectors";

// 모임 홈의 공연 탭(Figma 19의 탭) — 다가오는 공연(가까운 순)과 지난 공연(최근 순, 흐리게).
// 서버 공연 목록은 period=UPCOMING(PLANNED·RECRUITING)|PAST(DONE·CANCELED)로 나뉜다.
// 공연은 모임에 속해서 만들기는 모임장만(서버) — "새 공연" 행을 모임장에게만 둔다.
function PerformanceRow({ performance }: { performance: Performance }) {
  const navigate = useNavigate();
  const status = performanceStatus(performance);
  return (
    <EventRow
      date={new Date(performance.performedAt)}
      dimmed={
        performance.status === "DONE" || performance.status === "CANCELED"
      }
      label={<Status tone={status.tone}>{status.label}</Status>}
      meta={performanceMeta(performance)}
      onClick={() => navigate(`/show/${performance.id}`)}
      title={performance.title}
    />
  );
}

function CrewShow({ group }: { group: Group }) {
  const navigate = useNavigate();
  const isOwner = group.myRole === "OWNER";
  const { past, upcoming } = splitPerformances(getGroupPerformances(group.id));

  return (
    <ScreenBody>
      <CrewHero group={group} tab="show" />

      <SectionHeader title="다가오는 공연" />
      <List>
        {upcoming.map((performance) => (
          <PerformanceRow key={performance.id} performance={performance} />
        ))}
        {isOwner && (
          <ActionRow
            meta="공연을 열면 모임원이 공연 팀을 만들어요"
            onClick={() => navigate(`/crew/${group.id}/show/new`)}
            title="새 공연"
          />
        )}
      </List>
      {upcoming.length === 0 && !isOwner && (
        <EmptyState description="공연이 정해지면 여기에 보여요" />
      )}

      {past.length > 0 && (
        <>
          <SectionHeader title="지난 공연" />
          <List>
            {past.map((performance) => (
              <PerformanceRow key={performance.id} performance={performance} />
            ))}
          </List>
        </>
      )}
    </ScreenBody>
  );
}

function CrewShowScreen() {
  const { crewId } = useParams();
  const group = getGroup(toId(crewId));
  if (!group) return <CrewNotFound />;
  return <CrewShow group={group} />;
}

export default CrewShowScreen;
