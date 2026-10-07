import { Button, Tab, TabList, TabListItem, Typography } from "@wanteddev/wds";
import {
  IconMusicMicrophone,
  IconPersons,
  IconPlus,
} from "@wanteddev/wds-icon";
import { useNavigate } from "react-router-dom";

import Badge from "@/components/ui/Badge";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

// Figma: 모임/01 모임 목록 (nodeId 101:18601), Bottom Nav "모임" 탭의 루트라 hasBottomNav를 그대로 둔다.
// 상단 "모임 | 팀" Tab은 이 화면 안의 콘텐츠 전환이 아니라 최상위 섹션 전환이다 — "팀" 목록은
// 별도 화면(팀 담당 에이전트가 구현 중인 /team)이라 선택 시 그쪽으로 이동만 시킨다.

interface CrewSummary {
  id: string;
  name: string;
  role?: "운영진" | "멤버";
  description: string;
  recruitPeriod?: string;
  genre: string;
  memberCount: number;
}

const MY_CREWS: CrewSummary[] = [
  {
    description: "좋아하는 음악으로 함께 무대를 만드는 모임",
    genre: "인디",
    id: "project-crew",
    memberCount: 11,
    name: "프로젝트 모임",
    recruitPeriod: "모집 2026.09.28까지 · 활동 10.03 ~ 11.15",
    role: "운영진",
  },
  {
    description: "매주 새로운 합주를 즐기는 자유 세션",
    genre: "록",
    id: "weekend-jam",
    memberCount: 3,
    name: "주말 잼 세션",
    role: "멤버",
  },
  {
    description: "작은 공연을 준비하는 어쿠스틱 모임",
    genre: "어쿠스틱",
    id: "acoustic-night",
    memberCount: 3,
    name: "어쿠스틱 나이트",
  },
];

function CrewListScreen() {
  const navigate = useNavigate();

  useScreenHeader(
    <div className="flex w-full items-center gap-3 px-5 py-2.5">
      <Typography
        as="h1"
        className="flex-1"
        color="semantic.label.normal"
        variant="title3"
        weight="bold"
      >
        모임
      </Typography>
      <button
        aria-label="모임 만들기"
        onClick={() => navigate("/crew/create/step1")}
        type="button"
      >
        <IconPlus className="size-6 text-label-normal" />
      </button>
    </div>,
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Tab
        onValueChange={(value) => {
          if (value === "team") {
            navigate("/team");
          }
        }}
        value="crew"
      >
        <TabList resize="fill" size="medium">
          <TabListItem value="crew">모임</TabListItem>
          <TabListItem value="team">팀</TabListItem>
        </TabList>
      </Tab>
      <div className="scrollbar-hidden flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 px-5 pt-5 pb-6">
          <Typography
            color="semantic.label.alternative"
            variant="body2"
            weight="regular"
          >
            모임은 공연을 운영하고, 팀은 함께 연주해요.
            <br />
            먼저 활동할 모임을 선택하세요.
          </Typography>
          <div className="flex items-center justify-between">
            <Typography
              color="semantic.label.alternative"
              variant="label2"
              weight="bold"
            >
              내 모임 {MY_CREWS.length}개
            </Typography>
            <button onClick={() => navigate("/crew/find")} type="button">
              <Typography
                color="semantic.primary.normal"
                variant="label2"
                weight="bold"
              >
                모임 찾기
              </Typography>
            </button>
          </div>
          {MY_CREWS.map((crew) => (
            <button
              className="flex flex-col gap-1 rounded-2xl border border-line-solid bg-surface p-4 text-left"
              key={crew.id}
              onClick={() => navigate(`/crew/${crew.id}`)}
              type="button"
            >
              <div className="flex items-center gap-1.5">
                <Typography
                  color="semantic.label.normal"
                  variant="body1"
                  weight="bold"
                >
                  {crew.name}
                </Typography>
                {crew.role === "운영진" && <Badge glow>운영진</Badge>}
                {crew.role === "멤버" && <Badge tone="outline">멤버</Badge>}
              </div>
              <Typography
                color="semantic.label.alternative"
                variant="label2"
                weight="medium"
              >
                {crew.description}
              </Typography>
              {crew.recruitPeriod && (
                <Typography
                  className="text-glow-sm"
                  color="semantic.primary.normal"
                  variant="caption1"
                  weight="bold"
                >
                  {crew.recruitPeriod}
                </Typography>
              )}
              <div className="flex items-center gap-2.5 pt-0.5">
                <div className="flex items-center gap-1">
                  <IconMusicMicrophone className="size-3.5 text-label-alternative" />
                  <Typography
                    color="semantic.label.alternative"
                    variant="label2"
                    weight="medium"
                  >
                    {crew.genre}
                  </Typography>
                </div>
                <div className="flex items-center gap-1">
                  <IconPersons className="size-3.5 text-label-alternative" />
                  <Typography
                    color="semantic.label.alternative"
                    variant="label2"
                    weight="medium"
                  >
                    {crew.memberCount}명
                  </Typography>
                </div>
              </div>
            </button>
          ))}
          <Button
            color="assistive"
            fullWidth
            onClick={() => navigate("/crew/create/step1")}
            size="large"
            sx={{ backgroundColor: "var(--color-surface)" }}
            variant="outlined"
          >
            모임 만들기
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CrewListScreen;
