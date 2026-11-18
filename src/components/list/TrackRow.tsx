import { IconButton, Typography } from "@wanteddev/wds";
import { IconMoreVertical } from "@wanteddev/wds-icon";
import type { ReactNode } from "react";

import MediaRow from "@/components/list/MediaRow";
import { innerClick } from "@/components/ui/listCellEvents";

// Figma "List/Track"(534:21692) — 셋리스트·선택곡 한 줄: 번호 · 곡 · 아티스트 · 상태(확정/후보) · 더보기.
interface TrackRowProps {
  index: number;
  title: ReactNode;
  artist: ReactNode;
  status?: ReactNode;
  /** 더보기(⋮) — 없으면 버튼을 그리지 않는다(권한 없는 사람) */
  onMore?: () => void;
  onClick?: () => void;
}

function TrackRow({
  artist,
  index,
  onClick,
  onMore,
  status,
  title,
}: TrackRowProps) {
  return (
    <MediaRow
      leading={
        <Typography
          as="span"
          className="w-4 shrink-0 text-center"
          color="semantic.label.assistive"
          variant="label1"
          weight="medium"
        >
          {index}
        </Typography>
      }
      meta={artist}
      onClick={onClick}
      title={title}
      trailing={
        status || onMore ? (
          <span className="flex shrink-0 items-center gap-1">
            {status}
            {onMore && (
              <IconButton
                aria-label="더보기"
                color="semantic.label.alternative"
                onClick={innerClick(onMore)}
                size={20}
                variant="normal"
              >
                <IconMoreVertical />
              </IconButton>
            )}
          </span>
        ) : undefined
      }
    />
  );
}

export default TrackRow;
