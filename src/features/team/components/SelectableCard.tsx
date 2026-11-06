import { WithInteraction } from "@wanteddev/wds";
import type { ReactNode } from "react";

// 하나만 고르는 큰 카드(팀 종류 · 참가할 공연). PressableCard와 같은 표면 카드에 선택 상태
// (레드 테두리 + 옅은 레드 배경)만 더했다 — 공통 PressableCard에 selected가 없어 팀 폴더에 둔다.
interface SelectableCardProps {
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
}

function SelectableCard({ children, onSelect, selected }: SelectableCardProps) {
  return (
    <WithInteraction variant="light">
      <button
        aria-pressed={selected}
        className={
          selected
            ? "flex w-full flex-col items-stretch gap-1.5 rounded-2xl border border-accent bg-accent-subtle p-5 text-left"
            : "flex w-full flex-col items-stretch gap-1.5 rounded-2xl border border-line-solid bg-surface p-5 text-left"
        }
        onClick={onSelect}
        type="button"
      >
        {children}
      </button>
    </WithInteraction>
  );
}

export default SelectableCard;
