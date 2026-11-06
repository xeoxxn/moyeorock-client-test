import { Chip, Typography } from "@wanteddev/wds";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomActionArea from "@/components/ui/BottomActionArea";
import ScreenHeader from "@/components/ui/ScreenHeader";
import StepProgress from "@/components/ui/StepProgress";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import {
  INSTRUMENT_LABEL,
  INSTRUMENT_OPTIONS,
  LEVEL_LABEL,
  LEVEL_OPTIONS,
} from "@/lib/domain/labels";
import type { Instrument, Level } from "@/lib/domain/types";

// Figma: 온보딩/04 프로필 설정 - 세션 (nodeId 101:11407). 프로필 설정 3단계 중 2단계.
// Figma는 "연주 실력"을 하나만 고르지만 서버는 세션마다 실력을 받는다
// (POST /users/me/onboarding instruments[{instrument, level}]) — 그래서 고른 세션마다 실력 줄을 하나씩 둔다.
// 세션을 고르면 실력은 "입문"으로 시작해서, 실력을 따로 안 골라도 다음으로 갈 수 있다.
function OnboardingSessionScreen() {
  const navigate = useNavigate();
  const [levels, setLevels] = useState<Partial<Record<Instrument, Level>>>({});

  useScreenHeader(<ScreenHeader />);

  const selected = INSTRUMENT_OPTIONS.filter(
    (instrument) => levels[instrument] !== undefined,
  );

  const toggleInstrument = (instrument: Instrument) => {
    setLevels((prev) => {
      const next = { ...prev };
      if (next[instrument] === undefined) {
        next[instrument] = LEVEL_OPTIONS[0];
      } else {
        delete next[instrument];
      }
      return next;
    });
  };

  const setLevel = (instrument: Instrument, level: Level) => {
    setLevels((prev) => ({ ...prev, [instrument]: level }));
  };

  return (
    <div className="flex h-full w-full flex-col bg-background">
      <div className="scrollbar-hidden flex flex-1 flex-col gap-7 overflow-y-auto px-5 pt-2 pb-6">
        <StepProgress current={2} total={3} />
        <div className="flex flex-col gap-2">
          <Typography
            color="semantic.label.strong"
            variant="title3"
            weight="bold"
          >
            어떤 세션을 맡고 있나요?
          </Typography>
          <Typography
            color="semantic.label.assistive"
            variant="label1"
            weight="regular"
          >
            여러 개를 골라도 괜찮아요
          </Typography>
        </div>
        <div className="flex flex-col gap-3">
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="medium"
          >
            내 세션
          </Typography>
          <div className="flex flex-wrap gap-2">
            {INSTRUMENT_OPTIONS.map((instrument) => (
              <Chip
                active={levels[instrument] !== undefined}
                key={instrument}
                onClick={() => toggleInstrument(instrument)}
                size="large"
                variant="outlined"
              >
                {INSTRUMENT_LABEL[instrument]}
              </Chip>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="medium"
          >
            연주 실력
          </Typography>
          {selected.length === 0 ? (
            <Typography
              color="semantic.label.assistive"
              variant="label1"
              weight="regular"
            >
              세션을 고르면 세션마다 실력을 정할 수 있어요
            </Typography>
          ) : (
            <div className="flex flex-col gap-4">
              {selected.map((instrument) => (
                <div className="flex flex-col gap-2" key={instrument}>
                  <Typography
                    color="semantic.label.normal"
                    variant="label1"
                    weight="bold"
                  >
                    {INSTRUMENT_LABEL[instrument]}
                  </Typography>
                  <div className="flex flex-wrap gap-2">
                    {LEVEL_OPTIONS.map((level) => (
                      <Chip
                        active={levels[instrument] === level}
                        key={level}
                        onClick={() => setLevel(instrument, level)}
                        size="medium"
                        variant="outlined"
                      >
                        {LEVEL_LABEL[level]}
                      </Chip>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomActionArea
        disabled={selected.length === 0}
        label="다음"
        onClick={() => navigate("/onboarding/preference")}
      />
    </div>
  );
}

export default OnboardingSessionScreen;
