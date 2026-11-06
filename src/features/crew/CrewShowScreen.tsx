import {
  Category,
  CategoryList,
  CategoryListItem,
  TextButton,
  Typography,
} from "@wanteddev/wds";
import {
  IconCalendar,
  IconLocation,
  IconMusicMicrophone,
  IconPersons,
} from "@wanteddev/wds-icon";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import MetaItem from "@/components/ui/MetaItem";
import PressableCard from "@/components/ui/PressableCard";
import { CrewNotFound } from "@/features/crew/components/CrewFallback";
import CrewHeroTabs from "@/features/crew/components/CrewHeroTabs";
import { formatDateTime, formatDday } from "@/lib/domain/format";
import { PERFORMANCE_STATUS_LABEL } from "@/lib/domain/labels";
import type { Group, Performance } from "@/lib/domain/types";
import {
  getGroup,
  getGroupPerformances,
  isUpcoming,
  toId,
} from "@/mocks/selectors";

// Figma: 모임/03 모임 공연 (nodeId 101:19327). 서버 공연 목록이 period=UPCOMING|PAST로 나뉘어서
// (PLANNED·RECRUITING / DONE·CANCELED) Figma의 "예정된 공연 · 공연 히스토리" 두 섹션을 필터 칩
// 두 개로 바꿨다. 선택한 필터는 ?period=로 남겨 공연 상세에서 돌아와도 그대로 열린다.
type Period = "upcoming" | "past";

const PERIOD_LABEL: Record<Period, string> = {
  past: "지난 공연",
  upcoming: "다가오는 공연",
};

function PerformanceCard({
  onClick,
  performance,
}: {
  onClick: () => void;
  performance: Performance;
}) {
  const upcoming = isUpcoming(performance);

  return (
    <PressableCard dimmed={performance.status === "CANCELED"} onClick={onClick}>
      <div className="flex items-center gap-1.5">
        <Badge size="md" tone={upcoming ? "accent" : "outline"}>
          {PERFORMANCE_STATUS_LABEL[performance.status]}
        </Badge>
        {upcoming && (
          <Badge size="md" tone="solid">
            {formatDday(performance.performedAt)}
          </Badge>
        )}
      </div>
      <Typography
        color="semantic.label.strong"
        variant="headline1"
        weight="bold"
      >
        {performance.title}
      </Typography>
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <MetaItem icon={<IconCalendar />}>
          {formatDateTime(performance.performedAt)}
        </MetaItem>
        <MetaItem icon={<IconLocation />}>{performance.venue}</MetaItem>
      </div>
      {/* 종료·취소되면 서버가 공연 팀을 해체한다 — 지난 공연은 팀 수 대신 남은 셋리스트 곡 수를 보여준다. */}
      {upcoming ? (
        <MetaItem icon={<IconPersons />}>
          참가 팀 {performance.teamIds.length}팀
        </MetaItem>
      ) : (
        <MetaItem icon={<IconMusicMicrophone />}>
          셋리스트 {performance.setlist.length}곡
        </MetaItem>
      )}
    </PressableCard>
  );
}

function CrewShow({ group }: { group: Group }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const period: Period =
    searchParams.get("period") === "past" ? "past" : "upcoming";
  const isOwner = group.myRole === "OWNER";

  const performances = getGroupPerformances(group.id)
    .filter((performance) =>
      period === "upcoming"
        ? isUpcoming(performance)
        : !isUpcoming(performance),
    )
    .sort((a, b) =>
      period === "upcoming"
        ? a.performedAt.localeCompare(b.performedAt)
        : b.performedAt.localeCompare(a.performedAt),
    );

  const createShow = () => navigate(`/crew/${group.id}/show/new`);

  return (
    <div className="scrollbar-hidden flex-1 overflow-y-auto">
      <CrewHeroTabs active="show" group={group} />

      <div className="flex flex-col gap-4 px-5 pt-5 pb-8">
        <div className="-mx-5">
          <Category
            onValueChange={(value) =>
              setSearchParams(value === "past" ? { period: "past" } : {}, {
                replace: true,
              })
            }
            value={period}
          >
            <CategoryList horizontalPadding size="small">
              <CategoryListItem value="upcoming">
                {PERIOD_LABEL.upcoming}
              </CategoryListItem>
              <CategoryListItem value="past">
                {PERIOD_LABEL.past}
              </CategoryListItem>
            </CategoryList>
          </Category>
        </div>

        <div className="flex items-center justify-between">
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="bold"
          >
            {PERIOD_LABEL[period]} {performances.length}개
          </Typography>
          {isOwner && (
            <TextButton color="primary" onClick={createShow} size="small">
              공연 만들기
            </TextButton>
          )}
        </div>

        {performances.length === 0 ? (
          <EmptyState
            action={
              isOwner && period === "upcoming"
                ? { label: "공연 만들기", onClick: createShow }
                : undefined
            }
            description={
              period === "upcoming"
                ? "공연이 정해지면 여기에 보여요."
                : "끝난 공연이 여기에 쌓여요."
            }
            title={`${PERIOD_LABEL[period]}이 없어요`}
          />
        ) : (
          performances.map((performance) => (
            <PerformanceCard
              key={performance.id}
              onClick={() => navigate(`/show/${performance.id}`)}
              performance={performance}
            />
          ))
        )}
      </div>
    </div>
  );
}

function CrewShowScreen() {
  const { crewId } = useParams();
  const group = getGroup(toId(crewId));
  if (!group) return <CrewNotFound />;
  return <CrewShow group={group} />;
}

export default CrewShowScreen;
