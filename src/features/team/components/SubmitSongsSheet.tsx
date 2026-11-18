import {
  ActionArea,
  ActionAreaButton,
  Checkbox,
  List,
  ListCell,
  ListCellContent,
  Typography,
} from "@wanteddev/wds";

import BottomSheet from "@/components/ui/BottomSheet";
import type { Song } from "@/lib/domain/types";

// 선택곡 → 공연에 넘길 곡 고르기(공연 팀 팀장). 아직 넘기지 않은 선택곡만 체크 목록으로 보이고,
// 같은 공연의 다른 팀이 이미 넘긴 곡은 고를 수 없게 흐리게 둔다(서버 409 SONG_ALREADY_IN_SETLIST).
// "넘기기"를 누르면 부른 쪽이 확정 시트(Figma 17)로 한 번 더 묻는다.
interface SubmitSongsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  performanceTitle: string;
  songs: Song[];
  /** 다른 팀이 이미 넘긴 곡 → 그 팀 이름 */
  takenByOthers: Map<number, string>;
  checkedIds: number[];
  onCheckedIdsChange: (ids: number[]) => void;
  onNext: () => void;
}

function SubmitSongsSheet({
  checkedIds,
  onCheckedIdsChange,
  onNext,
  onOpenChange,
  open,
  performanceTitle,
  songs,
  takenByOthers,
}: SubmitSongsSheetProps) {
  const toggle = (songId: number, next: boolean) =>
    onCheckedIdsChange(
      next ? [...checkedIds, songId] : checkedIds.filter((id) => id !== songId),
    );

  return (
    <BottomSheet
      footer={
        <ActionArea variant="strong">
          <ActionAreaButton disabled={checkedIds.length === 0} onClick={onNext}>
            {checkedIds.length > 0 ? `${checkedIds.length}곡 넘기기` : "넘기기"}
          </ActionAreaButton>
        </ActionArea>
      }
      onOpenChange={onOpenChange}
      open={open}
      title="공연에 넘기기"
    >
      <Typography color="semantic.label.alternative" variant="label2">
        {performanceTitle}에 올릴 곡을 골라 주세요
      </Typography>
      <List>
        {songs.map((song) => {
          const takenBy = takenByOthers.get(song.id);
          return (
            <ListCell
              alignItems="center"
              disabled={takenBy !== undefined}
              key={song.id}
              leadingContent={
                <ListCellContent variant="checkbox">
                  <Checkbox
                    aria-label={song.title}
                    checked={checkedIds.includes(song.id)}
                    disabled={takenBy !== undefined}
                    onCheckedChange={(next) => toggle(song.id, next === true)}
                  />
                </ListCellContent>
              }
              textProps={{
                caption:
                  takenBy !== undefined
                    ? `다른 팀이 넘긴 곡 · ${takenBy}`
                    : song.artist,
                captionProps: {
                  color: "semantic.label.alternative",
                  variant: "label2",
                },
                color: "semantic.label.strong",
                weight: "bold",
              }}
              verticalPadding="small"
            >
              {song.title}
            </ListCell>
          );
        })}
      </List>
    </BottomSheet>
  );
}

export default SubmitSongsSheet;
