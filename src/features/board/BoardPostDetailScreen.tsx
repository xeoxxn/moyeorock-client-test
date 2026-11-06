import {
  Avatar,
  List,
  ListCell,
  ListCellContent,
  ToggleIcon,
  Typography,
  useToast,
  WithInteraction,
} from "@wanteddev/wds";
import {
  IconBookmark,
  IconBookmarkFill,
  IconLocation,
  IconMusicMicrophone,
  IconPersons,
} from "@wanteddev/wds-icon";
import type { ReactNode } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import mascotMegaphone from "@/assets/mascot/megaphone.png";
import Badge from "@/components/ui/Badge";
import BottomActionArea from "@/components/ui/BottomActionArea";
import EmptyState from "@/components/ui/EmptyState";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SectionHeader from "@/components/ui/SectionHeader";
import Tag from "@/components/ui/Tag";
import { useAppAlert } from "@/components/ui/useAppAlert";
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
  getBookmarks,
  getGroup,
  getGroupMembers,
  getMyJoinRequests,
  getPost,
  getTargetName,
  getTeam,
  getUser,
  toId,
} from "@/mocks/selectors";

// Figma: 게시판/02 모집글 상세 (101:24612). 서버 RecruitPostDetailResponse 기준으로 그린다.
// - Figma의 "모집 인원 3/5명"·"합주 장소"·"합주 일정"은 서버 공고에 없는 필드라 뺐고, 서버의
//   wantedSlots(세션별 인원·대기 신청 수)·region·대상(팀/모임)을 보여준다.
// - 북마크 대상은 유저·팀·곡뿐이라 공고 자체는 저장할 수 없다. 팀 공고에서만 "팀 저장"을 둔다.
// - 하단 버튼은 서버 상태(canEdit·status·대상의 myRole·myJoinRequest) 순서로 갈린다.

interface MemberChip {
  id: number;
  nickname: string;
  caption: string;
}

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
      isMember: team?.myRole != null,
      members: (team?.members ?? []).map<MemberChip>((member) => ({
        caption: INSTRUMENT_LABEL[member.instrument],
        id: member.user.id,
        nickname: member.user.nickname,
      })),
      path: `/team/${post.targetId}`,
      tags: (team?.genres ?? []).map((genre) => GENRE_LABEL[genre]),
    };
  }
  const group = getGroup(post.targetId);
  const groupMembers = getGroupMembers(post.targetId);
  const authorRole = groupMembers.find(
    (member) => member.userId === post.authorId,
  )?.role;
  return {
    authorRole: authorRole ? GROUP_ROLE_LABEL[authorRole] : undefined,
    isMember: group?.myRole != null,
    members: groupMembers.map<MemberChip>((member) => ({
      caption:
        member.instruments.length > 0
          ? INSTRUMENT_LABEL[member.instruments[0].instrument]
          : GROUP_ROLE_LABEL[member.role],
      id: member.userId,
      nickname: member.nickname,
    })),
    path: `/crew/${post.targetId}`,
    tags: group ? [GROUP_TYPE_LABEL[group.type]] : [],
  };
}

function InfoRow({
  icon,
  label,
  onClick,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  onClick?: () => void;
}) {
  return (
    <ListCell
      alignItems="center"
      disableInteraction={onClick === undefined}
      leadingContent={
        <ListCellContent sx={{ fontSize: "1.25rem" }} variant="icon">
          {icon}
        </ListCellContent>
      }
      textProps={{
        color: "semantic.label.alternative",
        variant: "label1",
        weight: "medium",
      }}
      // 누르는 행은 onClick을 chevron 쪽에 둔다 — ListCell이 행 클릭을 chevron(role=button)으로
      // 다시 보내기 때문에 ListCell에도 onClick을 달면 한 번 눌러도 두 번 이동한다.
      trailingContent={
        onClick ? (
          <ListCellContent onClick={onClick} variant="chevron">
            {value}
          </ListCellContent>
        ) : (
          <ListCellContent>{value}</ListCellContent>
        )
      }
      verticalPadding="small"
    >
      {label}
    </ListCell>
  );
}

