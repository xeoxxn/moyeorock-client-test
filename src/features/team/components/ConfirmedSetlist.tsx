import { List, ListCellContent } from "@wanteddev/wds";

import Badge from "@/components/ui/Badge";
import SongCell from "@/features/team/components/SongCell";
import type { Performance } from "@/lib/domain/types";
import { getSong, getTeam } from "@/mocks/selectors";

// 모임장이 확정한 공연 셋리스트(읽기 전용) — 팀 공연 탭과 선택곡 탭이 함께 쓴다. 확정본은 공연 전체
// 순서라 다른 팀 곡도 섞여 있어서, 곡마다 팀 이름을 붙이고 우리 팀 곡만 배지로 짚어 준다.
interface ConfirmedSetlistProps {
  performance: Performance;
  teamId: number;
}

function ConfirmedSetlist({ performance, teamId }: ConfirmedSetlistProps) {
  const items = [...performance.setlist].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );

  return (
    <List>
      {items.map((item, index) => {
        const song = getSong(item.songId);
        if (!song) return null;
        return (
          <SongCell
            caption={`${song.artist} · ${getTeam(item.teamId)?.name ?? ""}`}
            key={`${item.teamId}-${item.songId}`}
            order={item.sortOrder ?? index + 1}
            song={song}
            trailing={
              item.teamId === teamId ? (
                <ListCellContent variant="badge">
                  <Badge glow>우리 팀</Badge>
                </ListCellContent>
              ) : undefined
            }
          />
        );
      })}
    </List>
  );
}

export default ConfirmedSetlist;
