import { Tab, TabList, TabListItem } from "@wanteddev/wds";
import { useNavigate } from "react-router-dom";

// 팀·모임 상세의 히어로 아래 탭(WDS Tab · Fill · Medium) — 팀 "홈 · 합주 · 선택곡 · 멤버",
// 모임 "홈 · 공연 · 멤버". 탭마다 라우트가 있어 누르면 그 경로로 replace 이동한다(뒤로가기 한 번이면
// 들어오기 전 화면으로 돌아간다).
export interface HeroTab {
  value: string;
  label: string;
  path: string;
}

interface HeroTabsProps {
  tabs: HeroTab[];
  value: string;
}

function HeroTabs({ tabs, value }: HeroTabsProps) {
  const navigate = useNavigate();
  return (
    <Tab
      onValueChange={(next) => {
        const tab = tabs.find((item) => item.value === next);
        if (tab && next !== value) navigate(tab.path, { replace: true });
      }}
      value={value}
    >
      <TabList resize="fill" size="medium">
        {tabs.map((tab) => (
          <TabListItem key={tab.value} value={tab.value}>
            {tab.label}
          </TabListItem>
        ))}
      </TabList>
    </Tab>
  );
}

export default HeroTabs;
