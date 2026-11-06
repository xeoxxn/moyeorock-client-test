import { Tab, TabList, TabListItem } from "@wanteddev/wds";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import GroupHero from "@/features/crew/components/GroupHero";
import type { Group } from "@/lib/domain/types";

export type CrewTabValue = "home" | "show" | "members" | "manage";

const TAB_PATH: Record<CrewTabValue, (crewId: number) => string> = {
  home: (crewId) => `/crew/${crewId}`,
  manage: (crewId) => `/crew/${crewId}/manage`,
  members: (crewId) => `/crew/${crewId}/members`,
  show: (crewId) => `/crew/${crewId}/show`,
};

interface CrewHeroTabsProps {
  group: Group;
  active: CrewTabValue;
}

// 모임/02 홈 · 03 공연 · 05 멤버 · 06 관리가 공유하는 헤더 + 히어로 + 탭. 예전에는 네 화면이 이 마크업을
// 각자 복제해서(모임 이름·인원도 상수로) 들고 있었다. 탭은 화면 안 패널이 아니라 실제 라우트라 replace로
// 바꾼다 — 탭을 몇 번 오가도 뒤로가기 한 번이면 모임에 들어오기 전 화면으로 돌아간다.
// 관리 탭은 모임장에게만 보인다(서버: 모임 수정·해체·가입 승인·공지는 모임장 권한).
// 헤더의 검색 아이콘은 뺐다 — 서버에 전체 모임 검색이 없어 갈 곳이 없다.
function CrewHeroTabs({ active, group }: CrewHeroTabsProps) {
  const navigate = useNavigate();

  useScreenHeader(<ScreenHeader />);

  return (
    <>
      <GroupHero group={group} />
      <Tab
        onValueChange={(value) => {
          if (value === active) return;
          navigate(TAB_PATH[value as CrewTabValue](group.id), {
            replace: true,
          });
        }}
        value={active}
      >
        <TabList horizontalPadding resize="hug" size="medium">
          <TabListItem value="home">홈</TabListItem>
          <TabListItem value="show">공연</TabListItem>
          <TabListItem value="members">멤버</TabListItem>
          {group.myRole === "OWNER" && (
            <TabListItem value="manage">관리</TabListItem>
          )}
        </TabList>
      </Tab>
    </>
  );
}

export default CrewHeroTabs;
