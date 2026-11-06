import {
  Category,
  CategoryList,
  CategoryListItem,
  Checkbox,
  List,
  ListCell,
  ListCellContent,
  SearchField,
  ToggleIcon,
  Typography,
  useToast,
} from "@wanteddev/wds";
import { IconBookmark, IconBookmarkFill } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import BottomActionArea from "@/components/ui/BottomActionArea";
import EmptyState from "@/components/ui/EmptyState";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Tag from "@/components/ui/Tag";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import TeamFallback from "@/features/team/components/TeamFallback";
import {
  getSongsSelectedByOtherTeams,
  getTeamPerformance,
  isTeamLeader,
  useTeamParam,
} from "@/features/team/components/teamHelpers";
import {
  GENRE_LABEL,
  GENRE_OPTIONS,
  INSTRUMENT_LABEL,
  LEVEL_LABEL,
} from "@/lib/domain/labels";
import type { Genre, Team } from "@/lib/domain/types";
import { getAllSongs, getBookmarks } from "@/mocks/selectors";

type GenreFilter = Genre | "all";

// Figma: 팀/11 곡 추가 (nodeId 142:20057) — 팀장만. 곡 검색(GET /songs?keyword&genre)에서 여러 곡을
// 골라 선택곡을 통째로 저장한다(PUT /teams/{id}/songs). Figma의 "AI 추천" 탭은 서버에 곡 추천 API가
// 없어(대시보드 recommendedSongs도 null) 빼고, 검색 + 장르 필터 한 화면으로 합쳤다.
// 공연 팀이면 같은 공연의 다른 팀이 고른 곡을 알려 준다 — 서버는 막지 않고 경고만 한다.
function TeamSongsAddScreen() {
  const team = useTeamParam();
  if (!team) return <TeamFallback kind="notFound" />;
  if (!isTeamLeader(team))
    return <TeamFallback kind="leaderOnly" team={team} />;
  return <TeamSongsAddContent team={team} />;
}

