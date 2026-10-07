import { Button, Typography } from "@wanteddev/wds";
import { useNavigate, useParams } from "react-router-dom";

import TeamHeroTabs from "@/features/team/components/TeamHeroTabs";

// Figma: 팀/05 팀 일정 (nodeId 101:22543)

interface PracticeSchedule {
  id: string;
  month: string;
  day: string;
  title: string;
  place: string;
}

const PRACTICES: PracticeSchedule[] = [
  {
    day: "7",
    id: "1",
    month: "8월",
    place: "홍대 연습실 A",
    title: "정기 합주",
  },
];

function TeamScheduleScreen() {
  const navigate = useNavigate();
  const { teamId = "" } = useParams();

  return (
    <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto">
      <TeamHeroTabs active="schedule" teamId={teamId} />

      <div className="flex flex-col gap-3 px-5 pt-6 pb-8">
        <div className="flex items-center rounded-2xl bg-surface p-4">
          <Typography
            color="semantic.label.alternative"
            variant="body1"
            weight="medium"
          >
            예정된 공연이 없어요
          </Typography>
        </div>

        <div className="flex items-center pt-3">
          <Typography
            className="flex-1"
            color="semantic.label.normal"
            variant="headline1"
            weight="bold"
          >
            합주·연습 일정
          </Typography>
          <Typography
            color="semantic.label.disable"
            variant="label2"
            weight="medium"
          >
            전체 {PRACTICES.length}개
          </Typography>
        </div>

        {PRACTICES.map((practice) => (
          <div
            className="flex items-center gap-3.5 rounded-2xl bg-surface p-4"
            key={practice.id}
          >
            <div className="flex w-11 flex-col items-center">
              <Typography
                color="semantic.label.alternative"
                variant="caption1"
                weight="bold"
              >
                {practice.month}
              </Typography>
              <Typography
                color="semantic.label.normal"
                variant="headline1"
                weight="bold"
              >
                {practice.day}
              </Typography>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <Typography
                color="semantic.label.normal"
                variant="body1"
                weight="bold"
              >
                {practice.title}
              </Typography>
              <Typography
                color="semantic.label.alternative"
                variant="label2"
                weight="medium"
              >
                {practice.place}
              </Typography>
            </div>
          </div>
        ))}

        <Button
          className="mt-2"
          color="assistive"
          fullWidth
          size="large"
          sx={{ backgroundColor: "var(--color-surface)" }}
          variant="outlined"
          onClick={() => navigate("/schedule/add")}
        >
          합주 일정 추가
        </Button>
      </div>
    </div>
  );
}

export default TeamScheduleScreen;
