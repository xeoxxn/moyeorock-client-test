import {
  Button,
  Category,
  CategoryList,
  CategoryListItem,
  TextButton,
  Typography,
} from "@wanteddev/wds";
import { IconMusicMicrophone, IconPersons } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import MetaItem from "@/components/ui/MetaItem";
import PressableCard from "@/components/ui/PressableCard";
import { TEAM_KIND_LABEL } from "@/lib/domain/labels";
import {
  getMyTeams,
  getPerformance,
  isPerformanceTeam,
} from "@/mocks/selectors";

// Figma: 팀/01 팀 목록 (nodeId 101:21220) — 모임 탭(/crew?tab=team)의 "팀" 패널.
// 서버 GET /users/me/teams(내 팀)를 보여준다. 다른 팀에 들어가는 길은 게시판의 팀 모집 공고와
// 초대뿐이라, 둘러보기는 "팀 찾기" → 게시판 팀 모집 탭으로 보낸다.
// 필터는 서버의 팀 구분 그대로 공연 팀 / 독립 팀이다(예전 "공연 참가팀 · 자체 합주팀 · 내 팀"은
// 이름이 화면마다 달랐고 "내 팀"은 목록 자체가 내 팀이라 겹쳤다).
type TeamFilter = "all" | "performance" | "independent";

const FILTERS: { value: TeamFilter; label: string }[] = [
  { label: "전체", value: "all" },
  { label: TEAM_KIND_LABEL.performance, value: "performance" },
  { label: TEAM_KIND_LABEL.independent, value: "independent" },
];

function TeamListPanel() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<TeamFilter>("all");

  const teams = getMyTeams().filter((team) => {
    if (filter === "performance") return isPerformanceTeam(team);
    if (filter === "independent") return !isPerformanceTeam(team);
    return true;
  });

  return (
    <div className="flex flex-col gap-4 px-5 pt-5 pb-8">
      <Typography
        color="semantic.label.alternative"
        variant="body2"
        weight="regular"
      >
        공연 팀은 모임 공연에 나가는 팀, 독립 팀은 모임 없이 꾸린 밴드예요.
      </Typography>

      <div className="-mx-5">
        <Category
          onValueChange={(value) => setFilter(value as TeamFilter)}
          value={filter}
        >
          <CategoryList horizontalPadding size="small">
            {FILTERS.map((item) => (
              <CategoryListItem key={item.value} value={item.value}>
                {item.label}
              </CategoryListItem>
            ))}
          </CategoryList>
        </Category>
      </div>

      <div className="flex items-center justify-between">
        <Typography
          color="semantic.label.alternative"
          variant="label2"
          weight="bold"
        >
          내 팀 {teams.length}개
        </Typography>
        <TextButton
          color="primary"
          onClick={() => navigate("/board?type=team")}
          size="small"
        >
          팀 찾기
        </TextButton>
      </div>

      {teams.length === 0 ? (
        <EmptyState
          action={{
            label: "팀 모집 공고 보기",
            onClick: () => navigate("/board?type=team"),
          }}
          description="공고에 지원하거나 초대를 받으면 여기에 팀이 보여요."
          title="아직 함께하는 팀이 없어요"
        />
      ) : (
        teams.map((team) => {
          const performance =
            team.performanceId !== null
              ? getPerformance(team.performanceId)
              : undefined;
          return (
            <PressableCard
              key={team.id}
              onClick={() => navigate(`/team/${team.id}`)}
            >
              <div className="flex items-center gap-1.5">
                <Typography
                  color="semantic.label.strong"
                  variant="body1"
                  weight="bold"
                >
                  {team.name}
                </Typography>
                {team.myRole === "LEADER" ? (
                  <Badge glow>팀장</Badge>
                ) : (
                  <Badge tone="outline">멤버</Badge>
                )}
              </div>
              <Typography
                color="semantic.label.alternative"
                variant="label2"
                weight="medium"
              >
                {team.description}
              </Typography>
              {performance && (
                <Typography
                  className="text-glow-sm"
                  color="semantic.primary.normal"
                  variant="caption1"
                  weight="bold"
                >
                  공연 · {performance.title}
                </Typography>
              )}
              <div className="flex items-center gap-2.5">
                <MetaItem icon={<IconMusicMicrophone />}>
                  {performance
                    ? TEAM_KIND_LABEL.performance
                    : TEAM_KIND_LABEL.independent}
                </MetaItem>
                <MetaItem icon={<IconPersons />}>
                  {team.members.length}명
                </MetaItem>
              </div>
            </PressableCard>
          );
        })
      )}

      <Button
        color="assistive"
        fullWidth
        onClick={() => navigate("/team/create/type")}
        size="large"
        variant="outlined"
      >
        팀 만들기
      </Button>
    </div>
  );
}

export default TeamListPanel;
