import { Typography } from "@wanteddev/wds";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Cover, { type CoverTone } from "@/components/music/Cover";
import BottomActionArea from "@/components/ui/BottomActionArea";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import RadioOptionList from "@/features/team/components/RadioOptionList";
import { TEAM_KIND_LABEL } from "@/lib/domain/labels";

type TeamKind = keyof typeof TEAM_KIND_LABEL;

const OPTIONS: {
  value: TeamKind;
  description: string;
  path: string;
  tone: CoverTone;
}[] = [
  {
    description: "모임 없이 꾸리는 밴드예요. 선택곡·합주를 바로 시작해요.",
    path: "/team/create/independent",
    tone: "teal",
    value: "independent",
  },
  {
    description: "내 모임의 공연에 나가는 팀이에요. 다음에 공연을 골라요.",
    path: "/team/create/show",
    tone: "red",
    value: "performance",
  },
];

// 팀 만들기 1단계 — 서버의 팀 종류 두 가지(독립 팀 POST /teams · 공연 팀 POST /performances/{id}/teams)
// 중 고른다. 공연 팀은 공연에 속해야 해서 공연 고르기 단계를 거친다. 질문 + 고르는 목록 + 하단 버튼은
// Figma 22(세션 선택)와 같은 모양.
function TeamNewTypeScreen() {
  const navigate = useNavigate();
  const [kind, setKind] = useState<TeamKind>("independent");

  useScreenHeader(useMemo(() => <ScreenHeader title="팀 만들기" />, []));

  const selected = OPTIONS.find((option) => option.value === kind);

  return (
    <>
      <ScreenBody>
        <div className="flex flex-col gap-1 px-5 pt-2 pb-4">
          <Typography
            as="h1"
            color="semantic.label.strong"
            variant="heading1"
            weight="bold"
          >
            어떤 팀을 만들까요?
          </Typography>
          <Typography color="semantic.label.alternative" variant="body2">
            팀 종류는 나중에 바꿀 수 없어요
          </Typography>
        </div>
        <RadioOptionList
          onValueChange={(value) => setKind(value as TeamKind)}
          options={OPTIONS.map((option) => ({
            caption: option.description,
            leading: (
              <Cover className="size-14 rounded-sm" tone={option.tone} />
            ),
            title: TEAM_KIND_LABEL[option.value],
            value: option.value,
          }))}
          value={kind}
        />
      </ScreenBody>

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
