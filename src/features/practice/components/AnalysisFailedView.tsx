import { ActionArea, ActionAreaButton, Typography } from "@wanteddev/wds";

import { BrandSymbol } from "@/components/music/Brand";
import ScreenBody from "@/components/ui/ScreenBody";
import AnalysisHero from "@/features/practice/components/AnalysisHero";
import { analysisMeta } from "@/features/practice/practiceHelpers";
import type { PracticeRecording } from "@/lib/domain/types";

// Figma 30 연습 분석 실패(593:26342) — FAILED인 상세가 그리는 모습. 회색 피크 + 서버가 준 실패 사유
// (failureReason, 화면에 그대로 보여 주는 문장) + "다른 녹음"(같은 곡·파트로 11) · "다시 분석"(retry → 29).
interface AnalysisFailedViewProps {
  recording: PracticeRecording;
  onRerecord: () => void;
  onRetry: () => void;
}

function AnalysisFailedView({
  onRerecord,
  onRetry,
  recording,
}: AnalysisFailedViewProps) {
  return (
    <>
      <ScreenBody className="flex flex-col gap-8 px-5 pt-14">
        <AnalysisHero
          icon={<BrandSymbol className="h-24 w-22 text-label-assistive" />}
          meta={analysisMeta(recording)}
          title="분석하지 못했어요"
        />
        {recording.failureReason && (
          <div className="flex flex-col gap-1.5 rounded-2xl bg-surface p-5">
            <Typography
              color="semantic.label.assistive"
              variant="caption1"
              weight="medium"
            >
              이유
            </Typography>
            <Typography
              className="break-keep"
              color="semantic.label.strong"
              variant="body2"
            >
              {recording.failureReason}
            </Typography>
          </div>
        )}
      </ScreenBody>

      <div className="shrink-0 pb-safe-bottom">
        <ActionArea background variant="neutral">
          <ActionAreaButton
            buttonColor="assistive"
            buttonVariant="solid"
            onClick={onRerecord}
            variant="alternative"
          >
            다른 녹음
          </ActionAreaButton>
          <ActionAreaButton onClick={onRetry} variant="main">
            다시 분석
          </ActionAreaButton>
        </ActionArea>
      </div>
    </>
  );
}

export default AnalysisFailedView;
