import { IconChevronRight } from "@wanteddev/wds-icon";
import type { ReactNode } from "react";

import MediaRow from "@/components/list/MediaRow";
import Cover, { type CoverTone } from "@/components/music/Cover";
import NowPlaying from "@/components/music/NowPlaying";
import type { Instrument } from "@/lib/domain/types";

// Figma "List/Cover Row"(536:21929)와 "List/Cover Row · 상태"(536:23248) — 56px 커버 + 이름 + 설명.
// 오른쪽은 기본 chevron이고, status를 주면 상태 배지(연습 분석 목록)를 둔다. playing이면 설명 앞에
// 재생 중 막대가 붙는다.
interface CoverRowProps {
  tone: CoverTone;
  part?: Instrument;
  title: ReactNode;
  meta?: ReactNode;
  status?: ReactNode;
  playing?: boolean;
  onClick?: () => void;
  /** chevron 대신 둘 오른쪽 내용 */
  trailing?: ReactNode;
}

function CoverRow({
  meta,
  onClick,
  part,
  playing = false,
  status,
  title,
  tone,
  trailing,
}: CoverRowProps) {
  const right =
    trailing ??
    status ??
    (onClick ? (
      <IconChevronRight className="size-5 shrink-0 text-label-assistive" />
    ) : undefined);

  return (
    <MediaRow
      leading={<Cover className="size-14 rounded-sm" part={part} tone={tone} />}
      meta={
        meta !== undefined ? (
          <>
            {playing && <NowPlaying />}
            {meta}
          </>
        ) : undefined
      }
      onClick={onClick}
      title={title}
      trailing={right}
    />
  );
}

export default CoverRow;
