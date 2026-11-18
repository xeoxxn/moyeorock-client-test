import { isAnalysisInProgress } from "@/features/practice/practiceHelpers";
import { formatDuration } from "@/lib/domain/format";
import type {
  Instrument,
  PracticeFeedback,
  PracticeRecording,
  SongSummary,
} from "@/lib/domain/types";
import { getPracticeRecording, getPracticeRecordings } from "@/mocks/selectors";

// 연습 녹음 쓰기(업로드 · 분석 요청 · 다시 요청 · 삭제)와 서버의 분석 진행을 백엔드 없이 흉내 내는 자리.
// selectors는 읽기 전용 가짜 데이터라, 이 화면들이 만든 변화만 모듈 안에 들고 있다가 읽을 때 덮어 준다 —
// 그래야 지운 녹음이 목록에 다시 나오지 않고, 새로 요청한 녹음이 목록 맨 위에 "분석 중"으로 보인다.
// 분석 상태는 요청한 뒤 지난 시간으로 정한다(서버 §13 ③): 차례 기다리기(SUBMITTED) 4초 → 원곡과 비교
// (ANALYZING) 14초까지 → DONE. 화면은 서버와 똑같이 상세를 5초마다 다시 읽어 바뀐 상태를 본다.
// 백엔드가 붙으면 함수 안만 §13 practice API 호출로 바뀐다.

/** 요청 뒤 이만큼은 분석 차례를 기다린다(SUBMITTED) */
const SUBMITTED_MS = 4_000;
/** 요청 뒤 이때까지 원곡과 비교하고(ANALYZING), 지나면 DONE */
const ANALYZING_UNTIL_MS = 14_000;
/** 가짜 데이터에 처음부터 분석 중인 녹음은 앱을 연 뒤 이만큼 지나면 끝난다 — 새 요청을 영영 막지 않게 */
const SEEDED_ANALYSIS_MS = 30_000;
/** 업로드 URL 발급 + 녹음 PUT에 걸리는 시간 흉내 */
const UPLOAD_MS = 1_000;

const appLoadedAt = Date.now();

const created: PracticeRecording[] = [];
const deletedIds = new Set<number>();
/** 이 화면들이 분석을 요청하거나 다시 요청한 시각(ms) — 녹음 id별 */
const requestedAt = new Map<number, number>();

/** 서버의 피드백 문장 — 구간을 담은 고정 문장이다(§13: "원곡 0:20~0:23 구간과 다르게 연주했어요.") */
function serverFeedbackContent(startSec: number, endSec: number): string {
  return `원곡 ${formatDuration(startSec)}~${formatDuration(endSec)} 구간과 다르게 연주했어요.`;
}

/**
 * 분석이 끝난 녹음의 피드백 흉내 — 녹음을 셋으로 나눠 구간마다 3~4초 한 곳씩(짧으면 줄인다).
 * 폴링할 때마다 같은 결과가 나오게 녹음 id·길이로만 정한다. 구간은 서버처럼 정수 초다.
 */
function mockFeedbacks(recording: PracticeRecording): PracticeFeedback[] {
  const lastSec = Math.ceil(recording.durationSec);
  const count = Math.min(
    3,
    Math.max(1, Math.floor(recording.durationSec / 12)),
  );
  const part = recording.durationSec / count;
  return Array.from({ length: count }, (_, index) => {
    const startSec = Math.floor(part * index + part * 0.3);
    const endSec = Math.min(
      startSec + 3 + ((recording.id + index) % 2),
      lastSec,
    );
    return {
      content: serverFeedbackContent(startSec, endSec),
      endSec,
      part: recording.part,
      startSec,
    };
  });
}

function finished(recording: PracticeRecording, at: number): PracticeRecording {
  return {
    ...recording,
    analyzedAt: new Date(at).toISOString(),
    failureReason: null,
    feedbacks: mockFeedbacks(recording),
    status: "DONE",
  };
}

/** 지금 시각에 서버가 내려줄 상태로 맞춘다 */
function withProgress(recording: PracticeRecording): PracticeRecording {
  const now = Date.now();
  const startedAt = requestedAt.get(recording.id);
  if (startedAt === undefined) {
    if (!isAnalysisInProgress(recording.status)) return recording;
    const doneAt = appLoadedAt + SEEDED_ANALYSIS_MS;
    return now < doneAt ? recording : finished(recording, doneAt);
  }
  const elapsed = now - startedAt;
  if (elapsed >= ANALYZING_UNTIL_MS) {
    return finished(recording, startedAt + ANALYZING_UNTIL_MS);
  }
  return {
    ...recording,
    analyzedAt: null,
    failureReason: null,
    feedbacks: [],
    status: elapsed < SUBMITTED_MS ? "SUBMITTED" : "ANALYZING",
  };
}

