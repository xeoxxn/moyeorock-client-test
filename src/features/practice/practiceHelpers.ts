import type { StatusTone } from "@/components/ui/Status";
import { formatDuration } from "@/lib/domain/format";
import type {
  PracticeFeedback,
  PracticeRecording,
  PracticeStatus,
} from "@/lib/domain/types";

// 연습 분석 화면들이 같이 쓰는 계산 — 상태 색, 구간 피드백 타임라인, 녹음 파일 제한(서버 §13).

/** 같은 의미의 상태는 Status 하나로 — 분석 완료 positive · 분석 중 progress · 분석 실패 negative */
export const PRACTICE_STATUS_TONE: Record<PracticeStatus, StatusTone> = {
  ANALYZING: "progress",
  DONE: "positive",
  FAILED: "negative",
  SUBMITTED: "progress",
};

/** 서버가 아직 분석 중인 상태(SUBMITTED·ANALYZING) — 상세를 5초마다 다시 조회한다 */
export function isAnalysisInProgress(status: PracticeStatus): boolean {
  return status === "SUBMITTED" || status === "ANALYZING";
}

/** 서버 녹음 제한: 3~60초, 1.95MB(1,950,000바이트) 이하, mp3·m4a·wav */
export const RECORDING_LIMIT = {
  maxBytes: 1_950_000,
  maxSec: 60,
  minSec: 3,
} as const;

export const RECORDING_ACCEPT = "audio/mpeg,audio/mp4,audio/x-m4a,audio/wav";

/** 1.2MB · 0.84MB — 서버 한도(1.95MB)와 같은 10진 MB로 쓴다 */
export function formatFileSize(bytes: number): string {
  const megabytes = (bytes / 1_000_000).toFixed(2).replace(/\.?0+$/, "");
  return `${megabytes}MB`;
}

/** 0:11 · 0:20–0:23 — 구간 피드백 시간(서버는 시작 내림·끝 올림한 정수 초) */
export function formatSpan(startSec: number, endSec: number): string {
  return startSec === endSec
    ? formatDuration(startSec)
    : `${formatDuration(startSec)}–${formatDuration(endSec)}`;
}

/** 지금 재생 위치까지 지나간 마지막 피드백 — 가사 화면처럼 그 줄만 밝게 둔다. 아직 없으면 -1. */
export function reachedFeedbackIndex(
  feedbacks: PracticeFeedback[],
  positionSec: number,
): number {
  let reached = -1;
  feedbacks.forEach((feedback, index) => {
    if (feedback.startSec <= positionSec) reached = index;
  });
  return reached;
}

export type TimelineItem =
  | { kind: "ok"; startSec: number; endSec: number }
  | { kind: "feedback"; startSec: number; endSec: number; content: string };

/**
 * 구간 피드백 전체 보기(Figma 18) — 피드백 사이 빈 구간을 "잘 맞았어요"로 채운 타임라인.
 * 피드백 한 줄은 [startSec, endSec] 정수 초를 차지하고, 그 사이·앞뒤가 잘 맞은 구간이다.
 */
export function buildTimeline(recording: PracticeRecording): TimelineItem[] {
  const items: TimelineItem[] = [];
  const sorted = [...recording.feedbacks].sort(
    (a, b) => a.startSec - b.startSec,
  );
  let cursor = 0;
  for (const feedback of sorted) {
    if (feedback.startSec > cursor) {
      items.push({
        endSec: feedback.startSec - 1,
        kind: "ok",
        startSec: cursor,
      });
    }
    items.push({
      content: feedback.content,
      endSec: feedback.endSec,
      kind: "feedback",
      startSec: feedback.startSec,
    });
    cursor = feedback.endSec + 1;
  }
  const lastSec = Math.floor(recording.durationSec);
  if (cursor <= lastSec) {
    items.push({ endSec: lastSec, kind: "ok", startSec: cursor });
  }
  return items;
}
