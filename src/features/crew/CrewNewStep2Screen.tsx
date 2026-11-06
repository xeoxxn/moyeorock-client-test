import {
  Chip,
  FormField,
  FormLabel,
  FormMessage,
  Typography,
} from "@wanteddev/wds";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import BottomActionArea from "@/components/ui/BottomActionArea";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SelectField from "@/components/ui/SelectField";
import StepProgress from "@/components/ui/StepProgress";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import CoverImageField from "@/features/crew/components/CoverImageField";
import {
  crewCreateDraft,
  resetCrewCreateDraft,
} from "@/features/crew/components/crewCreateDraft";
import {
  GROUP_TYPE_LABEL,
  GROUP_TYPE_OPTIONS,
  REGION_LABEL,
  REGION_OPTIONS,
} from "@/lib/domain/labels";
import type { GroupType, Region } from "@/lib/domain/types";
import { getMe } from "@/mocks/selectors";

// Figma: 모임/09 모임 만들기 2단계 (nodeId 101:21112) — 유형 · 활동 지역 · 대표 이미지. "만들기"가
// POST /groups 자리다. 완료 화면으로는 replace로 가서, 뒤로가기로 이 폼에 다시 들어와 같은 모임을 또
// 만들지 않게 한다. 활동 지역은 내 프로필 지역을 기본으로 둔다.
const REGION_SELECT_OPTIONS = REGION_OPTIONS.map((value) => ({
  label: REGION_LABEL[value],
  value,
}));

function CrewNewStep2Screen() {
  const navigate = useNavigate();
  // 1단계를 건너뛰고 주소로 바로 들어오면 이름이 없어 만들 수 없다 — 처음 마운트 때만 보고 1단계로 보낸다
  // (만들기를 누르면 draft를 비우므로 매 렌더마다 보면 완료 화면으로 가는 길에 되돌려 보낸다).
  const [hasName] = useState(() => crewCreateDraft.name !== "");
  const [type, setType] = useState<GroupType | "">(crewCreateDraft.type);
  const [region, setRegion] = useState<Region>(
    crewCreateDraft.region || getMe().region,
  );

  useScreenHeader(<ScreenHeader title="모임 만들기" />);

  if (!hasName) return <Navigate replace to="/crew/create/step1" />;

  const chooseType = (value: GroupType) => {
    crewCreateDraft.type = value;
    setType(value);
  };

  const chooseRegion = (value: Region) => {
    crewCreateDraft.region = value;
    setRegion(value);
  };

  const create = () => {
    const { name } = crewCreateDraft;
    resetCrewCreateDraft();
    navigate("/crew/create/complete", { replace: true, state: { name } });
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="scrollbar-hidden flex flex-1 flex-col gap-6 overflow-y-auto px-5 pt-2 pb-6">
        <StepProgress current={2} total={2} />
        <div className="flex flex-col gap-1">
          <Typography
            color="semantic.label.strong"
            variant="title3"
            weight="bold"
          >
            마지막으로
            <br />
            활동 정보를 알려주세요
          </Typography>
          <Typography
            color="semantic.label.alternative"
            variant="body2"
            weight="regular"
          >
            모임 소개와 함께 보여져요
          </Typography>
        </div>

        <FormField>
          <FormLabel>모임 유형</FormLabel>
          <div className="flex gap-2">
            {GROUP_TYPE_OPTIONS.map((value) => (
              <Chip
                active={type === value}
                key={value}
                onClick={() => chooseType(value)}
                size="large"
                variant="outlined"
              >
                {GROUP_TYPE_LABEL[value]}
              </Chip>
            ))}
          </div>
          <FormMessage>
            정기형은 꾸준히 함께 활동하고, 프로젝트형은 공연처럼 정한 목표를
            위해 모여요
          </FormMessage>
        </FormField>

        <SelectField
          label="활동 지역"
          onChange={chooseRegion}
          options={REGION_SELECT_OPTIONS}
          value={region}
        />

        <CoverImageField />
      </div>
      <BottomActionArea
        disabled={type === ""}
        label="모임 만들기"
        onClick={create}
      />
    </div>
  );
}

export default CrewNewStep2Screen;
