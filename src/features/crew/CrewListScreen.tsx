import {
  Button,
  Tab,
  TabList,
  TabListItem,
  TextButton,
  TopNavigationButton,
  Typography,
} from "@wanteddev/wds";
import { IconLocation, IconPersons, IconPlus } from "@wanteddev/wds-icon";
import { useNavigate, useSearchParams } from "react-router-dom";

import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import MetaItem from "@/components/ui/MetaItem";
import PressableCard from "@/components/ui/PressableCard";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import TeamListPanel from "@/features/team/TeamListPanel";
import { GROUP_TYPE_LABEL, REGION_LABEL } from "@/lib/domain/labels";
import type { GroupRole } from "@/lib/domain/types";
import { getMyGroups } from "@/mocks/selectors";

// Figma: 모임/01 모임 목록 (101:18601) · 팀/01 팀 목록 (101:21220) — Bottom Nav "모임" 탭 루트.
// 두 Figma 화면은 같은 헤더 아래 "모임 | 팀" 탭만 다른 한 화면이다. 예전에는 /crew와 /team이
// 헤더·탭을 각자 그려서 탭을 누르면 화면 전체가 갈아끼워졌다(탭 크기도 서로 달랐다). 이제는 한
// 화면 안에서 패널만 바꾸고, 선택한 탭은 ?tab=으로 남겨 뒤로 와도 그대로 열린다.
type CrewTab = "crew" | "team";

function RoleBadge({ role }: { role: GroupRole }) {
  if (role === "OWNER") return <Badge glow>모임장</Badge>;
  if (role === "MANAGER") return <Badge>운영진</Badge>;
  return <Badge tone="outline">멤버</Badge>;
}

function CrewListPanel() {
  const navigate = useNavigate();
  const groups = getMyGroups();

  return (
    <div className="flex flex-col gap-4 px-5 pt-5 pb-8">
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
          내 모임 {groups.length}개
        </Typography>
        {/* 서버에 전체 모임 검색이 없다 — 모임은 공고·초대로만 들어간다(2026-10-29 결정). */}
        <TextButton
          color="primary"
          onClick={() => navigate("/board?type=group")}
          size="small"
        >
          모임 찾기
        </TextButton>
      </div>

      {groups.length === 0 ? (
        <EmptyState
          action={{
            label: "모임 모집 공고 보기",
            onClick: () => navigate("/board?type=group"),
          }}
          description="공고에 지원하거나 초대를 받으면 여기에 모임이 보여요."
          title="아직 함께하는 모임이 없어요"
        />
      ) : (
        groups.map((group) => (
          <PressableCard
            key={group.id}
            onClick={() => navigate(`/crew/${group.id}`)}
          >
            <div className="flex items-center gap-1.5">
              <Typography
                color="semantic.label.strong"
                variant="body1"
                weight="bold"
              >
                {group.name}
              </Typography>
              {group.myRole && <RoleBadge role={group.myRole} />}
            </div>
            <Typography
              color="semantic.label.alternative"
              variant="label2"
              weight="medium"
            >
              {group.description}
            </Typography>
            <div className="flex items-center gap-2.5">
              <MetaItem icon={<IconLocation />}>
                {REGION_LABEL[group.region]} · {GROUP_TYPE_LABEL[group.type]}
              </MetaItem>
              <MetaItem icon={<IconPersons />}>{group.memberCount}명</MetaItem>
            </div>
          </PressableCard>
        ))
      )}

      <Button
        color="assistive"
        fullWidth
        onClick={() => navigate("/crew/create/step1")}
        size="large"
        variant="outlined"
      >
        모임 만들기
      </Button>
    </div>
  );
}

function CrewListScreen() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab: CrewTab = searchParams.get("tab") === "team" ? "team" : "crew";

  useScreenHeader(
    <ScreenHeader
      title="모임"
      trailing={
        <TopNavigationButton
          aria-label={tab === "team" ? "팀 만들기" : "모임 만들기"}
          onClick={() =>
            navigate(
              tab === "team" ? "/team/create/type" : "/crew/create/step1",
            )
          }
        >
          <IconPlus />
        </TopNavigationButton>
      }
      variant="title"
    />,
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Tab
        onValueChange={(value) =>
          setSearchParams(value === "team" ? { tab: "team" } : {}, {
            replace: true,
          })
        }
        value={tab}
      >
        <TabList resize="fill" size="medium">
          <TabListItem value="crew">모임</TabListItem>
          <TabListItem value="team">팀</TabListItem>
        </TabList>
      </Tab>
      <div className="scrollbar-hidden flex-1 overflow-y-auto">
        {tab === "team" ? <TeamListPanel /> : <CrewListPanel />}
      </div>
    </div>
  );
}

export default CrewListScreen;
