import { Avatar, ListCell, ListCellContent } from "@wanteddev/wds";

import Badge from "@/components/ui/Badge";
import { formatInstruments, GROUP_ROLE_LABEL } from "@/lib/domain/labels";
import type { GroupMember } from "@/lib/domain/types";

interface MemberRowProps {
  member: GroupMember;
  isMe: boolean;
  onSelect: (member: GroupMember) => void;
}

// Figma: 모임 멤버 탭의 구성원 행(nodeId 101:19946) — 아바타 + 닉네임 + 세션, 모임장·운영진만 역할
// 배지를 붙인다(일반 멤버는 섹션 제목으로 충분). 눌렀을 때 무엇을 할지(멤버 관리 시트/프로필)는
// 내 역할에 따라 화면이 정한다.
function MemberRow({ isMe, member, onSelect }: MemberRowProps) {
  return (
    <ListCell
      alignItems="center"
      leadingContent={
        <ListCellContent variant="avatar">
          <Avatar
            alt=""
            size="medium"
            src={member.profileImage ?? undefined}
            variant="person"
          />
        </ListCellContent>
      }
      onClick={() => onSelect(member)}
      textProps={{
        caption: formatInstruments(member.instruments),
        weight: "medium",
      }}
      trailingContent={
        member.role !== "MEMBER" ? (
          <ListCellContent variant="badge">
            <Badge glow={member.role === "OWNER"}>
              {GROUP_ROLE_LABEL[member.role]}
            </Badge>
          </ListCellContent>
        ) : undefined
      }
    >
      {isMe ? `${member.nickname} (나)` : member.nickname}
    </ListCell>
  );
}

export default MemberRow;
