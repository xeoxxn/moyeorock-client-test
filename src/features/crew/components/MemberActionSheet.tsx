import { List, ListCell, Typography } from "@wanteddev/wds";

import BottomSheet from "@/components/ui/BottomSheet";
import { formatInstruments, GROUP_ROLE_LABEL } from "@/lib/domain/labels";
import type { GroupMember } from "@/lib/domain/types";

interface MemberActionSheetProps {
  member: GroupMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewProfile: (member: GroupMember) => void;
  onDelegate: (member: GroupMember) => void;
  onKick: (member: GroupMember) => void;
}

// Figma: 모임/14 멤버 관리 시트(nodeId 142:20947) — 모임장이 다른 멤버를 눌렀을 때만 뜬다.
// 서버가 지원하는 것만 남겼다: 모임장 위임(role OWNER), 내보내기(status BANNED). Figma의 "일반
// 구성원으로 변경"은 서버에 대응하는 역할 변경이 없어 뺐고, 대신 프로필 보기를 넣었다.
// 확인 대화상자·토스트는 목록 상태를 가진 화면이 맡는다.
function MemberActionSheet({
  member,
  onDelegate,
  onKick,
  onOpenChange,
  onViewProfile,
  open,
}: MemberActionSheetProps) {
  return (
    <BottomSheet
      onOpenChange={onOpenChange}
      open={open}
      title={member?.nickname}
    >
      {member && (
        <div className="flex flex-col gap-2 pb-4">
          <Typography
            color="semantic.label.alternative"
            variant="label1"
            weight="regular"
          >
            {formatInstruments(member.instruments)} ·{" "}
            {GROUP_ROLE_LABEL[member.role]}
          </Typography>
          <List>
            <ListCell onClick={() => onViewProfile(member)}>
              프로필 보기
            </ListCell>
            <ListCell onClick={() => onDelegate(member)}>
              모임장 위임하기
            </ListCell>
            <ListCell
              onClick={() => onKick(member)}
              textProps={{ color: "semantic.primary.normal" }}
            >
              모임에서 내보내기
            </ListCell>
          </List>
        </div>
      )}
    </BottomSheet>
  );
}

export default MemberActionSheet;
