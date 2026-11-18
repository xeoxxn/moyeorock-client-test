import { TextButton, Typography, WithInteraction } from "@wanteddev/wds";
import type { ReactNode } from "react";

import Waveform from "@/components/music/Waveform";
import { innerClick } from "@/components/ui/listCellEvents";

// 폼에서 "고른 것"을 보여 주는 카드 두 가지(Figma 11 새 연습 분석 · 25 파트 선택 시트).
// - SongPickCard(554:23549): 곡 커버 + 곡 + 아티스트 + 변경
// - RecordingCard(554:23892): 파일 이름 + 길이·크기 + 파형 + 변경
// "변경"은 블록 가운데가 아니라 제목 줄 높이에 맞춘다(사용자 지적).

interface SongPickCardProps {
  cover: ReactNode;
  title: string;
  artist: string;
  onChange: () => void;
}

export function SongPickCard({
  artist,
  cover,
  onChange,
  title,
}: SongPickCardProps) {
  return (
    <WithInteraction variant="light">
      <button
        className="flex w-full items-center gap-3.5 rounded-lg bg-surface py-3 pr-4 pl-3 text-left"
        onClick={onChange}
        type="button"
      >
        {cover}
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="flex items-center justify-between gap-3">
            <Typography
              as="span"
              className="truncate"
              color="semantic.label.strong"
              variant="body1"
              weight="bold"
            >
              {title}
            </Typography>
            <ChangeLabel />
          </span>
          <Typography color="semantic.label.alternative" variant="label2">
            {artist}
          </Typography>
        </span>
      </button>
    </WithInteraction>
  );
}

interface RecordingCardProps {
  fileName: string;
  meta: string;
  onChange: () => void;
}

export function RecordingCard({
  fileName,
  meta,
  onChange,
}: RecordingCardProps) {
  return (
    <div className="flex flex-col gap-3.5 rounded-lg bg-surface p-4">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center justify-between gap-3">
          <Typography
            className="truncate"
            color="semantic.label.strong"
            variant="body1"
            weight="bold"
          >
            {fileName}
          </Typography>
          <TextButton
            color="assistive"
            onClick={innerClick(onChange)}
            size="medium"
          >
            변경
          </TextButton>
        </div>
        <Typography color="semantic.label.alternative" variant="label2">
          {meta}
        </Typography>
      </div>
      <Waveform className="h-10 w-full text-label-alternative" />
    </div>
  );
}

function ChangeLabel() {
  return (
    <Typography
      as="span"
      className="shrink-0"
      color="semantic.label.alternative"
      variant="label1"
      weight="medium"
    >
      변경
    </Typography>
  );
}
