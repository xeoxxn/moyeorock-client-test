import {
  Avatar,
  List,
  ListCell,
  ListCellContent,
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
  IconMusicMicrophone,
  IconPersons,
} from "@wanteddev/wds-icon";
import type { ReactNode } from "react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import EmptyState from "@/components/ui/EmptyState";
import { innerClick, rowClick } from "@/components/ui/listCellEvents";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import InviteSheet from "@/features/join/InviteSheet";
import CaptionLines from "@/features/mine/components/CaptionLines";
import {
  formatInstruments,
  GENRE_LABEL,
  REGION_LABEL,
  TEAM_KIND_LABEL,
} from "@/lib/domain/labels";
import type { Bookmark, BookmarkTargetType, User } from "@/lib/domain/types";
import {
  getBookmarks,
  getPostableTargets,
  getSong,
  getTeam,
  getUser,
} from "@/mocks/selectors";

// Figma: 마이/04 저장 목록 — 서버 북마크 대상은 유저·팀·곡이다(공고·모임은 저장할 수 없다). 탭은
// ?tab=user|team|song에 묶어서 다른 화면에서 특정 탭으로 바로 열 수 있게 하고, 탭을 바꿀 땐
// replace로 히스토리를 쌓지 않는다.

type InterestTab = "user" | "team" | "song";

const TAB_TARGET: Record<InterestTab, BookmarkTargetType> = {
  song: "SONG",
  team: "TEAM",
  user: "USER",
};

const TAB_LABEL: Record<InterestTab, string> = {
  song: "곡",
  team: "팀",
  user: "유저",
};

const COUNT_TEXT: Record<InterestTab, (count: number) => string> = {
  song: (count) => `저장한 곡 ${count}개`,
  team: (count) => `저장한 팀 ${count}개`,
  user: (count) => `저장한 유저 ${count}명`,
};

const EMPTY_TITLE: Record<InterestTab, string> = {
  song: "아직 저장한 곡이 없어요",
  team: "아직 저장한 팀이 없어요",
  user: "아직 저장한 유저가 없어요",
};

function toTab(value: string | null): InterestTab {
  return value === "team" || value === "song" ? value : "user";
}

function MineInterestsScreen() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = toTab(searchParams.get("tab"));
  const bookmarks = getBookmarks();
  // 저장 취소한 항목은 바로 지우지 않고 빈 아이콘으로 남겨 둔다 — 잘못 눌렀으면 다시 저장할 수 있게.
  const [unsavedIds, setUnsavedIds] = useState<Set<number>>(new Set());
  const [invitee, setInvitee] = useState<User | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  // 초대는 팀장(내 팀)·모임장(내 모임)만 보낼 수 있다.
  const canInvite = getPostableTargets().length > 0;

  useScreenHeader(<ScreenHeader title="저장 목록" />);

  const items = bookmarks.filter(
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

  const deletedRow = (bookmark: Bookmark) => (
    <ListCell
      alignItems="center"
      disableInteraction
      key={bookmark.id}
      onClick={rowClick()}
      textProps={{ color: "semantic.label.assistive" }}
      trailingContent={
        <ListCellContent>{saveToggle(bookmark)}</ListCellContent>
      }
    >
      삭제된 항목
    </ListCell>
  );

  const renderRow = (bookmark: Bookmark): ReactNode => {
    if (bookmark.targetType === "USER") {
      const user = getUser(bookmark.targetId);
      if (!user) return deletedRow(bookmark);
      return (
        <ListCell
          alignItems="center"
          key={bookmark.id}
          leadingContent={
            <ListCellContent variant="avatar">
              <Avatar size="large" variant="person" />
            </ListCellContent>
          }
          onClick={rowClick(() => navigate(`/users/${user.id}`))}
          textProps={{
            caption: (
              <CaptionLines
                lines={[
                  formatInstruments(user.instruments, true),
                  [
                    REGION_LABEL[user.region],
                    user.genres.map((genre) => GENRE_LABEL[genre]).join(", "),
                  ]
                    .filter(Boolean)
                    .join(" · "),
                ]}
              />
            ),
            weight: "bold",
          }}
          trailingContent={
            <ListCellContent>
              <div className="flex items-center gap-3">
                {canInvite && (
                  <TextButton
                    color="primary"
                    onClick={innerClick(() => {
                      setInvitee(user);
                      setInviteOpen(true);
                    })}
                    size="small"
                  >
                    팀 초대
                  </TextButton>
                )}
                {saveToggle(bookmark)}
              </div>
            </ListCellContent>
          }
        >
          {user.nickname}
        </ListCell>
      );
    }

    if (bookmark.targetType === "TEAM") {
      const team = getTeam(bookmark.targetId);
      if (!team) return deletedRow(bookmark);
      return (
        <ListCell
          alignItems="center"
          key={bookmark.id}
          leadingContent={
            <ListCellContent variant="large-icon">
              <IconPersons />
            </ListCellContent>
          }
          onClick={rowClick(() => navigate(`/team/${team.id}`))}
          textProps={{
            caption: (
              <CaptionLines
                lines={[
                  `${TEAM_KIND_LABEL[team.performanceId !== null ? "performance" : "independent"]} · 멤버 ${team.members.length}명`,
                  [
                    REGION_LABEL[team.region],
                    team.genres.map((genre) => GENRE_LABEL[genre]).join(", "),
                  ]
                    .filter(Boolean)
                    .join(" · "),
                ]}
              />
            ),
            weight: "bold",
          }}
          trailingContent={
            <ListCellContent>{saveToggle(bookmark)}</ListCellContent>
          }
        >
          {team.name}
        </ListCell>
      );
    }

    const song = getSong(bookmark.targetId);
    if (!song) return deletedRow(bookmark);
    // 곡은 상세 화면이 없어 행 자체는 누를 곳이 없다 — 저장 아이콘만 누른다.
    return (
      <ListCell
        alignItems="center"
        disableInteraction
        key={bookmark.id}
        leadingContent={
          <ListCellContent variant="large-icon">
            <IconMusicMicrophone />
          </ListCellContent>
        }
        onClick={rowClick()}
        textProps={{ caption: song.artist, weight: "bold" }}
        trailingContent={
          <ListCellContent>{saveToggle(bookmark)}</ListCellContent>
        }
      >
        {song.title}
      </ListCell>
    );
  };

  return (
    <>
      <Tab
        onValueChange={(next) =>
          setSearchParams({ tab: next }, { replace: true })
        }
        value={tab}
      >
        <TabList resize="fill" size="medium">
          {(Object.keys(TAB_LABEL) as InterestTab[]).map((value) => (
            <TabListItem key={value} value={value}>
              {TAB_LABEL[value]}
            </TabListItem>
          ))}
        </TabList>
      </Tab>
      <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-8">
        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              description="프로필이나 목록에서 저장 아이콘을 누르면 여기에 모여요"
              title={EMPTY_TITLE[tab]}
            />
          </div>
        ) : (
          <>
            <Typography
              color="semantic.label.alternative"
              variant="label2"
              weight="bold"
            >
              {COUNT_TEXT[tab](items.length)}
            </Typography>
            <List>{items.map(renderRow)}</List>
          </>
        )}
      </div>
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
