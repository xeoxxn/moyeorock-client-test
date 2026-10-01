import { Button, Typography } from "@wanteddev/wds";
import { IconPlus } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import mascotSleep from "@/assets/mascot/sleep.png";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import MonthCalendar, {
  toDateKey,
} from "@/features/schedule/components/MonthCalendar";

// Figma: 일정/02 일정 - 다가오는 일정 (nodeId 101:12493). "일정/01 일정 - 비어있음"(101:12181)은
// 이 화면의 빈 상태 변형이라 별도 라우트가 아니라 UPCOMING_EVENTS 길이로 분기한다.

interface ScheduleEvent {
  id: string;
  date: Date;
  title: string;
  place: string;
  time?: string;
  isNext?: boolean;
}

const TODAY = new Date(2026, 8, 17);

const UPCOMING_EVENTS: ScheduleEvent[] = [
  {
    date: new Date(2026, 8, 17),
    id: "e1",
    place: "홍대 연습실 A",
    time: "19:00~21:00",
    title: "정기 합주 · A팀",
  },
  {
    date: new Date(2026, 8, 20),
    id: "e2",
    isNext: true,
    place: "합주실 A",
    time: "14:00",
    title: "전체 합주",
  },
  {
    date: new Date(2026, 9, 16),
    id: "e3",
    place: "홍대 롤링홀",
    time: "18:00",
    title: "공연 전 리허설",
  },
  {
    date: new Date(2026, 9, 17),
    id: "e4",
    place: "홍대 롤링홀 · 프로젝트 모임",
    time: "18:00",
    title: "2026 가을 정기공연",
  },
];

function ScheduleScreen() {
  const navigate = useNavigate();
  const [month, setMonth] = useState(
    new Date(TODAY.getFullYear(), TODAY.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState(TODAY);

  useScreenHeader(
    <ScreenHeader
      title="일정"
      trailing={
        <button
          aria-label="일정 추가"
          onClick={() => navigate("/schedule/add")}
          type="button"
        >
          <IconPlus className="size-6 text-label-normal" />
        </button>
      }
      variant="title"
    />,
  );

  const markedDateKeys = new Set(
    UPCOMING_EVENTS.map((event) => toDateKey(event.date)),
  );
  const nextEvent = UPCOMING_EVENTS.find((event) => event.isNext);

  return (
    <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto">
      <MonthCalendar
        markedDateKeys={markedDateKeys}
        month={month}
        onMonthChange={setMonth}
        onSelectDate={setSelectedDate}
        selectedDate={selectedDate}
      />
      <div className="h-3 w-full bg-surface" />

      {UPCOMING_EVENTS.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-10 pb-10">
          <img
            alt=""
            className="size-[120px] drop-shadow-neon-md"
            src={mascotSleep}
          />
          <div className="flex flex-col items-center gap-1.5">
            <Typography
              color="semantic.label.strong"
              variant="headline1"
              weight="bold"
            >
              예정된 일정이 없어요
            </Typography>
            <Typography
              className="text-center"
              color="semantic.label.alternative"
              variant="label1"
              weight="regular"
            >
              합주나 연습 일정을 추가해 보세요
            </Typography>
          </div>
          <Button
            color="primary"
            onClick={() => navigate("/schedule/add")}
            size="medium"
            variant="solid"
          >
            일정 추가하기
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 px-5 py-6">
          {nextEvent && (
            <div className="flex flex-col rounded-2xl border border-line-solid bg-surface p-4">
              <Typography
                className="text-glow-sm"
                color="semantic.primary.normal"
                variant="caption1"
                weight="bold"
              >
                D-3 · 다가오는 일정
              </Typography>
              <Typography
                color="semantic.label.normal"
                variant="body1"
                weight="bold"
              >
                {nextEvent.title}
              </Typography>
              <Typography
                color="semantic.label.assistive"
                variant="label2"
                weight="medium"
              >
                {nextEvent.date.getMonth() + 1}월 {nextEvent.date.getDate()}일 (
                {WEEKDAY_SHORT[nextEvent.date.getDay()]}) {nextEvent.time} ·{" "}
                {nextEvent.place}
              </Typography>
            </div>
          )}

          <div className="flex items-center pt-2">
            <Typography
              className="flex-1"
              color="semantic.label.normal"
              variant="headline1"
              weight="bold"
            >
              다음 일정
            </Typography>
            <Typography
              color="semantic.label.assistive"
              variant="label2"
              weight="medium"
            >
              전체 {UPCOMING_EVENTS.length}개
            </Typography>
          </div>

          {UPCOMING_EVENTS.map((event) => (
            <div
              className="flex items-center gap-3.5 rounded-2xl bg-surface p-4"
              key={event.id}
            >
              <div className="flex w-12 shrink-0 flex-col items-center">
                <Typography
                  color="semantic.label.assistive"
                  variant="caption1"
                  weight="bold"
                >
                  {event.date.getMonth() + 1}월
                </Typography>
                <Typography
                  color="semantic.label.normal"
                  variant="headline1"
                  weight="bold"
                >
                  {event.date.getDate()}
                </Typography>
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <Typography
                  color="semantic.label.normal"
                  variant="body1"
                  weight="bold"
                >
                  {event.title}
                </Typography>
                <Typography
                  color="semantic.label.assistive"
                  variant="label2"
                  weight="medium"
                >
                  {event.time} · {event.place}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const WEEKDAY_SHORT = ["일", "월", "화", "수", "목", "금", "토"];

export default ScheduleScreen;
