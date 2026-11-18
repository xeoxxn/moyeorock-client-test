import type { StatusTone } from "@/components/ui/Status";
import { formatDuration } from "@/lib/domain/format";
import { INSTRUMENT_LABEL } from "@/lib/domain/labels";
import type {
  PracticeFeedback,
  PracticeRecording,
  PracticeStatus,
} from "@/lib/domain/types";

// 연습 분석 화면들이 같이 쓰는 계산 — 상태 색, 분석 단계, 구간 피드백 타임라인, 녹음 파일 제한(서버 §13).

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

/** 비교 중(29) 단계 — 올리기는 요청이 받아졌으면 끝났고, SUBMITTED는 차례 기다리기, ANALYZING은 비교 중 */
export const ANALYSIS_STEPS: { label: string; status?: PracticeStatus }[] = [
  { label: "녹음 올리기" },
  { label: "분석 차례 기다리기", status: "SUBMITTED" },
  { label: "원곡과 비교하기", status: "ANALYZING" },
];

export type AnalysisStepState = "done" | "current" | "pending";

export function analysisStepState(
  index: number,
  status: PracticeStatus,
): AnalysisStepState {
  const current = ANALYSIS_STEPS.findIndex((step) => step.status === status);
  if (current === -1 || index < current) return "done";
  return index === current ? "current" : "pending";
}

/** 29·30 제목 아래 한 줄 — "Basket Case · 보컬 · 0:48" */
export function analysisMeta(recording: PracticeRecording): string {
  return `${recording.song.title} · ${INSTRUMENT_LABEL[recording.part]} · ${formatDuration(recording.durationSec)}`;
}

/** 새 연습 분석(11)으로 — 같은 곡·파트를 채워 둔다(다시 녹음 · 다른 녹음 · 새 녹음 올리기) */
export function newAnalysisPath(recording: PracticeRecording): string {
  const query = new URLSearchParams({
    part: recording.part,
    songId: String(recording.song.id),
  });
  return `/practice/new?${query.toString()}`;
}

/** 서버 피드백 문장("원곡 0:20~0:23 구간과 다르게 연주했어요.")에서 구간을 뺀 부분을 찾는다 */
const SERVER_FEEDBACK_SENTENCE =
  /원곡 \d+:\d{2}~\d+:\d{2} 구간과 다르게 연주했어요\.?/;

/**
 * 피드백 한 줄의 문장. 서버 문장은 구간을 다시 말하므로(시간은 위에 따로 보인다) "원곡과 다르게
 * 연주했어요"로 줄인다. 그 꼴이 아니면(AI 결과 형식이 바뀌면) 서버 문장을 그대로 보여 준다.
 */
export function feedbackSentence(content: string): string {
  return content.replace(SERVER_FEEDBACK_SENTENCE, "원곡과 다르게 연주했어요");
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
