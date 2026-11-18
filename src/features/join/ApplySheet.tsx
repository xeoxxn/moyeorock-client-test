import { ActionArea, ActionAreaButton, useToast } from "@wanteddev/wds";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomSheet from "@/components/ui/BottomSheet";
import ChipGrid from "@/components/ui/ChipGrid";
import FieldLabel from "@/components/ui/FieldLabel";
import TextInputField from "@/components/ui/TextInputField";
import { INSTRUMENT_LABEL, INSTRUMENT_OPTIONS } from "@/lib/domain/labels";
import type { Instrument, TargetType } from "@/lib/domain/types";

// 가입 신청 시트 — POST /v1/join-requests. 모집글 상세(지원하기)·모임 홈·팀 홈(비회원 신청)이 함께 쓴다.
// 서버 규칙: 팀 대상이면 세션(instrument) 필수, 모임 대상이면 세션을 받지 않는다. 메시지는 선택(500자).
// 세션은 모집글 쓰기와 같은 3열 칩으로 고른다. 신청 뒤에는 마이 > 내 신청으로 보낸다(대기 중인 신청을
// 바로 확인·취소할 수 있게).
interface ApplySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetType: TargetType;
  targetName: string;
  /** 공고를 거친 신청이면 공고가 모집하는 세션만 고를 수 있다. 없으면 전체 세션. */
  instrumentChoices?: Instrument[];
}

function ApplySheet({
  instrumentChoices,
  onOpenChange,
  open,
  targetName,
  targetType,
}: ApplySheetProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const choices = instrumentChoices ?? INSTRUMENT_OPTIONS;
  const [instrument, setInstrument] = useState<Instrument | null>(
    choices.length === 1 ? choices[0] : null,
  );
  const [message, setMessage] = useState("");

  const isTeam = targetType === "TEAM";
  const canSubmit = !isTeam || instrument !== null;

  const submit = () => {
    onOpenChange(false);
    toast({ content: `${targetName}에 신청했어요`, variant: "positive" });
    navigate("/mine/invitations?tab=applied");
  };

  return (
    <BottomSheet
      footer={
        <ActionArea variant="strong">
          <ActionAreaButton disabled={!canSubmit} onClick={submit}>
            {isTeam ? "지원하기" : "가입 신청"}
          </ActionAreaButton>
        </ActionArea>
      }
      onOpenChange={onOpenChange}
      open={open}
      title={isTeam ? `${targetName} 지원` : `${targetName} 가입 신청`}
    >
      <div className="flex flex-col gap-6 pb-2">
        {isTeam && (
          <div className="flex flex-col gap-3">
            <FieldLabel>지원할 세션</FieldLabel>
            <ChipGrid
              isSelected={(item) => item === instrument}
              onToggle={setInstrument}
              options={choices.map((item) => ({
                label: INSTRUMENT_LABEL[item],
                value: item,
              }))}
            />
          </div>
        )}
        <TextInputField
          label="하고 싶은 말"
          maxLength={500}
          message="선택 사항이에요"
          multiline
          onChange={setMessage}
          placeholder="연주 경력이나 함께하고 싶은 이유를 적어 주세요"
          value={message}
        />
      </div>
    </BottomSheet>
  );
}

export default ApplySheet;
