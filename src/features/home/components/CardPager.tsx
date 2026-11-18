import { PaginationDots } from "@wanteddev/wds";
import {
  Children,
  isValidElement,
  type ReactNode,
  useRef,
  useState,
} from "react";

// Figma 01 홈 '내 팀'(411:11056) + 페이지 점(587:23691) — 카드를 화면 폭(좌우 여백 20)으로 한 장씩
// 넘긴다. 카드 사이도 20이라 옆 카드가 비치지 않는다. 손가락을 세게 튕겨도 한 장씩만 넘어가게
// snap-always를 건다. 아래 점은 지금 카드를 따라가고, 점을 누르면 그 카드로 넘어간다. 한 장이면 점을 숨긴다.

/**
 * WDS PaginationDots는 같은 크기 동그라미(8·10)라 Figma 모양으로 sx만 덮는다 — 지금 점 16×6 알약
 * (text/primary), 나머지 6×6(text/tertiary), 사이 6. 마우스를 올리면 WDS가 점을 같은 크기로 되돌리는
 * 규칙(:hover)이 있어서, 지금 점 규칙을 같은 선택자 세기로 뒤에 둔다.
 */
const DOTS_SX = {
  "--wds-pagination-dot-size": "0.375rem",
  height: "0.375rem",
  "& [data-role='pagination-dot-button']": {
    backgroundColor: "var(--color-label-assistive)",
  },
  "& [data-role='pagination-dot-button'][aria-selected='true']": {
    backgroundColor: "var(--color-label-strong)",
    width: "1rem",
  },
};

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface CardPagerProps {
  /** 점 묶음 이름(스크린 리더) */
  label: string;
  children: ReactNode;
}

function CardPager({ children, label }: CardPagerProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  // toArray가 카드마다 원래 key를 붙여 주니 그 key로 칸을 만든다.
  const cards = Children.toArray(children).filter(isValidElement);
  const count = cards.length;

  // 한 장 = 카드 폭 + 사이 20이고 처음과 끝 카드가 양 끝에 붙으니, 넘긴 거리를 끝까지의 거리로 나누면
  // 몇 번째 장인지 나온다(카드 폭을 따로 재지 않는다).
  const syncPage = () => {
    const scroller = scrollerRef.current;
    if (!scroller || count < 2) return;
    const max = scroller.scrollWidth - scroller.clientWidth;
    if (max <= 0) return;
    setPage(Math.round((scroller.scrollLeft / max) * (count - 1)));
  };

  const scrollToPage = (index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller || count < 2) return;
    const max = scroller.scrollWidth - scroller.clientWidth;
    scroller.scrollTo({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      left: (max / (count - 1)) * index,
    });
  };

  return (
    <>
      <div
        className="scrollbar-hidden flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5"
        onScroll={syncPage}
        ref={scrollerRef}
      >
        {cards.map((card) => (
          <div
            className="flex w-full shrink-0 snap-start snap-always"
            key={card.key}
          >
            {card}
          </div>
        ))}
      </div>
      {count > 1 && (
        <div className="flex justify-center pt-3">
          <PaginationDots
            aria-label={label}
            currentPage={page + 1}
            maxDotCount={count}
            onClickDot={(next) => scrollToPage(next - 1)}
            size="small"
            sx={DOTS_SX}
            totalPages={count}
          />
        </div>
      )}
    </>
  );
}

export default CardPager;
