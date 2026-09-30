import { Tab, TabList, TabListItem } from "@wanteddev/wds";
import { useNavigate } from "react-router-dom";

export type ShowSection = "info" | "manage";

interface ShowSectionTabBarProps {
  showId: string;
  active: ShowSection;
}

// Figma 공연/01 공연 정보(101:23690)·공연/02 공연 관리(101:23868)가 공유하는 상단 탭 바
// (Tab/Tab). 두 화면은 콘텐츠가 크게 달라(하나는 열람용, 하나는 모임 관리자 전용 편집 폼)
// 별도 라우트(`/show/:showId`, `/show/:showId/manage`)로 만들었다 — 그래서 WDS Tab의 값 전환을
// TabPanel 마운트가 아니라 라우팅으로 연결한다. 탭 바 시각 요소만 재사용하고 TabPanel은 쓰지 않는다.
function ShowSectionTabBar({ showId, active }: ShowSectionTabBarProps) {
  const navigate = useNavigate();

  return (
    <Tab
      onValueChange={(next) =>
        navigate(
          next === "manage" ? `/show/${showId}/manage` : `/show/${showId}`,
          { replace: true },
        )
      }
      value={active}
    >
      <TabList resize="fill" size="medium">
        <TabListItem value="info">공연 정보</TabListItem>
        <TabListItem value="manage">공연 관리</TabListItem>
      </TabList>
    </Tab>
  );
}

export default ShowSectionTabBar;
