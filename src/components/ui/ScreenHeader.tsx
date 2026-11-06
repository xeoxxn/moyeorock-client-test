import { TopNavigation, TopNavigationButton } from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

// 모든 화면의 상단 바 — 전부 WDS `TopNavigation`이다. 화면은 이 컴포넌트만 쓰고 TopNavigation이나
// 뒤로가기 버튼을 직접 만들지 않는다(예전에는 화면마다 <button><IconChevronLeft/></button>를 손으로
// 깔아서 크기·여백이 제각각이었다). trailing에는 WDS `TopNavigationButton`을 넘긴다.
type ScreenHeaderProps =
  | {
      // 홈 — 워드마크 로고가 본문 히어로로 내려가 있어 헤더에는 오른쪽 아이콘만 남는다.
      variant: "home";
      trailing?: ReactNode;
    }
  | {
      // 탭 루트(일정·모임·게시판·마이) — 뒤로가기 없이 큰 제목. WDS `display` 변형.
      variant: "title";
      title: string;
      trailing?: ReactNode;
    }
  | {
      // 하위 화면 — 뒤로가기 + 가운데 제목. onBack을 안 주면 브라우저 히스토리로 돌아간다.
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

function ScreenHeader(props: ScreenHeaderProps) {
  if (props.variant === "home") {
    return (
      <TopNavigation
        background={false}
        trailingContent={props.trailing}
        variant="normal"
      />
    );
  }

  if (props.variant === "title") {
    return (
      <TopNavigation
        background={false}
        trailingContent={props.trailing}
        variant="display"
      >
        {props.title}
      </TopNavigation>
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
