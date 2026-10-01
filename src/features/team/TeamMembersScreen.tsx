import {
  Avatar,
  Category,
  CategoryList,
  CategoryListItem,
  ContentBadge,
  Typography,
} from "@wanteddev/wds";
import { IconSearch } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useParams } from "react-router-dom";

import TeamHeroTabs from "@/features/team/components/TeamHeroTabs";

// Figma: 팀/06 팀 멤버 (nodeId 101:22803)

type SessionFilter = "all" | "vocal" | "electric" | "acoustic";

const FILTERS: { value: SessionFilter; label: string }[] = [
  { label: "전체 9", value: "all" },
  { label: "보컬 2", value: "vocal" },
  { label: "일렉 1", value: "electric" },
  { label: "어쿠스틱 2", value: "acoustic" },
];

interface Member {
  id: string;
  name: string;
  session: string;
  isLeader?: boolean;
}

const LEADER: Member = {
  id: "1",
  isLeader: true,
  name: "서비스 2팀",
  session: "어쿠스틱",
};

const MEMBERS: Member[] = [
  { id: "2", name: "강보컬", session: "보컬" },
  { id: "3", name: "이보컬", session: "보컬" },
  { id: "4", name: "정일렉", session: "일렉" },
  { id: "5", name: "박베이스", session: "베이스" },
];

function TeamMembersScreen() {
  const { teamId = "" } = useParams();
  const [filter, setFilter] = useState<SessionFilter>("all");

  return (
    <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto">
      <TeamHeroTabs active="members" teamId={teamId} />

      <div className="flex flex-col gap-3.5 px-5 pt-5 pb-8">
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

        <Category
          onValueChange={(v) => setFilter(v as SessionFilter)}
          value={filter}
        >
          <CategoryList size="small">
            {FILTERS.map((item) => (
              <CategoryListItem key={item.value} value={item.value}>
                {item.label}
              </CategoryListItem>
            ))}
          </CategoryList>
        </Category>

        <div className="flex flex-col gap-1 pt-2">
          <div className="flex items-center gap-1.5">
            <Typography
              color="semantic.label.normal"
              variant="headline2"
              weight="bold"
            >
              운영진
            </Typography>
            <Typography
              className="text-glow-sm"
              color="semantic.primary.normal"
              variant="label1"
              weight="bold"
            >
              1명
            </Typography>
          </div>
          <div className="flex items-center gap-3 py-1">
            <Avatar size="small" variant="person" />
            <div className="flex min-w-0 flex-1 flex-col">
              <Typography
                color="semantic.label.normal"
                variant="body1"
                weight="medium"
              >
                {LEADER.name}
              </Typography>
              <Typography
                color="semantic.label.assistive"
                variant="label2"
                weight="medium"
              >
                {LEADER.session}
              </Typography>
            </div>
            <ContentBadge
              accentColor="semantic.primary.normal"
              className="shadow-neon-sm"
              color="accent"
              size="small"
            >
              팀장
            </ContentBadge>
          </div>
        </div>

        <div className="flex flex-col gap-1 pt-2">
          <div className="flex items-center gap-1.5">
            <Typography
              color="semantic.label.normal"
              variant="headline2"
              weight="bold"
            >
              팀원
            </Typography>
            <Typography
              color="semantic.label.assistive"
              variant="label1"
              weight="medium"
            >
              {MEMBERS.length}명
            </Typography>
          </div>
          {MEMBERS.map((member) => (
            <div className="flex items-center gap-3 py-1" key={member.id}>
              <Avatar size="small" variant="person" />
              <div className="flex min-w-0 flex-1 flex-col">
                <Typography
                  color="semantic.label.normal"
                  variant="body1"
                  weight="medium"
                >
                  {member.name}
                </Typography>
                <Typography
                  color="semantic.label.assistive"
                  variant="label2"
                  weight="medium"
                >
                  {member.session}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TeamMembersScreen;
