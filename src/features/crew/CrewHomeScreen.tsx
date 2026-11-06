import {
  ActionArea,
  ActionAreaButton,
  Divider,
  List,
  ListCell,
  ListCellContent,
  TextButton,
  Typography,
} from "@wanteddev/wds";
import { IconLocation, IconPersons } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Badge from "@/components/ui/Badge";
import BottomActionArea from "@/components/ui/BottomActionArea";
import BottomSheet from "@/components/ui/BottomSheet";
import MetaItem from "@/components/ui/MetaItem";
import PressableCard from "@/components/ui/PressableCard";
import SectionHeader from "@/components/ui/SectionHeader";
import Tag from "@/components/ui/Tag";
import { CrewNotFound } from "@/features/crew/components/CrewFallback";
import CrewHeroTabs from "@/features/crew/components/CrewHeroTabs";
import ApplySheet from "@/features/join/ApplySheet";
import {
  formatDateTime,
  formatDotDate,
  formatShortDate,
} from "@/lib/domain/format";
import { PERFORMANCE_STATUS_LABEL } from "@/lib/domain/labels";
import type { Group, Notice } from "@/lib/domain/types";
import {
  getGroup,
  getGroupPerformances,
  getMyJoinRequests,
  getNotices,
  isUpcoming,
  toId,
} from "@/mocks/selectors";

// Figma: 모임/02 모임 홈 (nodeId 101:18968) — 서버 GroupDetail(다가오는 공연 · 공지)을 그린다.
// 비회원(myRole null)도 들어온다: 공고·초대로 모임을 알게 된 사람이 여기서 가입 신청을 한다
// (Figma 플로우 S3-A: 모임/02 → 가입 신청 → 마이/06 내 신청).
function CrewHome({ group }: { group: Group }) {
  const navigate = useNavigate();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);

  const isOwner = group.myRole === "OWNER";
  const isMember = group.myRole !== null;
  const nextPerformance = getGroupPerformances(group.id)
    .filter(isUpcoming)
    .sort((a, b) => a.performedAt.localeCompare(b.performedAt))[0];
  const notices = getNotices(group.id);
  // 대기 중인 신청이 이미 있으면 서버가 중복 신청을 막는다 — 다시 신청하게 두지 않고 내 신청으로 안내한다.
  const pendingRequest = getMyJoinRequests().find(
    (request) =>
      request.targetType === "GROUP" &&
      request.targetId === group.id &&
      request.status === "PENDING",
  );

  const openNotice = (item: Notice) => {
    setNotice(item);
    setNoticeOpen(true);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="scrollbar-hidden flex-1 overflow-y-auto">
        <CrewHeroTabs active="home" group={group} />

        <section className="flex flex-col gap-3 px-5 py-6">
          <SectionHeader
            actionLabel="공연 전체"
            onAction={() =>
              navigate(`/crew/${group.id}/show`, { replace: true })
            }
            title="다음 공연"
          />
          {nextPerformance ? (
            <PressableCard
              onClick={() => navigate(`/show/${nextPerformance.id}`)}
            >
              <div className="flex items-center gap-1.5">
                <Badge size="md">
                  {PERFORMANCE_STATUS_LABEL[nextPerformance.status]}
                </Badge>
                <Tag>{formatDateTime(nextPerformance.performedAt)}</Tag>
              </div>
              <Typography
                color="semantic.label.strong"
                variant="headline1"
                weight="bold"
              >
                {nextPerformance.title}
              </Typography>
              <div className="flex items-center gap-2.5">
                <MetaItem icon={<IconLocation />}>
                  {nextPerformance.venue}
                </MetaItem>
                <MetaItem icon={<IconPersons />}>
                  참가 팀 {nextPerformance.teamIds.length}팀
                </MetaItem>
              </div>
            </PressableCard>
          ) : (
            <PressableCard>
              <Typography
                color="semantic.label.alternative"
                variant="body2"
                weight="medium"
              >
                예정된 공연이 없어요
              </Typography>
              {isOwner && (
                <div className="flex">
                  <TextButton
                    color="primary"
                    onClick={() => navigate(`/crew/${group.id}/show/new`)}
                    size="small"
                  >
                    공연 만들기
                  </TextButton>
                </div>
              )}
            </PressableCard>
          )}
        </section>

        <Divider
          color="semantic.background.normal.normal"
          thickness="0.75rem"
        />

        <section className="flex flex-col gap-1 px-5 pt-6 pb-8">
          <SectionHeader
            actionLabel={isOwner ? "공지 쓰기" : undefined}
            onAction={
              isOwner
                ? () => navigate(`/crew/${group.id}/notice/new`)
                : undefined
            }
            title="공지"
          />
          {notices.length === 0 ? (
            <Typography
              className="py-3"
              color="semantic.label.assistive"
              variant="body2"
              weight="regular"
            >
              아직 올라온 공지가 없어요
            </Typography>
          ) : (
            <List>
              {notices.map((item) => (
                <ListCell
                  ellipsis
                  key={item.id}
                  textProps={{ caption: formatShortDate(item.createdAt) }}
                  trailingContent={
                    // 셀 어디를 눌러도 WDS ListCell이 이 chevron(role=button)을 대신 눌러 준다 —
                    // onClick을 셀에도 달면 두 번 불린다.
                    <ListCellContent
                      aria-label={`${item.title} 공지 보기`}
                      onClick={() => openNotice(item)}
                      variant="chevron"
                    >
                      {item.isPinned && <Badge>고정</Badge>}
                    </ListCellContent>
                  }
                >
                  {item.title}
                </ListCell>
              ))}
            </List>
          )}
        </section>
      </div>

      {!isMember &&
        (pendingRequest ? (
          <BottomActionArea
            caption="가입 신청을 보냈어요. 모임장이 승인하면 알림으로 알려드려요."
            label="내 신청 보기"
            onClick={() => navigate("/mine/invitations?tab=applied")}
          />
        ) : (
          <BottomActionArea
            label="가입 신청하기"
            onClick={() => setApplyOpen(true)}
          />
        ))}

      <BottomSheet
        footer={
          isOwner && notice ? (
            <ActionArea variant="strong">
              <ActionAreaButton
                onClick={() =>
                  navigate(`/crew/${group.id}/notice/${notice.id}/edit`)
                }
              >
                수정
              </ActionAreaButton>
            </ActionArea>
          ) : undefined
        }
        onOpenChange={setNoticeOpen}
        open={noticeOpen}
        title="공지"
      >
        {notice && (
          <div className="flex flex-col gap-1.5 pb-4">
            <div className="flex items-center gap-1.5">
              {notice.isPinned && <Badge>고정</Badge>}
              <Typography
                color="semantic.label.assistive"
                variant="label2"
                weight="medium"
              >
                {formatDotDate(notice.createdAt)}
              </Typography>
            </div>
            <Typography
              color="semantic.label.strong"
              variant="headline1"
              weight="bold"
            >
              {notice.title}
            </Typography>
            <Typography
              className="whitespace-pre-line pt-2"
              color="semantic.label.normal"
              variant="body1"
              weight="regular"
            >
              {notice.body}
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
    </div>
  );
}

function CrewHomeScreen() {
  const { crewId } = useParams();
  const group = getGroup(toId(crewId));
  if (!group) return <CrewNotFound />;
  return <CrewHome group={group} />;
}

export default CrewHomeScreen;
