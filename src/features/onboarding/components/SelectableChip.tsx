import { Typography } from "@wanteddev/wds";

interface SelectableChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

// Figma "Chip"(예: nodeId 101:11428 세션 선택, 101:11443 실력 선택, 101:11481 장르 선택) — 선택 시
// accent 16% 배경 + accent 테두리 + accent bold, 비선택 시 surface 배경 + 중립 테두리.
// stream-client-web에서도 비슷한 필터 칩이 WDS `Chip`과 스타일이 달라 로컬로 만든 전례가 있다
// (docs/conventions/wds-component-usage.md 4번 규칙).
function SelectableChip({ label, selected, onClick }: SelectableChipProps) {
  return (
    <button
      className={
        selected
          ? "rounded-xl border border-accent bg-accent-subtle px-4 py-2.5"
          : "rounded-xl border border-line-solid bg-surface px-4 py-2.5"
      }
      onClick={onClick}
      type="button"
    >
      <Typography
        color={
          selected ? "semantic.primary.normal" : "semantic.label.alternative"
        }
        variant="body2"
        weight={selected ? "bold" : "medium"}
      >
        {label}
      </Typography>
    </button>
  );
}

export default SelectableChip;
