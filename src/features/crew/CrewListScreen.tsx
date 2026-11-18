import { List } from "@wanteddev/wds";
import { IconPlus } from "@wanteddev/wds-icon";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import ActionRow from "@/components/list/ActionRow";
import CoverRow from "@/components/list/CoverRow";
import { coverToneOf } from "@/components/music/Cover";
import EmptyState from "@/components/ui/EmptyState";
import HeaderIconButton from "@/components/ui/HeaderIconButton";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import {
  useScreenBackdrop,
  useScreenHeader,
} from "@/components/ui/useScreenHeader";
import { groupRowMeta } from "@/features/crew/components/crewHelpers";
import TeamListPanel from "@/features/team/TeamListPanel";
import { getMyGroups } from "@/mocks/selectors";

// Figma 03 모임(415:11771) — Bottom Nav "모임" 탭 루트. 헤더의 글자 탭 "모임 | 팀"으로 패널만 바꾸고,
// 고른 탭은 ?tab=team으로 남겨 상세에서 돌아와도 그대로 열린다(replace라 히스토리는 쌓이지 않는다).
// Figma의 검색 아이콘은 뺐다 — 서버에 전체 모임 검색이 없다(2026-10-29 결정). 모임·팀에 들어가는 길은
// 공고·초대라서 "찾아보기"는 게시판의 모집 탭으로 보낸다.
type CrewTab = "group" | "team";

const TABS: { value: CrewTab; label: string }[] = [
  { label: "모임", value: "group" },
  { label: "팀", value: "team" },
];

function GroupListPanel() {
  const navigate = useNavigate();
  const groups = getMyGroups();

  return (
    <>
      {groups.length === 0 && (
        <EmptyState description="공고에 지원하거나 초대를 받으면 여기에 모임이 보여요" />
      )}
      <List>
        {groups.map((group) => (
          <CoverRow
            key={group.id}
            meta={groupRowMeta(group)}
            onClick={() => navigate(`/crew/${group.id}`)}
            title={group.name}
            tone={coverToneOf("group", group.id)}
          />
        ))}
        <ActionRow
          icon="search"
          meta="지역·장르로 맞는 모임을 찾아요"
          onClick={() => navigate("/board?type=group")}
          title="모임 찾아보기"
        />
      </List>
    </>
  );
}

function CrewListScreen() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab: CrewTab = searchParams.get("tab") === "team" ? "team" : "group";

  useScreenHeader(
    useMemo(
      () => (
        <ScreenHeader
          onValueChange={(value) =>
            setSearchParams(value === "team" ? { tab: "team" } : {}, {
              replace: true,
            })
          }
          tabs={TABS}
          trailing={
            <HeaderIconButton
              icon={<IconPlus />}
              label={tab === "team" ? "팀 만들기" : "모임 만들기"}
              onClick={() =>
                navigate(tab === "team" ? "/team/create/type" : "/crew/new")
              }
            />
          }
          value={tab}
          variant="tabs"
        />
      ),
      [navigate, setSearchParams, tab],
    ),
  );
  useScreenBackdrop("stage");

  return (
    <ScreenBody className="pt-2">
      {tab === "team" ? <TeamListPanel /> : <GroupListPanel />}
    </ScreenBody>
  );
}

export default CrewListScreen;
