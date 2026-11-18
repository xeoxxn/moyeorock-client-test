import type {
  Instrument,
  PracticeRecording,
  SongSummary,
} from "@/lib/domain/types";
import { getPracticeRecording, getPracticeRecordings } from "@/mocks/selectors";

// 연습 녹음 쓰기(분석 요청 · 다시 요청 · 삭제)를 백엔드 없이 흉내 내는 자리. selectors는 읽기 전용
// 가짜 데이터라, 이 화면들이 만든 변화만 모듈 안에 들고 있다가 읽을 때 덮어 준다 — 그래야 지운 녹음이
// 목록에 다시 나오지 않고, 새로 요청한 녹음이 목록 맨 위에 "분석 중"으로 보인다. 백엔드가 붙으면
// 함수 안만 §13 practice API 호출로 바뀐다.

const created: PracticeRecording[] = [];
const deletedIds = new Set<number>();
/** 다시 요청한 실패 녹음 — 서버는 상태를 SUBMITTED로 돌리고 실패 사유를 비운다 */
const retriedIds = new Set<number>();

function withLocalChanges(recording: PracticeRecording): PracticeRecording {
  if (!retriedIds.has(recording.id)) return recording;
  return { ...recording, failureReason: null, status: "SUBMITTED" };
}

/** GET /v1/users/me/practice-recordings — 요청한 시각 최근 순 */
export function listPracticeRecordings(): PracticeRecording[] {
  return [...created, ...getPracticeRecordings()]
    .filter((recording) => !deletedIds.has(recording.id))
    .map(withLocalChanges);
}

/** GET /v1/practice-recordings/{id} */
export function findPracticeRecording(
  id: number,
): PracticeRecording | undefined {
  if (deletedIds.has(id)) return undefined;
  const recording =
    created.find((item) => item.id === id) ?? getPracticeRecording(id);
  return recording ? withLocalChanges(recording) : undefined;
}

interface PracticeAnalysisRequest {
  title: string;
  part: Instrument;
  song: SongSummary;
  /** 서버 응답엔 없고 클라이언트가 파일에서 읽은 길이(types.ts 참고) */
  durationSec: number;
}

/** POST /v1/practice-recordings(202) — 업로드한 녹음으로 분석을 요청한다. 응답은 SUBMITTED. */
export function requestPracticeAnalysis(
  request: PracticeAnalysisRequest,
): PracticeRecording {
  const ids = [...created, ...getPracticeRecordings()].map((item) => item.id);
  const recording: PracticeRecording = {
    ...request,
    analyzedAt: null,
    createdAt: new Date().toISOString(),
    failureReason: null,
    feedbacks: [],
    id: Math.max(0, ...ids) + 1,
    status: "SUBMITTED",
  };
  created.unshift(recording);
  return recording;
}

/** POST /v1/practice-recordings/{id}/retry(202) — FAILED만 다시 요청할 수 있다. */
export function retryPracticeAnalysis(id: number): void {
  retriedIds.add(id);
}

/** DELETE /v1/practice-recordings/{id} — 분석 중에도 지울 수 있다. */
export function deletePracticeRecording(id: number): void {
  deletedIds.add(id);
}
