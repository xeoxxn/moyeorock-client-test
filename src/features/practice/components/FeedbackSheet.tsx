import { Button } from "@wanteddev/wds";

import BottomSheet from "@/components/ui/BottomSheet";
import FeedbackLine from "@/components/ui/FeedbackLine";
import {
  buildTimeline,
  feedbackSentence,
  formatSpan,
} from "@/features/practice/practiceHelpers";
import type { PracticeRecording } from "@/lib/domain/types";

// Figma 18 구간 피드백(459:18411) — 가사 화면처럼 녹음 전체를 "잘 맞았어요" 구간과 피드백 줄로 늘어놓고
// 지금 위치의 줄만 밝게 둔다(지나간 마지막 피드백, 아직 없으면 맨 앞 줄). 줄을 누르면 그 자리로 옮긴다.
// 피드백 줄은 구간을 시간 칸에 두고 문장은 "원곡과 다르게 연주했어요"만(서버 문장이 구간을 되풀이해서).
// Figma의 "팀에 공유"는 서버에 공유 API가 없어 두지 않았다 — 버튼은 같은 곡·파트로 "새 녹음 올리기" 하나.
interface FeedbackSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recording: PracticeRecording;
  positionSec: number;
  onSeek: (sec: number) => void;
  onRerecord: () => void;
}

function FeedbackSheet({
  onOpenChange,
  onRerecord,
  onSeek,
  open,
  positionSec,
  recording,
}: FeedbackSheetProps) {
  const items = buildTimeline(recording);
  let currentIndex = 0;
  items.forEach((item, index) => {
    if (item.kind === "feedback" && item.startSec <= positionSec) {
      currentIndex = index;
    }
  });

  return (
    <BottomSheet
      closable
      footer={
        <div className="flex justify-center px-5 pt-2 pb-5">
          <Button
            color="assistive"
            onClick={onRerecord}
            size="medium"
            variant="solid"
          >
            새 녹음 올리기
          </Button>
        </div>
      }
      onOpenChange={onOpenChange}
      open={open}
      title="구간 피드백"
    >
      <div className="flex flex-col gap-6.5 py-2">
        {items.map((item, index) => (
          <FeedbackLine
            current={index === currentIndex}
            key={`${item.kind}-${item.startSec}`}
            lyrics
            ok={item.kind === "ok"}
            onClick={() => onSeek(item.startSec)}
            text={
              item.kind === "feedback" ? feedbackSentence(item.content) : ""
            }
            time={formatSpan(item.startSec, item.endSec)}
          />
        ))}
      </div>
    </BottomSheet>
  );
}

export default FeedbackSheet;
