import {
  Button,
  List,
  ListCellContent,
  TextButton,
  Typography,
  useToast,
} from "@wanteddev/wds";
import { IconPersonPlus } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Badge from "@/components/ui/Badge";
import { innerClick } from "@/components/ui/listCellEvents";
import PressableCard from "@/components/ui/PressableCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { useAppAlert } from "@/components/ui/useAppAlert";
import MemberCell from "@/features/team/components/MemberCell";
import TeamFallback from "@/features/team/components/TeamFallback";
import TeamHeroTabs from "@/features/team/components/TeamHeroTabs";
import {
  isTeamLeader,
  isTeamMember,
  useTeamParam,
} from "@/features/team/components/teamHelpers";
import { formatRelative } from "@/lib/domain/format";
import { INSTRUMENT_LABEL, TEAM_ROLE_LABEL } from "@/lib/domain/labels";
import type { JoinRequest, Team, TeamMember } from "@/lib/domain/types";
import {
  getMe,
  getReceivedJoinRequests,
  getSentInvitations,
  getUser,
} from "@/mocks/selectors";

// Figma: 팀/06 팀 멤버 (nodeId 101:22803). 팀원 목록은 모두가 보고, 팀장에게는 받은 지원
// (TEAM_APPLY 알림이 여기로 온다)·보낸 초대(서버 GET /invitations는 있는데 Figma엔 화면이 없던 것)·
// 팀원 찾기를 더 보여준다. 팀장이 아닌 팀원은 여기서 팀을 나간다.
// Figma의 구성원 검색·세션 필터는 팀원이 몇 명뿐이라 뺐다(서버에도 팀원 검색 API가 없다).
function TeamMembersScreen() {
  const team = useTeamParam();
  if (!team) return <TeamFallback kind="notFound" />;
  if (!isTeamMember(team))
    return <TeamFallback kind="memberOnly" team={team} />;
  return <TeamMembersContent team={team} />;
}

