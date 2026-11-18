import { Button, ToggleIcon, useToast } from "@wanteddev/wds";
import { IconBookmark, IconBookmarkFill } from "@wanteddev/wds-icon";
import { type ReactNode, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import CoverRow from "@/components/list/CoverRow";
import MediaRow from "@/components/list/MediaRow";
import PersonRow from "@/components/list/PersonRow";
import { coverToneOf } from "@/components/music/Cover";
import EmptyState from "@/components/ui/EmptyState";
import HeroTabs from "@/components/ui/HeroTabs";
import { innerClick } from "@/components/ui/listCellEvents";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import InviteSheet from "@/features/join/InviteSheet";
import { formatProfileMeta } from "@/features/mine/components/ProfileSummary";
import { REGION_LABEL, TEAM_KIND_LABEL } from "@/lib/domain/labels";
import type { Bookmark, BookmarkTargetType, User } from "@/lib/domain/types";
import {
  getBookmarks,
  getPostableTargets,
  getSong,
  getTeam,
  getUser,
  isPerformanceTeam,
} from "@/mocks/selectors";

// 저장 목록(/mine/interests) — 마이(Figma 07) 통계의 팔로잉·저장한 곡에서 들어온다. Figma 화면은 없다.
// 서버 북마크 대상은 유저·팀·곡이고(공고·모임은 저장할 수 없다) 유저 북마크가 화면의 "팔로잉"이다.
// 탭은 ?tab=user|team|song에 묶어 다른 화면에서 특정 탭으로 바로 열 수 있게 하고, 탭을 바꿀 땐
// replace로 히스토리를 쌓지 않는다(HeroTabs).

type InterestTab = "user" | "team" | "song";

const TAB_TARGET: Record<InterestTab, BookmarkTargetType> = {
  song: "SONG",
  team: "TEAM",
  user: "USER",
};

const TABS = [
  { label: "팔로잉", path: "/mine/interests?tab=user", value: "user" },
  { label: "팀", path: "/mine/interests?tab=team", value: "team" },
  { label: "곡", path: "/mine/interests?tab=song", value: "song" },
];

const EMPTY_TITLE: Record<InterestTab, string> = {
  song: "아직 저장한 곡이 없어요",
  team: "아직 저장한 팀이 없어요",
  user: "아직 팔로우한 멤버가 없어요",
};

function toTab(value: string | null): InterestTab {
  return value === "team" || value === "song" ? value : "user";
}

function MineInterestsScreen() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const tab = toTab(searchParams.get("tab"));
  // 저장 취소한 항목은 바로 지우지 않고 빈 아이콘으로 남겨 둔다 — 잘못 눌렀으면 다시 저장할 수 있게.
  const [unsavedIds, setUnsavedIds] = useState<Set<number>>(new Set());
  const [invitee, setInvitee] = useState<User | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  // 초대는 팀장(내 팀)·모임장(내 모임)만 보낼 수 있다.
  const canInvite = getPostableTargets().length > 0;

  useScreenHeader(useMemo(() => <ScreenHeader title="저장 목록" />, []));

  const items = getBookmarks().filter(
    (bookmark) => bookmark.targetType === TAB_TARGET[tab],
  );

  const toggleSaved = (bookmark: Bookmark, next: boolean) => {
    setUnsavedIds((prev) => {
      const updated = new Set(prev);
      if (next) updated.delete(bookmark.id);
      else updated.add(bookmark.id);
      return updated;
    });
    toast({
      content: next ? "다시 저장했어요" : "저장을 취소했어요",
      variant: "positive",
    });
  };

  const saveToggle = (bookmark: Bookmark) => {
    const saved = !unsavedIds.has(bookmark.id);
    return (
      <ToggleIcon
        active={saved}
        aria-label={saved ? "저장 취소" : "다시 저장"}
        onActiveChange={(next) => toggleSaved(bookmark, next)}
        onClick={innerClick()}
      >
        {saved ? <IconBookmarkFill /> : <IconBookmark />}
      </ToggleIcon>
    );
  };

  // 저장해 둔 대상이 지워졌을 때 — 저장 취소만 할 수 있게 남긴다.
  const deletedRow = (bookmark: Bookmark) => (
    <MediaRow
      key={bookmark.id}
      meta="삭제됐거나 볼 수 없는 항목이에요"
      title="삭제된 항목"
      trailing={saveToggle(bookmark)}
    />
  );

  const renderRow = (bookmark: Bookmark): ReactNode => {
    if (bookmark.targetType === "USER") {
      const user = getUser(bookmark.targetId);
      if (!user) return deletedRow(bookmark);
      return (
        <PersonRow
          key={bookmark.id}
          meta={formatProfileMeta(user)}
          name={user.nickname}
          onClick={() => navigate(`/users/${user.id}`)}
          profileImage={user.profileImage}
          trailing={
            <span className="flex items-center gap-2">
              {canInvite && (
                <Button
                  color="primary"
                  onClick={innerClick(() => {
                    setInvitee(user);
                    setInviteOpen(true);
                  })}
                  size="small"
                  variant="solid"
                >
                  초대
                </Button>
              )}
              {saveToggle(bookmark)}
            </span>
          }
        />
      );
    }

    if (bookmark.targetType === "TEAM") {
      const team = getTeam(bookmark.targetId);
      if (!team) return deletedRow(bookmark);
      return (
        <CoverRow
          key={bookmark.id}
          meta={[
            TEAM_KIND_LABEL[
              isPerformanceTeam(team) ? "performance" : "independent"
            ],
            `멤버 ${team.members.length}명`,
            REGION_LABEL[team.region],
          ].join(" · ")}
          onClick={() => navigate(`/team/${team.id}`)}
          title={team.name}
          tone={coverToneOf("team", team.id)}
          trailing={saveToggle(bookmark)}
        />
      );
    }

    // 곡은 상세 화면이 없어 행 자체는 누를 곳이 없다 — 저장 아이콘만 누른다.
    const song = getSong(bookmark.targetId);
    if (!song) return deletedRow(bookmark);
    return (
      <CoverRow
        key={bookmark.id}
        meta={song.artist}
        title={song.title}
        tone={coverToneOf("song", song.id)}
        trailing={saveToggle(bookmark)}
      />
    );
  };

  return (
    <>
      <HeroTabs tabs={TABS} value={tab} />
      <ScreenBody className="flex flex-col pt-2">
        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              description="프로필이나 목록에서 저장하면 여기에 모여요"
              title={EMPTY_TITLE[tab]}
            />
          </div>
        ) : (
          items.map(renderRow)
        )}
      </ScreenBody>
      {invitee && (
        <InviteSheet
          invitee={invitee}
          key={invitee.id}
          onOpenChange={setInviteOpen}
          open={inviteOpen}
        />
      )}
    </>
  );
}

export default MineInterestsScreen;
