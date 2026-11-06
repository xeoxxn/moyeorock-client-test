import { TopNavigationButton, Typography } from "@wanteddev/wds";
import { IconPersons, IconPlus } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import mascotSleep from "@/assets/mascot/sleep.png";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import MetaItem from "@/components/ui/MetaItem";
import PressableCard from "@/components/ui/PressableCard";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SectionHeader from "@/components/ui/SectionHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import MonthCalendar from "@/features/schedule/components/MonthCalendar";
import {
  formatDate,
  formatDday,
  formatTimeRange,
  isSameDay,
} from "@/lib/domain/format";
import type { Rehearsal } from "@/lib/domain/types";
import { getRehearsals, getTeam } from "@/mocks/selectors";

// Figma: 일정/02 다가오는 일정 (101:12493) · 일정/01 비어있음 (101:12181 — 같은 화면의 빈 상태).
// 서버 GET /users/me/rehearsals(내 팀들의 합주)를 보여준다. 합주 상세 화면은 없어서(서버에도 단건 조회
// 화면 흐름이 없다) 합주를 누르면 그 팀의 일정 탭으로 간다.

function RehearsalCard({
  rehearsal,
  dday,
}: {
  rehearsal: Rehearsal;
  /** 다가오는 일정 목록에서만 D-day 배지를 붙인다. emphasized = 가장 가까운 합주 */
  dday?: { emphasized: boolean };
}) {
  const navigate = useNavigate();
  const startsAt = new Date(rehearsal.startsAt);
  const teamName = getTeam(rehearsal.teamId)?.name;
  const detail = [
    formatTimeRange(rehearsal.startsAt, rehearsal.endsAt),
    rehearsal.place,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <PressableCard
      aria-label={`${rehearsal.title} — ${teamName ?? ""} 일정 보기`}
      onClick={() => navigate(`/team/${rehearsal.teamId}/schedule`)}
    >
      <div className="flex items-center gap-3.5">
        <div className="flex w-12 shrink-0 flex-col items-center">
          <Typography
            color="semantic.label.assistive"
            variant="caption1"
            weight="bold"
          >
            {startsAt.getMonth() + 1}월
          </Typography>
          <Typography
            color="semantic.label.normal"
            variant="headline1"
            weight="bold"
          >
            {startsAt.getDate()}
          </Typography>
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
          <div className="flex w-full min-w-0 items-center gap-1.5">
            <Typography
              className="min-w-0 truncate"
              color="semantic.label.strong"
              variant="body1"
              weight="bold"
            >
              {rehearsal.title}
            </Typography>
            {dday && (
              <Badge
                glow={dday.emphasized}
                tone={dday.emphasized ? "accent" : "outline"}
              >
                {formatDday(rehearsal.startsAt)}
              </Badge>
            )}
          </div>
          <Typography
            className="w-full truncate"
            color="semantic.label.alternative"
            variant="label2"
            weight="medium"
          >
            {detail}
          </Typography>
          {teamName && <MetaItem icon={<IconPersons />}>{teamName}</MetaItem>}
        </div>
      </div>
    </PressableCard>
  );
}

function ScheduleScreen() {
  const navigate = useNavigate();
  const today = new Date();
  const [month, setMonth] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);

  useScreenHeader(
    <ScreenHeader
      title="일정"
      trailing={
        <TopNavigationButton
          aria-label="합주 일정 추가"
          onClick={() => navigate("/schedule/add")}
        >
          <IconPlus />
        </TopNavigationButton>
      }
      variant="title"
    />,
  );

  const rehearsals = getRehearsals();
  // 오늘 이미 끝난 합주는 "다가오는" 목록에서 뺀다(캘린더에서 그날을 누르면 여전히 보인다).
  const upcoming = rehearsals.filter(
    (rehearsal) => new Date(rehearsal.endsAt) >= today,
  );
  const dayRehearsals = rehearsals.filter((rehearsal) =>
    isSameDay(new Date(rehearsal.startsAt), selectedDate),
  );
  const isEmpty = upcoming.length === 0 && dayRehearsals.length === 0;

  return (
    <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto">
      <MonthCalendar
        markedDates={rehearsals.map(
          (rehearsal) => new Date(rehearsal.startsAt),
        )}
        month={month}
        onMonthChange={setMonth}
        onSelectDate={setSelectedDate}
        selectedDate={selectedDate}
      />
      <div className="h-3 w-full shrink-0 bg-surface" />

      {isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center px-5 py-8">
          <img
            alt=""
            className="aspect-square w-1/3 max-w-32 object-contain drop-shadow-neon-md"
            src={mascotSleep}
          />
          <EmptyState
            action={{
              label: "합주 일정 추가",
              onClick: () => navigate("/schedule/add"),
            }}
            description="팀 합주 일정을 추가하면 여기에 모여요"
            title="예정된 합주가 없어요"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-8 px-5 pt-6 pb-8">
          <section className="flex flex-col gap-3">
            <SectionHeader
              title={`${formatDate(selectedDate.toISOString())}${isSameDay(selectedDate, today) ? " · 오늘" : ""}`}
            />
            {dayRehearsals.length === 0 ? (
              <Typography
                color="semantic.label.assistive"
                variant="label1"
                weight="medium"
              >
                이 날은 합주 일정이 없어요
              </Typography>
            ) : (
              dayRehearsals.map((rehearsal) => (
                <RehearsalCard key={rehearsal.id} rehearsal={rehearsal} />
              ))
            )}
          </section>

          <section className="flex flex-col gap-3">
            <SectionHeader count={upcoming.length} title="다가오는 일정" />
            {upcoming.length === 0 ? (
              <Typography
                color="semantic.label.assistive"
                variant="label1"
                weight="medium"
              >
                예정된 합주가 없어요
              </Typography>
            ) : (
              upcoming.map((rehearsal, index) => (
                <RehearsalCard
                  dday={{ emphasized: index === 0 }}
                  key={rehearsal.id}
                  rehearsal={rehearsal}
                />
              ))
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default ScheduleScreen;
