import { useToast } from "@wanteddev/wds";
import { useState } from "react";
import { Navigate } from "react-router-dom";

import TrackRow from "@/components/list/TrackRow";
import ActionSheet, { type ActionSheetItem } from "@/components/ui/ActionSheet";
import BottomActionArea from "@/components/ui/BottomActionArea";
import ConfirmSheet from "@/components/ui/ConfirmSheet";
import EmptyState from "@/components/ui/EmptyState";
import SectionHeader from "@/components/ui/SectionHeader";
import Status from "@/components/ui/Status";
import SongAddSheet from "@/features/team/components/SongAddSheet";
import SubmitSongsSheet from "@/features/team/components/SubmitSongsSheet";
import { songStatus } from "@/features/team/components/songStatus";
import TeamFallback from "@/features/team/components/TeamFallback";
import TeamScreenFrame from "@/features/team/components/TeamScreenFrame";
import {
  getSongsSubmittedByOtherTeams,
  getSubmittedSongIds,
  getTeamPerformance,
  isTeamLeader,
  isTeamMember,
  useTeamParam,
  withObjectParticle,
} from "@/features/team/components/teamHelpers";
import type { Song, Team } from "@/lib/domain/types";
import { getSong, isUpcoming } from "@/mocks/selectors";

// Figma 04 팀·셋리스트(417:12460) → 서버 기준 "선택곡" 탭(팀 쪽은 셋리스트라는 말을 쓰지 않는다).
// - 선택곡: 팀장이 곡 추가 시트(Figma 16)로 고른다(PUT /teams/{id}/songs, 전체 대체). 팀원은 본다.
// - 공연 팀이면 팀장이 그중 일부를 공연에 넘긴다(PUT /performances/{pid}/setlist/teams/{tid}) — 공연이
//   진행 중이고 셋리스트 확정 전일 때만, 다른 팀이 이미 넘긴 곡은 빼고. 넘긴 곡은 "후보", 모임장이
//   확정하면 "확정". 독립 팀은 상태도 넘기기도 없다.
// - Figma 17 확정 시트의 "확정"은 모임장 쪽 동작이라, 팀 쪽에서는 같은 시트를 "넘기기" 확인으로 쓴다.
// - 서버는 선택곡을 바꿔도 넘긴 곡을 건드리지 않는다. 화면에서는 선택곡에서 뺀 곡을 공연에서도 함께
//   빼서(넘기기 PUT을 한 번 더) 두 목록이 어긋나지 않게 하고, 확정된 곡은 빼지 못하게 한다.
//   확정 뒤 곡 추가는 UI에서 막는다(서버 명세).
function TeamSongsScreen() {
  const team = useTeamParam();
  if (!team) return <TeamFallback kind="notFound" />;
  if (!isTeamMember(team)) return <Navigate replace to={`/team/${team.id}`} />;
  return <TeamSongsContent team={team} />;
}

