import { IconButton, Slider } from "@wanteddev/wds";
import { IconPause, IconPlay } from "@wanteddev/wds-icon";

import nextSegmentIcon from "@/assets/player/next-segment.svg";
import previousSegmentIcon from "@/assets/player/previous-segment.svg";
import volumeHighIcon from "@/assets/player/volume-high.svg";
import volumeLowIcon from "@/assets/player/volume-low.svg";
import { cn } from "@/lib/cn";

// Figma 05의 Controls(418:12808) · Volume(418:12826) — 이전 구간 / 큰 주홍 재생 / 다음 구간, 그 아래 음량.
// WDS 아이콘에 건너뛰기·음량이 없어 Figma 에셋(src/assets/player)을 WDS IconButton 안에 넣는다.
// 이전·다음은 트랙이 아니라 구간 피드백 사이를 오간다.
interface PlayerControlsProps {
  playing: boolean;
  onToggle: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

const VOLUME_MAX = 100;

function PlayerControls({
  hasNext,
  hasPrevious,
  onNext,
  onPrevious,
  onToggle,
  onVolumeChange,
  playing,
  volume,
}: PlayerControlsProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-center gap-11 pt-6 pb-3">
        <IconButton
          aria-label="이전 구간"
          disabled={!hasPrevious}
          onClick={onPrevious}
          size={28}
          variant="normal"
        >
          <img
            alt=""
            className={cn("size-7", !hasPrevious && "opacity-30")}
            src={previousSegmentIcon}
          />
        </IconButton>
        <IconButton
          aria-label={playing ? "일시정지" : "재생"}
          color="semantic.static.white"
          onClick={onToggle}
          size={64}
          sx={{ padding: "1.125rem" }}
          variant="solid"
        >
          {playing ? <IconPause /> : <IconPlay />}
        </IconButton>
        <IconButton
          aria-label="다음 구간"
          disabled={!hasNext}
          onClick={onNext}
          size={28}
          variant="normal"
        >
          <img
            alt=""
            className={cn("size-7", !hasNext && "opacity-30")}
            src={nextSegmentIcon}
          />
        </IconButton>
      </div>
      <div className="flex items-center gap-3 px-5 pb-2">
        <IconButton
          aria-label="소리 끄기"
          onClick={() => onVolumeChange(0)}
          size={20}
          variant="normal"
        >
          <img alt="" className="size-5" src={volumeLowIcon} />
        </IconButton>
        <div className="min-w-0 flex-1">
          <Slider
            aria-label="음량"
            max={VOLUME_MAX}
            min={0}
            onValueChange={([next]) => onVolumeChange(next)}
            value={[volume]}
          />
        </div>
        <IconButton
          aria-label="최대 음량"
          onClick={() => onVolumeChange(VOLUME_MAX)}
          size={20}
          variant="normal"
        >
          <img alt="" className="size-5" src={volumeHighIcon} />
        </IconButton>
      </div>
    </div>
  );
}

export default PlayerControls;
