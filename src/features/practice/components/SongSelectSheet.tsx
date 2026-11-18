import { List, SearchField, Typography } from "@wanteddev/wds";
import { IconCheck } from "@wanteddev/wds-icon";
import { useState } from "react";

import MediaRow from "@/components/list/MediaRow";
import Cover, { coverToneOf } from "@/components/music/Cover";
import BottomSheet from "@/components/ui/BottomSheet";
import type { Song } from "@/lib/domain/types";
import { getAllSongs } from "@/mocks/selectors";

// 새 연습 분석의 곡 고르기 — Figma 16 곡 추가 시트(429:15665)의 검색 + 결과 모양을 따르되, 여기선 곡
// 하나만 고르므로 +/✓ 토글 대신 행을 누르면 고르고 닫힌다(고른 곡엔 체크, 25 파트 시트와 같은 방식).
interface SongSelectSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedId: number | null;
  onSelect: (song: Song) => void;
}

function matches(song: Song, keyword: string): boolean {
  const query = keyword.trim().toLowerCase();
  if (!query) return true;
  return (
    song.title.toLowerCase().includes(query) ||
    song.artist.toLowerCase().includes(query)
  );
}

function SongSelectSheet({
  onOpenChange,
  onSelect,
  open,
  selectedId,
}: SongSelectSheetProps) {
  const [keyword, setKeyword] = useState("");
  const songs = getAllSongs().filter((song) => matches(song, keyword));

  return (
    <BottomSheet onOpenChange={onOpenChange} open={open} title="곡">
      <div className="flex flex-col gap-3">
        <SearchField
          onChange={(event) => setKeyword(event.target.value)}
          onReset={() => setKeyword("")}
          placeholder="곡 이름이나 아티스트"
          value={keyword}
          width="100%"
        />
        {songs.length === 0 ? (
          <Typography
            className="py-6 text-center"
            color="semantic.label.alternative"
            variant="body2"
          >
            찾는 곡이 없어요
          </Typography>
        ) : (
          <div className="-mx-5">
            <List>
              {songs.map((song) => (
                <MediaRow
                  key={song.id}
                  leading={
                    <Cover
                      className="size-12 rounded-sm"
                      tone={coverToneOf("song", song.id)}
                    />
                  }
                  meta={song.artist}
                  onClick={() => {
                    onSelect(song);
                    onOpenChange(false);
                  }}
                  padding="compact"
                  title={song.title}
                  trailing={
                    song.id === selectedId ? (
                      <IconCheck className="size-5 shrink-0 text-label-strong" />
                    ) : undefined
                  }
                />
              ))}
            </List>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}

export default SongSelectSheet;
