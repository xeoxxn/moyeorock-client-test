import { ActionArea, ActionAreaButton } from "@wanteddev/wds";
import type { ReactNode } from "react";

// 화면 하단 고정 버튼 영역(다음 · 저장 · 신청하기 …) — WDS `ActionArea`.
// 예전에는 화면마다 `pt-3 pb-[34px]` 같은 고정 여백 div 안에 Button을 넣었다. 여백·홈 인디케이터
// 자리는 이제 ActionArea와 pb-safe-bottom이 맡는다. 버튼이 둘이면 secondary를 넘긴다
// (WDS `neutral` 변형 — 가로 두 버튼).
interface BottomActionAreaProps {
  label: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  /** 보조 버튼(취소·건너뛰기 등). 있으면 두 버튼이 가로로 놓인다. */
  secondary?: { label: ReactNode; onClick: () => void };
  /** 버튼 위에 놓을 안내 문구(예: "확정하면 팀들이 더 이상 곡을 바꿀 수 없어요") */
  caption?: ReactNode;
  /** 버튼 위에 놓을 추가 요소(예: 약관 동의 체크박스) */
  extraContent?: ReactNode;
}

function BottomActionArea({
  caption,
  disabled = false,
  extraContent,
  label,
  onClick,
  secondary,
}: BottomActionAreaProps) {
  return (
    <div className="shrink-0 pb-safe-bottom">
      <ActionArea
        background
        caption={caption}
        extra={extraContent !== undefined}
        extraContent={extraContent}
        variant={secondary ? "neutral" : "strong"}
      >
        {secondary && (
          <ActionAreaButton onClick={secondary.onClick} variant="alternative">
            {secondary.label}
          </ActionAreaButton>
        )}
        <ActionAreaButton disabled={disabled} onClick={onClick} variant="main">
          {label}
        </ActionAreaButton>
      </ActionArea>
    </div>
  );
}

export default BottomActionArea;
