import { TopNavigationButton } from "@wanteddev/wds";
import type { ReactNode } from "react";

// Figma "Header/Icon Button"(554:23340) — 상단 바 오른쪽 아이콘(알림·추가·검색·설정·더보기) + 알림 점.
interface HeaderIconButtonProps {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  /** 안 읽은 알림 점 */
  dot?: boolean;
}

function HeaderIconButton({
  dot = false,
  icon,
  label,
  onClick,
}: HeaderIconButtonProps) {
  return (
    <TopNavigationButton aria-label={label} onClick={onClick}>
      <span className="relative flex">
        {icon}
        {dot && (
          <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-accent" />
        )}
      </span>
    </TopNavigationButton>
  );
}

export default HeaderIconButton;
