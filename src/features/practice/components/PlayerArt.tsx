import { Typography, WithInteraction } from "@wanteddev/wds";
import { type MouseEvent, useRef } from "react";

import Waveform from "@/components/music/Waveform";
import { formatDuration } from "@/lib/domain/format";
import type { PracticeFeedback } from "@/lib/domain/types";

// Figma 05의 Waveform Art(418:12641) — 표면 카드(248) 위 큰 파형 + 원곡과 다른 구간(주홍 16% 띠) + 재생
// 막대(흰 선). 지나간 부분은 밝게, 남은 부분은 흐리게. 카드를 누르면 그 자리로 옮긴다. 아래에 지금 위치 ·
// 전체 길이. 띠는 서버 구간(시작 내림 · 끝 올림한 정수 초) 그대로 startSec부터 endSec까지 칠한다.

/** 구간이 3~4초라 긴 녹음에서도 띠가 보이도록 최소 폭(트랙 대비 %)을 둔다. */
const MIN_BAND_PERCENT = 5;

interface PlayerArtProps {
  durationSec: number;
  positionSec: number;
  feedbacks: PracticeFeedback[];
  onSeek: (sec: number) => void;
}

function toPercent(sec: number, durationSec: number): number {
  return durationSec > 0 ? (sec / durationSec) * 100 : 0;
}

function PlayerArt({
  durationSec,
  feedbacks,
  onSeek,
  positionSec,
}: PlayerArtProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const progress = durationSec > 0 ? positionSec / durationSec : 0;

  const seekToPointer = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const ratio = Math.min(
      Math.max((event.clientX - rect.left) / rect.width, 0),
      1,
    );
    onSeek(ratio * durationSec);
  };

  return (
    <div className="flex flex-col gap-2">
      <WithInteraction variant="light">
        <button
          aria-label="재생 위치 옮기기"
          className="relative h-62 w-full overflow-hidden rounded-lg bg-surface"
          onClick={seekToPointer}
          type="button"
        >
          <div className="absolute inset-x-4 inset-y-0" ref={trackRef}>
            {feedbacks.map((feedback) => {
              const width = Math.max(
                toPercent(feedback.endSec - feedback.startSec, durationSec),
                MIN_BAND_PERCENT,
              );
              const left = Math.min(
                toPercent(feedback.startSec, durationSec),
                100 - width,
              );
              return (
                <span
                  aria-hidden
                  className="absolute inset-y-0 bg-accent/16"
                  key={`${feedback.startSec}-${feedback.endSec}`}
                  style={{ left: `${left}%`, width: `${width}%` }}
                />
              );
            })}
            <Waveform
              className="absolute inset-x-0 top-1/2 h-2/3 w-full -translate-y-1/2 text-label-strong"
              progress={progress}
            />
            <span
              aria-hidden
              className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-label-strong"
              style={{ left: `${progress * 100}%` }}
            />
          </div>
        </button>
      </WithInteraction>
      <div className="flex justify-between">
        <Typography
          color="semantic.label.alternative"
          variant="caption1"
          weight="medium"
        >
          {formatDuration(positionSec)}
        </Typography>
        <Typography
          color="semantic.label.assistive"
          variant="caption1"
          weight="medium"
        >
          {formatDuration(durationSec)}
        </Typography>
      </div>
    </div>
  );
}

export default PlayerArt;
