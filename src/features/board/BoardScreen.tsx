import {
  Button,
  Category,
  CategoryList,
  CategoryListItem,
  Tab,
  TabList,
  TabListItem,
  TopNavigationButton,
  Typography,
} from "@wanteddev/wds";
import {
  IconBell,
  IconLocation,
  IconMusicMicrophone,
  IconPersons,
  IconPlus,
} from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import MetaItem from "@/components/ui/MetaItem";
import PressableCard from "@/components/ui/PressableCard";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import {
  INSTRUMENT_LABEL,
  INSTRUMENT_OPTIONS,
  RECRUIT_STATUS_LABEL,
  REGION_LABEL,
  TARGET_TYPE_LABEL,
} from "@/lib/domain/labels";
import type {
  Instrument,
  RecruitPost,
  TargetType,
  WantedSlot,
} from "@/lib/domain/types";
import { getPostableTargets, getPosts, getTargetName } from "@/mocks/selectors";

// Figma: 게시판/01 게시판 (101:24187). 게시판 = 모집 공고(GET /recruit-posts).
// - 탭은 서버 공고 대상(targetType) 그대로 모임|팀 두 개다. Figma의 "공연" 탭은 서버에 공연 공고가 없어 뺐다.
//   다른 화면(팀 목록의 "팀 찾기" 등)이 ?type=team으로 바로 팀 탭을 열 수 있게 탭 값을 URL에 둔다.
// - 필터는 서버 목록 필터(status·instrument) 중 Figma 칩 줄에 있는 것 — 전체 · 모집중 · 세션별.
// - 검색 아이콘은 뺐다(서버에 공고 키워드 검색이 없다).

type BoardTab = "group" | "team";
type BoardFilter = "ALL" | "OPEN" | Instrument;

const TAB_TARGET: Record<BoardTab, TargetType> = {
  group: "GROUP",
  team: "TEAM",
};

const FILTERS: { value: BoardFilter; label: string }[] = [
  { label: "전체", value: "ALL" },
  { label: RECRUIT_STATUS_LABEL.OPEN, value: "OPEN" },
  ...INSTRUMENT_OPTIONS.map((instrument) => ({
    label: INSTRUMENT_LABEL[instrument],
    value: instrument,
  })),
];

function formatSlots(slots: WantedSlot[]): string {
  return slots
    .map((slot) => `${INSTRUMENT_LABEL[slot.instrument]} ${slot.count}명`)
    .join(" · ");
}

function matchesFilter(post: RecruitPost, filter: BoardFilter): boolean {
  if (filter === "ALL") return true;
  if (filter === "OPEN") return post.status === "OPEN";
  return post.wantedSlots.some((slot) => slot.instrument === filter);
}

function emptyTitle(tab: BoardTab, filter: BoardFilter): string {
  const target = TARGET_TYPE_LABEL[TAB_TARGET[tab]];
  if (filter === "ALL") return `아직 ${target} 모집 공고가 없어요`;
  if (filter === "OPEN") return `모집중인 ${target} 공고가 없어요`;
  return `${INSTRUMENT_LABEL[filter]} 세션을 찾는 ${target} 공고가 없어요`;
}

function PostCard({ post }: { post: RecruitPost }) {
  const navigate = useNavigate();
  const isClosed = post.status === "CLOSED";
  const targetName = getTargetName(post.targetType, post.targetId);

  return (
    <PressableCard
      dimmed={isClosed}
      onClick={() => navigate(`/board/${post.id}`)}
    >
      <div className="flex items-center gap-1.5">
        <Badge tone={isClosed ? "outline" : "accent"}>
          {RECRUIT_STATUS_LABEL[post.status]}
        </Badge>
        <Typography
          color="semantic.label.assistive"
          variant="caption1"
          weight="bold"
        >
          {TARGET_TYPE_LABEL[post.targetType]} 모집
        </Typography>
      </div>
      <Typography color="semantic.label.strong" variant="body1" weight="bold">
        {post.title}
      </Typography>
      <Typography
        className="line-clamp-2"
        color="semantic.label.alternative"
        variant="label2"
        weight="regular"
      >
        {post.body}
      </Typography>
      <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 pt-0.5">
        <MetaItem icon={<IconLocation />}>{REGION_LABEL[post.region]}</MetaItem>
        {targetName && <MetaItem icon={<IconPersons />}>{targetName}</MetaItem>}
        <MetaItem icon={<IconMusicMicrophone />}>
          {formatSlots(post.wantedSlots)}
        </MetaItem>
      </div>
    </PressableCard>
  );
}

function BoardScreen() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab: BoardTab = searchParams.get("type") === "team" ? "team" : "group";
  const [filter, setFilter] = useState<BoardFilter>("ALL");
  const canWrite = getPostableTargets().length > 0;

  useScreenHeader(
    <ScreenHeader
      title="게시판"
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

  const posts = getPosts().filter(
    (post) =>
      post.targetType === TAB_TARGET[tab] && matchesFilter(post, filter),
  );

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <Tab
        // 탭 전환은 같은 목록의 보기 전환이라 히스토리를 쌓지 않는다.
        onValueChange={(value) =>
          setSearchParams({ type: value }, { replace: true })
        }
        value={tab}
      >
        <TabList resize="fill" size="medium">
          <TabListItem value="group">{TARGET_TYPE_LABEL.GROUP}</TabListItem>
          <TabListItem value="team">{TARGET_TYPE_LABEL.TEAM}</TabListItem>
        </TabList>
      </Tab>

      <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto">
        <div className="pt-3 pb-1">
          <Category
            onValueChange={(value) => setFilter(value as BoardFilter)}
            value={filter}
          >
            <CategoryList horizontalPadding size="small">
              {FILTERS.map((item) => (
                <CategoryListItem key={item.value} value={item.value}>
                  {item.label}
                </CategoryListItem>
              ))}
            </CategoryList>
          </Category>
        </div>

        {posts.length === 0 ? (
          <div className="flex flex-1 flex-col justify-center pb-24">
            <EmptyState
              description={
                filter === "ALL"
                  ? "새 공고가 올라오면 여기에 보여요"
                  : "다른 조건으로 바꿔 보세요"
              }
              title={emptyTitle(tab, filter)}
            />
          </div>
        ) : (
          // 글쓰기 버튼이 마지막 카드를 가리지 않게 아래 여백을 넉넉히 둔다.
          <div className="flex flex-col gap-3 px-5 pt-3 pb-24">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* 공고는 현재 팀장·모임장만 쓸 수 있어서(서버 규칙) 쓸 대상이 없으면 버튼을 숨긴다. */}
      {canWrite && (
        <div className="absolute right-5 bottom-5">
          <Button
            className="shadow-neon-md"
            color="primary"
            leadingContent={<IconPlus />}
            onClick={() => navigate("/board/write")}
            size="medium"
            variant="solid"
          >
            글쓰기
          </Button>
        </div>
      )}
    </div>
  );
}

export default BoardScreen;
