import {
  Button,
  Category,
  CategoryList,
  CategoryListItem,
  ContentBadge,
  Tab,
  TabList,
  TabListItem,
  Typography,
} from "@wanteddev/wds";
import { IconMusicMicrophone, IconPersons, IconPlus } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useScreenHeader } from "@/components/ui/useScreenHeader";

// Figma: 팀/01 팀 목록 (nodeId 101:21220). 최상위 "모임" 탭 화면(101:11294 캔버스 기준 "모임/01
// 모임 목록"과 자매 화면)의 "모임 · 팀" 세그먼트 중 "팀" 쪽이다 — 같은 화면 컴포넌트 안의 두 탭
// 패널이 아니라 이 프로젝트에서 모임(/crew)과 팀(/team)이 서로 다른 담당 구현이라 별도 라우트로
// 나눴고, 상단 Tab은 두 라우트 사이를 오가는 네비게이션으로 취급한다.
// 이 화면은 하단 Bottom Nav가 스크린샷에 그대로 보이는 몇 안 되는 팀 화면이라(모임 탭의 하위
// 화면이라서) hasBottomNav: true로 둔다 — BOTTOM_NAV_PATHS(ScreenLayout.tsx)에 "/team"을
// "모임" 탭으로 매핑하는 건 라우팅 통합 담당자 몫이라 여기서는 건드리지 않는다.

type TeamFilter = "all" | "showTeam" | "independent" | "mine";

const FILTERS: { value: TeamFilter; label: string }[] = [
  { label: "전체", value: "all" },
  { label: "공연 참가팀", value: "showTeam" },
  { label: "자체 합주팀", value: "independent" },
  { label: "내 팀", value: "mine" },
];

interface TeamListItem {
  id: string;
  name: string;
  role?: "leader" | "member";
  description: string;
  affiliation?: string;
  showOrKind: string;
  memberCount: number;
}

const TEAMS: TeamListItem[] = [
  {
    affiliation: "프로젝트 모임",
    description: "인디 록 사운드를 함께 만드는 밴드",
    id: "1",
    memberCount: 9,
    name: "블루 웨이브",
    role: "leader",
    showOrKind: "봄날 록 페스티벌",
  },
  {
    affiliation: "주말 잼 세션",
    description: "퇴근 후 시티팝을 연주하는 직장인 밴드",
    id: "2",
    memberCount: 3,
    name: "나이트 드라이브",
    role: "member",
    showOrKind: "자체 합주팀",
  },
  {
    affiliation: "어쿠스틱 나이트",
    description: "공연을 준비하는 하드 록 밴드",
    id: "3",
    memberCount: 3,
    name: "라우드 룸",
    showOrKind: "여름 클럽 공연",
  },
];

function TeamListScreen() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<TeamFilter>("all");

  useScreenHeader(
    <div className="flex w-full items-center gap-3 px-5 py-1.5">
      <Typography
        as="h1"
        className="flex-1"
        color="semantic.label.strong"
        variant="title3"
        weight="bold"
      >
        모임
      </Typography>
      <button
        aria-label="팀 만들기"
        onClick={() => navigate("/team/create/type")}
        type="button"
      >
        <IconPlus className="size-6 text-label-strong" />
      </button>
    </div>,
  );

  return (
    <div className="scrollbar-hidden flex-1 overflow-y-auto">
      <Tab onValueChange={(value) => value === "crew" && navigate("/crew")} value="team">
        <TabList resize="fill" size="large">
          <TabListItem value="crew">모임</TabListItem>
          <TabListItem value="team">팀</TabListItem>
        </TabList>
      </Tab>

      <div className="flex flex-col gap-4 px-5 pt-5 pb-8">
        <Typography color="semantic.label.alternative" variant="body2" weight="medium">
          모임 안의 팀과 독립 팀을 한곳에서 확인해요.
          <br />
          모임 없이도 팀을 만들 수 있어요.
        </Typography>

        <div className="-mx-5">
          <Category onValueChange={(v) => setFilter(v as TeamFilter)} value={filter}>
            <CategoryList horizontalPadding size="small">
              {FILTERS.map((item) => (
                <CategoryListItem key={item.value} value={item.value}>
                  {item.label}
                </CategoryListItem>
              ))}
            </CategoryList>
          </Category>
        </div>

        <Typography color="semantic.label.alternative" variant="label2" weight="bold">
          결과 {TEAMS.length}개
        </Typography>

        <div className="flex flex-col gap-4">
          {TEAMS.map((team) => (
            <button
              className="flex flex-col gap-1 rounded-2xl border border-line-neutral bg-surface p-4 text-left"
              key={team.id}
              onClick={() => navigate(`/team/${team.id}`)}
              type="button"
            >
              <div className="flex items-center gap-1.5">
                <Typography color="semantic.label.strong" variant="body1" weight="bold">
                  {team.name}
                </Typography>
                {team.role === "leader" && (
                  <ContentBadge className="shadow-neon-sm" color="accent" size="xsmall" variant="solid">
                    팀장
                  </ContentBadge>
                )}
                {team.role === "member" && (
                  <ContentBadge color="neutral" size="xsmall" variant="outlined">
                    멤버
                  </ContentBadge>
                )}
              </div>
              <Typography color="semantic.label.alternative" variant="label2" weight="medium">
                {team.description}
              </Typography>
              {team.affiliation && (
                <Typography
                  className="text-glow-sm"
                  color="semantic.primary.normal"
                  variant="caption1"
                  weight="bold"
                >
                  소속 · {team.affiliation}
                </Typography>
              )}
              <div className="flex items-center gap-2.5 pt-1">
                <div className="flex items-center gap-1">
                  <IconMusicMicrophone className="size-3.5 text-label-assistive" />
                  <Typography color="semantic.label.alternative" variant="label2" weight="medium">
                    {team.showOrKind}
                  </Typography>
                </div>
                <div className="flex items-center gap-1">
                  <IconPersons className="size-3.5 text-label-assistive" />
                  <Typography color="semantic.label.alternative" variant="label2" weight="medium">
                    {team.memberCount}명
                  </Typography>
                </div>
              </div>
            </button>
          ))}
        </div>

        <Typography
          className="text-center"
          color="semantic.label.assistive"
          variant="label2"
          weight="medium"
        >
          내 팀에서 멤버, 합주와 셋리스트를 함께 관리해요.
        </Typography>

        <Button
          color="assistive"
          fullWidth
          onClick={() => navigate("/team/create/type")}
          size="large"
          sx={{ backgroundColor: "var(--color-surface)" }}
          variant="outlined"
        >
          팀 만들기
        </Button>
      </div>
    </div>
  );
}

export default TeamListScreen;
