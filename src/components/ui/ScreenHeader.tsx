import { TopNavigation, Typography } from "@wanteddev/wds";
import type { ReactNode } from "react";

import mascotFlag from "@/assets/mascot/flag.png";

type ScreenHeaderProps =
  | {
      // 홈 등 최상위 탭 화면의 로고 헤더(Figma "Top Bar", nodeId 101:11537) — WDS 인스턴스가 아니라
      // Stream 로컬 컴포넌트와 같은 방식의 모여락 전용 로컬 마크업이다. 뒤로가기가 없다.
      variant: "logo";
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
  if (props.variant === "logo") {
    return (
      <div className="flex w-full items-center gap-2 px-5 py-1.5">
        <img alt="" className="size-[30px]" src={mascotFlag} />
        <Typography
          as="p"
          className="text-glow-sm"
          color="semantic.label.strong"
          variant="headline1"
          weight="bold"
        >
          모여락
        </Typography>
        <div className="flex-1" />
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
