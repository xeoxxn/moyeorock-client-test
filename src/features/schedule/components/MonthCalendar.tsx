import { IconButton, Typography, WithInteraction } from "@wanteddev/wds";
import { IconChevronLeft, IconChevronRight } from "@wanteddev/wds-icon";

import { isSameDay } from "@/lib/domain/format";

// 일정 탭(/schedule)의 월간 캘린더. WDS `DateCalendar`를 먼저 검토했지만 날짜 칸에 표시(합주 있는 날의
// 점)를 넣을 방법이 없고, 보이는 달이 내부 상태라 바깥에서 알 수도 없다(onMonthChange 없음). 또
// 폭이 팝오버용으로 고정돼 있어 화면 폭 캘린더가 안 된다. 그래서 그리드만 직접 그리고, 글자·버튼·눌림은
// WDS `Typography`·`IconButton`·`WithInteraction`을 쓴다. 날짜를 "고르는" 폼(합주 추가)은 WDS
// `DatePicker`를 쓴다.

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

interface MonthCalendarProps {
  /** 보이는 달(그 달의 아무 날) */
  month: Date;
  selectedDate: Date;
  /** 점을 찍을 날(합주가 있는 날) */
  markedDates: Date[];
  onMonthChange: (month: Date) => void;
  onSelectDate: (date: Date) => void;
}

interface DayCell {
  key: string;
  /** 달 앞뒤의 빈칸이면 null */
  date: Date | null;
}

function buildWeeks(year: number, monthIndex: number): DayCell[][] {
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: DayCell[] = [
    ...Array.from({ length: firstWeekday }, (_, i) => ({
      date: null,
      key: `empty-${i}`,
    })),
    ...Array.from({ length: daysInMonth }, (_, i) => ({
      date: new Date(year, monthIndex, i + 1),
      key: `day-${i + 1}`,
    })),
  ];
  // 마지막 주도 7칸을 채워야 flex-1 칸 폭이 다른 주와 같다.
  const trailing = (7 - (cells.length % 7)) % 7;
  for (let i = 0; i < trailing; i += 1) {
    cells.push({ date: null, key: `trailing-${i}` });
  }
  const weeks: DayCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

function MonthCalendar({
  markedDates,
  month,
  onMonthChange,
  onSelectDate,
  selectedDate,
}: MonthCalendarProps) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const today = new Date();
  const weeks = buildWeeks(year, monthIndex);

  return (
    <div className="flex w-full flex-col gap-1 px-5 pt-2 pb-4">
      <div className="flex items-center gap-3 pb-2">
        <Typography
          className="flex-1"
          color="semantic.label.normal"
          variant="headline1"
          weight="bold"
        >
          {year}년 {monthIndex + 1}월
        </Typography>
        <IconButton
          aria-label="이전 달"
          onClick={() => onMonthChange(new Date(year, monthIndex - 1, 1))}
        >
          <IconChevronLeft />
        </IconButton>
        <IconButton
          aria-label="다음 달"
          onClick={() => onMonthChange(new Date(year, monthIndex + 1, 1))}
        >
          <IconChevronRight />
        </IconButton>
      </div>

      <div className="flex w-full">
        {WEEKDAY_LABELS.map((label, i) => (
          <Typography
            align="center"
            className="flex-1 py-1"
            color={
              i === 0 ? "semantic.status.negative" : "semantic.label.assistive"
            }
            key={label}
            variant="caption1"
            weight="bold"
          >
            {label}
          </Typography>
        ))}
      </div>

      {weeks.map((week) => (
        <div className="flex w-full" key={week[0].key}>
          {week.map(({ date, key }) => {
            if (!date) {
              return <div className="flex-1" key={key} />;
            }
            const isSelected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, today);
            const hasMark = markedDates.some((marked) =>
              isSameDay(marked, date),
            );
            return (
              <div
                className="flex flex-1 flex-col items-center gap-0.5 py-1"
                key={key}
              >
                <WithInteraction variant="light">
                  <button
                    aria-label={`${monthIndex + 1}월 ${date.getDate()}일${hasMark ? ", 합주 있음" : ""}`}
                    aria-pressed={isSelected}
                    className={
                      isSelected
                        ? "relative flex size-10 items-center justify-center rounded-full bg-accent-strong shadow-neon-sm"
                        : "relative flex size-10 items-center justify-center rounded-full"
                    }
                    onClick={() => onSelectDate(date)}
                    type="button"
                  >
                    <Typography
                      color={
                        isSelected
                          ? "semantic.static.white"
                          : date.getDay() === 0
                            ? "semantic.status.negative"
                            : "semantic.label.normal"
                      }
                      variant="body2"
                      weight={isSelected || isToday ? "bold" : "regular"}
                    >
                      {date.getDate()}
                    </Typography>
                  </button>
                </WithInteraction>
                <span
                  className={
                    hasMark
                      ? "size-1 rounded-full bg-accent shadow-neon-sm"
                      : "size-1 rounded-full"
                  }
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default MonthCalendar;
