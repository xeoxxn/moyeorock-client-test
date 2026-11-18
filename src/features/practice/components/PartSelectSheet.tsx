import { List, ListCell, Typography } from "@wanteddev/wds";
import { IconCheck } from "@wanteddev/wds-icon";

import BottomSheet from "@/components/ui/BottomSheet";
import { rowClick } from "@/components/ui/listCellEvents";
import { INSTRUMENT_LABEL, INSTRUMENT_OPTIONS } from "@/lib/domain/labels";
import type { Instrument } from "@/lib/domain/types";

// Figma 25 파트 선택 시트(508:21196) — 녹음한 세션 하나를 고른다. 프로필에 등록한 내 세션엔 작은
// "내 세션"을 붙이고, 고른 것엔 체크. 고르면 바로 닫힌다.
interface PartSelectSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: Instrument | null;
  myParts: Instrument[];
  onSelect: (part: Instrument) => void;
}

function PartSelectSheet({
  myParts,
  onOpenChange,
  onSelect,
  open,
  value,
}: PartSelectSheetProps) {
  return (
    <BottomSheet onOpenChange={onOpenChange} open={open} title="내 파트">
      {/* 시트 안 여백(20px)과 행 여백(fillWidth 20px)이 겹치지 않게 행을 시트 끝까지 편다. WDS List의
          margin이 Tailwind 클래스를 이겨서 당기는 건 감싼 div가 맡는다. */}
      <div className="-mx-5">
        <List>
          {INSTRUMENT_OPTIONS.map((part) => {
            const selected = part === value;
            return (
              <ListCell
                fillWidth
                key={part}
                onClick={rowClick(() => {
                  onSelect(part);
                  onOpenChange(false);
                })}
                sx={{ paddingBlock: "0.75rem" }}
                trailingContent={
                  selected ? (
                    <IconCheck className="size-5 text-label-strong" />
                  ) : undefined
                }
                verticalPadding="none"
              >
                <span className="flex items-center gap-1.5">
                  <Typography
                    as="span"
                    color="semantic.label.strong"
                    variant="body1"
                    weight={selected ? "bold" : "regular"}
                  >
                    {INSTRUMENT_LABEL[part]}
                  </Typography>
                  {myParts.includes(part) && (
                    <Typography
                      as="span"
                      color="semantic.label.assistive"
                      variant="caption1"
                      weight="medium"
                    >
                      내 세션
                    </Typography>
                  )}
                </span>
              </ListCell>
            );
          })}
        </List>
      </div>
    </BottomSheet>
  );
}

export default PartSelectSheet;
