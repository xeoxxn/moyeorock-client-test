import { IconButton, Typography, WithInteraction } from "@wanteddev/wds";
import { IconPause, IconPlay } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Cover, { PART_COVER_TONE } from "@/components/music/Cover";
import { innerClick } from "@/components/ui/listCellEvents";
import { cn } from "@/lib/cn";
import { getNowPlayingRecording } from "@/mocks/selectors";

const TONE_BG = {
  blue: "bg-cover-blue",
  green: "bg-cover-green",
  red: "bg-cover-red",
  teal: "bg-cover-teal",
  violet: "bg-cover-violet",
} as const;

// Figma "Music/Mini Player"(443:16632) — 탭 화면(홈·일정·모임·게시판·마이·연습 분석) 하단 탭 위 8px에
// 떠 있는 "지금 듣는 연습 녹음". 바탕은 그 녹음의 커버색 + 검정 35%. 누르면 분석 결과로 간다.
// 아직 실제 재생은 없어 재생/일시정지는 화면 상태로만 바뀐다.
function MiniPlayer() {
  const navigate = useNavigate();
  const recording = getNowPlayingRecording();
  const [playing, setPlaying] = useState(true);

  if (!recording) return null;
  const tone = PART_COVER_TONE[recording.part];

  return (
    <WithInteraction variant="light">
      {/* biome-ignore lint/a11y/useSemanticElements: 안에 재생 버튼이 있어 <button>으로 감쌀 수 없다(버튼 중첩) */}
      <div
        className={cn(
          "mini-player-dim relative flex h-14 cursor-pointer items-center gap-2.5 overflow-hidden rounded-md pr-1 pl-2",
          TONE_BG[tone],
        )}
        onClick={() => navigate(`/practice/${recording.id}`)}
        onKeyDown={(event) => {
          if (event.key === "Enter") navigate(`/practice/${recording.id}`);
        }}
        role="button"
        tabIndex={0}
      >
        <Cover
          className="size-10 rounded-sm"
          part={recording.part}
          tone={tone}
        />
        <span className="flex min-w-0 flex-1 flex-col">
          <Typography
            as="span"
            className="truncate"
            color="semantic.label.strong"
            variant="label1"
            weight="medium"
          >
            {recording.title}
          </Typography>
          <Typography
            as="span"
            className="truncate"
            color="semantic.label.alternative"
            variant="label2"
          >
            {recording.song.artist} · 내 녹음
          </Typography>
        </span>
        <IconButton
          aria-label={playing ? "일시정지" : "재생"}
          color="semantic.label.strong"
          onClick={innerClick(() => setPlaying((value) => !value))}
          size={24}
          sx={{ height: "2.75rem", width: "2.75rem" }}
          variant="normal"
        >
          {playing ? <IconPause /> : <IconPlay />}
        </IconButton>
        <span className="absolute inset-x-2 bottom-0.5 h-0.5 rounded-full bg-label-strong/20">
          <span className="block h-full w-2/5 rounded-full bg-label-strong" />
        </span>
      </div>
    </WithInteraction>
  );
}

export default MiniPlayer;
