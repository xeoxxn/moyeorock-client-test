import {
  Divider,
  Tab,
  TabList,
  TabListItem,
  TextButton,
  ToggleIcon,
  Typography,
  useToast,
} from "@wanteddev/wds";
import {
  IconBookmark,
  IconBookmarkFill,
  IconChevronRightSmall,
  IconMusicMicrophone,
  IconPersons,
} from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import mascotMusic from "@/assets/mascot/music.png";
import MetaItem from "@/components/ui/MetaItem";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import {
  getTeamPerformance,
  isTeamLeader,
  isTeamMember,
} from "@/features/team/components/teamHelpers";
import { TEAM_KIND_LABEL } from "@/lib/domain/labels";
import type { Team } from "@/lib/domain/types";
import { getBookmarks, getGroup } from "@/mocks/selectors";

export type TeamTabValue =
  | "home"
  | "show"
  | "songs"
  | "schedule"
  | "members"
  | "manage";

const TAB_PATH: Record<TeamTabValue, string> = {
  home: "",
  manage: "/manage",
  members: "/members",
  schedule: "/schedule",
  show: "/show",
  songs: "/songs",
};

// 저장(북마크) 상태. 탭을 옮길 때마다 이 컴포넌트가 새로 마운트되므로, 목업에서도 토글한 값이
// 탭을 오가며 유지되게 모듈에 들고 있는다 — 서버(POST/DELETE /bookmarks TEAM)가 붙으면 응답으로 대체.
const savedTeamIds = new Set(
  getBookmarks()
    .filter((bookmark) => bookmark.targetType === "TEAM")
    .map((bookmark) => bookmark.targetId),
);

function visibleTabs(team: Team): { value: TeamTabValue; label: string }[] {
  // 비회원(공고에서 들어온 팀 등)은 팀 홈만 본다 — 선택곡·일정·멤버는 팀원 전용이다.
  if (!isTeamMember(team)) return [{ label: "홈", value: "home" }];
  return [
    { label: "홈", value: "home" },
    // 공연 탭은 공연 팀에만 있다(서버 TeamDetail.performance가 null이면 독립 팀).
    ...(team.performanceId !== null
      ? [{ label: "공연", value: "show" as const }]
      : []),
    { label: "선택곡", value: "songs" },
    { label: "일정", value: "schedule" },
    { label: "멤버", value: "members" },
    ...(isTeamLeader(team)
      ? [{ label: "관리", value: "manage" as const }]
      : []),
  ];
}

// Figma: 팀/02~07 (홈·공연·선택곡·일정·멤버·관리)이 함께 쓰는 헤더 + 팀 히어로 + 탭.
// 탭은 화면 안 패널이 아니라 라우트라서, 탭끼리 옮길 때는 replace로 히스토리를 쌓지 않는다 —
// 탭을 몇 번 오가도 뒤로가기 한 번이면 팀에 들어오기 전 화면으로 돌아간다.
interface TeamHeroTabsProps {
  team: Team;
  active: TeamTabValue;
}

function TeamHeroTabs({ active, team }: TeamHeroTabsProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const [saved, setSaved] = useState(savedTeamIds.has(team.id));

  const performance = getTeamPerformance(team);
  const group = performance ? getGroup(performance.groupId) : undefined;
  const tabs = visibleTabs(team);

  const toggleSaved = (next: boolean) => {
    if (next) savedTeamIds.add(team.id);
    else savedTeamIds.delete(team.id);
    setSaved(next);
    toast({
      content: next ? "팀을 저장했어요" : "저장을 해제했어요",
      variant: "positive",
    });
  };

  useScreenHeader(
    <ScreenHeader
      trailing={
        <ToggleIcon
          active={saved}
          aria-label={saved ? "팀 저장 해제" : "팀 저장"}
          onActiveChange={toggleSaved}
        >
          {saved ? <IconBookmarkFill /> : <IconBookmark />}
        </ToggleIcon>
      }
    />,
  );

  return (
    <>
      <div className="flex flex-col gap-2.5 px-5 pt-1 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="flex size-18 shrink-0 items-center justify-center rounded-2xl bg-surface">
            <img
              alt=""
              className="aspect-square w-5/6 object-contain drop-shadow-neon-sm"
              src={mascotMusic}
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
            <Typography
              color="semantic.label.strong"
              variant="title3"
              weight="bold"
            >
              {team.name}
            </Typography>
            {performance ? (
              <TextButton
                color="primary"
                onClick={() => navigate(`/show/${performance.id}`)}
                size="small"
                trailingContent={<IconChevronRightSmall />}
              >
                {group ? `${group.name} · ` : ""}
                {performance.title}
              </TextButton>
            ) : (
              <Typography
                color="semantic.label.alternative"
                variant="label2"
                weight="bold"
              >
                {TEAM_KIND_LABEL.independent}
              </Typography>
            )}
          </div>
        </div>
        <Typography
          color="semantic.label.alternative"
          variant="body2"
          weight="medium"
        >
          {team.description}
        </Typography>
        <div className="flex items-center gap-2.5">
          <MetaItem icon={<IconMusicMicrophone />}>
            {performance
              ? TEAM_KIND_LABEL.performance
              : TEAM_KIND_LABEL.independent}
          </MetaItem>
          <MetaItem icon={<IconPersons />}>
            멤버 {team.members.length}명
          </MetaItem>
        </div>
      </div>

      {tabs.length > 1 ? (
        <Tab
          onValueChange={(value) => {
            if (value === active) return;
            navigate(`/team/${team.id}${TAB_PATH[value as TeamTabValue]}`, {
              replace: true,
            });
          }}
          value={active}
        >
          <TabList horizontalPadding resize="hug" size="medium">
            {tabs.map((tab) => (
              <TabListItem key={tab.value} value={tab.value}>
                {tab.label}
              </TabListItem>
            ))}
          </TabList>
        </Tab>
      ) : (
        <Divider />
      )}
    </>
  );
}

export default TeamHeroTabs;
