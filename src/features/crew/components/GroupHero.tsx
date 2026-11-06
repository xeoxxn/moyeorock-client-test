import { Typography } from "@wanteddev/wds";
import { IconLocation, IconPersons } from "@wanteddev/wds-icon";

import mascotFlag from "@/assets/mascot/flag.png";
import Badge from "@/components/ui/Badge";
import MetaItem from "@/components/ui/MetaItem";
import { GROUP_TYPE_LABEL, REGION_LABEL } from "@/lib/domain/labels";
import type { Group } from "@/lib/domain/types";

// Figma: 모임 홈/공연/멤버/관리 네 탭이 공유하는 상단 히어로("Group Hero", nodeId 101:18974).
// 대표 이미지(coverImage)가 없으면 깃발 마스코트를 대신 보여준다 — 서버가 coverImage를 선택값으로 받는다.
function GroupHero({ group }: { group: Group }) {
  return (
    <div className="flex flex-col gap-3 px-5 pt-1 pb-4">
      <div className="flex items-center gap-3.5">
        <div className="flex size-18 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-surface">
          <img
            alt=""
            className={
              group.coverImage
                ? "size-full object-cover"
                : "aspect-square w-5/6 object-contain"
            }
            src={group.coverImage ?? mascotFlag}
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex min-w-0 items-center gap-1.5">
            <Typography
              className="min-w-0 truncate"
              color="semantic.label.strong"
              variant="title3"
              weight="bold"
            >
              {group.name}
            </Typography>
            <Badge glow size="md">
              {GROUP_TYPE_LABEL[group.type]}
            </Badge>
          </div>
          <Typography
            color="semantic.label.alternative"
            variant="label1"
            weight="medium"
          >
            {group.description}
          </Typography>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <MetaItem icon={<IconLocation />}>
          {REGION_LABEL[group.region]}
        </MetaItem>
        <MetaItem icon={<IconPersons />}>멤버 {group.memberCount}명</MetaItem>
      </div>
    </div>
  );
}

export default GroupHero;
