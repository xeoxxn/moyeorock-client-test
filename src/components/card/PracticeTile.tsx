import { Typography, WithInteraction } from "@wanteddev/wds";

import Cover, { PART_COVER_TONE } from "@/components/music/Cover";
import NowPlaying from "@/components/music/NowPlaying";
import type { Instrument } from "@/lib/domain/types";

// Figma "Card/Practice Tile"(553:23920) — 홈 '다시 듣기' 선반의 연습 녹음 타일: 큰 파트 커버 + 곡 이름
// (14 Medium) + (재생 중) 파트 · 상태.
interface PracticeTileProps {
  part: Instrument;
  title: string;
  meta: string;
  playing?: boolean;
  onClick: () => void;
}

function PracticeTile({
  meta,
  onClick,
  part,
  playing = false,
  title,
}: PracticeTileProps) {
  return (
    <WithInteraction variant="light">
      <button
        className="flex w-33 shrink-0 flex-col gap-2 text-left"
        onClick={onClick}
        type="button"
      >
        <Cover
          className="aspect-square w-full rounded-lg"
          part={part}
          tone={PART_COVER_TONE[part]}
        />
        <span className="flex flex-col">
          <Typography
            as="span"
            className="truncate"
            color="semantic.label.strong"
            variant="label1"
            weight="medium"
          >
            {title}
          </Typography>
          <span className="flex items-center gap-1.5">
            {playing && <NowPlaying />}
            <Typography
              as="span"
              className="truncate"
              color="semantic.label.alternative"
              variant="label2"
            >
              {meta}
            </Typography>
          </span>
        </span>
      </button>
    </WithInteraction>
  );
}

export default PracticeTile;
