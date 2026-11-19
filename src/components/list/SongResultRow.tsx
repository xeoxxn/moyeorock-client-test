import { IconButton } from "@wanteddev/wds";
import { IconCheck, IconPlus } from "@wanteddev/wds-icon";
import type { ReactNode } from "react";

import MediaRow from "@/components/list/MediaRow";
import AppleMusicBadge from "@/components/music/AppleMusicBadge";
import Cover, { type CoverTone } from "@/components/music/Cover";
import { innerClick } from "@/components/ui/listCellEvents";

// Figma "List/Song Result"(538:22904) — 곡 검색 결과: 48px 커버 + 곡 + 아티스트 + 추가(+)/추가됨(✓).
// appleMusicId를 넘기면 곡 이름 옆에 Apple Music 배지를 붙인다(Figma엔 아직 없다).
interface SongResultRowProps {
  tone: CoverTone;
  title: ReactNode;
  artist: ReactNode;
  added: boolean;
  onToggle: () => void;
  /** 다른 팀이 이미 넘겨 고를 수 없을 때 */
  disabled?: boolean;
  /** Apple Music 곡 ID — 있으면 곡 이름 옆에 그 곡으로 가는 Apple Music 배지 */
  appleMusicId?: string | null;
}

function SongResultRow({
  added,
  appleMusicId,
  artist,
  disabled = false,
  onToggle,
  title,
  tone,
}: SongResultRowProps) {
  return (
    <MediaRow
      dimmed={disabled}
      leading={<Cover className="size-12 rounded-sm" tone={tone} />}
      meta={added ? <>{artist} · 추가됨</> : artist}
      onClick={disabled ? undefined : onToggle}
      padding="compact"
      title={title}
      titleSuffix={
        appleMusicId ? <AppleMusicBadge appleMusicId={appleMusicId} /> : null
      }
      trailing={
        <IconButton
          aria-label={added ? "선택곡에서 빼기" : "선택곡에 추가"}
          color={added ? "semantic.label.alternative" : "semantic.label.strong"}
          disabled={disabled}
          onClick={innerClick(onToggle)}
          size={22}
          variant="normal"
        >
          {added ? <IconCheck /> : <IconPlus />}
        </IconButton>
      }
    />
  );
}

export default SongResultRow;
