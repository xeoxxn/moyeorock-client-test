import {
  ActionArea,
  ActionAreaButton,
  Typography,
  useToast,
} from "@wanteddev/wds";
import { useState } from "react";

import BottomSheet from "@/components/ui/BottomSheet";
import ChipGrid from "@/components/ui/ChipGrid";
import FieldLabel from "@/components/ui/FieldLabel";
import SelectField from "@/components/ui/SelectField";
import TextInputField from "@/components/ui/TextInputField";
import {
  INSTRUMENT_LABEL,
  INSTRUMENT_OPTIONS,
  TARGET_TYPE_LABEL,
} from "@/lib/domain/labels";
import type { Instrument, User } from "@/lib/domain/types";
import { getPostableTargets } from "@/mocks/selectors";

// 초대 보내기 시트 — POST /v1/invitations. 팀 멤버 탭(AI 추천)·저장한 유저·다른 사용자 프로필이 함께 쓴다.
// 초대는 팀장(내 팀)·모임장(내 모임)만 보낼 수 있어서 초대할 곳은 그 목록에서 고른다(공연 팀도 초대로
// 팀원을 모은다). 팀 초대는 세션 필수, 모임 초대는 세션 없음(서버 규칙). 들어온 화면이 특정 팀이면
// defaultTargetKey로 미리 고른다.
interface InviteSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invitee: User;
  /** "TEAM:1"·"GROUP:1" 형식. 팀 화면에서 열면 그 팀이 미리 선택된다. */
  defaultTargetKey?: string;
  onInvited?: (targetKey: string) => void;
}

const INSTRUMENT_CHOICES = INSTRUMENT_OPTIONS.map((item) => ({
  label: INSTRUMENT_LABEL[item],
  value: item,
}));

function InviteSheet({
  defaultTargetKey,
  invitee,
  onInvited,
  onOpenChange,
  open,
}: InviteSheetProps) {
  const toast = useToast();
  const targets = getPostableTargets();
  const options = targets.map((target) => ({
    label: `${target.name} · ${TARGET_TYPE_LABEL[target.targetType]}`,
    value: `${target.targetType}:${target.id}`,
  }));
  const [targetKey, setTargetKey] = useState(
    defaultTargetKey ?? options[0]?.value ?? "",
  );
  const [instrument, setInstrument] = useState<Instrument | null>(
    invitee.instruments[0]?.instrument ?? null,
  );
  const [message, setMessage] = useState("");

  const target = targets.find(
    (item) => `${item.targetType}:${item.id}` === targetKey,
  );
  const needsInstrument = target?.targetType === "TEAM";
  const canSubmit =
    target !== undefined && (!needsInstrument || instrument !== null);

  const submit = () => {
    if (!target) return;
    onOpenChange(false);
    onInvited?.(targetKey);
    toast({
      content: `${invitee.nickname}님을 ${target.name}에 초대했어요`,
      variant: "positive",
    });
  };

  return (
    <BottomSheet
      footer={
        options.length > 0 ? (
          <ActionArea variant="strong">
            <ActionAreaButton disabled={!canSubmit} onClick={submit}>
              초대 보내기
            </ActionAreaButton>
          </ActionArea>
        ) : undefined
      }
      onOpenChange={onOpenChange}
      open={open}
      title={`${invitee.nickname}님 초대`}
    >
      <div className="flex flex-col gap-6 pb-2">
        {options.length === 0 ? (
          <Typography color="semantic.label.alternative" variant="body2">
            초대는 팀장·모임장만 보낼 수 있어요
          </Typography>
        ) : (
          <>
            <SelectField
              label="초대할 곳"
              onChange={setTargetKey}
              options={options}
              value={targetKey}
            />
            {needsInstrument && (
              <div className="flex flex-col gap-3">
                <FieldLabel>맡길 세션</FieldLabel>
                <ChipGrid
                  isSelected={(item) => item === instrument}
                  onToggle={setInstrument}
                  options={INSTRUMENT_CHOICES}
                />
              </div>
            )}
            <TextInputField
              label="메시지"
              maxLength={500}
              message="선택 사항이에요"
              multiline
              onChange={setMessage}
              placeholder="함께하고 싶은 이유를 적어 주세요"
              value={message}
            />
          </>
        )}
      </div>
    </BottomSheet>
  );
}

export default InviteSheet;
