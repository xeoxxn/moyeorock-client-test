import { Button, SearchField, Typography } from "@wanteddev/wds";
import { useState } from "react";

import SongResultRow from "@/components/list/SongResultRow";
import { coverToneOf } from "@/components/music/Cover";
import BottomSheet from "@/components/ui/BottomSheet";
import { getAllSongs } from "@/mocks/selectors";

// Figma 16 곡 추가 시트 — 선택곡 "수정"(팀장)에서 연다. 곡 검색(GET /songs?keyword=) 결과에서 +/✓로
// 선택곡에 넣고 뺀다. 누를 때마다 화면의 선택곡이 바로 바뀌고(PUT /teams/{id}/songs는 전체 대체라 바뀐
// 목록을 그대로 보낸다), 시트를 닫으면 끝이다. 같은 공연의 다른 팀이 넘긴 곡도 선택곡에는 담을 수 있다
// (넘기기만 막힌다). "AI 추천"은 따로 AI 곡 추천 시트(Figma 26~28, SongRecommendSheet)를 연다 —
// 부른 쪽이 이 시트를 닫고 그 시트를 띄운다.
interface SongAddSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: number[];
  onToggle: (songId: number) => void;
  onRecommend: () => void;
}

function SongAddSheet({
  onOpenChange,
  onRecommend,
  onToggle,
  open,
  selectedIds,
}: SongAddSheetProps) {
  const [keyword, setKeyword] = useState("");

  const query = keyword.trim().toLowerCase();
  const songs = getAllSongs().filter(
    (song) =>
      query === "" ||
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query),
  );

  return (
    <BottomSheet onOpenChange={onOpenChange} open={open} title="곡 추가">
      <div className="flex flex-col gap-3">
        <SearchField
          onChange={(event) => setKeyword(event.target.value)}
          onReset={() => setKeyword("")}
          placeholder="곡, 아티스트 검색"
          value={keyword}
          width="100%"
        />
        <Button
          color="assistive"
          fullWidth
          onClick={onRecommend}
          size="medium"
          variant="outlined"
        >
          AI 추천
        </Button>
      </div>
      <Typography
        className="pt-5 pb-1"
        color="semantic.label.assistive"
        variant="caption1"
        weight="medium"
      >
        검색 결과
      </Typography>
      {songs.length === 0 ? (
        <Typography
          className="py-6 text-center"
          color="semantic.label.alternative"
          variant="body2"
        >
          찾는 곡이 없어요
        </Typography>
      ) : (
        // 행(ListCell fillWidth)이 좌우 여백을 직접 가져서 시트 여백만큼 당긴다.
        <div className="-mx-5">
          {songs.map((song) => (
            <SongResultRow
              added={selectedIds.includes(song.id)}
              artist={song.artist}
              key={song.id}
              onToggle={() => onToggle(song.id)}
              title={song.title}
              tone={coverToneOf("song", song.id)}
            />
          ))}
        </div>
      )}
    </BottomSheet>
  );
}

export default SongAddSheet;
