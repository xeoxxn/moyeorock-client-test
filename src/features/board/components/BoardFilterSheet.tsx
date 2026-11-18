import { ActionArea, ActionAreaButton } from "@wanteddev/wds";

import BottomSheet from "@/components/ui/BottomSheet";
import ChipGrid from "@/components/ui/ChipGrid";
import FieldLabel from "@/components/ui/FieldLabel";
import SelectField from "@/components/ui/SelectField";
import {
  INSTRUMENT_LABEL,
  INSTRUMENT_OPTIONS,
  REGION_LABEL,
  REGION_OPTIONS,
} from "@/lib/domain/labels";
import type { Instrument, Region } from "@/lib/domain/types";

// 게시판 필터 시트 — 서버 공고 목록 쿼리(region · instrument, 둘 다 하나씩·선택)를 그대로 고른다.
// 지역은 시·도 단위, 세션은 하나만(다시 누르면 "모든 세션"). 적용을 눌러야 목록이 바뀐다.
export interface BoardFilter {
  region: Region | "ALL";
  instrument: Instrument | null;
}

export const ALL_REGIONS_LABEL = "전국";
export const ALL_INSTRUMENTS_LABEL = "모든 세션";

const REGION_CHOICES: { value: Region | "ALL"; label: string }[] = [
  { label: ALL_REGIONS_LABEL, value: "ALL" },
  ...REGION_OPTIONS.map((region) => ({
    label: REGION_LABEL[region],
    value: region,
  })),
];

const INSTRUMENT_CHOICES = INSTRUMENT_OPTIONS.map((item) => ({
  label: INSTRUMENT_LABEL[item],
  value: item,
}));

/** 서울 · 모든 세션 */
export function formatBoardFilter(filter: BoardFilter): string {
  return [
    filter.region === "ALL" ? ALL_REGIONS_LABEL : REGION_LABEL[filter.region],
    filter.instrument
      ? INSTRUMENT_LABEL[filter.instrument]
      : ALL_INSTRUMENTS_LABEL,
  ].join(" · ");
}

interface BoardFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 시트 안에서 고르는 중인 값 */
  draft: BoardFilter;
  onDraftChange: (draft: BoardFilter) => void;
  onApply: () => void;
  onReset: () => void;
}

function BoardFilterSheet({
  draft,
  onApply,
  onDraftChange,
  onOpenChange,
  onReset,
  open,
}: BoardFilterSheetProps) {
  return (
    <BottomSheet
      footer={
        <ActionArea variant="neutral">
          <ActionAreaButton onClick={onReset} variant="alternative">
            초기화
          </ActionAreaButton>
          <ActionAreaButton
            onClick={() => {
              onApply();
              onOpenChange(false);
            }}
            variant="main"
          >
            적용
          </ActionAreaButton>
        </ActionArea>
      }
      onOpenChange={onOpenChange}
      open={open}
      title="필터"
    >
      <div className="flex flex-col gap-6 pb-2">
        <SelectField
          label="지역"
          onChange={(region) => onDraftChange({ ...draft, region })}
          options={REGION_CHOICES}
          value={draft.region}
        />
        <div className="flex flex-col gap-3">
          <FieldLabel>세션</FieldLabel>
          <ChipGrid
            isSelected={(item) => item === draft.instrument}
            onToggle={(item) =>
              onDraftChange({
                ...draft,
                instrument: item === draft.instrument ? null : item,
              })
            }
            options={INSTRUMENT_CHOICES}
          />
        </div>
      </div>
    </BottomSheet>
  );
}

export default BoardFilterSheet;
