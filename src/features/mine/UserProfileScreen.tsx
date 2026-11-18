import { Button, Typography, useToast } from "@wanteddev/wds";
import { useMemo, useState } from "react";
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import CoverRow from "@/components/list/CoverRow";
import EventRow from "@/components/list/EventRow";
import { coverToneOf } from "@/components/music/Cover";
import EmptyState from "@/components/ui/EmptyState";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SectionHeader from "@/components/ui/SectionHeader";
import Status from "@/components/ui/Status";
import {
  useScreenBackdrop,
  useScreenHeader,
} from "@/components/ui/useScreenHeader";
import InviteSheet from "@/features/join/InviteSheet";
import ProfileSummary from "@/features/mine/components/ProfileSummary";
import SessionTiles from "@/features/mine/components/SessionTiles";
import { formatDday, formatTime } from "@/lib/domain/format";
import {
  GROUP_TYPE_LABEL,
  INSTRUMENT_LABEL,
  PERFORMANCE_STATUS_LABEL,
  TEAM_KIND_LABEL,
} from "@/lib/domain/labels";
import type { Group, Instrument, Performance, Team } from "@/lib/domain/types";
import {
  getMe,
  getPerformance,
  getPostableTargets,
  getUser,
  getUserGroups,
  getUserTeams,
  isBookmarked,
  isPerformanceTeam,
  isUpcoming,
  toId,
} from "@/mocks/selectors";

// Figma 23 멤버 프로필(502:20910, /users/:userId) — 멤버 목록·AI 추천·모집글·저장 목록 등 여러 곳에서
// 들어온다. 아바타 + 이름·지역 + 소개 + 초대·저장 + 세션(타일) + 소속 팀 · 소속 모임 · 참여 중인 공연.
// 세션은 프로필 본문(instruments)이라 활동 공개 설정과 상관없이 보이고, 소속·공연(activities)만 숨는다.
// 팀 화면에서 들어오면 ?teamId=로 그 팀을 초대 시트에서 미리 고른다. 내 id면 마이로 보낸다.
// Figma 헤더 오른쪽 더보기(⋮)는 메뉴 항목(신고·차단 등)이 서버에 없어 뺐다.

interface UserActivities {
  teams: { team: Team; instrument: Instrument }[];
  groups: Group[];
  performances: Performance[];
}

/**
 * 서버 GET /users/{id}의 activities(소속 모임·팀·진행 중 공연)를 목업에서 계산한다. 서버는
 * isActivityPublic이 false면 activities를 null로 준다.
 */
function getUserActivities(userId: number): UserActivities {
  const teams = getUserTeams(userId);
  const groups = getUserGroups(userId);
  const performances = new Map<number, Performance>();
  for (const { team } of teams) {
    const performance =
      team.performanceId !== null ? getPerformance(team.performanceId) : null;
    if (performance && isUpcoming(performance)) {
      performances.set(performance.id, performance);
    }
  }
  return {
    groups,
    performances: [...performances.values()].sort((a, b) =>
      a.performedAt.localeCompare(b.performedAt),
    ),
    teams,
  };
}

