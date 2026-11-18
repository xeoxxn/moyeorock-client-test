import { Typography, WithInteraction } from "@wanteddev/wds";
import { IconCheck } from "@wanteddev/wds-icon";

import Cover, { PART_COVER_TONE } from "@/components/music/Cover";
import { cn } from "@/lib/cn";
import { INSTRUMENT_LABEL } from "@/lib/domain/labels";
import type { Instrument } from "@/lib/domain/types";

// Figma "Session Tile"(553:23084) — 온보딩·세션 수정의 파트 고르기 타일: 파트 커버 + 체크 + 이름.
// 3열 같은 폭으로 둔다(폭이 제각각인 칩이 꺾이는 건 사용자가 싫어한다). 안 고른 타일은 흐리게.
interface SessionTileProps {
  instrument: Instrument;
  selected: boolean;
  onToggle: () => void;
}

function SessionTile({ instrument, onToggle, selected }: SessionTileProps) {
  return (
    <WithInteraction variant="light">
      <button
        aria-pressed={selected}
        className="flex min-w-0 flex-col gap-2 text-left"
        onClick={onToggle}
        type="button"
      >
        <span className="relative">
          <Cover
            className={cn(
              "aspect-square w-full rounded-lg transition-opacity",
              !selected && "opacity-45",
            )}
            part={instrument}
            tone={PART_COVER_TONE[instrument]}
          />
          {selected && (
            <span className="absolute top-2 right-2 flex size-6.5 items-center justify-center rounded-full bg-label-strong">
              <IconCheck className="size-4 text-background" />
            </span>
          )}
        </span>
        <Typography
          as="span"
          color={
            selected ? "semantic.label.strong" : "semantic.label.alternative"
          }
          variant="label1"
          weight="medium"
        >
          {INSTRUMENT_LABEL[instrument]}
        </Typography>
      </button>
    </WithInteraction>
  );
}

export default SessionTile;
