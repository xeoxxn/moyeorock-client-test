import { Typography } from "@wanteddev/wds";
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

interface BottomNavTab {
  value: BottomNavValue;
  label: string;
  Icon: typeof IconHome;
}

// Figma: Bottom Nav(홈 대시보드 nodeId 101:11659) — 선택 상태도 별도 Fill 아이콘이 아니라 같은
// 아이콘의 색(흰색 ↔ 회색)만 바뀐다. WDS `BottomNavigation`은 iOS 반투명 배경 + body 스크롤
// 기준 투명 전환 로직이 내장돼 있어(우리 레이아웃은 내부 스크롤이라 항상 오판) 쓰지 않고,
// Stream stream-client-web과 같은 이유로 로컬 컴포넌트로 새로 만들었다.
const TABS: BottomNavTab[] = [
  { Icon: IconHome, label: "홈", value: "home" },
  { Icon: IconCalendar, label: "일정", value: "schedule" },
  { Icon: IconPersons, label: "모임", value: "crew" },
  { Icon: IconDocument, label: "게시판", value: "board" },
  { Icon: IconPerson, label: "마이", value: "mine" },
];

function BottomNav({ value, onValueChange }: BottomNavProps) {
  return (
    <div className="flex w-full flex-col items-center border-line-neutral border-t bg-surface-elevated px-3 pt-2">
      <div className="flex h-[52px] w-full items-center justify-center">
        {TABS.map(({ value: tabValue, label, Icon }) => {
          const isSelected = tabValue === value;
          return (
            <button
              className="flex flex-1 flex-col items-center justify-center gap-1"
              key={tabValue}
              onClick={() => onValueChange(tabValue)}
              type="button"
            >
              <Icon
                className={
                  isSelected
                    ? "size-6 text-label-strong"
                    : "size-6 text-label-assistive"
                }
              />
              <Typography
                color={
                  isSelected
                    ? "semantic.label.strong"
                    : "semantic.label.assistive"
                }
                variant="caption2"
                weight={isSelected ? "bold" : "regular"}
              >
                {label}
              </Typography>
            </button>
          );
        })}
      </div>
      {/* iOS 홈 인디케이터 자리. 앱 WebView에서는 네이티브 세이프에어리어가 이미 확보해 줘서
          여기서 또 주면 여백이 두 번 들어간다. 홈 인디케이터가 없는 데스크톱 컬럼에서만
          Figma 스펙대로(812 프레임 기준 34px) 남긴다. */}
      <div className="h-safe-bottom w-full sm:h-[34px]" />
    </div>
  );
}

export default BottomNav;
