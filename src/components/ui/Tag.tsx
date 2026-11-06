import { ContentBadge } from "@wanteddev/wds";
import type { ReactNode } from "react";

// 세션·지역·장르처럼 "프로필에 붙는 값"을 보여주는 태그 — WDS `ContentBadge`(outlined).
// Badge(상태 라벨)와 달리 값의 나열이라 중립 톤이 기본이고, 강조할 때만 active로 레드 테두리를 쓴다.
// 탭해서 고르는 칩은 이 컴포넌트가 아니라 WDS `Chip`을 직접 쓴다.
interface TagProps {
  children: ReactNode;
  active?: boolean;
}

function Tag({ children, active = false }: TagProps) {
  return (
    <ContentBadge
      accentColor="semantic.primary.normal"
      color={active ? "accent" : "neutral"}
      neutralColor="semantic.label.alternative"
      size="small"
      variant="outlined"
    >
      {children}
    </ContentBadge>
  );
}

export default Tag;
