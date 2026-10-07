import { Typography } from "@wanteddev/wds";
import { IconLocation, IconPersons } from "@wanteddev/wds-icon";
import mascotFlag from "@/assets/mascot/flag.png";
import Badge from "@/components/ui/Badge";

interface GroupHeroProps {
  name: string;
  typeBadge: string;
  description: string;
  location: string;
  memberCount: number;
}

// Figma: 모임 홈/공연/멤버/관리 4개 탭이 공유하는 상단 히어로("Group Hero", 예: nodeId 101:18974).
// 마스코트 아이콘 + 모임명 + 유형 배지 + 소개 + 위치·인원 메타로 구성되며 탭마다 동일하다.
function GroupHero({
  name,
  typeBadge,
  description,
  location,
  memberCount,
}: GroupHeroProps) {
  return (
    <div className="flex w-full flex-col gap-3 px-5 pt-1 pb-4">
      <div className="flex w-full items-center gap-3.5">
        <div className="flex size-[72px] shrink-0 items-center justify-center rounded-[18px] bg-surface">
          <img alt="" className="size-[62px]" src={mascotFlag} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <Typography
              color="semantic.label.normal"
              variant="heading2"
              weight="bold"
            >
              {name}
            </Typography>
            <Badge glow size="md">
              {typeBadge}
            </Badge>
          </div>
          <Typography
            color="semantic.label.alternative"
            variant="label1"
            weight="medium"
          >
            {description}
          </Typography>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1">
          <IconLocation className="size-3.5 text-label-alternative" />
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="medium"
          >
            {location}
          </Typography>
        </div>
        <div className="flex items-center gap-1">
          <IconPersons className="size-3.5 text-label-alternative" />
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="medium"
          >
            멤버 {memberCount}명
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default GroupHero;
