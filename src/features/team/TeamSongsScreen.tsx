import {
  ActionArea,
  ActionAreaButton,
  Checkbox,
  IconButton,
  List,
  ListCell,
  ListCellContent,
  TextButton,
  Typography,
  useToast,
} from "@wanteddev/wds";
import { IconTrash } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Badge from "@/components/ui/Badge";
import BottomActionArea from "@/components/ui/BottomActionArea";
import BottomSheet from "@/components/ui/BottomSheet";
import EmptyState from "@/components/ui/EmptyState";
import SectionHeader from "@/components/ui/SectionHeader";
import ConfirmedSetlist from "@/features/team/components/ConfirmedSetlist";
import SongCell from "@/features/team/components/SongCell";
import TeamFallback from "@/features/team/components/TeamFallback";
import TeamHeroTabs from "@/features/team/components/TeamHeroTabs";
import {
  getSongsSubmittedByOtherTeams,
  getSubmittedSongIds,
  getTeamPerformance,
  isTeamLeader,
  isTeamMember,
  useTeamParam,
} from "@/features/team/components/teamHelpers";
import type { Team } from "@/lib/domain/types";
import { getSong, isUpcoming } from "@/mocks/selectors";

// Figma: 팀/04 셋리스트 (nodeId 101:22257) → 서버 기준 "선택곡"으로 바뀌었다(팀 쪽은 셋리스트라는
// 말을 쓰지 않는다). 흐름: 팀장이 선택곡을 고른다(PUT /teams/{id}/songs) → 공연 팀이면 그중 일부를
// 공연 셋리스트로 넘긴다(PUT /performances/{pid}/setlist/teams/{tid}) → 모임장이 확정한다.
// 확정된 뒤에는 넘길 수 없고, 팀 화면은 확정본을 공연 셋리스트에서 읽어 보여준다.
function TeamSongsScreen() {
  const team = useTeamParam();
  if (!team) return <TeamFallback kind="notFound" />;
  if (!isTeamMember(team))
    return <TeamFallback kind="memberOnly" team={team} />;
  return <TeamSongsContent team={team} />;
}

