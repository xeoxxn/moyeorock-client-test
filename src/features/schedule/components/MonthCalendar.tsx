import { Typography } from "@wanteddev/wds";
import { IconChevronLeft, IconChevronRight } from "@wanteddev/wds-icon";

// Figma: 일정/02 다가오는 일정(nodeId 101:12493)의 월간 캘린더 그리드. 실제 날짜 계산은
// Figma처럼 9월 고정이 아니라 Date로 생성한다 — 날짜 선택 화면(101:13144)에서도 같은
// 그리드를 재사용한다.

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

interface MonthCalendarProps {
  month: Date;
  selectedDate: Date;
  markedDateKeys?: Set<string>;
  onMonthChange: (month: Date) => void;
  onSelectDate: (date: Date) => void;
}

function MonthCalendar({
  month,
  selectedDate,
  markedDateKeys,
  onMonthChange,
  onSelectDate,
}: MonthCalendarProps) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const selectedKey = toDateKey(selectedDate);
  const todayKey = toDateKey(new Date());

  const cells: (Date | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => new Date(year, monthIndex, i + 1),
    ),
  ];
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <div className="flex w-full flex-col gap-1 px-5 pt-2 pb-4">
      <div className="flex items-center pb-2">
        <Typography
          className="flex-1"
          color="semantic.label.normal"
          variant="headline1"
          weight="bold"
        >
          {year}년 {monthIndex + 1}월
        </Typography>
        <button
          aria-label="이전 달"
          onClick={() => onMonthChange(new Date(year, monthIndex - 1, 1))}
          type="button"
        >
          <IconChevronLeft className="size-5 text-label-normal" />
        </button>
        <div className="w-3" />
        <button
          aria-label="다음 달"
          onClick={() => onMonthChange(new Date(year, monthIndex + 1, 1))}
          type="button"
        >
          <IconChevronRight className="size-5 text-label-normal" />
        </button>
      </div>
      <div className="flex w-full">
        {WEEKDAY_LABELS.map((label, i) => (
          <div
            className="flex flex-1 items-center justify-center py-1"
            key={label}
          >
            <Typography
              color={
                i === 0
                  ? "semantic.status.negative"
                  : "semantic.label.assistive"
              }
              variant="caption1"
              weight="bold"
            >
              {label}
            </Typography>
          </div>
        ))}
      </div>
      {weeks.map((week, weekIndex) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: 주 단위 행은 월 안에서 순서가 고정이라 안전하다
        <div className="flex w-full" key={weekIndex}>
          {week.map((date, dayIndex) => {
            if (!date) {
              const emptyKey = `empty-${weekIndex}-${dayIndex}`;
              return <div className="flex-1 py-1.5" key={emptyKey} />;
            }
            const key = toDateKey(date);
            const isSelected = key === selectedKey;
            const isToday = key === todayKey;
            const isSunday = date.getDay() === 0;
            const hasMark = markedDateKeys?.has(key) ?? false;
            return (
              <button
                className="flex flex-1 flex-col items-center gap-0.5 py-1.5"
                key={key}
                onClick={() => onSelectDate(date)}
                type="button"
              >
                <div
                  className={
                    isSelected
                      ? "flex size-9 items-center justify-center rounded-full bg-accent-strong shadow-neon-sm"
                      : "flex size-9 items-center justify-center rounded-full"
                  }
                >
                  <Typography
                    color={
                      isSelected
                        ? "semantic.static.white"
                        : isSunday
                          ? "semantic.status.negative"
                          : "semantic.label.normal"
                    }
                    variant="body2"
                    weight={isToday ? "bold" : "regular"}
                  >
                    {date.getDate()}
                  </Typography>
                </div>
                <div
                  className={
                    hasMark
                      ? "size-1 rounded-full bg-accent shadow-neon-sm"
                      : "size-1 rounded-full bg-transparent"
                  }
                />
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default MonthCalendar;
export { toDateKey };
