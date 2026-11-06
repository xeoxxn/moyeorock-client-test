import { ToggleIcon, useToast } from "@wanteddev/wds";
import { IconBookmark, IconBookmarkFill } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import BottomActionArea from "@/components/ui/BottomActionArea";
import EmptyState from "@/components/ui/EmptyState";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import InviteSheet from "@/features/join/InviteSheet";
import ActivitySection, {
  type ActivityLink,
} from "@/features/mine/components/ActivitySection";
import {
  ProfileHeader,
  ProfileInfoCard,
} from "@/features/mine/components/ProfileSummary";
import { formatDate } from "@/lib/domain/format";
import {
  GROUP_ROLE_LABEL,
  TEAM_KIND_LABEL,
  TEAM_ROLE_LABEL,
} from "@/lib/domain/labels";
import type { Performance } from "@/lib/domain/types";
import { GROUPS, TEAMS } from "@/mocks/data";
import {
  getBookmarks,
  getGroupMembers,
  getMe,
  getPerformance,
  getPostableTargets,
  getUser,
  isUpcoming,
  toId,
} from "@/mocks/selectors";

// Figma: 마이/08 다른 사용자 프로필(/users/:userId). 팀원 찾기·멤버 목록·저장한 유저 등 여러 곳에서
// 들어오는 하위 화면이라 Figma의 Bottom Nav 대신 뒤로가기 헤더를 쓴다. 팀 화면에서 들어오면
// ?teamId=로 그 팀을 초대 시트에서 미리 고른다.

/**
 * 서버 GET /users/{id}의 activities(소속 모임·팀·진행 중 공연)를 목업에서 계산한다. 서버는
 * isActivityPublic이 false면 activities를 null로 준다.
 */
function getUserActivities(userId: number): {
  groups: ActivityLink[];
  teams: ActivityLink[];
  performances: ActivityLink[];
} {
  const groups = GROUPS.flatMap((group) => {
    const member = getGroupMembers(group.id).find(
      (item) => item.userId === userId,
    );
    return member
      ? [
          {
            caption: `모임 · ${GROUP_ROLE_LABEL[member.role]}`,
            key: `group-${group.id}`,
            title: group.name,
            to: `/crew/${group.id}`,
          },
        ]
      : [];
  });

  const memberTeams = TEAMS.flatMap((team) => {
    const member = team.members.find((item) => item.user.id === userId);
    return member ? [{ role: member.role, team }] : [];
  });
  const teams = memberTeams.map(({ role, team }) => ({
    caption: `${TEAM_KIND_LABEL[team.performanceId !== null ? "performance" : "independent"]} · ${TEAM_ROLE_LABEL[role]}`,
    key: `team-${team.id}`,
    title: team.name,
    to: `/team/${team.id}`,
  }));

  const performances = new Map<number, Performance>();
  for (const { team } of memberTeams) {
    const performance =
      team.performanceId !== null ? getPerformance(team.performanceId) : null;
    if (performance && isUpcoming(performance)) {
      performances.set(performance.id, performance);
    }
  }

  return {
    groups,
    performances: [...performances.values()].map((performance) => ({
      caption: `공연 · ${formatDate(performance.performedAt)}`,
      key: `show-${performance.id}`,
      title: performance.title,
      to: `/show/${performance.id}`,
    })),
    teams,
  };
}

function UserProfileScreen() {
  const toast = useToast();
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const user = getUser(toId(userId));
  // 서버는 자기 자신을 저장(북마크)할 수 없게 막는다 — 내 프로필이면 저장 버튼을 숨긴다.
  const isMe = user?.id === getMe().id;
  // 같은 화면에서 다른 사용자로 넘어가도 저장 상태가 섞이지 않게 사용자별로 들고 있는다.
  const [savedOverride, setSavedOverride] = useState<Record<number, boolean>>(
    {},
  );
  const [inviteOpen, setInviteOpen] = useState(false);
  const saved =
    (user && savedOverride[user.id]) ??
    getBookmarks().some(
      (bookmark) =>
        bookmark.targetType === "USER" && bookmark.targetId === user?.id,
    );

  const toggleSaved = (next: boolean) => {
    if (!user) return;
    setSavedOverride((prev) => ({ ...prev, [user.id]: next }));
    toast({
      content: next ? "저장 목록에 담았어요" : "저장을 취소했어요",
      variant: "positive",
    });
  };

  useScreenHeader(
    <ScreenHeader
      title="프로필"
      trailing={
        user && !isMe ? (
          <ToggleIcon
            active={saved}
            aria-label={saved ? "저장 취소" : "저장"}
            onActiveChange={toggleSaved}
          >
            {saved ? <IconBookmarkFill /> : <IconBookmark />}
          </ToggleIcon>
        ) : undefined
      }
    />,
  );

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyState
          description="탈퇴했거나 주소가 잘못된 사용자예요"
          title="없는 사용자예요"
        />
      </div>
    );
  }

  // 초대는 팀장(내 팀)·모임장(내 모임)만 보낼 수 있다 — 초대할 곳이 없으면 버튼을 숨긴다.
  const targets = getPostableTargets();
  const canInvite = !isMe && targets.length > 0;
  const teamId = searchParams.get("teamId");
  // 들어온 팀이 내가 팀장인 팀일 때만 미리 고른다(아니면 시트가 비어 있는 값을 잡는다).
  const defaultTargetKey =
    teamId &&
    targets.some(
      (target) => target.targetType === "TEAM" && target.id === toId(teamId),
    )
      ? `TEAM:${teamId}`
      : undefined;

  const activities = getUserActivities(user.id);

  return (
    <>
      <div className="scrollbar-hidden flex-1 overflow-y-auto">
        <section className="flex flex-col gap-4 px-5 pt-2 pb-6">
          <ProfileHeader user={user} />
          <ProfileInfoCard sessionLabel="세션" user={user} />
        </section>

        <div className="h-3 bg-surface" />
        {user.isActivityPublic || isMe ? (
          <ActivitySection
            emptyText="아직 소속된 모임·팀이 없어요"
            links={[
              ...activities.groups,
              ...activities.teams,
              ...activities.performances,
            ]}
            stats={[
              { count: activities.groups.length, label: "소속 모임" },
              { count: activities.teams.length, label: "소속 팀" },
              {
                count: activities.performances.length,
                label: "참여 중인 공연",
              },
            ]}
            title="활동"
          />
        ) : (
          <EmptyState
            description="이 사용자는 모임·팀·공연 기록을 공개하지 않았어요"
            title="활동 기록을 공개하지 않았어요"
          />
        )}
      </div>

      {canInvite && (
        <>
          <BottomActionArea
            label="초대하기"
            onClick={() => setInviteOpen(true)}
          />
          <InviteSheet
            defaultTargetKey={defaultTargetKey}
            key={user.id}
            invitee={user}
            onOpenChange={setInviteOpen}
            open={inviteOpen}
          />
        </>
      )}
    </>
  );
}

export default UserProfileScreen;
