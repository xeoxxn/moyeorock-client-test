// Figma "Music/Now Playing"(443:16865) — 재생 중인 항목 앞에 붙는 주홍 막대 3개.
function NowPlaying() {
  return (
    <span
      aria-label="재생 중"
      className="flex size-3 shrink-0 items-end gap-px"
      role="img"
    >
      <span className="h-7/12 flex-1 bg-accent" />
      <span className="h-full flex-1 bg-accent" />
      <span className="h-3/4 flex-1 bg-accent" />
    </span>
  );
}

export default NowPlaying;
