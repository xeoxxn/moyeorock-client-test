import { List, Typography } from "@wanteddev/wds";
import { type ReactNode, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import EventRow from "@/components/list/EventRow";
import NoticeRow from "@/components/list/NoticeRow";
import BottomActionArea from "@/components/ui/BottomActionArea";
import BottomSheet from "@/components/ui/BottomSheet";
import LabeledAvatar from "@/components/ui/LabeledAvatar";
import ScreenBody from "@/components/ui/ScreenBody";
import SectionHeader from "@/components/ui/SectionHeader";
import Status from "@/components/ui/Status";
import { CrewNotFound } from "@/features/crew/components/CrewFallback";
import CrewHero from "@/features/crew/components/CrewHero";
import {
  performanceMeta,
  performanceStatus,
  profilePath,
  sortByRole,
  splitPerformances,
} from "@/features/crew/components/crewHelpers";
import ApplySheet from "@/features/join/ApplySheet";
import { formatMonthDay } from "@/lib/domain/format";
import type { Group, Notice } from "@/lib/domain/types";
import {
  getGroup,
  getGroupMembers,
  getGroupPerformances,
  getMyJoinRequests,
  getNotices,
  toId,
} from "@/mocks/selectors";

// Figma 19 모임 홈(498:18394) — 공지 · 다음 공연 · 멤버. 공지 목록 응답에는 작성자가 없어서(서버
// NoticeSummaryResponse) Figma의 "록스타 · 모임장 · 11월 12일" 대신 날짜만 둔다. 공지 쓰기·수정은
// 서버 기준 현재 모임장만 한다 — 모임장이 공지를 누르면 수정으로, 그 밖에는 본문 시트를 연다.
// 비회원(myRole null)도 공고·초대로 들어온다: 아래 "가입 신청"으로 ApplySheet를 연다.
function EmptyLine({ children }: { children: ReactNode }) {
  return (
    <Typography
      as="p"
      className="px-5 py-2"
      color="semantic.label.assistive"
      variant="body2"
    >
      {children}
    </Typography>
  );
}

function CrewHome({ group }: { group: Group }) {
  const navigate = useNavigate();
  // 닫히는 동안에도 시트 내용이 남아 있도록 고른 공지와 열림 상태를 따로 둔다.
  const [openNotice, setOpenNotice] = useState<Notice | null>(null);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);

  const isOwner = group.myRole === "OWNER";
  const isMember = group.myRole !== null;
  const notices = getNotices(group.id);
  const nextPerformance = splitPerformances(getGroupPerformances(group.id))
    .upcoming[0];
  const members = sortByRole(getGroupMembers(group.id));
  // 대기 중인 신청이 있으면 서버가 중복 신청을 막는다(JOIN_REQUEST_DUPLICATED) — 내 신청으로 안내한다.
  const pendingRequest = getMyJoinRequests().find(
    (request) =>
      request.targetType === "GROUP" &&
      request.targetId === group.id &&
      request.status === "PENDING",
  );
  const status = nextPerformance && performanceStatus(nextPerformance);

  const selectNotice = (notice: Notice) => {
    if (isOwner) {
      navigate(`/crew/${group.id}/notice/${notice.id}/edit`);
      return;
    }
    setOpenNotice(notice);
    setNoticeOpen(true);
  };

  return (
    <>
      <ScreenBody>
        <CrewHero group={group} tab="home" />

        <SectionHeader
          actionLabel={isOwner ? "쓰기" : undefined}
          onAction={
            isOwner ? () => navigate(`/crew/${group.id}/notice/new`) : undefined
          }
          title="공지"
        />
        {notices.length === 0 ? (
          <EmptyLine>아직 공지가 없어요</EmptyLine>
        ) : (
          <List>
            {notices.map((notice) => (
              <NoticeRow
                key={notice.id}
                meta={formatMonthDay(notice.createdAt)}
                onClick={() => selectNotice(notice)}
                pinned={notice.isPinned}
                title={notice.title}
              />
            ))}
          </List>
        )}

        <SectionHeader
          actionLabel="전체 보기"
          onAction={() => navigate(`/crew/${group.id}/show`, { replace: true })}
          title="다음 공연"
        />
        {nextPerformance && status ? (
          <List>
            <EventRow
              date={new Date(nextPerformance.performedAt)}
              label={<Status tone={status.tone}>{status.label}</Status>}
              meta={performanceMeta(nextPerformance)}
              onClick={() => navigate(`/show/${nextPerformance.id}`)}
              title={nextPerformance.title}
            />
          </List>
        ) : (
          <EmptyLine>예정된 공연이 없어요</EmptyLine>
        )}

        <SectionHeader
          actionLabel="전체 보기"
          onAction={() =>
            navigate(`/crew/${group.id}/members`, { replace: true })
          }
          title={`멤버 ${group.memberCount}명`}
        />
        <div className="scrollbar-hidden flex gap-3 overflow-x-auto px-5 pt-1">
          {members.map((member) => (
            <LabeledAvatar
              key={member.userId}
              name={member.nickname}
              onClick={() => navigate(profilePath(member.userId))}
              profileImage={member.profileImage}
            />
          ))}
        </div>
      </ScreenBody>

      {!isMember &&
        (pendingRequest ? (
          <BottomActionArea
            caption="가입 신청을 보냈어요. 승인되면 알림으로 알려 드려요"
            label="내 신청 보기"
            onClick={() => navigate("/mine/invitations?tab=applied")}
          />
        ) : (
          <BottomActionArea
            label="가입 신청"
            onClick={() => setApplyOpen(true)}
          />
        ))}

      <BottomSheet
        onOpenChange={setNoticeOpen}
        open={noticeOpen}
        title={openNotice?.title}
      >
        {openNotice && (
          <div className="flex flex-col gap-3 pb-4">
            <span className="flex items-center gap-1.5">
              {openNotice.isPinned && <Status tone="accent">고정</Status>}
              <Typography
                as="span"
                color="semantic.label.assistive"
                variant="label2"
              >
                {formatMonthDay(openNotice.createdAt)}
              </Typography>
            </span>
            <Typography
              className="whitespace-pre-line"
              color="semantic.label.normal"
              variant="body2"
            >
              {openNotice.body}
            </Typography>
          </div>
        )}
      </BottomSheet>

      {!isMember && (
        <ApplySheet
          onOpenChange={setApplyOpen}
          open={applyOpen}
          targetName={group.name}
          targetType="GROUP"
        />
      )}
    </>
  );
}

function CrewHomeScreen() {
  const { crewId } = useParams();
  const group = getGroup(toId(crewId));
  if (!group) return <CrewNotFound />;
  return <CrewHome group={group} />;
}

export default CrewHomeScreen;
