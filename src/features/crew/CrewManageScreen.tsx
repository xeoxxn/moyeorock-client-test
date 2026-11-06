import {
  Divider,
  List,
  ListCell,
  ListCellContent,
  TextButton,
  Typography,
  useToast,
} from "@wanteddev/wds";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Badge from "@/components/ui/Badge";
import BottomActionArea from "@/components/ui/BottomActionArea";
import SectionHeader from "@/components/ui/SectionHeader";
import SelectField from "@/components/ui/SelectField";
import TextInputField from "@/components/ui/TextInputField";
import { useAppAlert } from "@/components/ui/useAppAlert";
import CoverImageField from "@/features/crew/components/CoverImageField";
import {
  CrewNotFound,
  CrewOwnerOnly,
} from "@/features/crew/components/CrewFallback";
import CrewHeroTabs from "@/features/crew/components/CrewHeroTabs";
import {
  GROUP_TYPE_LABEL,
  GROUP_TYPE_OPTIONS,
  REGION_LABEL,
  REGION_OPTIONS,
} from "@/lib/domain/labels";
import type { Group, GroupType, Region } from "@/lib/domain/types";
import { getGroup, getReceivedJoinRequests, toId } from "@/mocks/selectors";

// Figma: 모임/06 모임 관리 (nodeId 101:20366) — 모임장 전용. 서버 PUT /groups/{id}가 받는 정보(이름 ·
// 소개 · 유형 · 활동 지역 · 대표 이미지)를 고치고, 가입 신청 관리(모임/13)·공지 쓰기(모임/11)로 간다.
// Figma에는 유형·지역 칸이 없었지만 서버가 수정할 수 있는 값이라 넣었다. 모임 해체(PATCH status,
// 서버 soft delete)는 되돌릴 수 없어서 맨 아래에 따로 두고 확인을 받는다.
interface GroupForm {
  name: string;
  description: string;
  type: GroupType;
  region: Region;
}

const TYPE_OPTIONS = GROUP_TYPE_OPTIONS.map((value) => ({
  label: GROUP_TYPE_LABEL[value],
  value,
}));

const REGION_SELECT_OPTIONS = REGION_OPTIONS.map((value) => ({
  label: REGION_LABEL[value],
  value,
}));

function isSameForm(a: GroupForm, b: GroupForm) {
  return (
    a.name === b.name &&
    a.description === b.description &&
    a.type === b.type &&
    a.region === b.region
  );
}

function CrewManage({ group }: { group: Group }) {
  const navigate = useNavigate();
  const alert = useAppAlert();
  const toast = useToast();
  const [saved, setSaved] = useState<GroupForm>({
    description: group.description,
    name: group.name,
    region: group.region,
    type: group.type,
  });
  const [form, setForm] = useState<GroupForm>(saved);
  const pendingCount = getReceivedJoinRequests("GROUP", group.id).length;

  const canSave = !isSameForm(form, saved) && form.name.trim() !== "";

  const update = <K extends keyof GroupForm>(key: K, value: GroupForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const save = () => {
    const next = { ...form, name: form.name.trim() };
    setForm(next);
    setSaved(next);
    toast({ content: "모임 정보를 저장했어요", variant: "positive" });
  };

  const disband = async () => {
    const result = await alert({
      cancel: "취소",
      confirm: "해체",
      content:
        "해체하면 모든 멤버가 모임에서 빠지고, 공지와 공연 기록을 더 볼 수 없어요. 되돌릴 수 없어요.",
      title: "모임을 해체할까요?",
    });
    if (result !== "confirm") return;
    toast({ content: "모임을 해체했어요" });
    navigate("/crew", { replace: true });
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="scrollbar-hidden flex-1 overflow-y-auto">
        <CrewHeroTabs active="manage" group={group} />

        <section className="flex flex-col gap-1 px-5 pt-6">
          <SectionHeader title="운영" />
          <List>
            <ListCell
              trailingContent={
                // 셀 어디를 눌러도 WDS ListCell이 이 chevron을 대신 눌러 준다(셀에도 달면 두 번 불린다).
                <ListCellContent
                  aria-label="가입 신청 관리로 이동"
                  onClick={() => navigate(`/crew/${group.id}/applications`)}
                  variant="chevron"
                >
                  {pendingCount > 0 && <Badge glow>대기 {pendingCount}</Badge>}
                </ListCellContent>
              }
            >
              가입 신청 관리
            </ListCell>
            <ListCell
              trailingContent={
                <ListCellContent
                  aria-label="공지 쓰기로 이동"
                  onClick={() => navigate(`/crew/${group.id}/notice/new`)}
                  variant="chevron"
                />
              }
            >
              공지 쓰기
            </ListCell>
          </List>
        </section>

        <section className="flex flex-col gap-5 px-5 pt-6 pb-8">
          <SectionHeader title="모임 정보" />
          <TextInputField
            label="모임 이름"
            maxLength={30}
            onChange={(value) => update("name", value)}
            placeholder="모임 이름을 입력해 주세요"
            value={form.name}
          />
          <TextInputField
            label="소개"
            multiline
            onChange={(value) => update("description", value)}
            placeholder="어떤 음악을 함께하는 모임인지 알려 주세요"
            value={form.description}
          />
          <SelectField
            label="모임 유형"
            onChange={(value) => update("type", value)}
            options={TYPE_OPTIONS}
            value={form.type}
          />
          <SelectField
            label="활동 지역"
            onChange={(value) => update("region", value)}
            options={REGION_SELECT_OPTIONS}
            value={form.region}
          />
          <CoverImageField />
        </section>

        <Divider
          color="semantic.background.normal.normal"
          thickness="0.75rem"
        />

        <section className="flex flex-col items-start gap-1 px-5 pt-6 pb-8">
          <Typography
            color="semantic.label.strong"
            variant="headline2"
            weight="bold"
          >
            모임 해체
          </Typography>
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="regular"
          >
            해체한 모임은 되돌릴 수 없어요.
          </Typography>
          <TextButton color="primary" onClick={disband} size="small">
            모임 해체하기
          </TextButton>
        </section>
      </div>

      <BottomActionArea
        disabled={!canSave}
        label="변경 내용 저장"
        onClick={save}
      />
    </div>
  );
}

function CrewManageScreen() {
  const { crewId } = useParams();
  const group = getGroup(toId(crewId));
  if (!group) return <CrewNotFound />;
  if (group.myRole !== "OWNER") return <CrewOwnerOnly crewId={group.id} />;
  return <CrewManage group={group} />;
}

export default CrewManageScreen;
