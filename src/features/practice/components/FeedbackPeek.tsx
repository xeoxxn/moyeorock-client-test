import { Typography, WithInteraction } from "@wanteddev/wds";
import { IconChevronUp } from "@wanteddev/wds-icon";

import FeedbackLine from "@/components/ui/FeedbackLine";
import {
  feedbackSentence,
  formatSpan,
} from "@/features/practice/practiceHelpers";
import type { PracticeFeedback } from "@/lib/domain/types";

// Figma 05의 바닥 패널 Feedback Peek(595:26300) — 시트 손잡이 + "구간 피드백 N곳 ⌃" + 지금 구간 한 줄.
// 18 구간 피드백 시트의 접힌 모습이라 누르면 시트가 열린다. 한 줄은 재생 위치를 따라간다(처음엔 첫 구간).
// 다르게 연주한 곳이 없으면 녹음 전체를 "잘 맞았어요"로 보여 준다.
interface FeedbackPeekProps {
  /** 시작 순으로 정렬한 피드백 */
  feedbacks: PracticeFeedback[];
  currentIndex: number;
  durationSec: number;
  onOpen: () => void;
}

function FeedbackPeek({
  currentIndex,
  durationSec,
  feedbacks,
  onOpen,
}: FeedbackPeekProps) {
  const current = feedbacks[currentIndex];
  return (
    <div className="shrink-0 overflow-hidden rounded-t-2xl bg-surface pb-safe-bottom">
      <WithInteraction variant="light">
        <button
          aria-haspopup="dialog"
          className="flex w-full flex-col gap-2.5 px-5 pb-5 text-left"
          onClick={onOpen}
          type="button"
        >
          <span aria-hidden className="flex w-full justify-center py-2">
            <span className="h-1 w-9 rounded-full bg-label-assistive/50" />
          </span>
          <span className="flex w-full items-center justify-between gap-3">
            <span className="flex items-center gap-1.5">
              <Typography
                as="span"
                color="semantic.label.strong"
                variant="body1"
                weight="bold"
              >
                구간 피드백
              </Typography>
              <Typography
                as="span"
                color="semantic.label.assistive"
                variant="label2"
              >
                {feedbacks.length}곳
              </Typography>
            </span>
            <IconChevronUp className="size-5 shrink-0 text-label-strong" />
          </span>
          {current ? (
            <FeedbackLine
              current
              text={feedbackSentence(current.content)}
              time={formatSpan(current.startSec, current.endSec)}
            />
          ) : (
            <FeedbackLine
              current
              ok
              text=""
              time={formatSpan(0, Math.floor(durationSec))}
            />
          )}
        </button>
      </WithInteraction>
    </div>
  );
}

export default FeedbackPeek;
