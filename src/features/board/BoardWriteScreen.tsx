import { Chip, IconButton, Typography, useToast } from "@wanteddev/wds";
import { IconMinus, IconPlus } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import BottomActionArea from "@/components/ui/BottomActionArea";
import EmptyState from "@/components/ui/EmptyState";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SelectField from "@/components/ui/SelectField";
import TextInputField from "@/components/ui/TextInputField";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
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
  getPostableTargets,
  getPosts,
  getTargetName,
  getTeam,
  toId,
} from "@/mocks/selectors";

// Figma: 게시판/03 모집글 쓰기 (101:24851). /board/write(?targetType=&targetId=)와
// /board/:postId/edit가 같은 폼을 쓴다.
// 서버 RecruitPostCreateRequest {targetType, targetId, title, body, wantedSlots[{instrument, count}], region}
// 기준으로 Figma 필드를 바꿨다.
// - "모집 유형"(모임/공연/팀) → "모집 대상": 공고는 내가 현재 팀장인 팀·모임장인 모임에만 쓸 수 있어서
//   그 목록에서 고른다. 수정할 때는 대상을 바꿀 수 없다.
// - "모집 세션" 칩 + "모집 인원" 하나 → 세션마다 인원(wantedSlots). 같은 세션을 두 번 넣을 수 없게
//   칩으로 고르고, 고른 세션마다 인원 행이 생긴다.
// - "합주 장소"는 서버 공고에 없는 필드라 뺐다.

const TITLE_MAX = 100;
const SLOT_COUNT_MAX = 10;

interface SlotDraft {
  instrument: Instrument;
  count: number;
}

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

function FieldLabel({ children }: { children: string }) {
  // WDS FormLabel과 같은 모양 — 한 칸이 아니라 칩 묶음에 붙는 제목이라 <label>을 쓰지 않는다.
  return (
    <Typography color="semantic.label.neutral" variant="label1" weight="bold">
      {children}
    </Typography>
  );
}

