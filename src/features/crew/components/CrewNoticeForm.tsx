import { Switch, Typography } from "@wanteddev/wds";
import { useId, useState } from "react";

import BottomActionArea from "@/components/ui/BottomActionArea";
import ScreenBody from "@/components/ui/ScreenBody";
import TextInputField from "@/components/ui/TextInputField";

export interface NoticeFormValues {
  title: string;
  body: string;
  isPinned: boolean;
}

// 서버 NoticeCreateRequest = NoticeUpdateRequest. 본문은 TEXT 컬럼이라 상한을 합주 메모와 같게 둔다.
const TITLE_MAX = 100;
const BODY_MAX = 20000;

interface CrewNoticeFormProps {
  submitLabel: string;
  initialValues?: NoticeFormValues;
  onSubmit: (values: NoticeFormValues) => void;
  /** 수정 화면에서만 — 있으면 하단에 삭제 버튼을 같이 둔다 */
  onDelete?: () => void;
}

// 공지 쓰기·수정(Figma에는 없는 화면) — 21 합주 일정 추가·24 모집글 쓰기와 같은 한 화면 폼.
// 서버 요청이 같은 {title, body, isPinned}라 두 화면이 이 폼을 함께 쓴다. 고정은 켜고 끄는 설정이라
// WDS Switch로 둔다.
function CrewNoticeForm({
  initialValues,
  onDelete,
  onSubmit,
  submitLabel,
}: CrewNoticeFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [body, setBody] = useState(initialValues?.body ?? "");
  const [isPinned, setIsPinned] = useState(initialValues?.isPinned ?? false);
  const pinnedId = useId();

  const canSubmit = title.trim() !== "" && body.trim() !== "";

  return (
    <>
      <ScreenBody className="flex flex-col gap-6 px-5 pt-2">
        <TextInputField
          label="제목"
          maxLength={TITLE_MAX}
          onChange={setTitle}
          placeholder="공지 제목"
          value={title}
        />
        <TextInputField
          label="내용"
          maxLength={BODY_MAX}
          multiline
          onChange={setBody}
          placeholder="모임원에게 알릴 내용을 적어 주세요"
          value={body}
        />

        {/* 글자를 눌러도 Switch가 켜지고 꺼지도록 label로 잇는다. */}
        <label
          className="flex items-center justify-between gap-3"
          htmlFor={pinnedId}
        >
          <span className="flex flex-col gap-0.5">
            <Typography
              as="span"
              color="semantic.label.strong"
              variant="body1"
              weight="bold"
            >
              맨 위에 고정
            </Typography>
            <Typography
              as="span"
              color="semantic.label.alternative"
              variant="label2"
            >
              모임 홈 공지 맨 위에 보여요
            </Typography>
          </span>
          <Switch
            checked={isPinned}
            id={pinnedId}
            onCheckedChange={setIsPinned}
          />
        </label>
      </ScreenBody>

      <BottomActionArea
        disabled={!canSubmit}
        label={submitLabel}
        onClick={() =>
          onSubmit({ body: body.trim(), isPinned, title: title.trim() })
        }
        secondary={onDelete ? { label: "삭제", onClick: onDelete } : undefined}
      />
    </>
  );
}

export default CrewNoticeForm;
