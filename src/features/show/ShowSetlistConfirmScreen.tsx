import { IconButton, Typography, useToast } from "@wanteddev/wds";
import {
  IconChevronDown,
  IconChevronUp,
  IconMoreVertical,
} from "@wanteddev/wds-icon";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import MediaRow from "@/components/list/MediaRow";
import TrackRow from "@/components/list/TrackRow";
import ActionSheet, { type ActionSheetItem } from "@/components/ui/ActionSheet";
import BottomActionArea from "@/components/ui/BottomActionArea";
import ConfirmSheet from "@/components/ui/ConfirmSheet";
import EmptyState from "@/components/ui/EmptyState";
import { innerClick } from "@/components/ui/listCellEvents";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SectionHeader from "@/components/ui/SectionHeader";
import Status from "@/components/ui/Status";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import { canManagePerformance } from "@/features/show/performanceAccess";
import type { Performance, SetlistItem } from "@/lib/domain/types";
import {
  getPerformance,
  getSong,
  getTeam,
  isUpcoming,
  toId,
} from "@/mocks/selectors";

// 셋리스트 확정 — 모임장 전용(공연 상세 ⋮ → 셋리스트 확정). 서버 확정 요청(SetlistConfirmRequest)은
// "넘긴 곡 중 넣을 곡 + 1..n 순서"를 한 번에 받는다. 공연은 팀 단위로 무대에 올라서 팀별로 묶어 보이고
// (구역 제목 = 팀), 팀 순서는 구역 제목 옆 화살표로, 팀 안의 곡 순서·빼기는 곡 ⋮로 바꾼다. 번호는 넣을
// 곡만 위에서부터 1..n이다. 확정하면 뺀 곡은 셋리스트에서 사라지고 팀들은 더 넘길 수 없다 — 다시 바꾸려면
// "확정 풀기"(PATCH unconfirm)로 푼다. 끝난 공연(종료·취소)은 서버가 확정·해제를 모두 막는다.

interface DraftItem extends SetlistItem {
  included: boolean;
}

const itemKey = (item: SetlistItem) => `${item.teamId}-${item.songId}`;

/** 확정본은 sortOrder 순서, 확정 전은 팀들이 넘긴 순서 그대로 시작한다 */
function toDraft(performance: Performance): DraftItem[] {
  const items = performance.setlistConfirmed
    ? [...performance.setlist].sort(
        (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
      )
    : performance.setlist;
  return items.map((item) => ({ ...item, included: true }));
}

/** 팀 순서 — 처음엔 곡이 처음 나오는 순서 */
function toTeamOrder(items: SetlistItem[]): number[] {
  return [...new Set(items.map((item) => item.teamId))];
}

function ExcludedTrackRow({
  artist,
  onMore,
  title,
}: {
  artist: string;
  title: string;
  onMore?: () => void;
}) {
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
          –
        </Typography>
      }
      meta={artist}
      title={<span className="text-label-assistive">{title}</span>}
      trailing={
        <span className="flex shrink-0 items-center gap-1">
          <Status tone="neutral">빠짐</Status>
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
      }
    />
  );
}

