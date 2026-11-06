import { Switch, TextButton, Typography } from "@wanteddev/wds";
import { useId, useState } from "react";

import BottomActionArea from "@/components/ui/BottomActionArea";
import TextInputField from "@/components/ui/TextInputField";

export interface NoticeFormValues {
  title: string;
  body: string;
  isPinned: boolean;
}

interface CrewNoticeFormProps {
  heading: string;
  description: string;
  submitLabel: string;
  initialValues?: NoticeFormValues;
  onSubmit: (values: NoticeFormValues) => void;
  /** 수정 화면에서만 — 있으면 삭제 버튼을 보여준다 */
  onDelete?: () => void;
}

// Figma: 모임/11 공지 작성(nodeId 142:19296) · 모임/12 공지 수정(nodeId 142:19369) — 문구와 삭제 유무만
// 다르고 서버 요청도 같은 {title, body, isPinned}라 폼 하나를 함께 쓴다. Figma의 "상단에 고정하기"
// 체크박스는 켜고 끄는 설정이라 WDS Switch로 바꿨다.
function CrewNoticeForm({
  description,
  heading,
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
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="scrollbar-hidden flex flex-1 flex-col gap-6 overflow-y-auto px-5 pt-2 pb-6">
        <div className="flex flex-col gap-1">
          <Typography
            color="semantic.label.strong"
            variant="title3"
            weight="bold"
          >
            {heading}
          </Typography>
          <Typography
            color="semantic.label.alternative"
            variant="body2"
            weight="regular"
          >
            {description}
          </Typography>
        </div>

        <TextInputField
          label="제목"
          maxLength={100}
          onChange={setTitle}
          placeholder="공지 제목을 입력해 주세요"
          value={title}
        />
        <TextInputField
          label="내용"
          multiline
          onChange={setBody}
          placeholder="공지 내용을 입력해 주세요"
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
              color="semantic.label.normal"
              variant="body1"
              weight="medium"
            >
              상단에 고정
            </Typography>
            <Typography
              as="span"
              color="semantic.label.alternative"
              variant="label2"
              weight="regular"
            >
              고정한 공지는 모임 홈 공지 맨 위에 보여요
            </Typography>
          </span>
          <Switch
            checked={isPinned}
            id={pinnedId}
            onCheckedChange={setIsPinned}
          />
        </label>

        {onDelete && (
          <div className="flex">
            <TextButton color="assistive" onClick={onDelete} size="small">
              이 공지 삭제하기
            </TextButton>
          </div>
        )}
      </div>

      <BottomActionArea
        disabled={!canSubmit}
        label={submitLabel}
        onClick={() =>
          onSubmit({ body: body.trim(), isPinned, title: title.trim() })
        }
      />
    </div>
  );
}

export default CrewNoticeForm;
