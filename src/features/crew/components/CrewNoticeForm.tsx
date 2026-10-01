import {
  Button,
  Checkbox,
  TextArea,
  TextField,
  Typography,
} from "@wanteddev/wds";
import { useState } from "react";

interface CrewNoticeFormProps {
  heading: string;
  description: string;
  defaultTitle?: string;
  defaultContent?: string;
  submitLabel: string;
  onSubmit: () => void;
  onDelete?: () => void;
}

// Figma: 모임/11 공지 작성(nodeId 142:19296), 모임/12 공지 수정(nodeId 142:19369) — 제목/타이틀
// 텍스트, 삭제 링크 유무만 다르고 레이아웃은 동일해서 폼 하나로 공유한다.
function CrewNoticeForm({
  heading,
  description,
  defaultTitle,
  defaultContent,
  submitLabel,
  onSubmit,
  onDelete,
}: CrewNoticeFormProps) {
  const [pinned, setPinned] = useState(false);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="scrollbar-hidden flex flex-1 flex-col gap-6 overflow-y-auto px-5 pt-2 pb-5">
        <div className="flex flex-col gap-2">
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

        <div className="flex flex-col gap-2">
          <Typography
            color="semantic.label.normal"
            variant="label1"
            weight="bold"
          >
            제목
          </Typography>
          <TextField
            defaultValue={defaultTitle}
            id="notice-title"
            width="100%"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Typography
            color="semantic.label.normal"
            variant="label1"
            weight="bold"
          >
            내용
          </Typography>
          <TextArea
            defaultValue={defaultContent}
            id="notice-content"
            minRows={4}
            placeholder="공지 내용을 입력해 주세요"
            width="100%"
          />
        </div>

        <label className="flex items-center gap-2.5" htmlFor="notice-pinned">
          <Checkbox
            checked={pinned}
            id="notice-pinned"
            onCheckedChange={setPinned}
            size="small"
          />
          <Typography
            color="semantic.label.normal"
            variant="body2"
            weight="regular"
          >
            상단에 고정하기
          </Typography>
        </label>

        {onDelete && (
          <button className="self-start" onClick={onDelete} type="button">
            <Typography
              color="semantic.label.assistive"
              variant="label1"
              weight="bold"
            >
              이 공지 삭제하기
            </Typography>
          </button>
        )}
      </div>
      <div className="flex shrink-0 flex-col bg-surface-elevated px-5 pt-3 pb-[34px]">
        <Button
          className="shadow-neon-sm"
          color="primary"
          fullWidth
          onClick={onSubmit}
          size="large"
          variant="solid"
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}

export default CrewNoticeForm;
