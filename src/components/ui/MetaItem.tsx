import { Typography } from "@wanteddev/wds";
import type { ReactNode } from "react";

// 카드·히어로 아래의 "아이콘 + 짧은 정보"(📍 서울 · 👥 멤버 7명). 아이콘은 @wanteddev/wds-icon 컴포넌트를
// 넘긴다 — 크기·색은 여기서 맞춘다.
interface MetaItemProps {
  icon: ReactNode;
  children: ReactNode;
}

function MetaItem({ children, icon }: MetaItemProps) {
  return (
    <span className="flex min-w-0 items-center gap-1 text-label-assistive [&>svg]:size-3.5 [&>svg]:shrink-0">
      {icon}
      <Typography
        as="span"
        className="truncate"
        color="semantic.label.alternative"
        variant="label2"
        weight="medium"
      >
        {children}
      </Typography>
    </span>
  );
}

export default MetaItem;
