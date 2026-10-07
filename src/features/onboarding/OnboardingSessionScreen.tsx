import { Button, Typography } from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import StepProgress from "@/components/ui/StepProgress";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import SelectableChip from "@/features/onboarding/components/SelectableChip";

const SESSIONS = [
  "보컬",
  "일렉 기타",
  "어쿠스틱 기타",
  "베이스",
  "드럼",
  "키보드",
];
const LEVELS = ["입문", "초급", "중급", "고급"];

// Figma: 온보딩/04 프로필 설정 - 세션 (nodeId 101:11407). 프로필 설정 3단계 중 2단계.
function OnboardingSessionScreen() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<string[]>([
    "어쿠스틱 기타",
    "키보드",
  ]);
  const [level, setLevel] = useState("입문");

  useScreenHeader(
    <ScreenHeader
      leading={
        <button onClick={() => navigate(-1)} type="button">
          <IconChevronLeft className="size-6 text-label-strong" />
        </button>
      }
      variant="normal"
    />,
  );

  const toggleSession = (session: string) => {
    setSessions((prev) =>
      prev.includes(session)
        ? prev.filter((item) => item !== session)
        : [...prev, session],
    );
  };

  return (
    <div className="flex h-full w-full flex-col bg-background px-5">
      <div className="flex flex-1 flex-col gap-7 overflow-y-auto pt-2">
        <StepProgress current={2} total={3} />
        <div className="flex flex-col gap-2">
          <Typography
            color="semantic.label.strong"
            variant="title3"
            weight="bold"
          >
            어떤 세션을 맡고 있나요?
          </Typography>
          <Typography
            color="semantic.label.assistive"
            variant="label1"
            weight="regular"
          >
            여러 개를 골라도 괜찮아요
          </Typography>
        </div>
        <div className="flex flex-col gap-3">
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="medium"
          >
            내 세션
          </Typography>
          <div className="flex flex-wrap gap-2">
            {SESSIONS.map((session) => (
              <SelectableChip
                key={session}
                label={session}
                onClick={() => toggleSession(session)}
                selected={sessions.includes(session)}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="medium"
          >
            연주 실력
          </Typography>
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((item) => (
              <SelectableChip
                key={item}
                label={item}
                onClick={() => setLevel(item)}
                selected={level === item}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center pt-3 pb-[34px]">
        <Button
          color="primary"
          disabled={sessions.length === 0}
          fullWidth
          onClick={() => navigate("/onboarding/preference")}
          size="large"
          variant="solid"
        >
          다음
        </Button>
      </div>
    </div>
  );
}

export default OnboardingSessionScreen;