function BoardPostDetailScreen() {
  const navigate = useNavigate();
  const toast = useToast();
  const alert = useAppAlert();
  const { postId } = useParams();
  const post = getPost(toId(postId));

  // 목업이라 마감·신청 취소·팀 저장은 이 화면 상태로만 반영한다.
  const [status, setStatus] = useState<RecruitStatus>(post?.status ?? "OPEN");
  const [requestCanceled, setRequestCanceled] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [teamSaved, setTeamSaved] = useState(
    () =>
      post?.targetType === "TEAM" &&
      getBookmarks().some(
        (bookmark) =>
          bookmark.targetType === "TEAM" && bookmark.targetId === post.targetId,
      ),
  );

  useScreenHeader(
    <ScreenHeader
      trailing={
        post?.targetType === "TEAM" ? (
          <ToggleIcon
            active={teamSaved}
            aria-label={teamSaved ? "팀 저장 해제" : "팀 저장"}
            onActiveChange={(next) => {
              setTeamSaved(next);
              toast({
                content: next ? "팀을 저장했어요" : "저장을 해제했어요",
                variant: next ? "positive" : "normal",
              });
            }}
          >
            {teamSaved ? <IconBookmarkFill /> : <IconBookmark />}
          </ToggleIcon>
        ) : undefined
      }
      variant="normal"
    />,
  );

  if (!post) {
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

  const author = getUser(post.authorId);
  const targetName = getTargetName(post.targetType, post.targetId) ?? "";
  const target = describeTarget(post);
  const isClosed = status === "CLOSED";
  const pendingRequest = requestCanceled
    ? undefined
    : getMyJoinRequests().find(
        (request) =>
          request.recruitPostId === post.id && request.status === "PENDING",
      );

  const closePost = async () => {
    const result = await alert({
      cancel: "취소",
      confirm: "마감",
      content: "마감하면 더 이상 지원을 받지 않아요.",
      title: "모집을 마감할까요?",
    });
    if (result !== "confirm") return;
    setStatus("CLOSED");
    toast({ content: "모집을 마감했어요", variant: "positive" });
  };

  const cancelRequest = async () => {
    const result = await alert({
      cancel: "닫기",
      confirm: "신청 취소",
      content: `${targetName}에 보낸 신청이 취소돼요.`,
      title: "신청을 취소할까요?",
    });
    if (result !== "confirm") return;
    setRequestCanceled(true);
    toast({ content: "신청을 취소했어요", variant: "positive" });
  };

  const renderAction = () => {
    if (canEditPost(post)) {
      return (
        <BottomActionArea
          disabled={isClosed}
          label={isClosed ? "모집이 마감됐어요" : "모집 마감"}
          onClick={closePost}
          secondary={{
            label: "수정",
            onClick: () => navigate(`/board/${post.id}/edit`),
          }}
        />
      );
    }
    if (isClosed) {
      return (
        <BottomActionArea
          disabled
          label="모집이 마감됐어요"
          onClick={() => {}}
        />
      );
    }
    if (target.isMember) {
      return (
        <BottomActionArea
          disabled
          label="이미 함께하고 있어요"
          onClick={() => {}}
        />
      );
    }
    if (pendingRequest) {
      return (
        <BottomActionArea
          caption="신청을 보냈어요. 승인을 기다리는 중이에요."
          label="신청 취소"
          onClick={cancelRequest}
        />
      );
    }
    return (
      <BottomActionArea label="지원하기" onClick={() => setApplyOpen(true)} />
    );
  };

  return (
    <>
      <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto">
        <div className="flex flex-col gap-3 px-5 pt-2 pb-6">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge tone={isClosed ? "outline" : "accent"}>
              {RECRUIT_STATUS_LABEL[status]}
            </Badge>
            {target.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          <Typography
            color="semantic.label.strong"
            variant="title3"
            weight="bold"
          >
            {post.title}
          </Typography>

          <List>
            <ListCell
              alignItems="center"
              leadingContent={
                <ListCellContent variant="avatar">
                  <Avatar size="small" variant="person" />
                </ListCellContent>
              }
              onClick={() => navigate(userPath(post.authorId))}
              textProps={{
                caption: [
                  targetName,
                  target.authorRole,
                  formatRelative(post.createdAt),
                ]
                  .filter(Boolean)
                  .join(" · "),
                captionProps: {
                  color: "semantic.label.assistive",
                  variant: "caption1",
                },
                color: "semantic.label.normal",
                variant: "label1",
                weight: "bold",
              }}
              verticalPadding="small"
            >
              {author?.nickname ?? "알 수 없는 사용자"}
            </ListCell>
          </List>

          <div className="flex items-center justify-center rounded-3xl bg-surface py-8">
            <img
              alt=""
              className="aspect-square w-2/5 max-w-40 object-contain drop-shadow-neon-md"
              src={mascotMegaphone}
            />
          </div>

          <List>
            <InfoRow
              icon={<IconMusicMicrophone />}
              label="모집 세션"
              value={
                <div className="flex flex-col items-end">
                  {post.wantedSlots.map((slot) => (
                    <Typography
                      color="semantic.label.normal"
                      key={slot.instrument}
                      variant="label1"
                      weight="bold"
                    >
                      {INSTRUMENT_LABEL[slot.instrument]} {slot.count}명
                      {slot.appliedCount > 0 && (
                        <Typography
                          as="span"
                          color="semantic.label.assistive"
                          variant="label1"
                          weight="medium"
                        >
                          {` · 대기 ${slot.appliedCount}명`}
                        </Typography>
                      )}
                    </Typography>
                  ))}
                </div>
              }
            />
            <InfoRow
              icon={<IconLocation />}
              label="활동 지역"
              value={
                <Typography
                  color="semantic.label.normal"
                  variant="label1"
                  weight="bold"
                >
                  {REGION_LABEL[post.region]}
                </Typography>
              }
            />
            <InfoRow
              icon={<IconPersons />}
              label={`모집 ${TARGET_TYPE_LABEL[post.targetType]}`}
              onClick={() => navigate(target.path)}
              value={
                <Typography
                  color="semantic.label.normal"
                  variant="label1"
                  weight="bold"
                >
                  {targetName}
                </Typography>
              }
            />
          </List>
        </div>

        <div className="h-3 w-full shrink-0 bg-surface" />

        <section className="flex flex-col gap-2 px-5 py-6">
          <SectionHeader title="소개" />
          <Typography
            className="whitespace-pre-line"
            color="semantic.label.alternative"
            variant="body2-reading"
            weight="regular"
          >
            {post.body}
          </Typography>
        </section>

        {target.members.length > 0 && (
          <>
            <div className="h-3 w-full shrink-0 bg-surface" />
            <section className="flex flex-col gap-3 py-6">
              <div className="px-5">
                <SectionHeader
                  count={target.members.length}
                  title="함께하는 멤버"
                />
              </div>
              <div className="scrollbar-hidden flex gap-2 overflow-x-auto px-5">
                {target.members.map((member) => (
                  <WithInteraction key={member.id} variant="light">
                    <button
                      aria-label={`${member.nickname} 프로필 보기`}
                      className="relative flex w-18 shrink-0 flex-col items-center gap-1 rounded-xl py-1"
                      onClick={() => navigate(userPath(member.id))}
                      type="button"
                    >
                      <Avatar size="medium" variant="person" />
                      <Typography
                        align="center"
                        className="w-full truncate"
                        color="semantic.label.normal"
                        variant="caption1"
                        weight="medium"
                      >
                        {member.nickname}
                      </Typography>
                      <Typography
                        color="semantic.label.assistive"
                        variant="caption2"
                        weight="regular"
                      >
                        {member.caption}
                      </Typography>
                    </button>
                  </WithInteraction>
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      {renderAction()}

      <ApplySheet
        instrumentChoices={
          post.targetType === "TEAM"
            ? post.wantedSlots.map((slot) => slot.instrument)
            : undefined
        }
        onOpenChange={setApplyOpen}
        open={applyOpen}
        targetName={targetName}
        targetType={post.targetType}
      />
    </>
  );
}

export default BoardPostDetailScreen;
