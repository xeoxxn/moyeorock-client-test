import type { ReactNode } from "react";

import MediaRow from "@/components/list/MediaRow";
import Cover, { type CoverTone } from "@/components/music/Cover";

// Figma "List/Post"(538:22451) — 게시판 모집글: 대상 커버 + 상태(모집 중) + 제목 + 세션·대상·지역·시간.
interface PostRowProps {
  tone: CoverTone;
  status?: ReactNode;
  title: ReactNode;
  meta: ReactNode;
  onClick?: () => void;
  dimmed?: boolean;
  /** 다음 글과 사이의 얇은 선(Figma 06) — 마지막 글은 끈다 */
  divider?: boolean;
}

function PostRow({
  dimmed,
  divider,
  meta,
  onClick,
  status,
  title,
  tone,
}: PostRowProps) {
  return (
    <MediaRow
      alignTop
      dimmed={dimmed}
      divider={divider}
      leading={<Cover className="size-14 rounded-sm" tone={tone} />}
      meta={meta}
      onClick={onClick}
      overline={status}
      padding="roomy"
      title={title}
    />
  );
}

export default PostRow;
