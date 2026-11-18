import {
  Avatar,
  AvatarGroup,
  Typography,
  WithInteraction,
} from "@wanteddev/wds";

import type { UserSummary } from "@/lib/domain/types";

// Figma "Music/Team Card"(483:18606) — 홈 '내 팀' 카드. 폭은 CardPager 칸을 꽉 채운다(화면 폭 − 좌우 20,
// 한 장씩 넘김). 바탕은 표면색 한 가지(팀별 색 없음). 팀 종류 · 이름 · 겹친 아바타 + 내 파트 · 멤버 수.
// 이름은 카드 항목 이름 규칙대로 16 Bold(body1 bold).
interface TeamCardProps {
  /** "공연 팀 · 2026 가을 정기공연" · "독립 팀" */
  kicker: string;
  name: string;
  members: UserSummary[];
  /** "보컬 · 멤버 4명" */
  meta: string;
  onClick: () => void;
}

const MAX_AVATARS = 3;

function TeamCard({ kicker, members, meta, name, onClick }: TeamCardProps) {
  return (
    <WithInteraction variant="light">
      <button
        className="flex h-30 w-full flex-col justify-between rounded-lg bg-surface px-4.5 py-4 text-left"
        onClick={onClick}
        type="button"
      >
        <span className="flex w-full min-w-0 flex-col gap-0.5">
          <Typography
            as="span"
            className="truncate"
            color="semantic.label.assistive"
            variant="caption1"
            weight="medium"
          >
            {kicker}
          </Typography>
          <Typography
            as="span"
            className="truncate"
            color="semantic.label.strong"
            variant="body1"
            weight="bold"
          >
            {name}
          </Typography>
        </span>
        <span className="flex w-full min-w-0 items-center gap-2.5">
          <AvatarGroup size="small">
            {members.slice(0, MAX_AVATARS).map((member) => (
              <Avatar
                alt=""
                key={member.id}
                size="small"
                src={member.profileImage ?? undefined}
                variant="person"
              />
            ))}
          </AvatarGroup>
          <Typography
            as="span"
            className="truncate"
            color="semantic.label.alternative"
            variant="label2"
          >
            {meta}
          </Typography>
        </span>
      </button>
    </WithInteraction>
  );
}

export default TeamCard;
