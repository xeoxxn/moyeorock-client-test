import { List, Typography } from "@wanteddev/wds";
import { IconPlus } from "@wanteddev/wds-icon";
import { type ReactNode, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import EventRow from "@/components/list/EventRow";
import CalendarDay from "@/components/ui/CalendarDay";
import HeaderIconButton from "@/components/ui/HeaderIconButton";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SectionHeader from "@/components/ui/SectionHeader";
import Status from "@/components/ui/Status";
import {
  useScreenBackdrop,
  useScreenHeader,
} from "@/components/ui/useScreenHeader";
import {
  eventMeta,
  eventPath,
  getScheduleEvents,
  type ScheduleEvent,
  startOfDay,
  weekOf,
} from "@/features/schedule/scheduleHelpers";
import { formatDayHeading, formatTime, isSameDay } from "@/lib/domain/format";

// Figma 02 일정(413:11658) — Bottom Nav "일정" 탭 루트. 이번 주 날짜 줄(월~일) + 고른 날의 일정 +
// 다가오는 일정(고른 날 이후, 끝나지 않은 것). 합주는 팀 단위라 + 는 팀을 고르는 합주 일정 추가로 간다.
// 합주를 누르면 그 팀의 합주 탭, 공연을 누르면 공연 상세로 간다.
function EmptyLine({ children }: { children: ReactNode }) {
  return (
    <Typography
      as="p"
      className="px-5 py-2"
      color="semantic.label.assistive"
      variant="body2"
    >
      {children}
    </Typography>
  );
}

function eventLabel(event: ScheduleEvent) {
  return event.kind === "performance" ? (
    <Status tone="accent">공연</Status>
  ) : undefined;
}

function ScheduleScreen() {
  const navigate = useNavigate();
  const [now] = useState(() => new Date());
  const [selected, setSelected] = useState(() => startOfDay(new Date()));

  useScreenHeader(
    useMemo(
      () => (
        <ScreenHeader
          title="일정"
          trailing={
            <HeaderIconButton
              icon={<IconPlus />}
              label="합주 일정 추가"
              onClick={() => navigate("/schedule/add")}
            />
          }
          variant="title"
        />
      ),
      [navigate],
    ),
  );
  useScreenBackdrop("stage");

  const week = weekOf(now);
  const events = getScheduleEvents();
  const dayEvents = events.filter((event) => isSameDay(event.start, selected));
  const upcoming = events.filter(
    (event) => startOfDay(event.start) > selected && event.end >= now,
  );

  return (
    <ScreenBody>
      <Typography
        as="p"
        className="px-5"
        color="semantic.label.alternative"
        variant="label2"
      >
        {now.getFullYear()}년 {now.getMonth() + 1}월 · 이번 주
      </Typography>
      <div className="flex px-5 pt-3">
        {week.map((day) => (
          <CalendarDay
            date={day}
            hasEvent={events.some((event) => isSameDay(event.start, day))}
            key={day.getTime()}
            onSelect={() => setSelected(day)}
            selected={isSameDay(day, selected)}
            today={isSameDay(day, now)}
          />
        ))}
      </div>

      <SectionHeader title={formatDayHeading(selected)} />
      {dayEvents.length === 0 ? (
        <EmptyLine>이 날은 일정이 없어요</EmptyLine>
      ) : (
        <List>
          {dayEvents.map((event) => (
            <EventRow
              date={event.start}
              key={event.key}
              label={eventLabel(event)}
              leadingText={formatTime(event.startsAt)}
              meta={eventMeta(event)}
              onClick={() => navigate(eventPath(event))}
              title={event.item.title}
            />
          ))}
        </List>
      )}

      <SectionHeader title="다가오는 일정" />
      {upcoming.length === 0 ? (
        <EmptyLine>다가오는 일정이 없어요</EmptyLine>
      ) : (
        <List>
          {upcoming.map((event) => (
            <EventRow
              date={event.start}
              key={event.key}
              label={eventLabel(event)}
              meta={eventMeta(event, now)}
              onClick={() => navigate(eventPath(event))}
              title={event.item.title}
            />
          ))}
        </List>
      )}
    </ScreenBody>
  );
}

export default ScheduleScreen;
