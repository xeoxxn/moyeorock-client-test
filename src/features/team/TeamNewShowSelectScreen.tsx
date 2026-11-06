import { Typography } from "@wanteddev/wds";
import { IconCalendar, IconLocation } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Badge from "@/components/ui/Badge";
import BottomActionArea from "@/components/ui/BottomActionArea";
import EmptyState from "@/components/ui/EmptyState";
import MetaItem from "@/components/ui/MetaItem";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import SelectableCard from "@/features/team/components/SelectableCard";
import { formatDateTime } from "@/lib/domain/format";
import { PERFORMANCE_STATUS_LABEL } from "@/lib/domain/labels";
import {
  getGroup,
  getJoinablePerformances,
  getMyTeams,
} from "@/mocks/selectors";

// 팀 만들기 → 공연 팀 → 참가할 공연 고르기. Figma 플로우 S6 B-2에 "어느 공연? 선택 단계 필요"로만
// 남아 있던 빈 단계다. 공연 팀은 공연에 속해서(POST /performances/{id}/teams) 공연을 먼저 정해야
// 하고, 서버는 내가 모임원인 모임의 진행 중(공연 예정·팀 모집 중) 공연에만 팀을 만들게 한다.
// 공연을 고르면 공연 쪽의 공연 팀 만들기 화면으로 넘긴다.
function TeamNewShowSelectScreen() {
  const navigate = useNavigate();
  const performances = getJoinablePerformances();
  const myTeams = getMyTeams();
  const [selectedId, setSelectedId] = useState<number | null>(
    performances[0]?.id ?? null,
  );

  useScreenHeader(<ScreenHeader title="공연 선택" />);

  if (performances.length === 0) {
    return (
      <div className="flex flex-1 flex-col justify-center px-5">
        <EmptyState
          action={{
            label: "모임 모집 공고 보기",
            onClick: () => navigate("/board?type=group"),
          }}
          description="모임에 가입하면 그 모임의 공연에 팀으로 나갈 수 있어요."
          title="참가할 수 있는 공연이 없어요"
        />
      </div>
    );
  }

  return (
    <>
      <div className="scrollbar-hidden flex flex-1 flex-col gap-6 overflow-y-auto px-5 pt-2 pb-8">
        <div className="flex flex-col gap-2">
          <Typography
            color="semantic.label.strong"
            variant="title3"
            weight="bold"
          >
            어느 공연에 나갈까요?
          </Typography>
          <Typography
            color="semantic.label.alternative"
            variant="body2"
            weight="regular"
          >
            공연 팀은 모임 공연에 나가는 팀이에요. 참가할 공연을 골라 주세요.
          </Typography>
        </div>

        <div className="flex flex-col gap-3">
          {performances.map((performance) => {
            // 이미 이 공연에 나가는 내 팀이 있으면 알려 준다.
            const myTeam = myTeams.find(
              (team) => team.performanceId === performance.id,
            );
            return (
              <SelectableCard
                key={performance.id}
                onSelect={() => setSelectedId(performance.id)}
                selected={selectedId === performance.id}
              >
                <div className="flex items-center gap-1.5">
                  <Badge>{PERFORMANCE_STATUS_LABEL[performance.status]}</Badge>
                  <Typography
                    className="min-w-0 truncate"
                    color="semantic.label.alternative"
                    variant="label2"
                    weight="medium"
                  >
                    {getGroup(performance.groupId)?.name}
                  </Typography>
                </div>
                <Typography
                  color="semantic.label.strong"
                  variant="headline2"
                  weight="bold"
                >
                  {performance.title}
                </Typography>
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <MetaItem icon={<IconCalendar />}>
                    {formatDateTime(performance.performedAt)}
                  </MetaItem>
                  <MetaItem icon={<IconLocation />}>
                    {performance.venue}
                  </MetaItem>
                </div>
                {myTeam && (
                  <Typography
                    color="semantic.label.assistive"
                    variant="caption1"
                    weight="medium"
                  >
                    참가 중인 내 팀 · {myTeam.name}
                  </Typography>
                )}
              </SelectableCard>
            );
          })}
        </div>
      </div>

      <BottomActionArea
        disabled={selectedId === null}
        label="다음"
        onClick={() => {
          if (selectedId !== null) navigate(`/show/${selectedId}/team/new`);
        }}
      />
    </>
  );
}

export default TeamNewShowSelectScreen;
