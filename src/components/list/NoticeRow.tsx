import { IconChevronRight } from "@wanteddev/wds-icon";

import MediaRow from "@/components/list/MediaRow";
import Status from "@/components/ui/Status";

// Figma "List/Notice"(552:23916) — 모임 공지 한 줄: (고정) + 제목 + 날짜.
// 공지 목록 응답(NoticeSummaryResponse)에 작성자가 없어 메타는 날짜만 둔다.
interface NoticeRowProps {
  title: string;
  meta: string;
  pinned: boolean;
  onClick?: () => void;
}

function NoticeRow({ meta, onClick, pinned, title }: NoticeRowProps) {
  return (
    <MediaRow
      meta={meta}
      onClick={onClick}
      title={title}
      titlePrefix={pinned ? <Status tone="accent">고정</Status> : undefined}
      trailing={
        onClick ? (
          <IconChevronRight className="size-5 shrink-0 text-label-assistive" />
        ) : undefined
      }
    />
  );
}

export default NoticeRow;
