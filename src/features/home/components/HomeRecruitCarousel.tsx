import { PaginationDots, Typography } from "@wanteddev/wds";
import { IconLocation, IconPersons } from "@wanteddev/wds-icon";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Badge from "@/components/ui/Badge";
import MetaItem from "@/components/ui/MetaItem";
import PressableCard from "@/components/ui/PressableCard";
import {
  INSTRUMENT_LABEL,
  REGION_LABEL,
  TARGET_TYPE_LABEL,
} from "@/lib/domain/labels";
import type { RecruitPost } from "@/lib/domain/types";
import { getTargetName } from "@/mocks/selectors";

function wantedLabel(post: RecruitPost): string {
  return post.wantedSlots
    .map((slot) => `${INSTRUMENT_LABEL[slot.instrument]} ${slot.count}명`)
    .join(" · ");
}

interface HomeRecruitCarouselProps {
  posts: RecruitPost[];
}

// 홈 "함께할 멤버를 찾고 있어요" — 모집 중 공고(대시보드 openRecruitPosts)를 가로 스냅 캐러셀로 보여 준다.
// 카드 폭을 5/6로 둬서 다음 카드가 살짝 보이게 했다(옆으로 넘길 수 있다는 단서). 페이지 점은 WDS
// PaginationDots — 1부터 센다.
function HomeRecruitCarousel({ posts }: HomeRecruitCarouselProps) {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);

  // 첫 카드의 offsetLeft가 곧 컨테이너 안쪽 여백이라, 그만큼 빼야 "스냅된 카드"와 스크롤 위치가 맞는다.
  const cardOffsets = () => {
    const el = scrollRef.current;
    if (!el) return [];
    const cards = Array.from(el.children) as HTMLElement[];
    const base = cards[0]?.offsetLeft ?? 0;
    return cards.map((card) => card.offsetLeft - base);
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const offsets = cardOffsets();
    let closest = 0;
    offsets.forEach((offset, index) => {
      if (
        Math.abs(offset - el.scrollLeft) <
        Math.abs(offsets[closest] - el.scrollLeft)
      ) {
        closest = index;
      }
    });
    setPage(closest + 1);
  };

  const scrollToPage = (next: number) => {
    const offset = cardOffsets()[next - 1];
    if (offset === undefined) return;
    scrollRef.current?.scrollTo({ behavior: "smooth", left: offset });
  };

  return (
    <>
      <div
        className="scrollbar-hidden relative -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5"
        onScroll={handleScroll}
        ref={scrollRef}
      >
        {posts.map((post) => {
          const targetName = getTargetName(post.targetType, post.targetId);
          return (
            <div className="flex w-5/6 shrink-0 snap-start" key={post.id}>
              <PressableCard onClick={() => navigate(`/board/${post.id}`)}>
                <div className="flex">
                  <Badge>{`${TARGET_TYPE_LABEL[post.targetType]} 모집`}</Badge>
                </div>
                <Typography
                  className="line-clamp-2"
                  color="semantic.label.strong"
                  variant="body2"
                  weight="bold"
                >
                  {post.title}
                </Typography>
                <Typography
                  color="semantic.primary.normal"
                  variant="caption1"
                  weight="bold"
                >
                  {wantedLabel(post)}
                </Typography>
                <div className="mt-auto flex min-w-0 items-center gap-3">
                  <MetaItem icon={<IconLocation />}>
                    {REGION_LABEL[post.region]}
                  </MetaItem>
                  {targetName && (
                    <MetaItem icon={<IconPersons />}>{targetName}</MetaItem>
                  )}
                </div>
              </PressableCard>
            </div>
          );
        })}
      </div>
      {posts.length > 1 && (
        <div className="flex justify-center">
          <PaginationDots
            currentPage={page}
            onClickDot={scrollToPage}
            size="small"
            totalPages={posts.length}
          />
        </div>
      )}
    </>
  );
}

export default HomeRecruitCarousel;
