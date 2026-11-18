import Waveform from "@/components/music/Waveform";
import { cn } from "@/lib/cn";
import { INSTRUMENT_COVER_LABEL } from "@/lib/domain/labels";
import type { Instrument } from "@/lib/domain/types";

// Figma "Cover"(410:10994) — 팀·모임·곡·녹음의 표지. 사진 대신 커버색 + 위쪽 파형 + (녹음·파트면)
// 왼쪽 아래 큰 Archivo Black 파트 글자로 만든 앨범 아트 같은 정사각형이다. 서버의 coverImage가
// 생기면 그 사진을 쓰고, 없을 때 이걸 그린다.
//
// 글자 크기는 커버 폭에 비례해야 해서(56px에 10px, 132px에 24px) 컨테이너 쿼리 단위를 쓴다
// (index.css의 cover-label).

export type CoverTone = "red" | "blue" | "green" | "violet" | "teal";

const TONE_CLASS: Record<CoverTone, string> = {
  blue: "bg-cover-blue",
  green: "bg-cover-green",
  red: "bg-cover-red",
  teal: "bg-cover-teal",
  violet: "bg-cover-violet",
};

/** 파트별 커버색 — 같은 파트는 어느 화면에서나 같은 색이다. */
export const PART_COVER_TONE: Record<Instrument, CoverTone> = {
  AC_GT: "teal",
  BASS: "green",
  DRUM: "blue",
  EL_GT: "red",
  KEY: "violet",
  VOCAL: "blue",
};

const PALETTE: CoverTone[] = ["red", "violet", "blue", "green", "teal"];
const KIND_OFFSET = { group: 0, performance: 4, song: 0, team: 2 } as const;

/** 사진이 없는 팀·모임·공연·곡의 커버색 — id로 정해서 화면마다 같은 대상은 같은 색이다. */
export function coverToneOf(
  kind: keyof typeof KIND_OFFSET,
  id: number,
): CoverTone {
  return PALETTE[(id + KIND_OFFSET[kind]) % PALETTE.length];
}

interface CoverProps {
  tone: CoverTone;
  /** 파트 커버면 그 파트 — 영문 파트 이름을 크게 쓴다. 팀·모임·곡 커버는 글자 없이. */
  part?: Instrument;
  /** 크기·모서리는 쓰는 곳이 정한다(size-14 rounded-sm 등). */
  className?: string;
}

function Cover({ className, part, tone }: CoverProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "@container relative shrink-0 overflow-hidden",
        TONE_CLASS[tone],
        className,
      )}
    >
      <div className="cover-sheen absolute inset-0" />
      <Waveform className="absolute inset-x-0 top-1/10 h-1/3 w-full text-static-white opacity-55" />
      {part && (
        <span className="cover-label absolute text-static-white">
          {INSTRUMENT_COVER_LABEL[part]}
        </span>
      )}
    </div>
  );
}

export default Cover;