/** GET /v1/users/me/practice-recordings — 요청한 시각 최근 순 */
export function listPracticeRecordings(): PracticeRecording[] {
  return [...created, ...getPracticeRecordings()]
    .filter((recording) => !deletedIds.has(recording.id))
    .map(withProgress);
}

/** GET /v1/practice-recordings/{id} */
export function findPracticeRecording(
  id: number,
): PracticeRecording | undefined {
  if (deletedIds.has(id)) return undefined;
  const recording =
    created.find((item) => item.id === id) ?? getPracticeRecording(id);
  return recording ? withProgress(recording) : undefined;
}

/**
 * 진행 중(SUBMITTED·ANALYZING)인 내 녹음 — 409 PRACTICE_ANALYSIS_IN_PROGRESS 응답엔 그 녹음 id가 없어
 * 클라이언트가 목록에서 찾는다. 한 사람당 하나뿐이다.
 */
export function findInProgressRecording(): PracticeRecording | undefined {
  return listPracticeRecordings().find((recording) =>
    isAnalysisInProgress(recording.status),
  );
}

/** 409 PRACTICE_ANALYSIS_IN_PROGRESS — 진행 중인 내 분석이 이미 있다(분석 요청 · 다시 요청) */
const IN_PROGRESS = {
  code: "PRACTICE_ANALYSIS_IN_PROGRESS",
  ok: false,
} as const;

/** 분석 요청 결과 — 202 SUBMITTED 또는 409 */
export type PracticeRequestResult =
  | { ok: true; recording: PracticeRecording }
  | typeof IN_PROGRESS;

/** 다시 요청 결과 — 실패한 녹음이 아니면 409 INVALID_STATE도 온다 */
export type PracticeRetryResult =
  | PracticeRequestResult
  | { ok: false; code: "INVALID_STATE" };

/**
 * POST /v1/files/upload-url(domain PRACTICE_AUDIO) → 녹음 PUT — 받은 fileUrl을 분석 요청의 audioUrl로
 * 쓴다. 지금은 잠깐 기다렸다 가짜 주소를 준다.
 */
export function uploadPracticeAudio(file: File): Promise<string> {
  return new Promise((resolve) => {
    window.setTimeout(
      () => resolve(`mock://practice/${encodeURIComponent(file.name)}`),
      UPLOAD_MS,
    );
  });
}

interface PracticeAnalysisRequest {
  title: string;
  part: Instrument;
  song: SongSummary;
  audioUrl: string;
  /** 서버 응답엔 없고 클라이언트가 파일에서 읽은 길이(types.ts 참고) */
  durationSec: number;
}

/**
 * POST /v1/practice-recordings(202) — 업로드한 녹음으로 분석을 요청한다. 응답은 SUBMITTED.
 * 진행 중인 내 분석이 이미 있으면 409 PRACTICE_ANALYSIS_IN_PROGRESS.
 */
export function requestPracticeAnalysis(
  request: PracticeAnalysisRequest,
): PracticeRequestResult {
  if (findInProgressRecording()) return IN_PROGRESS;
  const ids = [...created, ...getPracticeRecordings()].map((item) => item.id);
  const recording: PracticeRecording = {
    analyzedAt: null,
    createdAt: new Date().toISOString(),
    durationSec: request.durationSec,
    failureReason: null,
    feedbacks: [],
    id: Math.max(0, ...ids) + 1,
    part: request.part,
    song: request.song,
    status: "SUBMITTED",
    title: request.title,
  };
  created.unshift(recording);
  requestedAt.set(recording.id, Date.now());
  return { ok: true, recording: withProgress(recording) };
}

/**
 * POST /v1/practice-recordings/{id}/retry(202) — FAILED만 다시 요청할 수 있다(아니면 409 INVALID_STATE).
 * 실패 사유를 비우고 SUBMITTED로 돌린다. createdAt(요청 시각)은 처음 그대로다. 진행 중인 내 분석이
 * 이미 있으면 409 PRACTICE_ANALYSIS_IN_PROGRESS.
 */
export function retryPracticeAnalysis(id: number): PracticeRetryResult {
  const recording = findPracticeRecording(id);
  if (recording?.status !== "FAILED") {
    return { code: "INVALID_STATE", ok: false };
  }
  if (findInProgressRecording()) return IN_PROGRESS;
  requestedAt.set(id, Date.now());
  return { ok: true, recording: withProgress(recording) };
}

/** DELETE /v1/practice-recordings/{id} — 분석 중에도 지울 수 있다. */
export function deletePracticeRecording(id: number): void {
  deletedIds.add(id);
}
