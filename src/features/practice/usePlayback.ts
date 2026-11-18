import { useCallback, useEffect, useState } from "react";

const TICK_MS = 100;

// 녹음 재생 흉내 — 아직 실제 오디오(<audio> + 서버 audioUrl)가 없어 타이머로 재생 위치만 움직인다.
// 파형 재생 막대·지금 구간 피드백이 이 위치를 따라간다. 끝까지 가면 멈추고, 다시 누르면 처음부터.
export function usePlayback(durationSec: number) {
  const [positionSec, setPositionSec] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const delta = (now - last) / 1000;
      last = now;
      setPositionSec((prev) => Math.min(prev + delta, durationSec));
    }, TICK_MS);
    return () => window.clearInterval(timer);
  }, [durationSec, playing]);

  const ended = positionSec >= durationSec;
  useEffect(() => {
    if (playing && ended) setPlaying(false);
  }, [ended, playing]);

  const toggle = useCallback(() => {
    if (!playing && ended) setPositionSec(0);
    setPlaying((value) => !value);
  }, [ended, playing]);

  const seek = useCallback(
    (sec: number) => setPositionSec(Math.min(Math.max(sec, 0), durationSec)),
    [durationSec],
  );

  return { playing, positionSec, seek, toggle };
}