function TeamSongsContent({ team }: { team: Team }) {
  const toast = useToast();
  const isLeader = isTeamLeader(team);
  const performance = getTeamPerformance(team);
  const confirmed = performance?.setlistConfirmed ?? false;

  const [songIds, setSongIds] = useState(team.songIds);
  const [submittedIds, setSubmittedIds] = useState<number[]>(() =>
    performance ? getSubmittedSongIds(performance, team.id) : [],
  );
  const [addOpen, setAddOpen] = useState(false);
  const [menuSong, setMenuSong] = useState<Song | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [confirmIds, setConfirmIds] = useState<number[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const songs = songIds
    .map((id) => getSong(id))
    .filter((song) => song !== undefined);
  const takenByOthers = performance
    ? getSongsSubmittedByOtherTeams(performance, team.id)
    : new Map<number, string>();
  const canSubmit =
    isLeader &&
    performance !== undefined &&
    isUpcoming(performance) &&
    !confirmed;
  const canEdit = isLeader && !confirmed;
  const unsubmitted = songs.filter((song) => !submittedIds.includes(song.id));
  const submittableCount = unsubmitted.filter(
    (song) => !takenByOthers.has(song.id),
  ).length;

  // 곡 추가 시트의 +/✓ — 뺀 곡은 넘긴 곡에서도 빠진다.
  const toggleSong = (songId: number) => {
    setSongIds((prev) =>
      prev.includes(songId)
        ? prev.filter((id) => id !== songId)
        : [...prev, songId],
    );
    setSubmittedIds((prev) => prev.filter((id) => id !== songId));
  };

  const removeSong = (song: Song) => {
    toggleSong(song.id);
    toast({ content: "선택곡에서 뺐어요", variant: "positive" });
  };

  const withdraw = (song: Song) => {
    setSubmittedIds((prev) => prev.filter((id) => id !== song.id));
    toast({
      content: `${withObjectParticle(song.title)} 공연에서 뺐어요`,
      variant: "positive",
    });
  };

  const askSubmit = (ids: number[]) => {
    setConfirmIds(ids);
    setConfirmOpen(true);
  };

  const submit = () => {
    setSubmittedIds((prev) => [...prev, ...confirmIds]);
    toast({
      content: `${confirmIds.length}곡을 공연에 넘겼어요`,
      variant: "positive",
    });
  };

  const menuItems = (song: Song): ActionSheetItem[] => {
    const submitted = submittedIds.includes(song.id);
    const items: ActionSheetItem[] = [];
    if (canSubmit && !submitted && !takenByOthers.has(song.id)) {
      items.push({
        label: "공연에 넘기기",
        onSelect: () => askSubmit([song.id]),
      });
    }
    if (canSubmit && submitted) {
      items.push({ label: "공연에서 빼기", onSelect: () => withdraw(song) });
    }
    if (!(confirmed && submitted)) {
      items.push({
        destructive: true,
        label: "선택곡에서 빼기",
        onSelect: () => removeSong(song),
      });
    }
    return items;
  };

  const firstConfirmSong =
    confirmIds.length === 1 ? getSong(confirmIds[0]) : undefined;
  const confirmTitle = firstConfirmSong
    ? `${withObjectParticle(firstConfirmSong.title)} 공연에 넘길까요?`
    : `${confirmIds.length}곡을 공연에 넘길까요?`;

  return (
    <TeamScreenFrame
      footer={
        canSubmit && songs.length > 0 ? (
          <BottomActionArea
            caption={
              submittableCount === 0 ? "넘길 수 있는 곡이 없어요" : undefined
            }
            disabled={submittableCount === 0}
            label="공연에 넘기기"
            onClick={() => {
              setCheckedIds([]);
              setSubmitOpen(true);
            }}
          />
        ) : undefined
      }
      tab="songs"
      team={team}
    >
      <SectionHeader
        actionLabel="수정"
        first
        onAction={canEdit ? () => setAddOpen(true) : undefined}
        // 확정 뒤엔 "수정"이 사라지는 이유를 제목 옆에 알린다.
        status={
          performance && confirmed ? (
            <Status tone="positive">공연 곡 확정</Status>
          ) : undefined
        }
        title={`선택곡 · ${songs.length}곡`}
      />

      {songs.length === 0 ? (
        <EmptyState
          action={
            canEdit
              ? { label: "곡 추가", onClick: () => setAddOpen(true) }
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
        songs.map((song, index) => {
          const items = isLeader ? menuItems(song) : [];
          return (
            <TrackRow
              artist={song.artist}
              index={index + 1}
              key={song.id}
              onMore={
                items.length > 0
                  ? () => {
                      setMenuSong(song);
                      setMenuOpen(true);
                    }
                  : undefined
              }
              status={
                performance
                  ? songStatus(submittedIds.includes(song.id), confirmed)
                  : undefined
              }
              title={song.title}
            />
          );
        })
      )}

      {isLeader && (
        <>
          <SongAddSheet
            onOpenChange={setAddOpen}
            onToggle={toggleSong}
            open={addOpen}
            selectedIds={songIds}
            team={team}
          />
          <ActionSheet
            items={menuSong ? menuItems(menuSong) : []}
            onOpenChange={setMenuOpen}
            open={menuOpen}
            title={menuSong?.title}
          />
        </>
      )}

      {canSubmit && (
        <>
          <SubmitSongsSheet
            checkedIds={checkedIds}
            onCheckedIdsChange={setCheckedIds}
            onNext={() => {
              setSubmitOpen(false);
              askSubmit(checkedIds);
            }}
            onOpenChange={setSubmitOpen}
            open={submitOpen}
            performanceTitle={performance.title}
            songs={unsubmitted}
            takenByOthers={takenByOthers}
          />
          <ConfirmSheet
            confirmLabel="넘기기"
            description={
              "넘기면 공연 셋리스트 후보에 들어가요.\n모임장이 확정하기 전까지 다시 뺄 수 있어요."
            }
            onConfirm={submit}
            onOpenChange={setConfirmOpen}
            open={confirmOpen}
            title={confirmTitle}
          />
        </>
      )}
    </TeamScreenFrame>
  );
}

export default TeamSongsScreen;