function BoardWriteScreen() {
  const navigate = useNavigate();
  const toast = useToast();
  const { postId } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = postId !== undefined;
  const editPost = isEdit ? getPost(toId(postId)) : undefined;
  const postableTargets = getPostableTargets();

  const [target, setTarget] = useState(() => {
    if (editPost) return targetKey(editPost.targetType, editPost.targetId);
    // 팀·모임 화면에서 "공고 쓰기"로 들어오면 대상이 정해져 있다(TEAM·team 둘 다 받는다).
    const queryKey = targetKey(
      (searchParams.get("targetType") ?? "").toUpperCase() as TargetType,
      toId(searchParams.get("targetId") ?? undefined),
    );
    if (
      postableTargets.some((t) => targetKey(t.targetType, t.id) === queryKey)
    ) {
      return queryKey;
    }
    // 쓸 수 있는 대상이 하나뿐이면 고를 게 없으니 미리 채운다.
    return postableTargets.length === 1
      ? targetKey(postableTargets[0].targetType, postableTargets[0].id)
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
    <ScreenHeader
      title={isEdit ? "모집글 수정" : "모집글 쓰기"}
      variant="normal"
    />,
  );

  if (isEdit && !editPost) {
    return (
      <div className="flex flex-1 flex-col justify-center">
        <EmptyState
          action={{
            label: "게시판으로",
            onClick: () => navigate("/board", { replace: true }),
          }}
          description="마감 후 지워졌거나 주소가 잘못됐어요"
          title="없는 공고예요"
        />
      </div>
    );
  }

  if (editPost && !canEditPost(editPost)) {
    return (
      <div className="flex flex-1 flex-col justify-center">
        <EmptyState
          description="공고는 대상 팀의 팀장·모임의 모임장만 고칠 수 있어요"
          title="수정할 수 없는 공고예요"
        />
      </div>
    );
  }

  if (!editPost && postableTargets.length === 0) {
    return (
      <div className="flex flex-1 flex-col justify-center">
        <EmptyState
          action={{
            label: "게시판으로",
            onClick: () => navigate("/board", { replace: true }),
          }}
          description="모집 공고는 팀장·모임장만 쓸 수 있어요"
          title="공고를 쓸 수 있는 팀·모임이 없어요"
        />
      </div>
    );
  }

  const targetOptions = editPost
    ? [
        {
          label: `${TARGET_TYPE_LABEL[editPost.targetType]} · ${getTargetName(editPost.targetType, editPost.targetId) ?? ""}`,
          value: target,
        },
      ]
    : postableTargets.map((t) => ({
        label: `${TARGET_TYPE_LABEL[t.targetType]} · ${t.name}`,
        value: targetKey(t.targetType, t.id),
      }));

  const changeTarget = (key: string) => {
    setTarget(key);
    // 활동 지역은 대개 팀·모임 지역과 같아서 먼저 채워 두고, 필요하면 바꾸게 한다.
    const nextRegion = targetRegion(key);
    if (nextRegion) setRegion(nextRegion);
  };

  const toggleSlot = (instrument: Instrument) => {
    setSlots((prev) =>
      prev.some((slot) => slot.instrument === instrument)
        ? prev.filter((slot) => slot.instrument !== instrument)
        : [...prev, { count: 1, instrument }],
    );
  };

  const changeCount = (instrument: Instrument, delta: number) => {
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
  };

  // 칩 순서와 같게 보여 준다(고른 순서대로 쌓이면 칩과 행 순서가 엇갈린다).
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
      toast({ content: "공고를 수정했어요", variant: "positive" });
      navigate(`/board/${editPost.id}`, { replace: true });
      return;
    }
    toast({ content: "모집 공고를 올렸어요", variant: "positive" });
    // 목업은 새 공고를 만들지 못해서, 같은 대상의 기존 공고가 있으면 그 상세로, 없으면 그 탭 목록으로 간다.
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
      <div className="scrollbar-hidden flex flex-1 flex-col gap-6 overflow-y-auto px-5 pt-2 pb-8">
        <SelectField
          disabled={editPost !== undefined}
          label="모집 대상"
          message={
            editPost
              ? "올린 공고의 대상은 바꿀 수 없어요"
              : "내가 팀장인 팀, 모임장인 모임에만 공고를 쓸 수 있어요"
          }
          onChange={changeTarget}
          options={targetOptions}
          placeholder="팀이나 모임을 골라 주세요"
          value={target}
        />

        <TextInputField
          label="제목"
          maxLength={TITLE_MAX}
          onChange={setTitle}
          placeholder="홍대 주말 합주 보컬을 찾고 있어요"
          value={title}
        />

        <TextInputField
          label="본문"
          multiline
          onChange={setBody}
          placeholder="어떤 분과 함께하고 싶은지, 합주는 어떻게 하는지 알려 주세요"
          value={body}
        />

        <div className="flex flex-col gap-3">
          <FieldLabel>모집 세션</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {INSTRUMENT_OPTIONS.map((instrument) => (
              <Chip
                active={slots.some((slot) => slot.instrument === instrument)}
                key={instrument}
                onClick={() => toggleSlot(instrument)}
                size="large"
                variant="outlined"
              >
                {INSTRUMENT_LABEL[instrument]}
              </Chip>
            ))}
          </div>
          {orderedSlots.length === 0 ? (
            <Typography
              color="semantic.label.alternative"
              variant="label2"
              weight="regular"
            >
              찾는 세션을 하나 이상 골라 주세요
            </Typography>
          ) : (
            <div className="flex flex-col gap-2">
              {orderedSlots.map((slot) => {
                const label = INSTRUMENT_LABEL[slot.instrument];
                return (
                  <div
                    className="flex items-center gap-3 rounded-xl border border-line-solid bg-surface py-2 pr-2 pl-4"
                    key={slot.instrument}
                  >
                    <Typography
                      className="flex-1"
                      color="semantic.label.normal"
                      variant="body2"
                      weight="medium"
                    >
                      {label}
                    </Typography>
                    <IconButton
                      aria-label={`${label} 인원 줄이기`}
                      disabled={slot.count <= 1}
                      onClick={() => changeCount(slot.instrument, -1)}
                      size="small"
                      variant="outlined"
                    >
                      <IconMinus />
                    </IconButton>
                    <Typography
                      align="center"
                      className="w-10"
                      color="semantic.label.strong"
                      variant="body2"
                      weight="bold"
                    >
                      {slot.count}명
                    </Typography>
                    <IconButton
                      aria-label={`${label} 인원 늘리기`}
                      disabled={slot.count >= SLOT_COUNT_MAX}
                      onClick={() => changeCount(slot.instrument, 1)}
                      size="small"
                      variant="outlined"
                    >
                      <IconPlus />
                    </IconButton>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <SelectField
          label="활동 지역"
          onChange={setRegion}
          options={REGION_OPTIONS.map((value) => ({
            label: REGION_LABEL[value],
            value,
          }))}
          placeholder="지역을 골라 주세요"
          value={region}
        />
      </div>

      <BottomActionArea
        disabled={!canSubmit}
        label={isEdit ? "저장" : "등록"}
        onClick={submit}
      />
    </>
  );
}

export default BoardWriteScreen;
