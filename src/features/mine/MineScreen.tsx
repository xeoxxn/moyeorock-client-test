import {
  Button,
  List,
  ListCell,
  ListCellContent,
  Switch,
  TextButton,
  TopNavigationButton,
} from "@wanteddev/wds";
import {
  IconBell,
  IconChevronRightTightSmall,
  IconMusicMicrophone,
} from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { rowClick } from "@/components/ui/listCellEvents";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SectionHeader from "@/components/ui/SectionHeader";
import { useAppAlert } from "@/components/ui/useAppAlert";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import ActivitySection from "@/features/mine/components/ActivitySection";
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
import type { Song, User } from "@/lib/domain/types";
import {
  getAllSongs,
  getBookmarks,
  getMe,
  getMyGroups,
  getMyTeams,
  getMyUpcomingPerformances,
} from "@/mocks/selectors";

// Figma: 마이/01 마이(Bottom Nav "마이" 탭 루트). "마이/07 회원 탈퇴 확인"은 화면이 아니라 이 화면
// 위에 뜨는 확인창이라 WDS 확인창(useAppAlert)으로 띄운다.

/**
 * 서버 대시보드의 recommendedSongs는 아직 null이다 — 내 음악 취향이나 내 세션으로 칠 수 있는 곡을
 * 목업에서 골라 둔다.
 */
function getRecommendedSongs(user: User): Song[] {
  const myInstruments = new Set(
    user.instruments.map((item) => item.instrument),
  );
  return getAllSongs()
    .filter(
      (song) =>
        user.genres.includes(song.genre) ||
        song.difficulty.some((item) => myInstruments.has(item.part)),
    )
    .slice(0, 3);
}

/**
 * 서버는 팀장·모임장이면 탈퇴를 409 WITHDRAW_BLOCKED_BY_ROLE로 막고 어느 팀·모임인지 message에 담는다
 * (UserWithdrawService.blockedMessage와 같은 문장). 직책이 없으면 null.
 */
function getWithdrawBlockedMessage(): string | null {
  const quoted = (names: string[]) =>
    names.map((name) => `'${name}'`).join(", ");
  const ledTeams = getMyTeams()
    .filter((team) => team.myRole === "LEADER")
    .map((team) => team.name);
  const ownedGroups = getMyGroups()
    .filter((group) => group.myRole === "OWNER")
    .map((group) => group.name);

  const parts: string[] = [];
  if (ledTeams.length > 0) parts.push(`팀 ${quoted(ledTeams)}의 팀장을 위임`);
  if (ownedGroups.length > 0) {
    parts.push(`모임 ${quoted(ownedGroups)}의 모임장을 위임하거나 모임을 해체`);
  }
  return parts.length > 0
    ? `${parts.join("하고, ")}한 뒤 탈퇴할 수 있어요.`
    : null;
}

