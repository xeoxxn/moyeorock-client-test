import {
  Tab,
  TabList,
  TabListItem,
  TopNavigation,
  TopNavigationButton,
} from "@wanteddev/wds";
import { IconChevronLeft, IconClose } from "@wanteddev/wds-icon";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { BrandLogo } from "@/components/music/Brand";

// 모든 화면의 상단 바 — WDS TopNavigation(+ TopNavigationButton). 화면은 이 컴포넌트만 쓰고 뒤로가기·
// 제목을 직접 만들지 않는다.
// - home: 홈 — 왼쪽 가로 로고(높이 24) + 오른쪽 아이콘(알림)
// - title: Figma "Header/Page"(554:23482) — 탭 루트의 큰 제목(22 Bold) + 오른쪽 아이콘(일정·마이)
// - tabs: 모임·게시판 — 제목 대신 WDS Tab(Hug · Large) 글자 탭 "모임 | 팀" + 오른쪽 아이콘
// - normal: 하위 화면 — 뒤로가기 + 가운데 제목(없으면 비움) + 오른쪽(더보기 등)
// - close: 흐름의 끝(09 가입 완료) — 뒤로가기 없이 오른쪽 닫기만
type ScreenHeaderProps =
  | { variant: "close"; onClose: () => void }
  | { variant: "home"; trailing?: ReactNode }
  | { variant: "title"; title: string; trailing?: ReactNode }
  | {
      variant: "tabs";
      tabs: { value: string; label: string }[];
      value: string;
      onValueChange: (value: string) => void;
      trailing?: ReactNode;
    }
  | {
      variant?: "normal";
      title?: string;
      trailing?: ReactNode;
      onBack?: () => void;
    };

function BackButton({ onBack }: { onBack?: () => void }) {
  const navigate = useNavigate();
  return (
    <TopNavigationButton
      aria-label="뒤로 가기"
      onClick={onBack ?? (() => navigate(-1))}
    >
      <IconChevronLeft />
    </TopNavigationButton>
  );
}

// 탭 루트 제목은 22 Bold(Figma Title). WDS display 변형은 24라서 제목 크기만 덮는다.
const pageTitleSx = {
  "& [data-role='navigation-title'] h2": {
    fontSize: "1.375rem",
    lineHeight: "1.875rem",
  },
};

function ScreenHeader(props: ScreenHeaderProps) {
  if (props.variant === "home") {
    return (
      <TopNavigation
        background={false}
        leadingContent={<BrandLogo className="h-6" />}
        trailingContent={props.trailing}
        variant="normal"
      />
    );
  }

  if (props.variant === "close") {
    return (
      <TopNavigation
        background={false}
        trailingContent={
          <TopNavigationButton aria-label="닫기" onClick={props.onClose}>
            <IconClose />
          </TopNavigationButton>
        }
        variant="normal"
      />
    );
  }

  if (props.variant === "title") {
    return (
      <TopNavigation
        background={false}
        sx={pageTitleSx}
        trailingContent={props.trailing}
        variant="display"
      >
        {props.title}
      </TopNavigation>
    );
  }

  if (props.variant === "tabs") {
    return (
      <div className="flex items-center justify-between pr-2.5 pl-5">
        <Tab onValueChange={props.onValueChange} value={props.value}>
          <TabList
            horizontalPadding={false}
            resize="hug"
            size="large"
            sx={{
              "& [wds-component='tab-list-item']": {
                color: "var(--color-label-assistive)",
                fontSize: "1.375rem",
              },
              "& [wds-component='tab-list-item'][aria-selected='true']": {
                color: "var(--color-label-strong)",
              },
              // 글자 탭 — 밑줄(움직이는 막대)·아래 구분선 없이 글자 밝기로만 고른 탭을 보인다. WDS 스타일이
              // 같은 선택자로 뒤에 붙고, 움직이는 막대는 탭을 바꿀 때 JS가 인라인 스타일을 다시 넣어서
              // && 로 우선순위를 올리고 !important를 쓴다.
              "&&::after": { display: "none" },
              "&& [data-role='tab-motion'], && [data-role='tab-list-item-divider']":
                { display: "none !important" },
            }}
          >
            {props.tabs.map((tab) => (
              <TabListItem key={tab.value} value={tab.value}>
                {tab.label}
              </TabListItem>
            ))}
          </TabList>
        </Tab>
        <div className="flex items-center">{props.trailing}</div>
      </div>
    );
  }

  return (
    <TopNavigation
      background={false}
      leadingContent={<BackButton onBack={props.onBack} />}
      trailingContent={props.trailing}
      variant="normal"
    >
      {props.title}
    </TopNavigation>
  );
}

export default ScreenHeader;
