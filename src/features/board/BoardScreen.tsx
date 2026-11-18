import { TextButton } from "@wanteddev/wds";
import { IconChevronDown, IconPlus } from "@wanteddev/wds-icon";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import PostRow from "@/components/list/PostRow";
import EmptyState from "@/components/ui/EmptyState";
import HeaderIconButton from "@/components/ui/HeaderIconButton";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Status from "@/components/ui/Status";
import {
  useScreenBackdrop,
  useScreenHeader,
} from "@/components/ui/useScreenHeader";
import {
  formatSlots,
  getWritableTargets,
  postTone,
} from "@/features/board/boardHelpers";
import BoardFilterSheet, {
  type BoardFilter,
  formatBoardFilter,
} from "@/features/board/components/BoardFilterSheet";
import { formatRelative } from "@/lib/domain/format";
import {
  RECRUIT_STATUS_LABEL,
  REGION_LABEL,
  TARGET_TYPE_LABEL,
} from "@/lib/domain/labels";
import type { RecruitPost, TargetType } from "@/lib/domain/types";
import { getMe, getPosts, getTargetName } from "@/mocks/selectors";

// Figma 06 게시판 = 모집 공고(GET /recruit-post). 서버 공고 대상이 모임·팀 둘뿐이라 머리의 글자 탭도
// "모임 | 팀"이다(?type=group|team — 다른 화면이 팀 탭을 바로 열 수 있게 URL에 둔다).
// - 필터 줄 "서울 · 모든 세션 ⌄"은 서버 목록 쿼리(region · instrument)를 시트로 고른다. 처음엔 내 지역.
// - 모집 완료(CLOSED) 글은 흐리게 아래로(getPosts가 정렬). 키워드 검색은 서버에 없어 두지 않는다.
// - + 는 모집글을 쓸 수 있는 사람(모임장·독립 팀 팀장)에게만 보인다.

type BoardTab = "group" | "team";

const TAB_TARGET: Record<BoardTab, TargetType> = {
  group: "GROUP",
  team: "TEAM",
};

const TABS = [
  { label: TARGET_TYPE_LABEL.GROUP, value: "group" },
  { label: TARGET_TYPE_LABEL.TEAM, value: "team" },
];

function matchesFilter(post: RecruitPost, filter: BoardFilter): boolean {
  if (filter.region !== "ALL" && post.region !== filter.region) return false;
  if (
    filter.instrument &&
    !post.wantedSlots.some((slot) => slot.instrument === filter.instrument)
  ) {
    return false;
  }
  return true;
}

function postMeta(post: RecruitPost): string {
  return [
    formatSlots(post.wantedSlots),
    getTargetName(post.targetType, post.targetId),
    REGION_LABEL[post.region],
    formatRelative(post.createdAt),
  ]
    .filter(Boolean)
    .join(" · ");
}

function BoardScreen() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab: BoardTab = searchParams.get("type") === "team" ? "team" : "group";
  const canWrite = getWritableTargets().length > 0;

  const [defaultFilter] = useState<BoardFilter>(() => ({
    instrument: null,
    region: getMe().region,
  }));
  const [filter, setFilter] = useState(defaultFilter);
  const [draft, setDraft] = useState(defaultFilter);
  const [filterOpen, setFilterOpen] = useState(false);

  useScreenHeader(
    useMemo(
      () => (
        <ScreenHeader
          onValueChange={(value) =>
            // 탭 전환은 같은 목록의 보기 전환이라 히스토리를 쌓지 않는다.
            setSearchParams({ type: value }, { replace: true })
          }
          tabs={TABS}
          trailing={
            canWrite ? (
              <HeaderIconButton
                icon={<IconPlus />}
                label="모집글 쓰기"
                onClick={() => navigate("/board/write")}
              />
            ) : undefined
          }
          value={tab}
          variant="tabs"
        />
      ),
      [canWrite, navigate, setSearchParams, tab],
    ),
  );
  useScreenBackdrop("stage");

  const tabPosts = getPosts().filter(
    (post) => post.targetType === TAB_TARGET[tab],
  );
  const posts = tabPosts.filter((post) => matchesFilter(post, filter));

  const openFilter = () => {
    setDraft(filter);
    setFilterOpen(true);
  };

  return (
    <>
      <ScreenBody>
        <div className="px-5 pb-1">
          <TextButton
            color="assistive"
            onClick={openFilter}
            size="small"
            // Figma 필터 줄은 보조 글자 굵기(Regular)라 WDS TextButton의 bold만 덮는다.
            sx={{ "& > span": { fontWeight: 400 } }}
            trailingContent={<IconChevronDown />}
          >
            {formatBoardFilter(filter)}
          </TextButton>
        </div>

        {posts.length === 0 ? (
          <div className="pt-16">
            <EmptyState
              description={
                tabPosts.length === 0
                  ? "새 모집글이 올라오면 여기에 보여요"
                  : "지역이나 세션을 바꿔 보세요"
              }
              title={
                tabPosts.length === 0
                  ? `아직 ${TARGET_TYPE_LABEL[TAB_TARGET[tab]]} 모집글이 없어요`
                  : "조건에 맞는 모집글이 없어요"
              }
            />
          </div>
        ) : (
          posts.map((post, index) => {
            const closed = post.status === "CLOSED";
            return (
              <PostRow
                dimmed={closed}
                divider={index < posts.length - 1}
                key={post.id}
                meta={postMeta(post)}
                onClick={() => navigate(`/board/${post.id}`)}
                status={
                  <Status tone={closed ? "neutral" : "progress"}>
                    {RECRUIT_STATUS_LABEL[post.status]}
                  </Status>
                }
                title={post.title}
                tone={postTone(post)}
              />
            );
          })
        )}
      </ScreenBody>

      <BoardFilterSheet
        draft={draft}
        onApply={() => setFilter(draft)}
        onDraftChange={setDraft}
        onOpenChange={setFilterOpen}
        onReset={() => setDraft(defaultFilter)}
        open={filterOpen}
      />
    </>
  );
}

export default BoardScreen;
