import { WithInteraction } from "@wanteddev/wds";
import type { ReactNode } from "react";

// 목록의 카드(모임·팀·공고·공연 …) — 표면색 카드 + WDS `WithInteraction` 눌림 효과.
// 화면마다 rounded-2xl·rounded-[20px]·border 유무가 제각각이던 카드 모양을 여기 하나로 맞췄다.
// onClick이 없으면 누를 수 없는 정보 카드(div)로 그린다.
interface PressableCardProps {
  children: ReactNode;
  onClick?: () => void;
  /** 흐리게(마감된 공고 등) */
  dimmed?: boolean;
  "aria-label"?: string;
}

const CARD_CLASS =
  "flex w-full flex-col items-stretch gap-1.5 rounded-2xl border border-line-solid bg-surface p-4 text-left";

function PressableCard({
  "aria-label": ariaLabel,
  children,
  dimmed = false,
  onClick,
}: PressableCardProps) {
  const className = dimmed ? `${CARD_CLASS} opacity-60` : CARD_CLASS;

  if (onClick === undefined) {
    return <div className={className}>{children}</div>;
  }

  return (
    <WithInteraction variant="light">
      <button
        aria-label={ariaLabel}
        className={className}
        onClick={onClick}
        type="button"
      >
        {children}
      </button>
    </WithInteraction>
  );
}

export default PressableCard;
