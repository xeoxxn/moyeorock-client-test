import { BottomNavigation, BottomNavigationItem } from "@wanteddev/wds";
import {
  IconCalendar,
  IconCalendarFill,
  IconDocument,
  IconDocumentFill,
  IconHome,
  IconHomeFill,
  IconPerson,
  IconPersonFill,
  IconPersons,
  IconPersonsFill,
} from "@wanteddev/wds-icon";

export type BottomNavValue = "home" | "schedule" | "crew" | "board" | "mine";

interface BottomNavProps {
  value: BottomNavValue;
  onValueChange: (value: BottomNavValue) => void;
}

// Figma 하단 탭(WDS Bottom Navigation, iOS) — 바탕은 bg/base 88% + 위쪽 흰 8% 선. 고른 탭은 채운 아이콘 +
// 흰색, 나머지는 text/tertiary.
//
// WDS 기본 동작 두 가지를 sx로 덮는다.
// 1. `data-scroll-end`: body 스크롤 끝에서 배경을 투명하게 바꾸는데, 이 앱은 화면 안쪽이 스크롤돼서
//    항상 "끝"으로 판정된다 → 배경·테두리를 그대로 유지시킨다.
// 2. 선택 탭 색: WDS 기본은 primary(주홍)지만 디자인은 흰색이다.
const TABS: {
  value: BottomNavValue;
  label: string;
  Icon: typeof IconHome;
  ActiveIcon: typeof IconHome;
}[] = [
  { ActiveIcon: IconHomeFill, Icon: IconHome, label: "홈", value: "home" },
  {
    ActiveIcon: IconCalendarFill,
    Icon: IconCalendar,
    label: "일정",
    value: "schedule",
  },
  {
    ActiveIcon: IconPersonsFill,
    Icon: IconPersons,
    label: "모임",
    value: "crew",
  },
  {
    ActiveIcon: IconDocumentFill,
    Icon: IconDocument,
    label: "게시판",
    value: "board",
  },
  {
    ActiveIcon: IconPersonFill,
    Icon: IconPerson,
    label: "마이",
    value: "mine",
  },
];

// 화면 전환 방향(오른쪽 탭으로 가면 forward)을 ScreenLayout이 이 순서로 계산한다.
export const BOTTOM_NAV_ORDER: BottomNavValue[] = TABS.map((tab) => tab.value);

const navSurface = {
  backgroundColor:
    "color-mix(in srgb, var(--color-background) 88%, transparent)",
  borderColor: "var(--color-line-neutral)",
};

function BottomNav({ value, onValueChange }: BottomNavProps) {
  return (
    <div className="w-full pb-safe-bottom backdrop-blur-xl">
      <BottomNavigation
        onValueChange={(next) => onValueChange(next as BottomNavValue)}
        sx={{
          ...navSurface,
          backdropFilter: "none",
          '&[data-scroll-end="true"]': navSurface,
        }}
        value={value}
      >
        {TABS.map(({ ActiveIcon, Icon, label, value: tabValue }) => (
          <BottomNavigationItem
            icon={tabValue === value ? <ActiveIcon /> : <Icon />}
            key={tabValue}
            label={label}
            sx={{
              color: "var(--color-label-assistive)",
              '&[aria-current="page"]': {
                color: "var(--color-label-strong)",
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
