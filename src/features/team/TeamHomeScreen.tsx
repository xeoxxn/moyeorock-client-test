import {
  Avatar,
  List,
  TextButton,
  Typography,
  WithInteraction,
} from "@wanteddev/wds";
import { IconCalendar, IconLocation } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Badge from "@/components/ui/Badge";
import BottomActionArea from "@/components/ui/BottomActionArea";
import EmptyState from "@/components/ui/EmptyState";
import MetaItem from "@/components/ui/MetaItem";
import PressableCard from "@/components/ui/PressableCard";
import SectionHeader from "@/components/ui/SectionHeader";
import ApplySheet from "@/features/join/ApplySheet";
import SongCell from "@/features/team/components/SongCell";
import TeamFallback from "@/features/team/components/TeamFallback";
import TeamHeroTabs from "@/features/team/components/TeamHeroTabs";
import {
  getTeamPerformance,
  isTeamLeader,
  isTeamMember,
  useTeamParam,
} from "@/features/team/components/teamHelpers";
import { formatDateTime, formatDday } from "@/lib/domain/format";
import {
  INSTRUMENT_LABEL,
  PERFORMANCE_STATUS_LABEL,
  TEAM_ROLE_LABEL,
} from "@/lib/domain/labels";
import type { Team } from "@/lib/domain/types";
import {
  getGroup,
  getMyJoinRequests,
  getReceivedInvitations,
  getSong,
  isUpcoming,
} from "@/mocks/selectors";

// 팀 홈에서 미리 보여줄 선택곡 수 — 나머지는 "전체 보기"(선택곡 탭)로 넘긴다.
const SONG_PREVIEW_COUNT = 3;

// Figma: 팀/02 팀 홈 (nodeId 101:21590). 멤버 · 참가 공연 · 선택곡 미리보기.
// 비회원(공고에서 들어온 팀)도 이 화면은 볼 수 있어서, 하단에 지원하기(또는 받은 초대 확인)를 둔다.
function TeamHomeScreen() {
  const team = useTeamParam();
  if (!team) return <TeamFallback kind="notFound" />;
  return <TeamHomeContent team={team} />;
}

