import { Tab, TabList, TabListItem } from "@wanteddev/wds";
import { useNavigate } from "react-router-dom";
import { canManagePerformance } from "@/features/show/performanceAccess";
import type { Performance } from "@/lib/domain/types";

export type ShowSection = "info" | "manage";

const SECTION_PATH: Record<ShowSection, (showId: number) => string> = {
  info: (showId) => `/show/${showId}`,
  manage: (showId) => `/show/${showId}/manage`,
};

interface ShowSectionTabBarProps {
  performance: Performance;
  active: ShowSection;
}

// 공연 정보 | 관리 탭. 두 화면은 별도 라우트라 Tab 값 전환을 라우팅으로 잇고, replace로 바꿔서 탭을
// 오가도 뒤로가기 한 번이면 공연에 들어오기 전 화면으로 돌아간다. "관리"는 모임장(서버 canEdit)만
// 쓸 수 있어서, 모임장이 아니면 탭이 "공연 정보" 하나뿐이라 탭 바를 아예 그리지 않는다.
function ShowSectionTabBar({ active, performance }: ShowSectionTabBarProps) {
  const navigate = useNavigate();

  if (!canManagePerformance(performance)) return null;

  return (
    <Tab
      onValueChange={(next) => {
        if (next === active) return;
        navigate(SECTION_PATH[next as ShowSection](performance.id), {
          replace: true,
        });
      }}
      value={active}
    >
      <TabList resize="fill" size="medium">
        <TabListItem value="info">공연 정보</TabListItem>
        <TabListItem value="manage">관리</TabListItem>
      </TabList>
    </Tab>
  );
}

export default ShowSectionTabBar;
