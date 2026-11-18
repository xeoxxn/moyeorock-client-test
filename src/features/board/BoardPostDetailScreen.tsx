import { Button, Typography, useToast } from "@wanteddev/wds";
import { IconMoreVertical } from "@wanteddev/wds-icon";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PersonRow from "@/components/list/PersonRow";
import Cover, { PART_COVER_TONE } from "@/components/music/Cover";
import ActionSheet from "@/components/ui/ActionSheet";
import BottomActionArea from "@/components/ui/BottomActionArea";
import ConfirmSheet from "@/components/ui/ConfirmSheet";
import EmptyState from "@/components/ui/EmptyState";
import HeaderIconButton from "@/components/ui/HeaderIconButton";
import { innerClick } from "@/components/ui/listCellEvents";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Status from "@/components/ui/Status";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import ApplySheet from "@/features/join/ApplySheet";
import { formatRelative } from "@/lib/domain/format";
import {
  GENRE_LABEL,
  GROUP_ROLE_LABEL,
  GROUP_TYPE_LABEL,
  INSTRUMENT_LABEL,
  RECRUIT_STATUS_LABEL,
  REGION_LABEL,
  TARGET_TYPE_LABEL,
  TEAM_ROLE_LABEL,
} from "@/lib/domain/labels";
import type { RecruitPost, RecruitStatus } from "@/lib/domain/types";
import { ME_ID } from "@/mocks/data";
import {
  canEditPost,
  getGroup,
  getGroupMembers,
  getMyJoinRequests,
  getPost,
  getTargetName,
  getTeam,
  getUser,
  isBookmarked,
  toId,
} from "@/mocks/selectors";

// Figma 13 모집글 상세 — 상태 · 제목 · 대상 · 시간 / 요약 카드(세션별 인원·지원 수 + 지역 · 대상 종류 ·
// 멤버) / 본문 / 작성자(팔로우) / 지원하기. 서버 RecruitPostDetailResponse 기준이라 Figma의 조회수는 뺐다
// (필드 없음). 일정·장르 같은 건 본문에 쓴다.
// - 팀장·모임장(canEdit)은 ⋮ → 수정 · 마감. 마감한 글은 서버가 수정도 막아서(409) ⋮를 숨긴다.
// - 하단 버튼: 내 글이면 없음 → 이미 멤버 → 이미 지원 → 마감 순으로 막고, 아니면 지원하기(ApplySheet).
// - 팔로우는 서버 북마크(USER)다.

/** 내 프로필은 다른 사용자 프로필(/users/:id)이 아니라 마이 탭이다. */
function userPath(userId: number): string {
  return userId === ME_ID ? "/mine" : `/users/${userId}`;
}

/** 공고 대상(팀·모임)에서 화면이 쓰는 값만 모은다 — 팀/모임 DTO 모양이 달라서 한곳에서 맞춘다. */
function describeTarget(post: RecruitPost) {
  if (post.targetType === "TEAM") {
    const team = getTeam(post.targetId);
    const authorRole = team?.members.find(
      (member) => member.user.id === post.authorId,
    )?.role;
    return {
      authorRole: authorRole ? TEAM_ROLE_LABEL[authorRole] : undefined,
      facts: [
        { label: "지역", value: REGION_LABEL[post.region] },
        {
          label: "장르",
          value:
            team?.genres.map((genre) => GENRE_LABEL[genre]).join(", ") || "–",
        },
        { label: "멤버", value: `${team?.members.length ?? 0}명` },
      ],
      isMember: team?.myRole != null,
    };
  }
  const group = getGroup(post.targetId);
  const authorRole = getGroupMembers(post.targetId).find(
    (member) => member.userId === post.authorId,
  )?.role;
  return {
    authorRole: authorRole ? GROUP_ROLE_LABEL[authorRole] : undefined,
    facts: [
      { label: "지역", value: REGION_LABEL[post.region] },
      {
        label: TARGET_TYPE_LABEL.GROUP,
        value: group ? GROUP_TYPE_LABEL[group.type] : "–",
      },
      { label: "멤버", value: `${group?.memberCount ?? 0}명` },
    ],
    isMember: group?.myRole != null,
  };
}

