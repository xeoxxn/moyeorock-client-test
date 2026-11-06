import { BottomNavigation, BottomNavigationItem } from "@wanteddev/wds";
import {
  IconCalendar,
  IconDocument,
  IconHome,
  IconPerson,
  IconPersons,
} from "@wanteddev/wds-icon";

export type BottomNavValue = "home" | "schedule" | "crew" | "board" | "mine";

interface BottomNavProps {
  value: BottomNavValue;
  onValueChange: (value: BottomNavValue) => void;
}

// Figma: Bottom Nav(홈 대시보드 nodeId 101:11659) — WDS `BottomNavigation`을 쓴다.
//
// WDS 기본 동작 두 가지만 sx로 덮는다.
// 1. `data-scroll-end`: body 스크롤이 끝나면 배경을 투명하게 바꾸는데, 이 앱은 body가 아니라
//    화면 안쪽이 스크롤돼서 항상 "끝"으로 판정된다 → 배경·테두리를 그대로 유지시킨다.
// 2. 선택 탭 색: WDS 기본은 primary(레드)지만 디자인은 흰색(label.strong)이다 — 레드는 강조에만 쓴다.
const TABS: { value: BottomNavValue; label: string; Icon: typeof IconHome }[] =
  [
    { Icon: IconHome, label: "홈", value: "home" },
    { Icon: IconCalendar, label: "일정", value: "schedule" },
    { Icon: IconPersons, label: "모임", value: "crew" },
    { Icon: IconDocument, label: "게시판", value: "board" },
    { Icon: IconPerson, label: "마이", value: "mine" },
  ];

// 화면 전환 방향(오른쪽 탭으로 가면 forward)을 ScreenLayout이 이 순서로 계산한다.
export const BOTTOM_NAV_ORDER: BottomNavValue[] = TABS.map((tab) => tab.value);

const navSurface = {
  backgroundColor: "var(--semantic-background-elevated-normal)",
  borderColor: "var(--semantic-line-normal-neutral)",
};

function BottomNav({ value, onValueChange }: BottomNavProps) {
  return (
    <div className="w-full bg-surface-elevated pb-safe-bottom">
      <BottomNavigation
        onValueChange={(next) => onValueChange(next as BottomNavValue)}
        sx={{
          ...navSurface,
          backdropFilter: "none",
          '&[data-scroll-end="true"]': navSurface,
        }}
        value={value}
      >
        {TABS.map(({ value: tabValue, label, Icon }) => (
          <BottomNavigationItem
            icon={<Icon />}
            key={tabValue}
            label={label}
            sx={{
              color: "var(--semantic-label-assistive)",
              '&[aria-current="page"]': {
                color: "var(--semantic-label-strong)",
              },
            }}
            value={tabValue}
          />
        ))}
      </BottomNavigation>
    </div>
  );
}

export default BottomNav;
