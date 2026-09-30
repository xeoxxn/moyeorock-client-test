import { Typography } from "@wanteddev/wds";
import { IconSearch } from "@wanteddev/wds-icon";
import { useState } from "react";

import MemberActionSheet from "@/features/crew/components/MemberActionSheet";
import MemberRow, {
  type CrewMember,
} from "@/features/crew/components/MemberRow";

// Figma: 모임 멤버 탭 본문(nodeId 101:19915) — 검색 필드, 파트별 필터 칩, 운영진/일반 구성원
// 그룹으로 나뉜 목록. 칩 필터는 아직 실제 필터링을 연결하지 않은 정적 표시다(백엔드 부재).
const STAFF: CrewMember[] = [
  { id: "1", isOwner: true, name: "김모임", part: "일렉" },
  { id: "2", name: "이보컬", part: "보컬" },
  { id: "3", name: "서비스 2팀", part: "어쿠스틱" },
  { id: "4", name: "박드럼", part: "드럼" },
];

const REGULARS: CrewMember[] = [
  { id: "5", name: "강보컬", part: "보컬" },
  { id: "6", name: "정일렉", part: "일렉" },
  { id: "7", name: "오어쿠", part: "어쿠스틱" },
];

const PART_FILTERS = ["전체 11", "보컬 2", "일렉 2", "어쿠스틱 2", "드럼 1"];

function CrewMembersScreen() {
  const [selectedMember, setSelectedMember] = useState<CrewMember | null>(null);

  return (
    <div className="flex flex-col gap-3.5 px-5 py-5">
      <div className="flex items-center gap-2 rounded-xl bg-surface px-3.5 py-3">
        <IconSearch className="size-5 text-label-disable" />
        <Typography
          color="semantic.label.disable"
          variant="body1"
          weight="regular"
        >
          구성원 검색
        </Typography>
      </div>
      <div className="scrollbar-hidden -mx-5 flex gap-1.5 overflow-x-auto px-5">
        {PART_FILTERS.map((filter, index) => (
          <div
            className={
              index === 0
                ? "shrink-0 rounded-lg bg-label-strong px-2 py-1.5"
                : "shrink-0 rounded-lg border border-line-solid px-2 py-1.5"
            }
            key={filter}
          >
            <Typography
              color={
                index === 0
                  ? "semantic.inverse.label"
                  : "semantic.label.alternative"
              }
              variant="label1"
              weight="medium"
            >
              {filter}
            </Typography>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1.5 pt-2">
        <Typography
          color="semantic.label.normal"
          variant="headline2"
          weight="bold"
        >
          운영진
        </Typography>
        <Typography
          className="text-glow-sm"
          color="semantic.primary.strong"
          variant="label1"
          weight="bold"
        >
          {STAFF.length}명
        </Typography>
      </div>
      {STAFF.map((member) => (
        <MemberRow
          key={member.id}
          member={member}
          onClick={setSelectedMember}
        />
      ))}

      <div className="flex items-center gap-1.5 pt-2">
        <Typography
          color="semantic.label.normal"
          variant="headline2"
          weight="bold"
        >
          일반 구성원
        </Typography>
        <Typography
          color="semantic.label.alternative"
          variant="label1"
          weight="medium"
        >
          {REGULARS.length}명
        </Typography>
      </div>
      {REGULARS.map((member) => (
        <MemberRow
          key={member.id}
          member={member}
          onClick={setSelectedMember}
        />
      ))}

      <MemberActionSheet
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
}

export default CrewMembersScreen;
