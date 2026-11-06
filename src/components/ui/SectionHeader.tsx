import {
  TextButton,
  Typography,
  SectionHeader as WdsSectionHeader,
} from "@wanteddev/wds";
import type { ReactNode } from "react";

// 섹션 제목 + 오른쪽 보조 액션("전체보기") — WDS `SectionHeader`. 액션은 onAction이 있을 때만
// TextButton으로 그려서, 갈 곳이 없는 섹션이 누를 수 있는 것처럼 보이지 않게 한다.
// count는 "함께하는 멤버 6"처럼 제목 옆에 붙는 레드 숫자다.
interface SectionHeaderProps {
  title: string;
  count?: number;
  actionLabel?: string;
  onAction?: () => void;
  /** 액션 자리에 버튼 대신 다른 요소를 둘 때(예: 아이콘 버튼) */
  trailing?: ReactNode;
}

function SectionHeader({
  actionLabel,
  count,
  onAction,
  title,
  trailing,
}: SectionHeaderProps) {
  const action =
    trailing ??
    (actionLabel !== undefined && onAction !== undefined ? (
      <TextButton color="assistive" onClick={onAction} size="small">
        {actionLabel}
      </TextButton>
    ) : undefined);

  return (
    <WdsSectionHeader
      color="semantic.label.strong"
      headingContent={
        count !== undefined ? (
          <Typography
            color="semantic.primary.normal"
            variant="headline1"
            weight="bold"
          >
            {count}
          </Typography>
        ) : undefined
      }
      headingTag="h3"
      size="small"
      sx={{ alignItems: "center" }}
      trailingContent={action}
    >
      {title}
    </WdsSectionHeader>
  );
}

export default SectionHeader;
