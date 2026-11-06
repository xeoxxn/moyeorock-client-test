import { Avatar, ListCell, ListCellContent } from "@wanteddev/wds";
import type { ReactNode } from "react";

import { rowClick } from "@/components/ui/listCellEvents";

// 아바타 + 닉네임 + 세션 한 줄 — 팀 멤버·받은 지원·보낸 초대·팀원 찾기·팀원 관리가 같은 행을 쓴다.
// 행을 누르면 onPress(대개 프로필로 이동). 오른쪽은 기본 chevron이고, 배지·보조 버튼을 넘기면
// 그걸로 바꾼다(보조 버튼은 innerClick으로 감싸야 행 이동과 겹치지 않는다).
interface MemberCellProps {
  nickname: ReactNode;
  caption?: ReactNode;
  onPress: () => void;
  trailing?: ReactNode;
  /** List(ul) 밖(카드 안 등)에 둘 때 */
  standalone?: boolean;
}

function MemberCell({
  caption,
  nickname,
  onPress,
  standalone = false,
  trailing,
}: MemberCellProps) {
  return (
    <ListCell
      alignItems="center"
      as={standalone ? "div" : undefined}
      leadingContent={
        <ListCellContent variant="avatar">
          <Avatar size="medium" variant="person" />
        </ListCellContent>
      }
      onClick={rowClick(onPress)}
      textProps={{
        caption,
        captionProps: {
          color: "semantic.label.assistive",
          variant: "label2",
          weight: "medium",
        },
        weight: "bold",
      }}
      trailingContent={trailing ?? <ListCellContent variant="chevron" />}
      verticalPadding="small"
    >
      {nickname}
    </ListCell>
  );
}

export default MemberCell;
