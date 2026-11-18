import { useCallback, useEffect, useState } from "react";

import { isAnalysisInProgress } from "@/features/practice/practiceHelpers";
import {
  findPracticeRecording,
  listPracticeRecordings,
} from "@/features/practice/practiceStore";

/** 서버 흐름(§13 ④): 분석 중이면 상세를 5초쯤 간격으로 다시 조회하다 DONE·FAILED면 멈춘다. */
export const PRACTICE_POLL_INTERVAL_MS = 5_000;

// 연습 녹음 상세(GET /v1/practice-recordings/{id}). 분석 중(SUBMITTED·ANALYZING)인 동안만 폴링한다.
// 다시 요청처럼 화면이 상태를 바꾼 뒤엔 refresh로 바로 다시 읽어 폴링을 다시 켠다.
export function usePracticeRecording(id: number) {
  const [state, setState] = useState(() => ({
    id,
    recording: findPracticeRecording(id),
  }));
  // 라우트 파라미터가 바뀌면 그 녹음으로 다시 읽는다(렌더 중 상태 맞추기).
  if (state.id !== id) {
    setState({ id, recording: findPracticeRecording(id) });
  }

  const { recording } = state;
  const polling =
    recording !== undefined && isAnalysisInProgress(recording.status);

  const refresh = useCallback(() => {
    setState({ id, recording: findPracticeRecording(id) });
  }, [id]);

  useEffect(() => {
    if (!polling) return;
    const timer = window.setInterval(refresh, PRACTICE_POLL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [polling, refresh]);

  return { recording, refresh };
}

// 내 연습 녹음 목록(GET /v1/users/me/practice-recordings). 29의 "목록에서 기다리기"로 온 사람이 목록에서
// 결과를 보도록, 분석 중인 녹음이 있는 동안만 같은 간격으로 다시 읽는다.
export function usePracticeRecordingList() {
  const [recordings, setRecordings] = useState(listPracticeRecordings);
  const polling = recordings.some((recording) =>
    isAnalysisInProgress(recording.status),
  );

  useEffect(() => {
    if (!polling) return;
    const timer = window.setInterval(
      () => setRecordings(listPracticeRecordings()),
      PRACTICE_POLL_INTERVAL_MS,
    );
    return () => window.clearInterval(timer);
  }, [polling]);

  return recordings;
}
