import type { GroupType, Region } from "@/lib/domain/types";

// 모임 만들기 1·2단계가 나눠 채우는 POST /groups 요청 본문(GroupCreateRequest — 대표 이미지는 업로드가
// 아직 없어 뺐다). 각 단계 화면은 따로 마운트되므로, 2단계에서 뒤로 가도 1단계 입력이 남도록 화면
// state가 아니라 여기에 둔다. 만들기를 누르면 비운다.
export interface CrewCreateDraft {
  name: string;
  description: string;
  type: GroupType | "";
  region: Region | "";
}

const EMPTY_DRAFT: CrewCreateDraft = {
  description: "",
  name: "",
  region: "",
  type: "",
};

export const crewCreateDraft: CrewCreateDraft = { ...EMPTY_DRAFT };

export function resetCrewCreateDraft() {
  Object.assign(crewCreateDraft, EMPTY_DRAFT);
}