function UserProfileScreen() {
  const navigate = useNavigate();
  const toast = useToast();
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const user = getUser(toId(userId));
  const isMe = user?.id === getMe().id;
  // 같은 화면에서 다른 사용자로 넘어가도 저장 상태가 섞이지 않게 사용자별로 들고 있는다.
  const [savedOverride, setSavedOverride] = useState<Record<number, boolean>>(
    {},
  );
  const [inviteOpen, setInviteOpen] = useState(false);

  useScreenHeader(useMemo(() => <ScreenHeader />, []));
  useScreenBackdrop(user && !isMe ? "stage" : null);

  if (isMe) return <Navigate replace to="/mine" />;

  if (!user) {
    return (
      <ScreenBody className="flex flex-col items-center justify-center">
        <EmptyState
          description="탈퇴했거나 주소가 잘못된 사용자예요"
          title="없는 사용자예요"
        />
      </ScreenBody>
    );
  }

  // 유저 북마크 = 저장(팔로우). POST·DELETE /bookmarks 자리 — 목업에선 화면 상태로만 바꾼다.
  const saved = savedOverride[user.id] ?? isBookmarked("USER", user.id);
  const toggleSaved = () => {
    setSavedOverride((prev) => ({ ...prev, [user.id]: !saved }));
    toast({
      content: saved ? "저장을 취소했어요" : "저장 목록에 담았어요",
      variant: "positive",
    });
  };

  // 초대는 팀장(내 팀)·모임장(내 모임)만 보낼 수 있다 — 초대할 곳이 없으면 버튼을 숨긴다.
  const targets = getPostableTargets();
  const canInvite = targets.length > 0;
  const teamId = searchParams.get("teamId");
  // 들어온 팀이 내가 팀장인 팀일 때만 미리 고른다(아니면 시트가 첫 대상을 잡는다).
  const defaultTargetKey =
    teamId &&
    targets.some(
      (target) => target.targetType === "TEAM" && target.id === toId(teamId),
    )
      ? `TEAM:${teamId}`
      : undefined;

  const activities = user.isActivityPublic ? getUserActivities(user.id) : null;
  const hasActivity =
    activities !== null &&
    (activities.teams.length > 0 ||
      activities.groups.length > 0 ||
      activities.performances.length > 0);

  return (
    <>
      <ScreenBody>
        <section className="flex flex-col gap-4 px-5 pt-4">
          <ProfileSummary user={user} />
          {user.bio && (
            <Typography color="semantic.label.neutral" variant="body2">
              {user.bio}
            </Typography>
          )}
          <div className="flex gap-2">
            {canInvite && (
              <Button
                color="primary"
                onClick={() => setInviteOpen(true)}
                size="small"
                variant="solid"
              >
                초대
              </Button>
            )}
            <Button
              aria-pressed={saved}
              color="assistive"
              onClick={toggleSaved}
              size="small"
              variant="outlined"
            >
              {saved ? "저장됨" : "저장"}
            </Button>
          </div>
        </section>

        {user.instruments.length > 0 && (
          <>
            <SectionHeader title="세션" />
            <SessionTiles instruments={user.instruments} />
          </>
        )}

        {activities === null ? (
          <Typography
            as="p"
            className="px-5 pt-8"
            color="semantic.label.assistive"
            variant="body2"
          >
            활동 기록을 공개하지 않은 멤버예요
          </Typography>
        ) : !hasActivity ? (
          <Typography
            as="p"
            className="px-5 pt-8"
            color="semantic.label.assistive"
            variant="body2"
          >
            아직 소속된 팀·모임이 없어요
          </Typography>
        ) : (
          <>
            {activities.teams.length > 0 && (
              <>
                <SectionHeader title="소속 팀" />
                {activities.teams.map(({ instrument, team }) => (
                  <CoverRow
                    key={team.id}
                    meta={`${TEAM_KIND_LABEL[isPerformanceTeam(team) ? "performance" : "independent"]} · ${INSTRUMENT_LABEL[instrument]}`}
                    onClick={() => navigate(`/team/${team.id}`)}
                    title={team.name}
                    tone={coverToneOf("team", team.id)}
                  />
                ))}
              </>
            )}
            {activities.groups.length > 0 && (
              <>
                <SectionHeader title="소속 모임" />
                {activities.groups.map((group) => (
                  <CoverRow
                    key={group.id}
                    meta={`${GROUP_TYPE_LABEL[group.type]} · 멤버 ${group.memberCount}명`}
                    onClick={() => navigate(`/crew/${group.id}`)}
                    title={group.name}
                    tone={coverToneOf("group", group.id)}
                  />
                ))}
              </>
            )}
            {activities.performances.length > 0 && (
              <>
                <SectionHeader title="참여 중인 공연" />
                {activities.performances.map((performance) => (
                  <EventRow
                    date={new Date(performance.performedAt)}
                    key={performance.id}
                    label={
                      <Status
                        tone={
                          performance.status === "PLANNED"
                            ? "accent"
                            : "progress"
                        }
                      >
                        {`${PERFORMANCE_STATUS_LABEL[performance.status]} · ${formatDday(performance.performedAt)}`}
                      </Status>
                    }
                    meta={`${formatTime(performance.performedAt)} · ${performance.venue}`}
                    onClick={() => navigate(`/show/${performance.id}`)}
                    title={performance.title}
                  />
                ))}
              </>
            )}
          </>
        )}
      </ScreenBody>

      {canInvite && (
        <InviteSheet
          defaultTargetKey={defaultTargetKey}
          invitee={user}
          key={user.id}
          onOpenChange={setInviteOpen}
          open={inviteOpen}
        />
      )}
    </>
  );
}

export default UserProfileScreen;
