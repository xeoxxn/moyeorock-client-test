import { Typography } from "@wanteddev/wds";
import { cn } from "@/lib/cn";

// Figma "Feedback/Line"(553:24381) — 구간 피드백 한 줄: 시간(12) + 문장. 가사 화면처럼 지금 구간만
// 밝게(1), 나머지는 흐리게(0.42) 둔다. 잘 맞은 구간은 문장 대신 ♪.
// 문장은 05 결과 화면에선 항목 이름과 같은 16 Bold, 18 가사 보기 시트에서만 예외로 22 Bold(lyrics).
interface FeedbackLineProps {
  time: string;
  text: string;
  current?: boolean;
  /** 잘 맞은 구간 — 문장 대신 ♪ */
  ok?: boolean;
  /** 18 가사 보기 시트 — 문장을 22로 크게 */
  lyrics?: boolean;
  onClick?: () => void;
}

function FeedbackLine({
  current = false,
  lyrics = false,
  ok = false,
  onClick,
  text,
  time,
}: FeedbackLineProps) {
  const Element = onClick ? "button" : "div";
  return (
    <Element
      className={cn(
        "flex w-full flex-col items-start gap-1 text-left transition-opacity",
        current ? "opacity-100" : "opacity-40",
      )}
      onClick={onClick}
      type={onClick ? "button" : undefined}
    >
      <Typography
        as="span"
        color="semantic.label.alternative"
        variant="caption1"
        weight="medium"
      >
        {ok ? `${time} · 잘 맞았어요` : time}
      </Typography>
      <Typography
        as="span"
        color="semantic.label.strong"
        variant={lyrics ? "heading1" : "body1"}
        weight="bold"
      >
        {ok ? "♪" : text}
      </Typography>
    </Element>
  );
}

export default FeedbackLine;