function ShowSetlistConfirmScreen() {
  const toast = useToast();
  const { showId } = useParams();
  const performance = getPerformance(toId(showId));
  const [items, setItems] = useState(() =>
    performance ? toDraft(performance) : [],
  );
  const [teamOrder, setTeamOrder] = useState(() => toTeamOrder(items));
  const [confirmed, setConfirmed] = useState(
    performance?.setlistConfirmed ?? false,
  );
  const [menuKey, setMenuKey] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [unconfirmOpen, setUnconfirmOpen] = useState(false);

  useScreenHeader(useMemo(() => <ScreenHeader title="셋리스트 확정" />, []));

  if (!performance) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyState
          description="삭제됐거나 주소가 잘못된 공연이에요"
          title="없는 공연이에요"
        />
      </div>
    );
  }

  if (!canManagePerformance(performance)) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyState
          description="셋리스트는 모임장만 확정할 수 있어요"
          title="확정 권한이 없어요"
        />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyState
          description="공연 팀 팀장이 선택곡을 넘기면 여기에 모여요"
          title="아직 팀들이 넘긴 곡이 없어요"
        />
      </div>
    );
  }

  const editable = isUpcoming(performance);
  const editing = editable && !confirmed;
  const teamItems = (teamId: number) =>
    items.filter((item) => item.teamId === teamId);
  // 서버에 보낼 순서 — 팀 순서대로, 팀 안에서는 목록 순서대로 넣을 곡만 1..n
  const ordered = teamOrder.flatMap((teamId) =>
    teamItems(teamId).filter((item) => item.included),
  );
  const menuItem = items.find((item) => itemKey(item) === menuKey);

  const moveTeam = (index: number, delta: -1 | 1) =>
    setTeamOrder((prev) => {
      const next = [...prev];
      [next[index], next[index + delta]] = [next[index + delta], next[index]];
      return next;
    });

  /** 같은 팀 안에서 한 칸 옮긴다 */
  const moveItem = (target: DraftItem, delta: -1 | 1) =>
    setItems((prev) => {
      const positions = prev
        .map((item, index) => (item.teamId === target.teamId ? index : -1))
        .filter((index) => index >= 0);
      const at = positions.findIndex(
        (index) => itemKey(prev[index]) === itemKey(target),
      );
      const from = positions[at];
      const to = positions[at + delta];
      if (to === undefined) return prev;
      const next = [...prev];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });

  const setIncluded = (target: DraftItem, included: boolean) =>
    setItems((prev) =>
      prev.map((item) =>
        itemKey(item) === itemKey(target) ? { ...item, included } : item,
      ),
    );

  const menuItems = (): ActionSheetItem[] => {
    if (!menuItem) return [];
    const siblings = teamItems(menuItem.teamId);
    const at = siblings.findIndex(
      (item) => itemKey(item) === itemKey(menuItem),
    );
    return [
      ...(at > 0
        ? [{ label: "위로 옮기기", onSelect: () => moveItem(menuItem, -1) }]
        : []),
      ...(at < siblings.length - 1
        ? [{ label: "아래로 옮기기", onSelect: () => moveItem(menuItem, 1) }]
        : []),
      menuItem.included
        ? {
            label: "셋리스트에서 빼기",
            onSelect: () => setIncluded(menuItem, false),
          }
        : { label: "다시 넣기", onSelect: () => setIncluded(menuItem, true) },
    ];
  };

  const openMenu = (item: DraftItem) => {
    setMenuKey(itemKey(item));
    setMenuOpen(true);
  };

  const confirm = () => {
    // 서버에는 넣을 곡만 1부터 빈틈없는 sortOrder로 보낸다(ordered 순서 = 공연 순서). 확정하면 뺀 곡은
    // 셋리스트에서 사라진다.
    setItems(ordered);
    setTeamOrder(toTeamOrder(ordered));
    setConfirmed(true);
    toast({ content: "셋리스트를 확정했어요", variant: "positive" });
  };

  const unconfirm = () => {
    setConfirmed(false);
    toast({ content: "셋리스트 확정을 풀었어요", variant: "positive" });
  };

  let caption: string | null = null;
  if (!editable) caption = "끝난 공연은 셋리스트를 바꿀 수 없어요";
  else if (confirmed)
    caption = "확정한 셋리스트예요. 바꾸려면 확정을 풀어 주세요";

  return (
    <>
      <ScreenBody>
        {caption && (
          <Typography
            as="p"
            className="px-5 pt-2"
            color="semantic.label.assistive"
            variant="label2"
          >
            {caption}
          </Typography>
        )}
        {teamOrder.map((teamId, teamIndex) => {
          const list = teamItems(teamId);
          const teamName = getTeam(teamId)?.name ?? "해체된 팀";
          return (
            <section key={teamId}>
              <SectionHeader
                first={teamIndex === 0 && caption === null}
                title={teamName}
                trailing={
                  editing && teamOrder.length > 1 ? (
                    <span className="flex items-center gap-1">
                      <IconButton
                        aria-label={`${teamName} 앞으로`}
                        color="semantic.label.alternative"
                        disabled={teamIndex === 0}
                        onClick={() => moveTeam(teamIndex, -1)}
                        size={24}
                        variant="normal"
                      >
                        <IconChevronUp />
                      </IconButton>
                      <IconButton
                        aria-label={`${teamName} 뒤로`}
                        color="semantic.label.alternative"
                        disabled={teamIndex === teamOrder.length - 1}
                        onClick={() => moveTeam(teamIndex, 1)}
                        size={24}
                        variant="normal"
                      >
                        <IconChevronDown />
                      </IconButton>
                    </span>
                  ) : (
                    <Typography
                      color="semantic.label.assistive"
                      variant="label1"
                      weight="medium"
                    >
                      {list.length}곡
                    </Typography>
                  )
                }
              />
              {list.map((item) => {
                const song = getSong(item.songId);
                const title = song?.title ?? "삭제된 곡";
                const artist = song?.artist ?? "";
                const onMore = editing ? () => openMenu(item) : undefined;
                return item.included ? (
                  <TrackRow
                    artist={artist}
                    index={ordered.indexOf(item) + 1}
                    key={itemKey(item)}
                    onMore={onMore}
                    title={title}
                  />
                ) : (
                  <ExcludedTrackRow
                    artist={artist}
                    key={itemKey(item)}
                    onMore={onMore}
                    title={title}
                  />
                );
              })}
            </section>
          );
        })}
      </ScreenBody>

      {editing && (
        <BottomActionArea
          caption={`${ordered.length}곡을 이 순서로 확정해요`}
          disabled={ordered.length === 0}
          label="셋리스트 확정"
          onClick={() => setConfirmOpen(true)}
        />
      )}
      {editable && confirmed && (
        <BottomActionArea
          label="확정 풀기"
          onClick={() => setUnconfirmOpen(true)}
        />
      )}

      <ActionSheet
        items={menuItems()}
        onOpenChange={setMenuOpen}
        open={menuOpen}
        title={menuItem ? getSong(menuItem.songId)?.title : undefined}
      />
      <ConfirmSheet
        confirmLabel="확정"
        description={
          "확정하면 팀들이 더 이상 곡을 넘길 수 없어요.\n나중에 확정을 풀 수 있어요."
        }
        onConfirm={confirm}
        onOpenChange={setConfirmOpen}
        open={confirmOpen}
        title="셋리스트를 확정할까요?"
      />
      <ConfirmSheet
        confirmLabel="확정 풀기"
        description="팀들이 다시 곡을 넘기거나 바꿀 수 있어요."
        onConfirm={unconfirm}
        onOpenChange={setUnconfirmOpen}
        open={unconfirmOpen}
        title="셋리스트 확정을 풀까요?"
      />
    </>
  );
}

export default ShowSetlistConfirmScreen;
