import { SegmentedControl, SegmentedControlItem } from "@wanteddev/wds";
import FieldLabel from "@/components/ui/FieldLabel";
import SelectField from "@/components/ui/SelectField";
import TextInputField from "@/components/ui/TextInputField";
import {
  GROUP_TYPE_LABEL,
  GROUP_TYPE_OPTIONS,
  REGION_LABEL,
  REGION_OPTIONS,
} from "@/lib/domain/labels";
import type { GroupType, Region } from "@/lib/domain/types";

// 모임 만들기(POST /groups)와 모임 정보 수정(PUT /groups/{id})이 같은 본문(GroupCreateRequest =
// GroupUpdateRequest)을 받아서 칸도 같이 쓴다. 대표 이미지(coverImage)는 업로드 API가 아직 없어 뺐다 —
// 사진이 없으면 커버색 표지(Cover)를 그린다. 지역은 서버 기준 시·도 단위다.
export interface CrewInfo {
  name: string;
  type: GroupType;
  region: Region | "";
  description: string;
}

export const CREW_NAME_MAX = 30;

export function isCrewInfoValid(info: CrewInfo): boolean {
  return info.name.trim() !== "" && info.region !== "";
}

const REGION_SELECT_OPTIONS = REGION_OPTIONS.map((value) => ({
  label: REGION_LABEL[value],
  value,
}));

interface CrewInfoFieldsProps {
  value: CrewInfo;
  onChange: (next: CrewInfo) => void;
}

function CrewInfoFields({ onChange, value }: CrewInfoFieldsProps) {
  const update = <K extends keyof CrewInfo>(key: K, next: CrewInfo[K]) =>
    onChange({ ...value, [key]: next });

  return (
    <>
      <TextInputField
        label="이름"
        maxLength={CREW_NAME_MAX}
        onChange={(next) => update("name", next)}
        placeholder="모임 이름"
        value={value.name}
      />

      <div className="flex flex-col gap-2">
        <FieldLabel>모임 유형</FieldLabel>
        <SegmentedControl
          aria-label="모임 유형"
          onValueChange={(next) => update("type", next as GroupType)}
          size="large"
          value={value.type}
        >
          {GROUP_TYPE_OPTIONS.map((type) => (
            <SegmentedControlItem key={type} value={type}>
              {GROUP_TYPE_LABEL[type]}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
      </div>

      <SelectField
        label="지역"
        onChange={(next) => update("region", next)}
        options={REGION_SELECT_OPTIONS}
        placeholder="활동 지역을 골라 주세요"
        value={value.region}
      />

      <TextInputField
        label="소개"
        multiline
        onChange={(next) => update("description", next)}
        placeholder="어떤 음악을 함께하는 모임인지 적어 주세요"
        value={value.description}
      />
    </>
  );
}

export default CrewInfoFields;