function MineScreen() {
  const navigate = useNavigate();
  const alert = useAppAlert();
  const me = getMe();
  // PUT /users/me의 isActivityPublic·isRecommendable. 목업 User에는 isRecommendable이 없어 켜 둔 채로 시작한다.
  const [activityPublic, setActivityPublic] = useState(me.isActivityPublic);
  const [recommendable, setRecommendable] = useState(true);

  useScreenHeader(
    <ScreenHeader
      title="마이"
      trailing={
        <TopNavigationButton
          aria-label="알림"
          onClick={() => navigate("/notifications")}
        >
          <IconBell />
        </TopNavigationButton>
      }
      variant="title"
    />,
  );

  const groups = getMyGroups();
  const teams = getMyTeams();
  const performances = getMyUpcomingPerformances();
  const recommendedSongs = getRecommendedSongs(me);
  const bookmarks = getBookmarks();
  const bookmarkCount = (type: "USER" | "TEAM" | "SONG") =>
    bookmarks.filter((bookmark) => bookmark.targetType === type).length;

  // 서버에 로그아웃 API가 없다 — 앱이 들고 있는 토큰만 지우고 로그인 화면으로 보낸다.
  const logout = async () => {
    const result = await alert({
      cancel: "취소",
      confirm: "로그아웃",
      content: "다시 로그인하면 이어서 쓸 수 있어요.",
      title: "로그아웃할까요?",
    });
    if (result === "confirm") navigate("/login", { replace: true });
  };

  const withdraw = async () => {
    const blockedMessage = getWithdrawBlockedMessage();
    if (blockedMessage) {
      await alert({
        confirm: "확인",
        content: blockedMessage,
        title: "아직 탈퇴할 수 없어요",
      });
      return;
    }
    const result = await alert({
      cancel: "취소",
      confirm: "탈퇴하기",
      content: "소속 모임·팀과 활동 기록이 모두 삭제되고 되돌릴 수 없어요.",
      title: "정말 탈퇴할까요?",
    });
    if (result === "confirm") navigate("/login", { replace: true });
  };

  return (
    <div className="scrollbar-hidden flex-1 overflow-y-auto">
      <section className="flex flex-col gap-4 px-5 pt-2 pb-6">
        <ProfileHeader user={me} />
        <Button
          color="assistive"
          fullWidth
          onClick={() => navigate("/mine/profile")}
          size="medium"
          variant="outlined"
        >
          프로필 수정
        </Button>
        <ProfileInfoCard
          sessionAction={
            <TextButton
              color="assistive"
              onClick={() => navigate("/mine/session")}
              size="small"
              trailingContent={<IconChevronRightTightSmall />}
            >
              세션 수정
            </TextButton>
          }
          sessionLabel="내 세션"
          user={me}
        />
      </section>

      <div className="h-3 bg-surface" />
      <ActivitySection
        emptyText="아직 소속된 모임·팀이 없어요"
        links={[
          ...groups.map((group) => ({
            caption: `모임 · ${group.myRole ? GROUP_ROLE_LABEL[group.myRole] : ""}`,
            key: `group-${group.id}`,
            title: group.name,
            to: `/crew/${group.id}`,
          })),
          ...teams.map((team) => ({
            caption: `${TEAM_KIND_LABEL[team.performanceId !== null ? "performance" : "independent"]} · ${team.myRole ? TEAM_ROLE_LABEL[team.myRole] : ""}`,
            key: `team-${team.id}`,
            title: team.name,
            to: `/team/${team.id}`,
          })),
          ...performances.map((performance) => ({
            caption: `공연 · ${formatDate(performance.performedAt)}`,
            key: `show-${performance.id}`,
            title: performance.title,
            to: `/show/${performance.id}`,
          })),
        ]}
        stats={[
          { count: groups.length, label: "소속 모임" },
          { count: teams.length, label: "소속 팀" },
          { count: performances.length, label: "참여 중인 공연" },
        ]}
        title="내 활동"
      />

      {recommendedSongs.length > 0 && (
        <>
          <div className="h-3 bg-surface" />
          <section className="flex flex-col gap-1 px-5 py-6">
            <SectionHeader title="내 취향 추천곡" />
            <List>
              {recommendedSongs.map((song) => (
                <ListCell
                  alignItems="center"
                  disableInteraction
                  key={song.id}
                  leadingContent={
                    <ListCellContent variant="large-icon">
                      <IconMusicMicrophone />
                    </ListCellContent>
                  }
                  textProps={{ caption: song.artist, weight: "bold" }}
                >
                  {song.title}
                </ListCell>
              ))}
            </List>
          </section>
        </>
      )}

      <div className="h-3 bg-surface" />
      <section className="flex flex-col gap-1 px-5 py-6">
        <SectionHeader
          actionLabel="전체보기"
          onAction={() => navigate("/mine/interests")}
          title="저장 목록"
        />
        <List>
          <ListCell
            onClick={rowClick(() => navigate("/mine/interests"))}
            textProps={{
              caption: `유저 ${bookmarkCount("USER")} · 팀 ${bookmarkCount("TEAM")} · 곡 ${bookmarkCount("SONG")}`,
            }}
            trailingContent={<ListCellContent variant="chevron" />}
          >
            저장한 항목
          </ListCell>
        </List>
      </section>

      <div className="h-3 bg-surface" />
      <section className="flex flex-col gap-1 px-5 pt-6 pb-8">
        <SectionHeader title="설정" />
        <List>
          {/* 스위치 행은 스위치만 누른다 — WDS ListCell은 role="switch"를 대신 눌러 주지 않는다. */}
          <ListCell
            alignItems="center"
            disableInteraction
            textProps={{
              caption: "다른 사용자가 내 모임·팀·공연 기록을 볼 수 있어요",
            }}
            trailingContent={
              <ListCellContent variant="switch">
                <Switch
                  aria-label="활동 기록 공개"
                  checked={activityPublic}
                  onCheckedChange={setActivityPublic}
                />
              </ListCellContent>
            }
          >
            활동 기록 공개
          </ListCell>
          <ListCell
            alignItems="center"
            disableInteraction
            textProps={{
              caption: "팀장이 AI 팀원 추천에서 나를 찾을 수 있어요",
            }}
            trailingContent={
              <ListCellContent variant="switch">
                <Switch
                  aria-label="팀원 추천 받기"
                  checked={recommendable}
                  onCheckedChange={setRecommendable}
                />
              </ListCellContent>
            }
          >
            팀원 추천 받기
          </ListCell>
          <ListCell
            onClick={rowClick(() => navigate("/mine/invitations"))}
            textProps={{ caption: "받은 초대와 보낸 가입 신청을 확인해요" }}
            trailingContent={<ListCellContent variant="chevron" />}
          >
            초대 · 신청
          </ListCell>
          <ListCell onClick={rowClick(logout)}>로그아웃</ListCell>
          <ListCell
            onClick={rowClick(withdraw)}
            textProps={{ caption: "계정과 활동 기록이 모두 삭제돼요" }}
          >
            회원 탈퇴
          </ListCell>
        </List>
      </section>
    </div>
  );
}

export default MineScreen;
