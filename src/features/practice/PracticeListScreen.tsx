import { Chip, List } from "@wanteddev/wds";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import ActionRow from "@/components/list/ActionRow";
import CoverRow from "@/components/list/CoverRow";
import { PART_COVER_TONE } from "@/components/music/Cover";
import EmptyState from "@/components/ui/EmptyState";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Status from "@/components/ui/Status";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import {
  isAnalysisInProgress,
  PRACTICE_STATUS_TONE,
} from "@/features/practice/practiceHelpers";
import { listPracticeRecordings } from "@/features/practice/practiceStore";
import { formatMonthDay } from "@/lib/domain/format";
import { INSTRUMENT_LABEL, PRACTICE_STATUS_LABEL } from "@/lib/domain/labels";
import type { PracticeRecording } from "@/lib/domain/types";
import { getNowPlayingRecording } from "@/mocks/selectors";

// Figma 10 연습 분석 목록(424:13856) · 비었을 때 15 빈 상태(428:15484).
// 필터 칩(전체 · 분석 완료 · 분석 중)은 같은 화면 안의 필터라 쿼리(?status=)로 남긴다.

type PracticeFilter = "all" | "done" | "analyzing";

const FILTERS: {
  value: PracticeFilter;
  label: string;
  match: (recording: PracticeRecording) => boolean;
  /** 이 필터로 고른 녹음이 없을 때 */
  empty: { title: string; description: string };
}[] = [
  {
    empty: { description: "", title: "" },
    label: "전체",
    match: () => true,
    value: "all",
  },
  {
    empty: {
      description: "분석이 끝나면 여기에 모아 보여 드려요.",
      title: "분석이 끝난 연습이 없어요",
    },
    label: PRACTICE_STATUS_LABEL.DONE,
    match: (recording) => recording.status === "DONE",
    value: "done",
  },
  {
    empty: {
      description: "녹음을 올리면 바로 분석을 시작해요.",
      title: "분석 중인 연습이 없어요",
    },
    label: PRACTICE_STATUS_LABEL.ANALYZING,
    match: (recording) => isAnalysisInProgress(recording.status),
    value: "analyzing",
  },
];

function toFilter(param: string | null): PracticeFilter {
  return FILTERS.some((filter) => filter.value === param)
    ? (param as PracticeFilter)
    : "all";
}

function PracticeListScreen() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = toFilter(searchParams.get("status"));

  useScreenHeader(useMemo(() => <ScreenHeader title="연습 분석" />, []));

  const recordings = listPracticeRecordings();
  const nowPlayingId = getNowPlayingRecording()?.id;
  const activeFilter =
    FILTERS.find((item) => item.value === filter) ?? FILTERS[0];
  const visible = recordings.filter(activeFilter.match);
  const goNew = () => navigate("/practice/new");

  if (recordings.length === 0) {
    return (
      <ScreenBody className="flex flex-col justify-center">
        <EmptyState
          action={{ label: "녹음 올리기", onClick: goNew }}
          description={"녹음을 올리면 원곡과 비교해\n다른 구간을 짚어 드려요."}
          title="아직 분석한 연습이 없어요"
        />
      </ScreenBody>
    );
  }

  const changeFilter = (next: PracticeFilter) => {
    setSearchParams(next === "all" ? {} : { status: next }, { replace: true });
  };

  return (
    <ScreenBody>
      <div className="flex gap-2 px-5 pt-1 pb-5">
        {FILTERS.map((item) => (
          <Chip
            active={item.value === filter}
            key={item.value}
            onClick={() => changeFilter(item.value)}
            size="medium"
            variant="solid"
          >
            {item.value === "all"
              ? `${item.label} ${recordings.length}`
              : item.label}
          </Chip>
        ))}
      </div>
      <List>
        <ActionRow
          icon="plus"
          meta="녹음을 올리면 원곡과 비교해 드려요"
          onClick={goNew}
          title="새 연습 분석"
        />
        {visible.map((recording) => (
          <CoverRow
            key={recording.id}
            meta={`${INSTRUMENT_LABEL[recording.part]} · ${formatMonthDay(recording.createdAt)}`}
            onClick={() => navigate(`/practice/${recording.id}`)}
            part={recording.part}
            playing={recording.id === nowPlayingId}
            status={
              <Status tone={PRACTICE_STATUS_TONE[recording.status]}>
                {PRACTICE_STATUS_LABEL[recording.status]}
              </Status>
            }
            title={recording.song.title}
            tone={PART_COVER_TONE[recording.part]}
          />
        ))}
      </List>
      {visible.length === 0 && (
        <EmptyState
          description={activeFilter.empty.description}
          title={activeFilter.empty.title}
        />
      )}
    </ScreenBody>
  );
}

export default PracticeListScreen;
