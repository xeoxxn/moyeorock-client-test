import { Avatar } from "@wanteddev/wds";
import type { ReactNode } from "react";

import MediaRow from "@/components/list/MediaRow";

// Figma "List/Person"(536:23811) — WDS Avatar(40) + 이름 + 세션·역할, 오른쪽에 짧은 버튼("팔로우"·
// "초대")이나 "나" 같은 글자. 행 안 버튼은 innerClick으로 감싸 행 이동과 겹치지 않게 한다.
interface PersonRowProps {
  name: ReactNode;
  meta?: ReactNode;
  profileImage?: string | null;
  trailing?: ReactNode;
  onClick?: () => void;
}

function PersonRow({
  meta,
  name,
  onClick,
  profileImage,
  trailing,
}: PersonRowProps) {
  return (
    <MediaRow
      leading={
        <Avatar
          alt=""
          size="medium"
          src={profileImage ?? undefined}
          variant="person"
        />
      }
      meta={meta}
      onClick={onClick}
      title={name}
      trailing={trailing}
    />
  );
}

export default PersonRow;