function TeamHomeContent({ team }: { team: Team }) {
  const navigate = useNavigate();
  const [applyOpen, setApplyOpen] = useState(false);

  const isMember = isTeamMember(team);
  const isLeader = isTeamLeader(team);
  const performance = getTeamPerformance(team);
  const group = performance ? getGroup(performance.groupId) : undefined;
  const songs = team.songIds
    .map((id) => getSong(id))
    .filter((song) => song !== undefined);

  // 비회원 하단 버튼: 이미 초대를 받았으면 그걸 먼저 확인하게 하고, 대기 중인 신청이 있으면 막는다.
  const pendingInvitation = getReceivedInvitations().find(
    (invitation) =>
      invitation.targetType === "TEAM" &&
      invitation.targetId === team.id &&
      invitation.status === "PENDING",
  );
  const pendingRequest = getMyJoinRequests().find(
    (request) =>
      request.targetType === "TEAM" &&
      request.targetId === team.id &&
      request.status === "PENDING",
  );

  return (
    <>
      <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto">
        <TeamHeroTabs active="home" team={team} />

        <section className="flex flex-col gap-3 px-5 py-6">
          <SectionHeader count={team.members.length} title="함께하는 멤버" />
          <div className="grid grid-cols-3 gap-x-2 gap-y-4">
            {team.members.map((member) => (
              <WithInteraction key={member.user.id} variant="light">
                <button
                  className="flex flex-col items-center gap-1 rounded-xl py-1"
                  onClick={() => navigate(`/users/${member.user.id}`)}
                  type="button"
                >
                  <Avatar size="large" variant="person" />
                  <Typography
                    className="max-w-full truncate"
                    color="semantic.label.normal"
                    variant="label2"
                    weight="bold"
                  >
                    {member.user.nickname}
                  </Typography>
                  <Typography
                    color="semantic.label.assistive"
                    variant="caption1"
                    weight="medium"
                  >
                    {INSTRUMENT_LABEL[member.instrument]}
                    {member.role === "LEADER"
                      ? ` · ${TEAM_ROLE_LABEL.LEADER}`
                      : ""}
                  </Typography>
                </button>
              </WithInteraction>
            ))}
          </div>
        </section>

        <div className="h-3 w-full shrink-0 bg-surface" />

        <section className="flex flex-col gap-3 px-5 py-6">
          <SectionHeader title="참가 공연" />
          {performance ? (
            <PressableCard onClick={() => navigate(`/show/${performance.id}`)}>
              <div className="flex items-center gap-1.5">
                <Badge tone={isUpcoming(performance) ? "accent" : "outline"}>
                  {PERFORMANCE_STATUS_LABEL[performance.status]}
                </Badge>
                {isUpcoming(performance) && (
                  <Badge tone="solid">
                    {formatDday(performance.performedAt)}
                  </Badge>
                )}
              </div>
              <Typography
                color="semantic.label.strong"
                variant="body1"
                weight="bold"
              >
                {performance.title}
              </Typography>
              {group && (
                <Typography
                  color="semantic.label.alternative"
                  variant="label2"
                  weight="medium"
                >
                  {group.name}
                </Typography>
              )}
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <MetaItem icon={<IconCalendar />}>
                  {formatDateTime(performance.performedAt)}
                </MetaItem>
                <MetaItem icon={<IconLocation />}>{performance.venue}</MetaItem>
              </div>
            </PressableCard>
          ) : (
            <PressableCard>
              <Typography
                color="semantic.label.alternative"
                variant="body2"
                weight="medium"
              >
                독립 팀은 공연 없이 합주해요
              </Typography>
            </PressableCard>
          )}
        </section>

        <div className="h-3 w-full shrink-0 bg-surface" />

        <section className="flex flex-col gap-1 px-5 pt-6 pb-8">
          <SectionHeader
            count={songs.length}
            title="선택곡"
            trailing={
              isMember ? (
                <div className="flex items-center gap-3">
                  {isLeader && (
                    <TextButton
                      color="primary"
                      onClick={() => navigate(`/team/${team.id}/songs/add`)}
                      size="small"
                    >
                      곡 추가
                    </TextButton>
                  )}
                  {/* 선택곡 탭과 같은 화면이라 탭 전환처럼 히스토리를 쌓지 않는다 */}
                  <TextButton
                    color="assistive"
                    onClick={() =>
                      navigate(`/team/${team.id}/songs`, { replace: true })
                    }
                    size="small"
                  >
                    전체 보기
                  </TextButton>
                </div>
              ) : undefined
            }
          />
          {songs.length === 0 ? (
            <EmptyState
              description={
                isLeader
                  ? "함께 연주할 곡을 골라 보세요."
                  : "팀장이 곡을 고르면 여기에 보여요."
              }
              title="아직 고른 곡이 없어요"
            />
          ) : (
            <List>
              {songs.slice(0, SONG_PREVIEW_COUNT).map((song, index) => (
                <SongCell key={song.id} order={index + 1} song={song} />
              ))}
            </List>
          )}
        </section>
      </div>

      {!isMember &&
        (pendingInvitation ? (
          <BottomActionArea
            caption="이 팀에서 초대를 보냈어요"
            label="받은 초대 확인하기"
            onClick={() => navigate("/mine/invitations?tab=received")}
          />
        ) : (
          <BottomActionArea
            caption={
              pendingRequest
                ? "팀장이 확인하면 알림으로 알려 드려요"
                : undefined
            }
            disabled={pendingRequest !== undefined}
            label={pendingRequest ? "지원 대기 중" : "이 팀에 지원하기"}
            onClick={() => setApplyOpen(true)}
          />
        ))}

      <ApplySheet
        onOpenChange={setApplyOpen}
        open={applyOpen}
        targetName={team.name}
        targetType="TEAM"
      />
    </>
  );
}

export default TeamHomeScreen;
