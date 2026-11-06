import { Typography } from "@wanteddev/wds";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomActionArea from "@/components/ui/BottomActionArea";
import ScreenHeader from "@/components/ui/ScreenHeader";
import StepProgress from "@/components/ui/StepProgress";
import TextInputField from "@/components/ui/TextInputField";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import { crewCreateDraft } from "@/features/crew/components/crewCreateDraft";

// Figma: 모임/08 모임 만들기 1단계 (nodeId 101:20859) — 이름 · 소개. Figma는 3단계에 "상시 운영 ·
// 기간 한정 · 원데이" 유형을 1단계에서 받았지만, 서버 GroupType은 정기형/프로젝트형 둘뿐이고
// 단계도 2개라 유형은 지역과 함께 2단계로 옮겼다.
function CrewNewStep1Screen() {
  const navigate = useNavigate();
  const [name, setName] = useState(crewCreateDraft.name);
  const [description, setDescription] = useState(crewCreateDraft.description);

  useScreenHeader(<ScreenHeader title="모임 만들기" />);

  const next = () => {
    crewCreateDraft.name = name.trim();
    crewCreateDraft.description = description.trim();
    navigate("/crew/create/step2");
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="scrollbar-hidden flex flex-1 flex-col gap-6 overflow-y-auto px-5 pt-2 pb-6">
        <StepProgress current={1} total={2} />
        <div className="flex flex-col gap-1">
          <Typography
            color="semantic.label.strong"
            variant="title3"
            weight="bold"
          >
            어떤 모임을 만들까요?
          </Typography>
          <Typography
            color="semantic.label.alternative"
            variant="body2"
            weight="regular"
          >
            만들면 내가 모임장이 돼요
          </Typography>
        </div>
        <TextInputField
          label="모임 이름"
          maxLength={30}
          onChange={setName}
          placeholder="모임 이름을 입력해 주세요"
          value={name}
        />
        <TextInputField
          label="모임 소개"
          multiline
          onChange={setDescription}
          placeholder="어떤 음악을 함께하는 모임인지 알려 주세요"
          value={description}
        />
      </div>
      <BottomActionArea
        disabled={name.trim() === ""}
        label="다음"
        onClick={next}
      />
    </div>
  );
}

export default CrewNewStep1Screen;
