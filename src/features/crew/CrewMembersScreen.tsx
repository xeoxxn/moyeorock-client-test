import { List, Typography } from "@wanteddev/wds";
import { useNavigate, useParams } from "react-router-dom";

import PersonRow from "@/components/list/PersonRow";
import ScreenBody from "@/components/ui/ScreenBody";
import SectionHeader from "@/components/ui/SectionHeader";
import { CrewNotFound } from "@/features/crew/components/CrewFallback";
import CrewHero from "@/features/crew/components/CrewHero";
import { profilePath } from "@/features/crew/components/crewHelpers";
import { formatInstruments, GROUP_ROLE_LABEL } from "@/lib/domain/labels";
import type { Group, GroupMember, GroupRole } from "@/lib/domain/types";
import { ME_ID } from "@/mocks/data";
import { getGroup, getGroupMembers, toId } from "@/mocks/selectors";

// 모임 홈의 멤버 탭(Figma 19의 탭) — 모임장 · 운영진 · 멤버 묶음. 보조 줄은 세션, 누르면 프로필
// (나는 마이 탭). 서버 모임원 목록(GroupMemberResponse)은 역할·세션을 함께 준다.
function MemberSection({
  members,
  role,
}: {
  members: GroupMember[];
  role: GroupRole;
}) {
  const navigate = useNavigate();
  if (members.length === 0) return null;

  return (
    <>
      <SectionHeader
        title={
          role === "MEMBER"
            ? `${GROUP_ROLE_LABEL.MEMBER} ${members.length}명`
            : GROUP_ROLE_LABEL[role]
        }
      />
      <List>
        {members.map((member) => (
          <PersonRow
            key={member.userId}
            meta={formatInstruments(member.instruments)}
            name={member.nickname}
            onClick={() => navigate(profilePath(member.userId))}
            profileImage={member.profileImage}
            trailing={
              member.userId === ME_ID ? (
                <Typography
                  as="span"
                  className="shrink-0"
                  color="semantic.label.assistive"
                  variant="label2"
                >
                  나
                </Typography>
              ) : undefined
            }
          />
        ))}
      </List>
    </>
  );
}

const ROLES: GroupRole[] = ["OWNER", "MANAGER", "MEMBER"];

function CrewMembers({ group }: { group: Group }) {
  const members = getGroupMembers(group.id);

  return (
    <ScreenBody>
      <CrewHero group={group} tab="members" />
      {ROLES.map((role) => (
        <MemberSection
          key={role}
          members={members.filter((member) => member.role === role)}
          role={role}
        />
      ))}
    </ScreenBody>
  );
}

function CrewMembersScreen() {
  const { crewId } = useParams();
  const group = getGroup(toId(crewId));
  if (!group) return <CrewNotFound />;
  return <CrewMembers group={group} />;
}

export default CrewMembersScreen;
