// 가로 스크롤 카드(홈 "함께할 멤버를 찾고 있어요" 등) 아래의 페이지 인디케이터.
// 활성 점만 알약 모양으로 늘어난다.
interface CarouselDotsProps {
  count: number;
  active: number;
  onSelect: (index: number) => void;
  /** 스크린 리더용 항목 이름 — "2번째 모집 보기"처럼 읽힌다. */
  itemLabel: string;
}

function CarouselDots({
  active,
  count,
  itemLabel,
  onSelect,
}: CarouselDotsProps) {
  return (
    <div className="flex items-center justify-center gap-1.5 pt-1">
      {Array.from({ length: count }, (_, i) => (
        <button
          aria-label={`${i + 1}번째 ${itemLabel} 보기`}
          className={
            i === active
              ? "h-1.5 w-4 rounded-full bg-accent shadow-neon-sm transition-all duration-300"
              : "size-1.5 rounded-full bg-white/20 transition-all duration-300"
          }
          // 점은 순서 자체가 정체성이다.
          key={`dot-${i}`}
          onClick={() => onSelect(i)}
          type="button"
        />
      ))}
    </div>
  );
}

export default CarouselDots;