function TeamSongsContent({ team }: { team: Team }) {
  const navigate = useNavigate();
  const toast = useToast();
  const isLeader = isTeamLeader(team);
  const performance = getTeamPerformance(team);

  const [songIds, setSongIds] = useState(team.songIds);
  const [submittedIds, setSubmittedIds] = useState<number[]>(
    performance ? getSubmittedSongIds(performance, team.id) : [],
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [checkedIds, setCheckedIds] = useState<number[]>([]);

  const songs = songIds
    .map((id) => getSong(id))
    .filter((song) => song !== undefined);
  const confirmed = performance?.setlistConfirmed ?? false;
  const takenByOthers = performance
    ? getSongsSubmittedByOtherTeams(performance, team.id)
    : new Map<number, string>();
  // 넘기기는 공연 팀 팀장만, 진행 중(공연 예정·팀 모집 중)인 공연에만 할 수 있다.
  const canSubmit =
    isLeader && performance !== undefined && isUpcoming(performance);

  // 곡 추가 화면이 저장 뒤 이 화면으로 "돌아오게"(새로 쌓지 않게) 출발지를 알려 준다.
  const addSongs = () =>
    navigate(`/team/${team.id}/songs/add`, { state: { fromSongs: true } });

  const removeSong = (songId: number) => {
    setSongIds((prev) => prev.filter((id) => id !== songId));
    // 선택곡에서 빠진 곡은 넘긴 곡에서도 함께 빠진다.
    setSubmittedIds((prev) => prev.filter((id) => id !== songId));
    toast({ content: "선택곡에서 뺐어요", variant: "positive" });
  };

  const openSheet = () => {
    setCheckedIds(submittedIds.filter((id) => songIds.includes(id)));
    setSheetOpen(true);
  };

  const submit = () => {
    setSubmittedIds(checkedIds);
    setSheetOpen(false);
    toast({
      content:
        checkedIds.length > 0
          ? `공연 셋리스트로 ${checkedIds.length}곡을 넘겼어요`
          : "넘긴 곡을 모두 거뒀어요",
      variant: "positive",
    });
  };

  return (
    <>
      <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto">
        <TeamHeroTabs active="songs" team={team} />

        <section className="flex flex-col gap-1 px-5 pt-6 pb-8">
          <SectionHeader
            count={songs.length}
            title="선택곡"
            trailing={
              isLeader ? (
                <TextButton
                  color="primary"
                  onClick={() => addSongs()}
                  size="small"
                >
                  곡 추가
                </TextButton>
              ) : undefined
            }
          />
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="medium"
          >
            {performance
              ? "함께 연주할 곡을 모아 두고, 그중 공연에 올릴 곡을 셋리스트로 넘겨요."
              : "함께 연주할 곡을 모아 두세요."}
          </Typography>

          {songs.length === 0 ? (
            <EmptyState
              action={
                isLeader
                  ? {
                      label: "곡 추가",
                      onClick: () => addSongs(),
                    }
                  : undefined
              }
              description={
                isLeader
                  ? "함께 연주할 곡을 골라 보세요."
                  : "팀장이 곡을 고르면 여기에 보여요."
              }
              title="아직 고른 곡이 없어요"
            />
          ) : (
            <List>
              {songs.map((song, index) => {
                const submitted = submittedIds.includes(song.id);
                return (
                  <SongCell
                    key={song.id}
                    order={index + 1}
                    song={song}
                    trailing={
                      submitted || isLeader ? (
                        <ListCellContent>
                          <div className="flex items-center gap-2">
                            {submitted && <Badge glow>넘긴 곡</Badge>}
                            {isLeader && (
                              <IconButton
                                aria-label={`${song.title} 빼기`}
                                // 확정된 셋리스트에 들어간 곡은 확정이 풀릴 때까지 뺄 수 없다.
                                disabled={confirmed && submitted}
                                onClick={() => removeSong(song.id)}
                              >
                                <IconTrash />
                              </IconButton>
                            )}
                          </div>
                        </ListCellContent>
                      ) : undefined
                    }
                  />
                );
              })}
            </List>
          )}
        </section>

        {performance && confirmed && (
          <section className="flex flex-col gap-1 px-5 pb-8">
            <SectionHeader
              count={performance.setlist.length}
              title="확정된 공연 셋리스트"
            />
            <ConfirmedSetlist performance={performance} teamId={team.id} />
          </section>
        )}
      </div>

      {canSubmit && (
        <BottomActionArea
          caption={
            confirmed
              ? "확정된 뒤에는 넘길 수 없어요 (모임장이 확정을 해제하면 다시 가능)"
              : undefined
          }
          disabled={confirmed || songs.length === 0}
          label="공연 셋리스트로 넘기기"
          onClick={openSheet}
        />
      )}

      {performance && (
        <BottomSheet
          footer={
            <ActionArea variant="strong">
              <ActionAreaButton onClick={submit}>
                {checkedIds.length}곡 넘기기
              </ActionAreaButton>
            </ActionArea>
          }
          onOpenChange={setSheetOpen}
          open={sheetOpen}
          title="공연 셋리스트로 넘기기"
        >
          <div className="flex flex-col gap-2 pb-2">
            <Typography
              color="semantic.label.alternative"
              variant="label2"
              weight="medium"
            >
              {performance.title}에 올릴 곡을 골라 주세요. 한 곡은 한 팀만 넘길
              수 있어요.
            </Typography>
            <List>
              {songs.map((song) => {
                const takenBy = takenByOthers.get(song.id);
                const checked = checkedIds.includes(song.id);
                return (
                  <ListCell
                    alignItems="center"
                    disabled={takenBy !== undefined}
                    key={song.id}
                    leadingContent={
                      <ListCellContent variant="checkbox">
                        <Checkbox
                          aria-label={song.title}
                          checked={checked}
                          disabled={takenBy !== undefined}
                          onCheckedChange={(next) =>
                            setCheckedIds((prev) =>
                              next
                                ? [...prev, song.id]
                                : prev.filter((id) => id !== song.id),
                            )
                          }
                        />
                      </ListCellContent>
                    }
                    textProps={{
                      caption:
                        takenBy !== undefined
                          ? `다른 팀이 이미 넘긴 곡 · ${takenBy}`
                          : song.artist,
                      weight: "bold",
                    }}
                    verticalPadding="small"
                  >
                    {song.title}
                  </ListCell>
                );
              })}
            </List>
          </div>
        </BottomSheet>
      )}
    </>
  );
}

export default TeamSongsScreen;
