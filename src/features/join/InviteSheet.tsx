import {
  ActionArea,
  ActionAreaButton,
  Chip,
  Typography,
  useToast,
} from "@wanteddev/wds";
import { useState } from "react";

import BottomSheet from "@/components/ui/BottomSheet";
import SelectField from "@/components/ui/SelectField";
import TextInputField from "@/components/ui/TextInputField";
import { INSTRUMENT_LABEL, INSTRUMENT_OPTIONS } from "@/lib/domain/labels";
import type { Instrument, User } from "@/lib/domain/types";
import { getPostableTargets } from "@/mocks/selectors";

// 초대 보내기 시트 — POST /v1/invitations. 팀원 찾기(AI)·저장한 유저·다른 사용자 프로필이 함께 쓴다.
// 초대는 팀장(내 팀)·모임장(내 모임)만 보낼 수 있어서 초대할 곳은 그 목록에서 고른다. 팀 초대는
// 세션 필수, 모임 초대는 세션 없음(서버 규칙). 들어온 화면이 특정 팀이면 defaultTargetKey로 미리 고른다.
interface InviteSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invitee: User;
  /** "TEAM:1"·"GROUP:1" 형식. 팀 화면에서 열면 그 팀이 미리 선택된다. */
  defaultTargetKey?: string;
  onInvited?: (targetKey: string) => void;
}

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
    label: `${target.targetType === "TEAM" ? "팀" : "모임"} · ${target.name}`,
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
        <ActionArea variant="strong">
          <ActionAreaButton disabled={!canSubmit} onClick={submit}>
            초대 보내기
          </ActionAreaButton>
        </ActionArea>
      }
      onOpenChange={onOpenChange}
      open={open}
      title={`${invitee.nickname}님 초대`}
    >
      <div className="flex flex-col gap-6 pb-2">
        {options.length === 0 ? (
          <Typography
            color="semantic.label.alternative"
            variant="body2"
            weight="regular"
          >
            초대는 팀장·모임장만 보낼 수 있어요. 먼저 팀이나 모임을 만들어
            보세요.
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
                <Typography
                  color="semantic.label.alternative"
                  variant="label2"
                  weight="medium"
                >
                  맡길 세션
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {INSTRUMENT_OPTIONS.map((item) => (
                    <Chip
                      active={instrument === item}
                      key={item}
                      onClick={() => setInstrument(item)}
                      size="large"
                      variant="outlined"
                    >
                      {INSTRUMENT_LABEL[item]}
                    </Chip>
                  ))}
                </div>
              </div>
            )}
            <TextInputField
              label="메시지"
              maxLength={500}
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
