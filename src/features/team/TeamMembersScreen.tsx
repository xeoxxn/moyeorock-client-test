import { Button, Typography, useToast } from "@wanteddev/wds";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import PersonRow from "@/components/list/PersonRow";
import { innerClick } from "@/components/ui/listCellEvents";
import SectionHeader from "@/components/ui/SectionHeader";
import InviteSheet from "@/features/join/InviteSheet";
import EmptyNote from "@/features/team/components/EmptyNote";
import InviteCandidatesSheet from "@/features/team/components/InviteCandidatesSheet";
import TeamFallback from "@/features/team/components/TeamFallback";
import TeamScreenFrame from "@/features/team/components/TeamScreenFrame";
import {
  isTeamLeader,
  isTeamMember,
  useTeamParam,
} from "@/features/team/components/teamHelpers";
import { INSTRUMENT_LABEL, TEAM_ROLE_LABEL } from "@/lib/domain/labels";
import type { Team, User } from "@/lib/domain/types";
import {
  getBookmarkedIds,
  getMe,
  getRecommendedMembers,
  getUser,
} from "@/mocks/selectors";

// Figma 12 팀·멤버(427:14849). 팀원 목록(GET /teams/{id}/members)은 팀원 모두가 보고, 나 아닌 사람은
// 팔로우(북마크 USER)할 수 있다. 팀장에게만:
// - "초대": 저장한 사람 중에서 골라 초대 보내기(InviteSheet, POST /invitations)
// - "AI 추천 팀원"(GET /teams/{id}/members/recommendations, 팀장만) + 다시 추천 + 바로 초대
// 팀원 내보내기·팀장 넘기기는 팀 관리 화면에서 한다.
function TeamMembersScreen() {
  const team = useTeamParam();
  if (!team) return <TeamFallback kind="notFound" />;
  if (!isTeamMember(team)) return <Navigate replace to={`/team/${team.id}`} />;
  return <TeamMembersContent team={team} />;
}

/** 목록을 n칸 돌린다 — 목업에서 "다시 추천"이 다른 순서를 보이게 */
function rotate<T>(items: T[], shift: number): T[] {
  if (items.length === 0) return items;
  const start = shift % items.length;
  return [...items.slice(start), ...items.slice(0, start)];
}

function TeamMembersContent({ team }: { team: Team }) {
  const navigate = useNavigate();
  const toast = useToast();
  const isLeader = isTeamLeader(team);
  const meId = getMe().id;

  const [followingIds, setFollowingIds] = useState(() =>
    getBookmarkedIds("USER"),
  );
  const [recommendShift, setRecommendShift] = useState(0);
  const [candidatesOpen, setCandidatesOpen] = useState(false);
  const [invitee, setInvitee] = useState<User | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invitedIds, setInvitedIds] = useState<number[]>([]);

  const members = [...team.members].sort(
    (a, b) => Number(b.role === "LEADER") - Number(a.role === "LEADER"),
  );
  const memberIds = new Set(members.map((member) => member.user.id));
  const recommended = isLeader
    ? rotate(getRecommendedMembers(team), recommendShift)
    : [];
  const inviteCandidates = getBookmarkedIds("USER")
    .filter((id) => !memberIds.has(id))
    .map((id) => getUser(id))
    .filter((user) => user !== undefined);

  const toggleFollow = (userId: number, nickname: string) => {
    const next = !followingIds.includes(userId);
    setFollowingIds((prev) =>
      next ? [...prev, userId] : prev.filter((id) => id !== userId),
    );
    toast({
      content: next ? `${nickname}님을 팔로우했어요` : "팔로우를 취소했어요",
      variant: "positive",
    });
  };

  const openInvite = (user: User) => {
    setCandidatesOpen(false);
    setInvitee(user);
    setInviteOpen(true);
  };

  return (
    <TeamScreenFrame tab="members" team={team}>
      <SectionHeader
        actionLabel="초대"
        first
        onAction={isLeader ? () => setCandidatesOpen(true) : undefined}
        title={`멤버 ${members.length}명`}
      />
      {members.map((member) => {
        const isMe = member.user.id === meId;
        const following = followingIds.includes(member.user.id);
        return (
          <PersonRow
            key={member.user.id}
            meta={
              member.role === "LEADER"
                ? `${INSTRUMENT_LABEL[member.instrument]} · ${TEAM_ROLE_LABEL.LEADER}`
                : INSTRUMENT_LABEL[member.instrument]
            }
            name={member.user.nickname}
            onClick={() => navigate(`/users/${member.user.id}`)}
            profileImage={member.user.profileImage}
            trailing={
              isMe ? (
                <Typography
                  as="span"
                  color="semantic.label.assistive"
                  variant="label2"
                  weight="medium"
                >
                  나
                </Typography>
              ) : (
                <Button
                  color={following ? "assistive" : "primary"}
                  onClick={innerClick(() =>
                    toggleFollow(member.user.id, member.user.nickname),
                  )}
                  size="small"
                  variant="solid"
                >
                  {following ? "팔로잉" : "팔로우"}
                </Button>
              )
            }
          />
        );
      })}

      {isLeader && (
        <>
          <SectionHeader
            actionLabel="다시 추천"
            onAction={() => setRecommendShift((prev) => prev + 1)}
            title="AI 추천 팀원"
          />
          {recommended.length === 0 ? (
            <EmptyNote>지금은 추천할 사람이 없어요</EmptyNote>
          ) : (
            recommended.map(({ reason, user }) => {
              const invited = invitedIds.includes(user.id);
              const instrument = user.instruments[0]?.instrument;
              return (
                <PersonRow
                  key={user.id}
                  meta={
                    instrument
                      ? `${INSTRUMENT_LABEL[instrument]} · ${reason}`
                      : reason
                  }
                  name={user.nickname}
                  onClick={() => navigate(`/users/${user.id}`)}
                  profileImage={user.profileImage}
                  trailing={
                    <Button
                      color="assistive"
                      disabled={invited}
                      onClick={innerClick(() => openInvite(user))}
                      size="small"
                      variant="solid"
                    >
                      {invited ? "초대함" : "초대"}
                    </Button>
                  }
                />
              );
            })
          )}

          <InviteCandidatesSheet
            candidates={inviteCandidates}
            invitedIds={invitedIds}
            onInvite={openInvite}
            onOpenChange={setCandidatesOpen}
            open={candidatesOpen}
          />
          {invitee && (
            <InviteSheet
              defaultTargetKey={`TEAM:${team.id}`}
              invitee={invitee}
              key={invitee.id}
              onInvited={() => setInvitedIds((prev) => [...prev, invitee.id])}
              onOpenChange={setInviteOpen}
              open={inviteOpen}
            />
          )}
        </>
      )}
    </TeamScreenFrame>
  );
}

export default TeamMembersScreen;
