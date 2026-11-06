import { Typography } from "@wanteddev/wds";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomActionArea from "@/components/ui/BottomActionArea";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import SelectableCard from "@/features/team/components/SelectableCard";
import { TEAM_KIND_LABEL } from "@/lib/domain/labels";

type TeamKind = keyof typeof TEAM_KIND_LABEL;

const OPTIONS: { value: TeamKind; description: string; path: string }[] = [
  {
    description:
      "모임 없이 꾸리는 밴드예요. 만들자마자 선택곡·합주 일정을 함께 관리해요.",
    path: "/team/create/independent",
    value: "independent",
  },
  {
    description:
      "내가 속한 모임의 공연에 나가는 팀이에요. 다음 단계에서 참가할 공연을 골라요.",
    path: "/team/create/show",
    value: "performance",
  },
];

// Figma: 팀/08 팀 만들기 - 유형 선택 (nodeId 101:23524). 서버의 팀 종류 두 가지(독립 팀 / 공연 팀)를
// 고른다. 공연 팀은 공연에 속해야 해서(POST /performances/{id}/teams) 공연 선택 단계를 거친다.
function TeamNewTypeScreen() {
  const navigate = useNavigate();
  const [kind, setKind] = useState<TeamKind>("independent");

  useScreenHeader(<ScreenHeader title="팀 만들기" />);

  const selected = OPTIONS.find((option) => option.value === kind);

  return (
    <>
      <div className="scrollbar-hidden flex flex-1 flex-col gap-6 overflow-y-auto px-5 pt-2 pb-8">
        <div className="flex flex-col gap-2">
          <Typography
            color="semantic.label.strong"
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
            팀 종류는 나중에 바꿀 수 없어요
          </Typography>
        </div>

        <div className="flex flex-col gap-3">
          {OPTIONS.map((option) => (
            <SelectableCard
              key={option.value}
              onSelect={() => setKind(option.value)}
              selected={kind === option.value}
            >
              <Typography
                color="semantic.label.strong"
                variant="headline2"
                weight="bold"
              >
                {TEAM_KIND_LABEL[option.value]}
              </Typography>
              <Typography
                color="semantic.label.alternative"
                variant="label2"
                weight="medium"
              >
                {option.description}
              </Typography>
            </SelectableCard>
          ))}
        </div>
      </div>

      <BottomActionArea
        label="다음"
        onClick={() => {
          if (selected) navigate(selected.path);
        }}
      />
    </>
  );
}

export default TeamNewTypeScreen;
