import { Avatar, Typography } from "@wanteddev/wds";

import Badge from "@/components/ui/Badge";

export interface CrewMember {
  id: string;
  name: string;
  part: string;
  isOwner?: boolean;
}

interface MemberRowProps {
  member: CrewMember;
  onClick?: (member: CrewMember) => void;
}

// Figma: 모임 멤버 탭의 구성원 행("Row", 예: nodeId 101:19946) — 운영진/일반 구성원 그룹 안에서
// 반복된다. 모임장에게는 "모임장" Content Badge가 붙는다. 클릭하면 멤버 관리 바텀시트가 열린다
// (nodeId 142:20947, 운영진에게만 노출되는 액션이라 실제로는 관리 권한이 있을 때만 연결한다).
function MemberRow({ member, onClick }: MemberRowProps) {
  return (
    <button
      className="flex w-full items-center gap-3 py-1"
      onClick={() => onClick?.(member)}
      type="button"
    >
      <Avatar size={40} variant="person" />
      <div className="flex min-w-0 flex-1 flex-col items-start">
        <Typography
          color="semantic.label.normal"
          variant="body1"
          weight="medium"
        >
          {member.name}
        </Typography>
        <Typography
          color="semantic.label.alternative"
          variant="label2"
          weight="regular"
        >
          {member.part}
        </Typography>
      </div>
      {member.isOwner && <Badge glow>모임장</Badge>}
    </button>
  );
}

export default MemberRow;
