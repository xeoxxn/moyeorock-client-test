import { Button, Typography, WithInteraction } from "@wanteddev/wds";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import PressableCard from "@/components/ui/PressableCard";
import { formatTimeRange, isSameDay, weekdayLabel } from "@/lib/domain/format";
import type { Rehearsal } from "@/lib/domain/types";
import { getMyTeams, getRehearsals, getTeam } from "@/mocks/selectors";

const DAY_COUNT = 5;

const DAY_CLASS =
  "flex flex-1 flex-col items-center gap-0.5 rounded-2xl border border-line-neutral bg-surface py-2.5";
const SELECTED_DAY_CLASS =
  "flex flex-1 flex-col items-center gap-0.5 rounded-2xl bg-accent-strong py-2.5 shadow-neon-md";

function upcomingDays(count: number): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Array.from({ length: count }, (_, offset) => {
    const day = new Date(today);
    day.setDate(today.getDate() + offset);
    return day;
  });
}

function RehearsalCard({ rehearsal }: { rehearsal: Rehearsal }) {
  const navigate = useNavigate();
  const teamName = getTeam(rehearsal.teamId)?.name;

  return (
    <PressableCard
      onClick={() => navigate(`/team/${rehearsal.teamId}/schedule`)}
    >
      <div className="flex items-stretch gap-3.5">
        <div className="w-1 shrink-0 rounded-full bg-accent shadow-neon-sm" />
        <div className="flex min-w-0 flex-col gap-0.5">
          <Typography
            className="text-glow-sm"
            color="semantic.primary.normal"
            variant="caption1"
            weight="bold"
          >
            {formatTimeRange(rehearsal.startsAt, rehearsal.endsAt)}
          </Typography>
          <Typography
            color="semantic.label.strong"
            variant="headline2"
            weight="bold"
          >
            {rehearsal.title}
          </Typography>
          <Typography
            className="truncate"
            color="semantic.label.alternative"
            variant="label2"
            weight="regular"
          >
            {teamName ? `${rehearsal.place} · ${teamName}` : rehearsal.place}
          </Typography>
        </div>
      </div>
    </PressableCard>
  );
}

// 홈 "오늘의 일정" — 오늘부터 5일 동안의 내 합주(GET /users/me/rehearsals). 날짜 칸을 누르면 그날 합주로
// 아래 카드가 바뀐다(처음엔 오늘). Figma "홈/02 일정 없는 날"(101:11660)은 별도 화면이 아니라 고른
// 날에 합주가 없을 때의 빈 카드다.
function HomeWeekSchedule() {
  const navigate = useNavigate();
  const days = useMemo(() => upcomingDays(DAY_COUNT), []);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const rehearsals = getRehearsals();
  // 합주는 팀 단위로만 만들 수 있다 — 속한 팀이 없으면 "추가"를 눌러도 고를 팀이 없다.
  const canAddRehearsal = getMyTeams().length > 0;

  const rehearsalsOf = (day: Date) =>
    rehearsals.filter((rehearsal) =>
      isSameDay(new Date(rehearsal.startsAt), day),
    );

  const selectedDay = days[selectedIndex];
  const selectedRehearsals = rehearsalsOf(selectedDay);
  const selectedDayLabel =
    selectedIndex === 0
      ? "오늘은"
      : `${selectedDay.getMonth() + 1}월 ${selectedDay.getDate()}일은`;

  return (
    <>
      <div className="flex gap-1.5">
        {days.map((day, index) => {
          const count = rehearsalsOf(day).length;
          const selected = index === selectedIndex;
          return (
            <WithInteraction key={day.toISOString()} variant="light">
              <button
                aria-label={`${day.getMonth() + 1}월 ${day.getDate()}일 ${weekdayLabel(day)}요일, 합주 ${count}건`}
                aria-pressed={selected}
                className={selected ? SELECTED_DAY_CLASS : DAY_CLASS}
                onClick={() => setSelectedIndex(index)}
                type="button"
              >
                <Typography
                  color={
                    selected
                      ? "semantic.static.white"
                      : "semantic.label.assistive"
                  }
                  variant="caption2"
                  weight="bold"
                >
                  {index === 0 ? "오늘" : weekdayLabel(day)}
                </Typography>
                <Typography
                  color={
                    selected ? "semantic.static.white" : "semantic.label.strong"
                  }
                  variant="headline1"
                  weight="bold"
                >
                  {day.getDate()}
                </Typography>
                {/* 건수가 없는 날도 줄 높이를 맞추려고 빈 칸을 둔다 */}
                <Typography
                  color={
                    selected
                      ? "semantic.static.white"
                      : "semantic.primary.normal"
                  }
                  variant="caption2"
                  weight="medium"
                >
                  {count > 0 ? `${count}건` : " "}
                </Typography>
              </button>
            </WithInteraction>
          );
        })}
      </div>

      {selectedRehearsals.length > 0 ? (
        selectedRehearsals.map((rehearsal) => (
          <RehearsalCard key={rehearsal.id} rehearsal={rehearsal} />
        ))
      ) : (
        <PressableCard>
          <div className="flex items-center gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <Typography
                color="semantic.label.strong"
                variant="body1"
                weight="bold"
              >
                {selectedDayLabel} 일정이 없어요
              </Typography>
              <Typography
                color="semantic.label.alternative"
                variant="label2"
                weight="regular"
              >
                {canAddRehearsal
                  ? "새 합주 일정을 추가해 볼까요?"
                  : "팀에 들어가면 합주 일정을 잡을 수 있어요"}
              </Typography>
            </div>
            {canAddRehearsal && (
              <Button
                color="primary"
                onClick={() => navigate("/schedule/add")}
                size="small"
                variant="solid"
              >
                추가
              </Button>
            )}
          </div>
        </PressableCard>
      )}
    </>
  );
}

export default HomeWeekSchedule;
