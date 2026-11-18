import { Chip, Typography } from "@wanteddev/wds";

import FieldLabel from "@/components/ui/FieldLabel";

// 고르는 칩 묶음(Figma 21 "팀" · 24 "모집 세션") — 같은 폭 3열(폭이 제각각인 칩이 꺾이면 들쭉날쭉해
// 보인다). WDS Chip(solid)이고 고른 칩은 흰 바탕(WDS inverse), 안 고른 칩은 카드색 바탕 + 보조 글자다.
// 세션·장르·지역처럼 폼에서 값을 고를 때 쓴다. label을 주면 위에 필드 제목(FieldLabel)을 붙인다.
export interface ChipGridOption<T extends string> {
  value: T;
  label: string;
}

interface ChipGridProps<T extends string> {
  options: ChipGridOption<T>[];
  isSelected: (value: T) => boolean;
  onToggle: (value: T) => void;
  isDisabled?: (value: T) => boolean;
  label?: string;
  /** 아래 안내 문구(예: "여러 개 고를 수 있어요") */
  message?: string;
}

const CHIP_SX = {
  "&:not([data-active='true']):not(:disabled)": {
    backgroundColor: "var(--color-surface)",
    color: "var(--color-label-alternative)",
  },
  width: "100%",
};

function ChipGrid<T extends string>({
  isDisabled,
  isSelected,
  label,
  message,
  onToggle,
  options,
}: ChipGridProps<T>) {
  const grid = (
    <div className="grid grid-cols-3 gap-2">
      {options.map((option) => (
        <Chip
          active={isSelected(option.value)}
          disabled={isDisabled?.(option.value) ?? false}
          key={option.value}
          onClick={() => onToggle(option.value)}
          size="medium"
          sx={CHIP_SX}
          variant="solid"
        >
          {option.label}
        </Chip>
      ))}
    </div>
  );

  if (label === undefined && message === undefined) return grid;
  return (
    <div className="flex flex-col gap-2">
      {label !== undefined && <FieldLabel>{label}</FieldLabel>}
      {grid}
      {message !== undefined && (
        <Typography color="semantic.label.assistive" variant="caption1">
          {message}
        </Typography>
      )}
    </div>
  );
}

export default ChipGrid;
