import { Button, TextArea, TextField, Typography } from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SelectField from "@/components/ui/SelectField";
import StepProgress from "@/components/ui/StepProgress";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

// Figma: 모임/08 모임 만들기 - 1단계 (nodeId 101:20859). 3단계 중 1단계 — 이름/유형/소개.
// "모임 유형" Select는 실제 드롭다운을 열지 않는 정적 표시다(옵션 목록이 백엔드에 없음).
const CREW_TYPES = ["상시 운영", "기간 한정", "원데이 모임"];

function CrewNewStep1Screen() {
  const navigate = useNavigate();
  const [crewType, setCrewType] = useState(CREW_TYPES[0]);

  useScreenHeader(
    <div className="flex h-14 w-full items-center gap-3 px-5">
      <button onClick={() => navigate(-1)} type="button">
        <IconChevronLeft className="size-6 text-label-normal" />
      </button>
      <Typography
        color="semantic.label.normal"
        variant="headline2"
        weight="bold"
      >
        모임 만들기
      </Typography>
    </div>,
  );

  return (
    <div className="flex h-full flex-col">
      <div className="scrollbar-hidden flex flex-1 flex-col gap-6 overflow-y-auto px-5 pt-2 pb-5">
        <StepProgress current={1} total={3} />
        <div className="flex flex-col gap-2">
          <Typography
            color="semantic.label.normal"
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
        <div className="flex flex-col gap-2">
          <Typography
            color="semantic.label.normal"
            variant="label1"
            weight="bold"
          >
            모임 이름
          </Typography>
          <TextField
            id="crew-new-name"
            placeholder="모임 이름을 입력해 주세요"
            width="100%"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Typography
            color="semantic.label.normal"
            variant="label1"
            weight="bold"
          >
            모임 유형
          </Typography>
          <SelectField
            onChange={setCrewType}
            options={CREW_TYPES}
            title="모임 유형"
            value={crewType}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Typography
            color="semantic.label.normal"
            variant="label1"
            weight="bold"
          >
            모임 소개
          </Typography>
          <TextArea
            minRows={2}
            placeholder="모임 소개를 입력해 주세요"
            width="100%"
          />
        </div>
      </div>
      <div className="shrink-0 px-5 pt-3 pb-[34px]">
        <Button
          color="primary"
          fullWidth
          onClick={() => navigate("/crew/create/step2")}
          size="large"
          sx={{ backgroundColor: "var(--color-accent-strong)" }}
          variant="solid"
        >
          다음
        </Button>
      </div>
    </div>
  );
}

export default CrewNewStep1Screen;
