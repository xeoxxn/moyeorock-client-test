import { ListCell, Typography } from "@wanteddev/wds";
import type { ReactNode } from "react";

import { rowClick } from "@/components/ui/listCellEvents";

// 목록 행의 공통 뼈대 — WDS ListCell(fillWidth: 좌우 20px)에 왼쪽 미디어(커버·아바타·날짜) + 제목
// (16 Bold) + 보조 줄(13) + 오른쪽 내용을 얹는다. Figma의 List/Cover Row · List/Person · List/Event ·
// List/Post · List/Notice · List/Action Row · List/Track · List/Song Result가 전부 이 모양이라, 각 행
// 컴포넌트는 이걸 감싸서 미디어·오른쪽만 정한다.
export interface MediaRowProps {
  leading?: ReactNode;
  /** 제목 위 작은 줄(상태 배지 등) */
  overline?: ReactNode;
  title: ReactNode;
  /** 제목 앞에 붙는 요소(공지의 "고정" 배지처럼 제목과 한 줄) */
  titlePrefix?: ReactNode;
  /** 제목 뒤에 붙는 요소(곡의 Apple Music 배지처럼 제목과 한 줄). 제목이 길면 제목만 줄어든다. */
  titleSuffix?: ReactNode;
  meta?: ReactNode;
  /** 메타 아래 추가 줄(알림의 거절·수락 버튼 등) */
  footer?: ReactNode;
  trailing?: ReactNode;
  onClick?: () => void;
  /** 위쪽 정렬(본문이 여러 줄인 행). 기본은 가운데. */
  alignTop?: boolean;
  /** 위아래 여백 — Figma 행마다 10~16px */
  padding?: "compact" | "normal" | "roomy";
  /** 제목 굵기(알림처럼 본문형 행은 regular) */
  titleWeight?: "bold" | "regular";
  /** 흐리게(지난 일정·마감 공고) */
  dimmed?: boolean;
  /** 아래 얇은 구분선(게시판처럼 본문이 여러 줄인 행이 이어질 때 — 마지막 행은 끈다) */
  divider?: boolean;
}

const PADDING = {
  compact: "0.5rem",
  normal: "0.625rem",
  roomy: "1rem",
} as const;

function MediaRow({
  alignTop = false,
  dimmed = false,
  divider = false,
  footer,
  leading,
  meta,
  onClick,
  overline,
  padding = "normal",
  title,
  titlePrefix,
  titleSuffix,
  titleWeight = "bold",
  trailing,
}: MediaRowProps) {
  return (
    <ListCell
      alignItems={alignTop ? "flex-start" : "center"}
      disableInteraction={onClick === undefined}
      divider={divider}
      fillWidth
      leadingContent={leading}
      onClick={onClick ? rowClick(onClick) : undefined}
      sx={{
        gap: "0.875rem",
        opacity: dimmed ? 0.5 : 1,
        paddingBlock: PADDING[padding],
      }}
      trailingContent={trailing}
      verticalPadding="none"
    >
      <span className="flex min-w-0 flex-col items-start gap-0.5">
        {overline && <span className="pb-0.5">{overline}</span>}
        <span className="flex w-full min-w-0 items-center gap-1.5">
          {titlePrefix}
          <Typography
            as="span"
            className="min-w-0 truncate"
            color="semantic.label.strong"
            variant={titleWeight === "bold" ? "body1" : "body2"}
            weight={titleWeight === "bold" ? "bold" : "regular"}
          >
            {title}
          </Typography>
          {titleSuffix}
        </span>
        {meta !== undefined && (
          <Typography
            as="span"
            className="flex w-full min-w-0 items-center gap-1 truncate"
            color="semantic.label.alternative"
            variant="label2"
          >
            {meta}
          </Typography>
        )}
        {footer}
      </span>
    </ListCell>
  );
}

export default MediaRow;
