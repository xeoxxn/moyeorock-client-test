import { ActionArea, ActionAreaButton, Typography } from "@wanteddev/wds";
import { IconCheck } from "@wanteddev/wds-icon";

import LoaderLogo from "@/components/ui/LoaderLogo";
import LoaderWave from "@/components/ui/LoaderWave";
import ScreenBody from "@/components/ui/ScreenBody";
import AnalysisHero from "@/features/practice/components/AnalysisHero";
import {
  ANALYSIS_STEPS,
  type AnalysisStepState,
  analysisMeta,
  analysisStepState,
} from "@/features/practice/practiceHelpers";
import { cn } from "@/lib/cn";
import type { PracticeRecording } from "@/lib/domain/types";

// Figma 29 연습 분석 비교 중(593:26152) — 분석이 끝나기 전(SUBMITTED·ANALYZING) 상세가 그리는 모습.
// 서버엔 진행률이 없어 상태로 단계만 보여 준다: 녹음 올리기(요청이 받아졌으면 끝) → 분석 차례
// 기다리기(SUBMITTED) → 원곡과 비교하기(ANALYZING). 상세가 5초마다 다시 읽다 DONE이면 05로 바뀐다.
interface AnalysisProgressViewProps {
  recording: PracticeRecording;
  onWaitInList: () => void;
}

const STEP_TRAILING: Record<AnalysisStepState, string | null> = {
  current: "진행 중",
  done: "완료",
  pending: null,
};

function AnalysisStep({
  label,
  state,
}: {
  label: string;
  state: AnalysisStepState;
}) {
  const trailing = STEP_TRAILING[state];
  return (
    <li className="flex items-center gap-3">
      {/* 끝난 단계는 주홍 22% 원 + 체크, 지금 단계는 작은 웨이브, 남은 단계는 빈칸 */}
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full",
          state === "done" && "bg-accent/22",
        )}
      >
        {state === "done" && <IconCheck className="size-4 text-accent-text" />}
        {state === "current" && (
          <LoaderWave className="text-label-strong" size="small" />
        )}
      </span>
      <Typography
        as="span"
        className="min-w-0 flex-1"
        color={
          state === "current"
            ? "semantic.label.strong"
            : state === "done"
              ? "semantic.label.alternative"
              : "semantic.label.assistive"
        }
        variant={state === "current" ? "body1" : "body2"}
        weight={state === "current" ? "bold" : "regular"}
      >
        {label}
      </Typography>
      {trailing && (
        <Typography
          as="span"
          color="semantic.label.assistive"
          variant="caption1"
          weight="medium"
        >
          {trailing}
        </Typography>
      )}
    </li>
  );
}

function AnalysisProgressView({
  onWaitInList,
  recording,
}: AnalysisProgressViewProps) {
  return (
    <>
      <ScreenBody className="flex flex-col gap-8 px-5 pt-12">
        <AnalysisHero
          icon={<LoaderLogo />}
          meta={analysisMeta(recording)}
          title="원곡과 비교하고 있어요"
        />
        <div className="flex flex-col gap-4">
          <ol className="flex flex-col gap-4 rounded-2xl bg-surface p-5">
            {ANALYSIS_STEPS.map((step, index) => (
              <AnalysisStep
                key={step.label}
                label={step.label}
                state={analysisStepState(index, recording.status)}
              />
            ))}
          </ol>
          <Typography
            align="center"
            className="whitespace-pre-line"
            color="semantic.label.assistive"
            variant="label2"
          >
            {
              "분석은 조금 걸려요. 나가도 계속되고,\n연습 분석 목록에서 결과를 볼 수 있어요."
            }
          </Typography>
        </div>
      </ScreenBody>

      <div className="shrink-0 pb-safe-bottom">
        <ActionArea background variant="strong">
          <ActionAreaButton buttonColor="assistive" onClick={onWaitInList}>
            목록에서 기다리기
          </ActionAreaButton>
        </ActionArea>
      </div>
    </>
  );
}

export default AnalysisProgressView;
