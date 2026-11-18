import { TextButton, SectionHeader as WdsSectionHeader } from "@wanteddev/wds";
import type { ReactNode } from "react";

// Figma "Section Header"(534:21950) — 구역 제목(20 Bold) + (상태) + 오른쪽 짧은 텍스트 버튼("전체 보기"·
// "수정", 14 · text/secondary). 구역은 선 대신 여백으로 나누고, 구역 제목은 모든 화면에서 이것 하나를
// 쓴다(규칙 패널 571:24140).
//
// 구역 간격: 위 28, 아래 8. 헤더나 탭 바로 아래 첫 구역만 위 20(first). 구역 안 내용 블록은 아래 여백
// 없이 끝나고, 다음 구역의 위 28이 사이를 띄운다.
// 액션은 onAction이 있을 때만 버튼으로 그려서, 갈 곳이 없는 구역이 누를 수 있는 것처럼 보이지 않게 한다.
interface SectionHeaderProps {
  title: ReactNode;
  /** 제목 옆 상태(예: 참가 팀 3 옆 <Status tone="neutral">셋리스트 확정 전</Status>) */
  status?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  /** 버튼 대신 오른쪽에 둘 요소 */
  trailing?: ReactNode;
  /** 헤더나 탭 바로 아래 첫 구역(위 여백 20) */
  first?: boolean;
  /** @deprecated first와 같다 — 섹션 작업 중 이름이 바뀌어 남겨 둔 별칭 */
  flush?: boolean;
}

function SectionHeader({
  actionLabel,
  first = false,
  flush = false,
  onAction,
  status,
  title,
  trailing,
}: SectionHeaderProps) {
  const action =
    trailing ??
    (actionLabel !== undefined && onAction !== undefined ? (
      <TextButton
        color="assistive"
        onClick={onAction}
        size="medium"
        sx={{ color: "var(--color-label-alternative)", fontWeight: 500 }}
      >
        {actionLabel}
      </TextButton>
    ) : undefined);

  return (
    <WdsSectionHeader
      color="semantic.label.strong"
      headingContent={status}
      headingTag="h2"
      size="medium"
      sx={{
        alignItems: "center",
        paddingBottom: "0.5rem",
        paddingInline: "1.25rem",
        paddingTop: first || flush ? "1.25rem" : "1.75rem",
      }}
      trailingContent={action}
    >
      {title}
    </WdsSectionHeader>
  );
}

export default SectionHeader;