function TeamSongsAddContent({ team }: { team: Team }) {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const performance = getTeamPerformance(team);
  const takenByOthers = performance
    ? getSongsSelectedByOtherTeams(performance, team.id)
    : new Set<number>();

  const [keyword, setKeyword] = useState("");
  const [genre, setGenre] = useState<GenreFilter>("all");
  const [selectedIds, setSelectedIds] = useState(team.songIds);
  const [savedSongIds, setSavedSongIds] = useState(
    () =>
      new Set(
        getBookmarks()
          .filter((bookmark) => bookmark.targetType === "SONG")
          .map((bookmark) => bookmark.targetId),
      ),
  );

  useScreenHeader(<ScreenHeader title="곡 추가" />);

  const allSongs = getAllSongs();
  // 장르 칩은 실제 곡이 있는 장르만 서버 enum 순서대로 보여준다.
  const genres = GENRE_OPTIONS.filter((value) =>
    allSongs.some((song) => song.genre === value),
  );
  const query = keyword.trim().toLowerCase();
  const songs = allSongs.filter(
    (song) =>
      (genre === "all" || song.genre === genre) &&
      (query === "" ||
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query)),
  );

  const toggleSelected = (songId: number, next: boolean) =>
    setSelectedIds((prev) =>
      next ? [...prev, songId] : prev.filter((id) => id !== songId),
    );

  const toggleSaved = (songId: number, next: boolean) => {
    setSavedSongIds((prev) => {
      const copy = new Set(prev);
      if (next) copy.add(songId);
      else copy.delete(songId);
      return copy;
    });
    toast({
      content: next ? "곡을 저장했어요" : "저장을 해제했어요",
      variant: "positive",
    });
  };

  const save = () => {
    toast({
      content: `선택곡을 저장했어요 (${selectedIds.length}곡)`,
      variant: "positive",
    });
    // 선택곡 탭에서 왔으면 그 화면으로 되돌아가고(히스토리에 선택곡이 두 번 쌓이지 않게), 팀 홈 등
    // 다른 데서 왔으면 이 화면을 선택곡으로 바꿔 끼운다 — 어느 쪽이든 뒤로가기로 폼에 다시 오지 않는다.
    if ((location.state as { fromSongs?: boolean } | null)?.fromSongs) {
      navigate(-1);
    } else {
      navigate(`/team/${team.id}/songs`, { replace: true });
    }
  };

  return (
    <>
      <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto">
        <div className="flex flex-col gap-3 px-5 pt-2">
          <SearchField
            onChange={(event) => setKeyword(event.target.value)}
            onReset={() => setKeyword("")}
            placeholder="곡 제목이나 아티스트로 검색"
            value={keyword}
            width="100%"
          />
        </div>

        <Category
          onValueChange={(value) => setGenre(value as GenreFilter)}
          value={genre}
        >
          <CategoryList horizontalPadding size="small" verticalPadding>
            <CategoryListItem value="all">전체</CategoryListItem>
            {genres.map((value) => (
              <CategoryListItem key={value} value={value}>
                {GENRE_LABEL[value]}
              </CategoryListItem>
            ))}
          </CategoryList>
        </Category>

        <div className="flex flex-col px-5 pb-8">
          {performance && (
            <Typography
              color="semantic.label.assistive"
              variant="caption1"
              weight="medium"
            >
              같은 공연의 다른 팀이 고른 곡도 고를 수 있어요. 셋리스트로 넘길
              때는 먼저 넘긴 팀의 곡이 돼요.
            </Typography>
          )}

          {songs.length === 0 ? (
            <EmptyState
              description="다른 제목이나 아티스트로 찾아보세요."
              title="찾는 곡이 없어요"
            />
          ) : (
            <List>
              {songs.map((song) => {
                const saved = savedSongIds.has(song.id);
                return (
                  <ListCell
                    alignItems="center"
                    key={song.id}
                    leadingContent={
                      <ListCellContent variant="checkbox">
                        <Checkbox
                          aria-label={song.title}
                          checked={selectedIds.includes(song.id)}
                          onCheckedChange={(next) =>
                            toggleSelected(song.id, next)
                          }
                        />
                      </ListCellContent>
                    }
                    textProps={{
                      caption: (
                        <span className="flex flex-col items-start gap-1.5">
                          <span>
                            {song.artist} · {GENRE_LABEL[song.genre]}
                          </span>
                          <span className="flex flex-wrap gap-1">
                            {song.difficulty.map((item) => (
                              <Tag key={item.part}>
                                {INSTRUMENT_LABEL[item.part]}{" "}
                                {LEVEL_LABEL[item.level]}
                              </Tag>
                            ))}
                          </span>
                          {takenByOthers.has(song.id) && (
                            <Typography
                              className="text-glow-sm"
                              color="semantic.primary.normal"
                              variant="caption1"
                              weight="bold"
                            >
                              다른 팀이 이미 골랐어요
                            </Typography>
                          )}
                        </span>
                      ),
                      captionProps: {
                        color: "semantic.label.assistive",
                        variant: "label2",
                        weight: "medium",
                      },
                      weight: "bold",
                    }}
                    trailingContent={
                      <ListCellContent variant="icon-button">
                        <ToggleIcon
                          active={saved}
                          aria-label={saved ? "곡 저장 해제" : "곡 저장"}
                          // 행을 누르면 체크박스가 토글되므로, 저장 버튼 클릭은 행까지 올라가지 않게 한다.
                          onActiveChange={(next) => toggleSaved(song.id, next)}
                          onClick={(event) => event.stopPropagation()}
                          size="1.25rem"
                        >
                          {saved ? <IconBookmarkFill /> : <IconBookmark />}
                        </ToggleIcon>
                      </ListCellContent>
                    }
                  >
                    {song.title}
                  </ListCell>
                );
              })}
            </List>
          )}
        </div>
      </div>

      <BottomActionArea
        label={`선택 저장 (${selectedIds.length}곡)`}
        onClick={save}
      />
    </>
  );
}

export default TeamSongsAddScreen;
