import { Typography, WithInteraction } from "@wanteddev/wds";

import { cn } from "@/lib/cn";
import { weekdayLabel } from "@/lib/domain/format";

// Figma "Calendar/Day"(553:23047) — 일정 화면의 주간 날짜 한 칸: 요일 + 날짜 + 일정 점.
// 고른 날은 흰 10% 반투명(단색 대신), 오늘의 점은 주홍.
interface CalendarDayProps {
  date: Date;
  selected: boolean;
  today: boolean;
  hasEvent: boolean;
  onSelect: () => void;
}

function CalendarDay({
  date,
  hasEvent,
  onSelect,
  selected,
  today,
}: CalendarDayProps) {
  return (
    <WithInteraction variant="light">
      <button
        aria-pressed={selected}
        className={cn(
          "flex flex-1 flex-col items-center gap-1.5 rounded-md py-2.5",
          selected && "bg-label-strong/10",
        )}
        onClick={onSelect}
        type="button"
      >
        <Typography
          as="span"
          color="semantic.label.assistive"
          variant="caption1"
          weight="medium"
        >
          {weekdayLabel(date)}
        </Typography>
        <Typography
          as="span"
          color={
            selected ? "semantic.label.strong" : "semantic.label.alternative"
          }
          variant="body1"
          weight="bold"
        >
          {date.getDate()}
        </Typography>
        <span
          className={cn(
            "size-1 rounded-full",
            hasEvent
              ? today
                ? "bg-accent-text"
                : "bg-label-assistive"
              : "bg-transparent",
          )}
        />
      </button>
    </WithInteraction>
  );
}

export default CalendarDay;
