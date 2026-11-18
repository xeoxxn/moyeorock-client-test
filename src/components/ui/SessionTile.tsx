import { Typography, WithInteraction } from "@wanteddev/wds";
import { IconCheck } from "@wanteddev/wds-icon";

import Cover, { PART_COVER_TONE } from "@/components/music/Cover";
import { cn } from "@/lib/cn";
import { INSTRUMENT_LABEL, LEVEL_LABEL } from "@/lib/domain/labels";
import type { Instrument, Level } from "@/lib/domain/types";

// Figma "Session Tile"(553:23084) — 파트 커버(Vocal · Electric Guitar …) + 세션 이름(14) + 실력 한 줄
// (13 secondary). 3열 같은 폭 격자로 둔다(폭이 제각각인 칩이 꺾이는 건 사용자가 싫어한다).
// - 보여 주기: 07 마이 "내 세션" · 23 멤버 프로필 "세션" — level을 넘기면 실력 줄이 나온다.
// - 고르기: 22 온보딩 · 세션 수정 — onToggle을 넘기면 버튼이 되고, 안 고른 타일은 흐리게, 고른
//   타일엔 체크. 22에선 실력 줄을 숨긴다(level을 넘기지 않는다).
interface SessionTileProps {
  instrument: Instrument;
  /** 실력 한 줄 — 넘기지 않으면 숨긴다 */
  level?: Level;
  /** 고르기 타일일 때 고른 상태 */
  selected?: boolean;
  /** 넘기면 고르기 타일(버튼)이 된다 */
  onToggle?: () => void;
}

function SessionTile({
  instrument,
  level,
  onToggle,
  selected = false,
}: SessionTileProps) {
  const selectable = onToggle !== undefined;
  const dimmed = selectable && !selected;

  const content = (
    <>
      <span className="relative">
        <Cover
          className={cn(
            "aspect-square w-full rounded-lg transition-opacity",
            dimmed && "opacity-45",
          )}
          part={instrument}
          tone={PART_COVER_TONE[instrument]}
        />
        {selectable && selected && (
          <span className="absolute top-2 right-2 flex size-6.5 items-center justify-center rounded-full bg-label-strong">
            <IconCheck className="size-4 text-background" />
          </span>
        )}
      </span>
      <Typography
        as="span"
        color={dimmed ? "semantic.label.alternative" : "semantic.label.strong"}
        variant="label1"
        weight="medium"
      >
        {INSTRUMENT_LABEL[instrument]}
      </Typography>
      {level && (
        <Typography
          as="span"
          color="semantic.label.alternative"
          variant="label2"
        >
          {LEVEL_LABEL[level]}
        </Typography>
      )}
    </>
  );

  if (!selectable) {
    return <div className="flex min-w-0 flex-col gap-2">{content}</div>;
  }
  return (
    <WithInteraction variant="light">
      <button
        aria-pressed={selected}
        className="flex min-w-0 flex-col gap-2 text-left"
        onClick={onToggle}
        type="button"
      >
        {content}
      </button>
    </WithInteraction>
  );
}

export default SessionTile;
