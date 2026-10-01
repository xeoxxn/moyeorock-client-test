import { TopNavigation, Typography } from "@wanteddev/wds";
import type { ReactNode } from "react";

type ScreenHeaderProps =
  | {
      // 홈 등 최상위 탭 화면의 상단 바(Figma "Top Bar", nodeId 101:11537) — 뒤로가기가 없다.
      // Figma 원안은 "작은 마스코트 + 모여락 텍스트"였지만, 워드마크 로고를 크게 쓰기로 해서
      // (사용자 요청) 로고는 본문 히어로로 내려갔다. 헤더는 스크롤되지 않고 늘 자리를 차지하므로
      // 여기에 큰 로고를 두면 본문이 그만큼 영영 줄어든다 — 그래서 아이콘만 남긴다.
      variant: "home";
      trailing?: ReactNode;
    }
  | {
      // 일정/게시판처럼 뒤로가기 없는 탭 루트지만 로고 대신 큰 타이틀을 쓰는 화면(Figma "Top Bar",
      // nodeId 101:12495, 101:24189) — 24px bold + trailing 아이콘. WDS 인스턴스가 아니라
      // 로고 변형과 같은 방식의 로컬 마크업이다.
      variant: "title";
      title: string;
      trailing?: ReactNode;
    }
  | {
      // 하위 화면의 뒤로가기 헤더 — WDS `TopNavigation`을 그대로 쓴다.
      variant?: "normal";
      title?: string;
      leading?: ReactNode;
      trailing?: ReactNode;
    };

function ScreenHeader(props: ScreenHeaderProps) {
  if (props.variant === "home") {
    return (
      <div className="flex h-10 w-full items-center justify-end gap-4 px-5">
        {props.trailing}
      </div>
    );
  }

  if (props.variant === "title") {
    return (
      <div className="flex h-14 w-full items-center gap-3 px-5">
        <Typography
          as="h1"
          className="flex-1"
          color="semantic.label.normal"
          variant="title3"
          weight="bold"
        >
          {props.title}
        </Typography>
        {props.trailing !== undefined && (
          <div className="flex shrink-0 items-center gap-4">
            {props.trailing}
          </div>
        )}
      </div>
    );
  }

  return (
    <TopNavigation
      background={false}
      leadingContent={props.leading}
      trailingContent={props.trailing}
      variant="normal"
    >
      {props.title !== undefined && (
        <Typography
          as="h2"
          color="semantic.label.strong"
          variant="headline1"
          weight="bold"
        >
          {props.title}
        </Typography>
      )}
    </TopNavigation>
  );
}

export default ScreenHeader;
