import { Avatar, Typography } from "@wanteddev/wds";

import { formatInstruments, REGION_LABEL } from "@/lib/domain/labels";
import type { User } from "@/lib/domain/types";

/** "보컬 중급 · 일렉 기타 초급 · 서울" — 세션(실력 포함) · 지역. 사람 목록 행(저장한 멤버)의 한 줄 정보 */
export function formatProfileMeta(user: User): string {
  return [formatInstruments(user.instruments, true), REGION_LABEL[user.region]]
    .filter(Boolean)
    .join(" · ");
}

// 마이(Figma 07)와 멤버 프로필(Figma 23)의 머리 — 아바타 80 + 이름(heading1) + 지역("서울").
// 세션·실력은 이름 아래에 늘어놓지 않고 아래 세션 구역(SessionTile)에서 보여 준다.
// 프로필 사진이 없으면 WDS Avatar 기본 사람 모양이 나온다(23).
function ProfileSummary({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-4">
      <Avatar
        alt=""
        size={80}
        src={user.profileImage ?? undefined}
        variant="person"
      />
      <div className="flex min-w-0 flex-col gap-0.5">
        <Typography
          as="h1"
          color="semantic.label.strong"
          variant="heading1"
          weight="bold"
        >
          {user.nickname}
        </Typography>
        <Typography color="semantic.label.alternative" variant="label2">
          {REGION_LABEL[user.region]}
        </Typography>
      </div>
    </div>
  );
}

export default ProfileSummary;