function BoardPostDetailScreen() {
  const navigate = useNavigate();
  const toast = useToast();
  const { postId } = useParams();
  const post = getPost(toId(postId));
  const canEdit = post ? canEditPost(post) : false;

  // 목업이라 마감·팔로우는 이 화면 상태로만 반영한다.
  const [status, setStatus] = useState<RecruitStatus>(post?.status ?? "OPEN");
  const [following, setFollowing] = useState(() =>
    post ? isBookmarked("USER", post.authorId) : false,
  );
  const [applyOpen, setApplyOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);

  const showMenu = canEdit && status === "OPEN";

  useScreenHeader(
    useMemo(
      () => (
        <ScreenHeader
          trailing={
            showMenu ? (
              <HeaderIconButton
                icon={<IconMoreVertical />}
                label="모집글 메뉴"
                onClick={() => setMenuOpen(true)}
              />
            ) : undefined
          }
        />
      ),
      [showMenu],
    ),
  );

  if (!post) {
    return (
      <div className="flex flex-1 flex-col justify-center">
        <EmptyState
          description="마감 후 지워졌거나 주소가 잘못됐어요"
          title="없는 모집글이에요"
        />
      </div>
    );
  }

  const author = getUser(post.authorId);
  const targetName = getTargetName(post.targetType, post.targetId) ?? "";
  const target = describeTarget(post);
  const closed = status === "CLOSED";
  const applied = getMyJoinRequests().some(
    (request) =>
      request.status === "PENDING" &&
      (request.recruitPostId === post.id ||
        (request.targetType === post.targetType &&
          request.targetId === post.targetId)),
  );

  let blockedLabel: string | null = null;
  if (target.isMember) blockedLabel = "이미 함께하고 있어요";
  else if (applied) blockedLabel = "지원했어요";
  else if (closed) blockedLabel = "모집이 끝났어요";

  const toggleFollow = () => {
    const next = !following;
    setFollowing(next);
    toast({
      content: next
        ? `${author?.nickname ?? ""}님을 팔로우했어요`
        : "팔로우를 취소했어요",
      variant: next ? "positive" : "normal",
    });
  };

  const closePost = () => {
    setStatus("CLOSED");
    toast({ content: "모집을 마감했어요", variant: "positive" });
  };

  return (
    <>
      <ScreenBody>
        <div className="flex flex-col items-start gap-2 px-5 pt-2">
          <Status tone={closed ? "neutral" : "progress"}>
            {RECRUIT_STATUS_LABEL[status]}
          </Status>
          <div className="flex flex-col gap-1">
            <Typography
              as="h1"
              color="semantic.label.strong"
              variant="heading1"
              weight="bold"
            >
              {post.title}
            </Typography>
            <Typography color="semantic.label.alternative" variant="label2">
              {[targetName, formatRelative(post.createdAt)]
                .filter(Boolean)
                .join(" · ")}
            </Typography>
          </div>
        </div>

        <div className="mx-5 mt-6 rounded-lg bg-surface p-4">
          <ul className="flex flex-col gap-3">
            {post.wantedSlots.map((slot) => (
              <li className="flex items-center gap-3.5" key={slot.instrument}>
                <Cover
                  className="size-12 rounded-sm"
                  part={slot.instrument}
                  tone={PART_COVER_TONE[slot.instrument]}
                />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <Typography
                    color="semantic.label.strong"
                    variant="body1"
                    weight="bold"
                  >
                    {INSTRUMENT_LABEL[slot.instrument]}{" "}
                    <span className="text-accent-text">{slot.count}명</span>
                  </Typography>
                  <Typography
                    color="semantic.label.alternative"
                    variant="label2"
                  >
                    지원 {slot.appliedCount}명
                  </Typography>
                </div>
              </li>
            ))}
          </ul>
          <hr className="my-4 border-line-neutral" />
          <dl className="grid grid-cols-3 gap-3">
            {target.facts.map((fact) => (
              <div className="flex min-w-0 flex-col gap-1" key={fact.label}>
                <Typography
                  as="dt"
                  color="semantic.label.assistive"
                  variant="label2"
                >
                  {fact.label}
                </Typography>
                <Typography
                  as="dd"
                  className="truncate"
                  color="semantic.label.strong"
                  variant="body1"
                  weight="bold"
                >
                  {fact.value}
                </Typography>
              </div>
            ))}
          </dl>
        </div>

        <Typography
          as="p"
          className="whitespace-pre-line px-5 pt-6 pb-4"
          color="semantic.label.alternative"
          variant="body2"
        >
          {post.body}
        </Typography>

        {author && (
          <PersonRow
            meta={[targetName, target.authorRole].filter(Boolean).join(" ")}
            name={author.nickname}
            onClick={() => navigate(userPath(author.id))}
            profileImage={author.profileImage}
            trailing={
              author.id === ME_ID ? undefined : (
                <Button
                  color={following ? "assistive" : "primary"}
                  onClick={innerClick(toggleFollow)}
                  size="small"
                  variant="solid"
                >
                  {following ? "팔로잉" : "팔로우"}
                </Button>
              )
            }
          />
        )}
      </ScreenBody>

      {!canEdit &&
        (blockedLabel ? (
          <BottomActionArea disabled label={blockedLabel} onClick={() => {}} />
        ) : (
          <BottomActionArea
            label="지원하기"
            onClick={() => setApplyOpen(true)}
          />
        ))}

      <ApplySheet
        instrumentChoices={post.wantedSlots.map((slot) => slot.instrument)}
        onOpenChange={setApplyOpen}
        open={applyOpen}
        targetName={targetName}
        targetType={post.targetType}
      />
      <ActionSheet
        items={[
          {
            label: "수정",
            onSelect: () => navigate(`/board/${post.id}/edit`),
          },
          { label: "마감", onSelect: () => setCloseOpen(true) },
        ]}
        onOpenChange={setMenuOpen}
        open={menuOpen}
      />
      <ConfirmSheet
        confirmLabel="마감"
        description={
          "마감하면 더 이상 지원을 받지 않아요.\n마감한 글은 수정할 수 없어요."
        }
        onConfirm={closePost}
        onOpenChange={setCloseOpen}
        open={closeOpen}
        title="모집을 마감할까요?"
      />
    </>
  );
}

export default BoardPostDetailScreen;
