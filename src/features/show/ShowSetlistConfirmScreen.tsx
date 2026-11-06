import {
  Checkbox,
  IconButton,
  List,
  ListCell,
  ListCellContent,
  SectionMessage,
  Typography,
  useToast,
} from "@wanteddev/wds";
import { IconChevronDown, IconChevronUp } from "@wanteddev/wds-icon";
import type { MouseEvent } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BottomActionArea from "@/components/ui/BottomActionArea";
import EmptyState from "@/components/ui/EmptyState";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useAppAlert } from "@/components/ui/useAppAlert";
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

// Figma: 공연/06 셋리스트 확정 — 모임장 전용. Figma는 팀별 탭으로 넘긴 곡을 보기만 했지만, 서버
// 확정 요청(SetlistConfirmRequest)은 "넘긴 곡 중 넣을 곡 + 1..n 순서"를 한 번에 받는다. 그래서 한
// 목록에서 넣을 곡을 체크하고 위/아래로 공연 순서를 정하게 바꿨다. 이미 확정했어도 다시 확정할 수 있고
// (확정 시각만 새로 찍힌다), 확정을 풀면 팀들이 다시 곡을 넘길 수 있다.

interface DraftItem extends SetlistItem {
  included: boolean;
}

/** 확정본은 sortOrder 순서, 확정 전은 팀들이 넘긴 순서 그대로 시작한다 */
function toDraft(performance: Performance): DraftItem[] {
  const items = performance.setlistConfirmed
    ? [...performance.setlist].sort(
        (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
      )
    : performance.setlist;
  return items.map((item) => ({ ...item, included: true }));
}

function songCaption(item: SetlistItem) {
  return [
    getSong(item.songId)?.artist,
    getTeam(item.teamId)?.name ?? "해체된 팀",
  ]
    .filter(Boolean)
    .join(" · ");
}

function OrderNumber({ order }: { order: number | null }) {
  return (
    <ListCellContent>
      <Typography
        className="w-6 text-center"
        color={
          order !== null
            ? "semantic.primary.normal"
            : "semantic.label.assistive"
        }
        variant="body1"
        weight="bold"
      >
        {order !== null ? String(order).padStart(2, "0") : "–"}
      </Typography>
    </ListCellContent>
  );
}

function ShowSetlistConfirmScreen() {
  const navigate = useNavigate();
  const alert = useAppAlert();
  const toast = useToast();
  const { showId } = useParams();
  const performance = getPerformance(toId(showId));
  const [items, setItems] = useState(() =>
    performance ? toDraft(performance) : [],
  );
  const [confirmed, setConfirmed] = useState(
    performance?.setlistConfirmed ?? false,
  );

  useScreenHeader(<ScreenHeader title="셋리스트 확정" />);

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
          description="공연 팀 팀장이 선택곡을 셋리스트로 넘기면 여기에 모여요"
          title="아직 팀들이 넘긴 곡이 없어요"
        />
      </div>
    );
  }

  // 끝난 공연(종료·취소)은 서버가 확정·해제를 모두 막는다.
  const editable = isUpcoming(performance);
  const included = items.filter((item) => item.included);
  const teamCount = new Set(items.map((item) => item.teamId)).size;

  const toggle = (index: number, next: boolean) =>
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, included: next } : item)),
    );

  const move = (index: number, delta: -1 | 1) =>
    setItems((prev) => {
      const next = [...prev];
      [next[index], next[index + delta]] = [next[index + delta], next[index]];
      return next;
    });

  // WDS ListCell은 행을 누르면 안의 첫 버튼(여기선 체크박스)을 대신 눌러 준다. 위/아래 버튼을 눌러도
  // 체크가 같이 바뀌지 않도록 그 전달은 막고, 버튼이 아닌 곳을 눌렀을 때만 직접 체크를 바꾼다.
  const handleRowClick = (event: MouseEvent, index: number) => {
    event.preventDefault();
    if ((event.target as HTMLElement).closest("button")) return;
    toggle(index, !items[index].included);
  };

  const confirm = async () => {
    const result = await alert({
      cancel: "취소",
      confirm: "확정",
      content: `${included.length}곡을 이 순서로 확정해요. 확정하면 팀들이 곡을 더 넘기거나 바꿀 수 없어요.`,
      title: confirmed
        ? "셋리스트를 다시 확정할까요?"
        : "셋리스트를 확정할까요?",
    });
    if (result !== "confirm") return;
    // 서버에는 체크한 곡만 1부터 빈틈없는 sortOrder로 보낸다(included 순서 = 공연 순서).
    toast({ content: "셋리스트를 확정했어요", variant: "positive" });
    navigate(`/show/${performance.id}`, { replace: true });
  };

  const unconfirm = async () => {
    const result = await alert({
      cancel: "취소",
      confirm: "확정 해제",
      content: "팀들이 다시 곡을 넘기거나 바꿀 수 있어요.",
      title: "셋리스트 확정을 풀까요?",
    });
    if (result !== "confirm") return;
    setConfirmed(false);
    toast({ content: "셋리스트 확정을 풀었어요", variant: "positive" });
  };

  return (
    <>
      <div className="scrollbar-hidden flex flex-1 flex-col gap-4 overflow-y-auto px-5 pt-4 pb-8">
        {!editable ? (
          <SectionMessage variant="cautionary">
            끝난 공연은 셋리스트를 바꿀 수 없어요
          </SectionMessage>
        ) : (
          confirmed && (
            <SectionMessage
              description="순서를 바꿔 다시 확정하거나, 확정을 풀어 팀들이 곡을 다시 넘기게 할 수 있어요."
              variant="positive"
            >
              확정한 셋리스트예요
            </SectionMessage>
          )
        )}

        <Typography
          color="semantic.label.assistive"
          variant="label2"
          weight="bold"
        >
          {confirmed
            ? `확정한 곡 ${items.length}개`
            : `팀 ${teamCount}곳이 넘긴 곡 ${items.length}개`}
          {editable && " · 체크한 곡만 이 순서로 들어가요"}
        </Typography>

        <List>
          {items.map((item, index) => {
            // 끝난 공연에서 확정하지 않은 곡은 순서가 없다(확정 전 목록일 뿐이다).
            const order =
              item.included && (editable || confirmed)
                ? included.indexOf(item) + 1
                : null;
            const title = getSong(item.songId)?.title ?? "삭제된 곡";

            if (!editable) {
              return (
                <ListCell
                  alignItems="center"
                  disableInteraction
                  key={`${item.teamId}-${item.songId}`}
                  leadingContent={<OrderNumber order={order} />}
                  textProps={{ caption: songCaption(item) }}
                >
                  {title}
                </ListCell>
              );
            }

            return (
              <ListCell
                alignItems="center"
                key={`${item.teamId}-${item.songId}`}
                leadingContent={
                  <>
                    <ListCellContent variant="checkbox">
                      <Checkbox
                        aria-label={`${title} 넣기`}
                        checked={item.included}
                        onCheckedChange={(next) => toggle(index, next)}
                      />
                    </ListCellContent>
                    <OrderNumber order={order} />
                  </>
                }
                onClick={(event) => handleRowClick(event, index)}
                textProps={{
                  caption: songCaption(item),
                  color: item.included
                    ? "semantic.label.normal"
                    : "semantic.label.assistive",
                }}
                trailingContent={
                  <ListCellContent variant="icon-button">
                    <div className="flex items-center gap-1">
                      <IconButton
                        aria-label={`${title} 위로`}
                        disabled={index === 0}
                        onClick={() => move(index, -1)}
                      >
                        <IconChevronUp />
                      </IconButton>
                      <IconButton
                        aria-label={`${title} 아래로`}
                        disabled={index === items.length - 1}
                        onClick={() => move(index, 1)}
                      >
                        <IconChevronDown />
                      </IconButton>
                    </div>
                  </ListCellContent>
                }
              >
                {title}
              </ListCell>
            );
          })}
        </List>
      </div>
      {editable && (
        <BottomActionArea
          caption={`${included.length}곡을 이 순서로 확정해요`}
          disabled={included.length === 0}
          label={confirmed ? "다시 확정" : "셋리스트 확정"}
          onClick={confirm}
          secondary={
            confirmed ? { label: "확정 해제", onClick: unconfirm } : undefined
          }
        />
      )}
    </>
  );
}

export default ShowSetlistConfirmScreen;