function TeamMembersContent({ team }: { team: Team }) {
  const navigate = useNavigate();
  const toast = useToast();
  const alert = useAppAlert();
  const isLeader = isTeamLeader(team);
  const meId = getMe().id;

  // 승인·거절·초대 취소는 그 자리에서 끝나는 액션이라 목록을 로컬로 들고 고친다.
  const [members, setMembers] = useState(team.members);
  const [requests, setRequests] = useState(() =>
    isLeader ? getReceivedJoinRequests("TEAM", team.id) : [],
  );
  const [invitations, setInvitations] = useState(() =>
    isLeader
      ? getSentInvitations("TEAM", team.id).filter(
          (invitation) => invitation.status === "PENDING",
        )
      : [],
  );

  const leaders = members.filter((member) => member.role === "LEADER");
  const others = members.filter((member) => member.role !== "LEADER");
  const goProfile = (userId: number) => navigate(`/users/${userId}`);

  const approve = (request: JoinRequest) => {
    const applicant = getUser(request.applicantId);
    if (applicant && request.instrument) {
      const joined: TeamMember = {
        instrument: request.instrument,
        role: "MEMBER",
        user: {
          id: applicant.id,
          nickname: applicant.nickname,
          profileImage: applicant.profileImage,
        },
      };
      setMembers((prev) => [...prev, joined]);
    }
    setRequests((prev) => prev.filter((item) => item.id !== request.id));
    toast({
      content: `${applicant?.nickname ?? "지원자"}님이 팀원이 됐어요`,
      variant: "positive",
    });
  };

  const reject = (request: JoinRequest) => {
    setRequests((prev) => prev.filter((item) => item.id !== request.id));
    toast({ content: "지원을 거절했어요", variant: "normal" });
  };

  const cancelInvitation = async (invitationId: number, nickname: string) => {
    const result = await alert({
      cancel: "닫기",
      confirm: "초대 취소",
      content: `${nickname}님에게 보낸 초대를 거둬요. 다시 초대하려면 새로 보내야 해요.`,
      title: "초대를 취소할까요?",
    });
    if (result !== "confirm") return;
    setInvitations((prev) => prev.filter((item) => item.id !== invitationId));
    toast({ content: "초대를 취소했어요", variant: "positive" });
  };

  const leaveTeam = async () => {
    const result = await alert({
      cancel: "취소",
      confirm: "나가기",
      content: `${team.name}에서 나가면 선택곡·일정을 더 볼 수 없어요. 다시 들어오려면 초대나 지원이 필요해요.`,
      title: "팀에서 나갈까요?",
    });
    if (result !== "confirm") return;
    toast({ content: "팀에서 나왔어요", variant: "positive" });
    navigate("/crew?tab=team", { replace: true });
  };

  const renderMember = (member: TeamMember) => (
    <MemberCell
      caption={INSTRUMENT_LABEL[member.instrument]}
      key={member.user.id}
      nickname={
        member.user.id === meId
          ? `${member.user.nickname} (나)`
          : member.user.nickname
      }
      onPress={() => goProfile(member.user.id)}
      trailing={
        member.role === "LEADER" ? (
          <ListCellContent variant="chevron">
            <Badge glow>{TEAM_ROLE_LABEL.LEADER}</Badge>
          </ListCellContent>
        ) : undefined
      }
    />
  );

  return (
    <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto">
      <TeamHeroTabs active="members" team={team} />

      <div className="flex flex-col gap-6 px-5 pt-6 pb-8">
        {requests.length > 0 && (
          <section className="flex flex-col gap-3">
            <SectionHeader count={requests.length} title="받은 지원" />
            {requests.map((request) => {
              const applicant = getUser(request.applicantId);
              if (!applicant) return null;
              return (
                <PressableCard key={request.id}>
                  <MemberCell
                    caption={`${request.instrument ? `${INSTRUMENT_LABEL[request.instrument]} 지원 · ` : ""}${formatRelative(request.createdAt)}`}
                    nickname={applicant.nickname}
                    onPress={() => goProfile(applicant.id)}
                    standalone
                  />
                  {request.message !== "" && (
                    <Typography
                      color="semantic.label.normal"
                      variant="label1"
                      weight="regular"
                    >
                      {request.message}
                    </Typography>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button
                      color="assistive"
                      fullWidth
                      onClick={() => reject(request)}
                      size="medium"
                      variant="outlined"
                    >
                      거절
                    </Button>
                    <Button
                      color="primary"
                      fullWidth
                      onClick={() => approve(request)}
                      size="medium"
                      variant="solid"
                    >
                      승인
                    </Button>
                  </div>
                </PressableCard>
              );
            })}
          </section>
        )}

        <section className="flex flex-col gap-1">
          <SectionHeader title={TEAM_ROLE_LABEL.LEADER} />
          <List>{leaders.map(renderMember)}</List>
        </section>

        <section className="flex flex-col gap-1">
          <SectionHeader count={others.length} title="팀원" />
          {others.length === 0 ? (
            <Typography
              color="semantic.label.assistive"
              variant="label1"
              weight="medium"
            >
              아직 팀원이 없어요
            </Typography>
          ) : (
            <List>{others.map(renderMember)}</List>
          )}
        </section>

        {isLeader && (
          <Button
            color="assistive"
            fullWidth
            leadingContent={<IconPersonPlus />}
            onClick={() => navigate(`/team/${team.id}/members/find`)}
            size="large"
            variant="outlined"
          >
            팀원 찾기
          </Button>
        )}

        {invitations.length > 0 && (
          <section className="flex flex-col gap-1">
            <SectionHeader count={invitations.length} title="보낸 초대" />
            <List>
              {invitations.map((invitation) => {
                const invitee = getUser(invitation.inviteeId);
                if (!invitee) return null;
                return (
                  <MemberCell
                    caption={`${invitation.instrument ? `${INSTRUMENT_LABEL[invitation.instrument]} · ` : ""}${formatRelative(invitation.createdAt)} 보냄`}
                    key={invitation.id}
                    nickname={invitee.nickname}
                    onPress={() => goProfile(invitee.id)}
                    trailing={
                      <ListCellContent variant="button">
                        <TextButton
                          color="assistive"
                          onClick={innerClick(() =>
                            cancelInvitation(invitation.id, invitee.nickname),
                          )}
                          size="small"
                        >
                          초대 취소
                        </TextButton>
                      </ListCellContent>
                    }
                  />
                );
              })}
            </List>
          </section>
        )}

        {!isLeader && (
          <div className="flex justify-center pt-2">
            <TextButton color="assistive" onClick={leaveTeam} size="small">
              팀 나가기
            </TextButton>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamMembersScreen;
