import { Button, Typography } from "@wanteddev/wds";

import PersonRow from "@/components/list/PersonRow";
import BottomSheet from "@/components/ui/BottomSheet";
import { innerClick } from "@/components/ui/listCellEvents";
import { formatInstruments } from "@/lib/domain/labels";
import type { User } from "@/lib/domain/types";

// 멤버 탭 "초대"(팀장) — 초대 보내기(InviteSheet)는 받을 사람이 정해져 있어야 해서, 먼저 내가 저장한
// 사람(북마크 USER) 중 팀원이 아닌 사람을 보여 주고 고르게 한다. 모르는 사람은 아래 'AI 추천 팀원'이나
// 게시판 모집글로 찾는다.
interface InviteCandidatesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidates: User[];
  invitedIds: number[];
  onInvite: (user: User) => void;
}

function InviteCandidatesSheet({
  candidates,
  invitedIds,
  onInvite,
  onOpenChange,
  open,
}: InviteCandidatesSheetProps) {
  return (
    <BottomSheet onOpenChange={onOpenChange} open={open} title="팀원 초대">
      <Typography color="semantic.label.alternative" variant="label2">
        저장한 사람
      </Typography>
      {candidates.length === 0 ? (
        <Typography
          className="whitespace-pre-line py-6 text-center"
          color="semantic.label.alternative"
          variant="body2"
        >
          {
            "프로필에서 저장한 사람을 여기서 바로 초대할 수 있어요.\n아래 AI 추천 팀원도 살펴보세요."
          }
        </Typography>
      ) : (
        // 행(ListCell fillWidth)이 좌우 여백을 직접 가져서 시트 여백만큼 당긴다.
        <div className="-mx-5">
          {candidates.map((user) => {
            const invited = invitedIds.includes(user.id);
            return (
              <PersonRow
                key={user.id}
                meta={formatInstruments(user.instruments)}
                name={user.nickname}
                profileImage={user.profileImage}
                trailing={
                  <Button
                    color="assistive"
                    disabled={invited}
                    onClick={innerClick(() => onInvite(user))}
                    size="small"
                    variant="solid"
                  >
                    {invited ? "초대함" : "초대"}
                  </Button>
                }
              />
            );
          })}
        </div>
      )}
    </BottomSheet>
  );
}

export default InviteCandidatesSheet;
