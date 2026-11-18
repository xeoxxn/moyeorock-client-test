import { IconButton, Typography, useToast } from "@wanteddev/wds";
import { IconMinus, IconPlus } from "@wanteddev/wds-icon";
import { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import BottomActionArea from "@/components/ui/BottomActionArea";
import ChipGrid from "@/components/ui/ChipGrid";
import EmptyState from "@/components/ui/EmptyState";
import FieldLabel from "@/components/ui/FieldLabel";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SelectField from "@/components/ui/SelectField";
import TextInputField from "@/components/ui/TextInputField";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import { getWritableTargets } from "@/features/board/boardHelpers";
import {
  INSTRUMENT_LABEL,
  INSTRUMENT_OPTIONS,
  REGION_LABEL,
  REGION_OPTIONS,
  TARGET_TYPE_LABEL,
} from "@/lib/domain/labels";
import type { Instrument, Region, TargetType } from "@/lib/domain/types";
import {
  canEditPost,
  getGroup,
  getPost,
  getPosts,
  getTargetName,
  getTeam,
  toId,
} from "@/mocks/selectors";

// Figma 24 모집글 쓰기 — /board/write(?targetType=&targetId=)와 /board/:postId/edit가 같은 폼을 쓴다.
// 서버 RecruitPostCreateRequest {targetType, targetId, title, body, wantedSlots[{instrument, count}], region}.
// - 모집 대상: 내가 모임장인 모임 · 팀장인 독립 팀("나이트 드라이브 · 팀"). 공연 팀은 서버가 막는다(409).
//   수정할 때는 대상을 바꿀 수 없다.
// - 모집 세션: 같은 폭 3열 칩(흰 칩 = 고름). 고른 세션마다 "{세션} 인원" − n + 줄이 생긴다(서버는 같은
//   세션 두 번을 400으로 막는다).
// - 만든 뒤에는 그 모집글로 간다(replace + 토스트).

const TITLE_MAX = 100;
const SLOT_COUNT_MAX = 10;

interface SlotDraft {
  instrument: Instrument;
  count: number;
}

const INSTRUMENT_CHOICES = INSTRUMENT_OPTIONS.map((item) => ({
  label: INSTRUMENT_LABEL[item],
  value: item,
}));

const REGION_CHOICES = REGION_OPTIONS.map((value) => ({
  label: REGION_LABEL[value],
  value,
}));

function targetKey(targetType: TargetType, targetId: number): string {
  return `${targetType}:${targetId}`;
}

function parseTargetKey(key: string): {
  targetType: TargetType;
  targetId: number;
} {
  const [targetType, targetId] = key.split(":");
  return { targetId: Number(targetId), targetType: targetType as TargetType };
}

function targetRegion(key: string): Region | undefined {
  const { targetId, targetType } = parseTargetKey(key);
  return targetType === "TEAM"
    ? getTeam(targetId)?.region
    : getGroup(targetId)?.region;
}

function targetLabel(targetType: TargetType, name: string): string {
  return `${name} · ${TARGET_TYPE_LABEL[targetType]}`;
}

function SlotStepper({
  onChange,
  slot,
}: {
  slot: SlotDraft;
  onChange: (delta: -1 | 1) => void;
}) {
  const label = INSTRUMENT_LABEL[slot.instrument];
  return (
    // Figma 24 Slot(508:22350) — 줄 이름은 본문 15(body2), 숫자는 16 Bold 32칸, 버튼 사이 4.
    <div className="flex items-center justify-between gap-3">
      <Typography color="semantic.label.strong" variant="body2">
        {label} 인원
      </Typography>
      <div className="flex items-center gap-1">
        <IconButton
          aria-label={`${label} 인원 줄이기`}
          disabled={slot.count <= 1}
          onClick={() => onChange(-1)}
          size="small"
          variant="outlined"
        >
          <IconMinus />
        </IconButton>
        <Typography
          align="center"
          className="w-8"
          color="semantic.label.strong"
          variant="body1"
          weight="bold"
        >
          {slot.count}
        </Typography>
        <IconButton
          aria-label={`${label} 인원 늘리기`}
          disabled={slot.count >= SLOT_COUNT_MAX}
          onClick={() => onChange(1)}
          size="small"
          variant="outlined"
        >
          <IconPlus />
        </IconButton>
      </div>
    </div>
  );
}

function BoardWriteScreen() {
  const navigate = useNavigate();
  const toast = useToast();
  const { postId } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = postId !== undefined;
  const editPost = isEdit ? getPost(toId(postId)) : undefined;
  const writableTargets = getWritableTargets();

  const [target, setTarget] = useState(() => {
    if (editPost) return targetKey(editPost.targetType, editPost.targetId);
    // 팀·모임 화면에서 "모집글 쓰기"로 들어오면 대상이 정해져 있다(TEAM·team 둘 다 받는다).
    const queryKey = targetKey(
      (searchParams.get("targetType") ?? "").toUpperCase() as TargetType,
      toId(searchParams.get("targetId") ?? undefined),
    );
    if (
      writableTargets.some((t) => targetKey(t.targetType, t.id) === queryKey)
    ) {
      return queryKey;
    }
    // 쓸 수 있는 대상이 하나뿐이면 고를 게 없으니 미리 채운다.
    return writableTargets.length === 1
      ? targetKey(writableTargets[0].targetType, writableTargets[0].id)
      : "";
  });
  const [title, setTitle] = useState(editPost?.title ?? "");
  const [body, setBody] = useState(editPost?.body ?? "");
  const [slots, setSlots] = useState<SlotDraft[]>(
    () =>
      editPost?.wantedSlots.map(({ count, instrument }) => ({
        count,
        instrument,
      })) ?? [],
  );
  const [region, setRegion] = useState<Region | "">(
    () => editPost?.region ?? (target ? (targetRegion(target) ?? "") : ""),
  );

  useScreenHeader(
    useMemo(
      () => <ScreenHeader title={isEdit ? "모집글 수정" : "모집글 쓰기"} />,
      [isEdit],
    ),
  );

  if (isEdit && !editPost) {
    return (
      <div className="flex flex-1 flex-col justify-center">
        <EmptyState
          description="마감 후 지워졌거나 주소가 잘못됐어요"
          title="없는 모집글이에요"
        />
      </div>
    );
  }

  if (editPost && (!canEditPost(editPost) || editPost.status === "CLOSED")) {
    return (
      <div className="flex flex-1 flex-col justify-center">
        <EmptyState
          description={
            editPost.status === "CLOSED"
              ? "마감한 모집글은 고칠 수 없어요"
              : "모집글은 대상 팀의 팀장·모임의 모임장만 고칠 수 있어요"
          }
          title="수정할 수 없는 모집글이에요"
        />
      </div>
    );
  }

  if (!editPost && writableTargets.length === 0) {
    return (
      <div className="flex flex-1 flex-col justify-center">
        <EmptyState
          description={
            "모집글은 모임장과 독립 팀의 팀장만 쓸 수 있어요.\n공연 팀은 초대로 팀원을 모아요."
          }
          title="모집글을 쓸 수 있는 곳이 없어요"
        />
      </div>
    );
  }

  const targetOptions = editPost
    ? [
        {
          label: targetLabel(
            editPost.targetType,
            getTargetName(editPost.targetType, editPost.targetId) ?? "",
          ),
          value: target,
        },
      ]
    : writableTargets.map((t) => ({
        label: targetLabel(t.targetType, t.name),
        value: targetKey(t.targetType, t.id),
      }));

  const changeTarget = (key: string) => {
    setTarget(key);
    // 활동 지역은 대개 팀·모임 지역과 같아서 먼저 채워 두고, 필요하면 바꾸게 한다.
    const nextRegion = targetRegion(key);
    if (nextRegion) setRegion(nextRegion);
  };

  const toggleSlot = (instrument: Instrument) =>
    setSlots((prev) =>
      prev.some((slot) => slot.instrument === instrument)
        ? prev.filter((slot) => slot.instrument !== instrument)
        : [...prev, { count: 1, instrument }],
    );

  const changeCount = (instrument: Instrument, delta: -1 | 1) =>
    setSlots((prev) =>
      prev.map((slot) =>
        slot.instrument === instrument
          ? {
              ...slot,
              count: Math.min(SLOT_COUNT_MAX, Math.max(1, slot.count + delta)),
            }
          : slot,
      ),
    );

  // 칩 순서와 같게 보여 준다(고른 순서대로 쌓이면 칩과 줄 순서가 엇갈린다).
  const orderedSlots = INSTRUMENT_OPTIONS.flatMap((instrument) =>
    slots.filter((slot) => slot.instrument === instrument),
  );

  const canSubmit =
    target !== "" &&
    title.trim() !== "" &&
    body.trim() !== "" &&
    slots.length > 0 &&
    region !== "";

  const submit = () => {
    if (editPost) {
      toast({ content: "모집글을 고쳤어요", variant: "positive" });
      navigate(`/board/${editPost.id}`, { replace: true });
      return;
    }
    toast({ content: "모집글을 올렸어요", variant: "positive" });
    // 목업은 새 글을 만들지 못해서, 같은 대상의 기존 글이 있으면 그 상세로, 없으면 그 탭 목록으로 간다.
    // 서버에 붙이면 응답의 id로 /board/:id에 간다.
    const { targetId, targetType } = parseTargetKey(target);
    const existing = getPosts().find(
      (post) => post.targetType === targetType && post.targetId === targetId,
    );
    navigate(
      existing
        ? `/board/${existing.id}`
        : `/board?type=${targetType === "TEAM" ? "team" : "group"}`,
      { replace: true },
    );
  };

  return (
    <>
      <ScreenBody className="flex flex-col gap-6 px-5 pt-2">
        <SelectField
          disabled={editPost !== undefined}
          label="모집 대상"
          message={editPost ? "올린 글의 대상은 바꿀 수 없어요" : undefined}
          onChange={changeTarget}
          options={targetOptions}
          placeholder="팀이나 모임을 골라 주세요"
          value={target}
        />

        <TextInputField
          label="제목"
          maxLength={TITLE_MAX}
          onChange={setTitle}
          placeholder="주말 합주할 베이스를 찾아요"
          value={title}
        />

        <div className="flex flex-col gap-3">
          <FieldLabel>모집 세션</FieldLabel>
          <ChipGrid
            isSelected={(instrument) =>
              slots.some((slot) => slot.instrument === instrument)
            }
            onToggle={toggleSlot}
            options={INSTRUMENT_CHOICES}
          />
          {orderedSlots.length > 0 && (
            <div className="flex flex-col gap-3 pt-2">
              {orderedSlots.map((slot) => (
                <SlotStepper
                  key={slot.instrument}
                  onChange={(delta) => changeCount(slot.instrument, delta)}
                  slot={slot}
                />
              ))}
            </div>
          )}
        </div>

        <SelectField
          label="활동 지역"
          onChange={setRegion}
          options={REGION_CHOICES}
          placeholder="지역을 골라 주세요"
          value={region}
        />

        <TextInputField
          label="본문"
          multiline
          onChange={setBody}
          placeholder="합주 일정·장소, 주로 하는 장르처럼 함께할 분이 알아야 할 것을 적어 주세요"
          value={body}
        />
      </ScreenBody>

      <BottomActionArea
        disabled={!canSubmit}
        label={isEdit ? "저장" : "등록"}
        onClick={submit}
      />
    </>
  );
}

export default BoardWriteScreen;
