import { Button, Typography } from "@wanteddev/wds";
import { IconClose } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Figma: 팀/08 팀 만들기 - 유형 선택 (nodeId 101:23524)

type TeamType = "show" | "independent";

interface TeamTypeOption {
  value: TeamType;
  title: string;
  description: string;
}

const OPTIONS: TeamTypeOption[] = [
  {
    description: "모임 공연에 참가할 팀을 만들어요.",
    title: "공연 참가 팀",
    value: "show",
  },
  {
    description: "모임에 소속되지 않고 자유롭게 합주해요.",
    title: "독립 팀",
    value: "independent",
  },
];

function TeamNewTypeScreen() {
  const navigate = useNavigate();
  const [type, setType] = useState<TeamType>("show");

  return (
    <div className="flex h-full w-full flex-col bg-background">
      <div className="flex h-14 items-center px-5">
        <button onClick={() => navigate(-1)} type="button">
          <IconClose className="size-6 text-label-strong" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-6 px-5 pt-2 pb-5">
        <div className="flex flex-col gap-2">
          <Typography
            color="semantic.label.normal"
            variant="title3"
            weight="bold"
          >
            어떤 팀을 만들까요?
          </Typography>
          <Typography
            color="semantic.label.alternative"
            variant="body2"
            weight="regular"
          >
            팀 유형은 나중에 바꿀 수 없어요
          </Typography>
        </div>

        <div className="flex flex-col gap-3">
          {OPTIONS.map((option) => {
            const isSelected = type === option.value;
            return (
              <button
                className={
                  isSelected
                    ? "rounded-2xl border-[1.5px] border-accent bg-accent-subtle p-5 text-left"
                    : "rounded-2xl border border-line-neutral bg-surface p-5 text-left"
                }
                key={option.value}
                onClick={() => setType(option.value)}
                type="button"
              >
                  <div className="flex items-center gap-2">
                <Typography
                  color="semantic.label.normal"
                  variant="headline2"
                  weight="bold"
                >
                  {option.title}
                </Typography>
                <Typography
                  color="semantic.label.alternative"
                  variant="label2"
                  weight="medium"
                >
                  {option.description}
                </Typography>
                  </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col bg-surface-elevated px-5 pt-3 pb-[34px]">
        <Button
          color="primary"
          fullWidth
          onClick={() =>
            navigate(
              type === "independent"
                ? "/team/create/independent"
                : "/team/create/show",
            )
          }
          size="large"
          variant="solid"
        >
          다음
        </Button>
      </div>
    </div>
  );
}

export default TeamNewTypeScreen;
