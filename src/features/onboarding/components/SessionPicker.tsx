import {
  SegmentedControl,
  SegmentedControlItem,
  Typography,
} from "@wanteddev/wds";

import SectionHeader from "@/components/ui/SectionHeader";
import SessionTile from "@/components/ui/SessionTile";
import {
  INSTRUMENT_LABEL,
  INSTRUMENT_OPTIONS,
  LEVEL_LABEL,
  LEVEL_OPTIONS,
} from "@/lib/domain/labels";
import type { Instrument, Level } from "@/lib/domain/types";

// Figma 22 온보딩·세션 선택의 본문 — 세션 타일(3×2) + 고른 세션마다 연주 실력(입문~고급).
// 마이의 세션 편집(/mine/session)도 같은 모양이라 같이 쓴다. "연주 실력"은 구역 제목(SectionHeader)이라
// 좌우 여백을 스스로 가진다 — 그래서 이 컴포넌트는 화면 폭 그대로 놓고, 타일·실력 줄에만 px-5를 준다.
// Figma는 실력을 세션마다 고르게 그렸고 서버도 세션마다 받는다(POST /users/me/onboarding ·
// PUT /users/me/instruments의 instruments[{instrument, level}]). 세션을 켜면 "입문"으로 시작해서
// 실력을 따로 안 골라도 다음으로 갈 수 있다.

export type SessionLevels = Partial<Record<Instrument, Level>>;

/** 고른 세션(타일 순서대로) */
export function getSelectedInstruments(levels: SessionLevels): Instrument[] {
  return INSTRUMENT_OPTIONS.filter(
    (instrument) => levels[instrument] !== undefined,
  );
}

interface SessionPickerProps {
  value: SessionLevels;
  onChange: (next: SessionLevels) => void;
}

function SessionPicker({ onChange, value }: SessionPickerProps) {
  const selected = getSelectedInstruments(value);

  const toggle = (instrument: Instrument) => {
    const next = { ...value };
    if (next[instrument] === undefined) {
      next[instrument] = LEVEL_OPTIONS[0];
    } else {
      delete next[instrument];
    }
    onChange(next);
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-x-3 gap-y-4 px-5">
        {INSTRUMENT_OPTIONS.map((instrument) => (
          <SessionTile
            instrument={instrument}
            key={instrument}
            onToggle={() => toggle(instrument)}
            selected={value[instrument] !== undefined}
          />
        ))}
      </div>

      <SectionHeader title="연주 실력" />
      <div className="flex flex-col gap-5 px-5">
        {selected.length === 0 ? (
          <Typography color="semantic.label.assistive" variant="label2">
            세션을 고르면 세션마다 실력을 정할 수 있어요
          </Typography>
        ) : (
          selected.map((instrument) => (
            <div className="flex flex-col gap-2" key={instrument}>
              <Typography
                color="semantic.label.alternative"
                variant="label1"
                weight="medium"
              >
                {INSTRUMENT_LABEL[instrument]}
              </Typography>
              {/* WDS SegmentedControl은 폭 100%·항목 flex 1이라 부모(flex-col)가 늘려 주면 네 칸이 같은 폭이다. */}
              <SegmentedControl
                aria-label={`${INSTRUMENT_LABEL[instrument]} 실력`}
                onValueChange={(level) =>
                  onChange({ ...value, [instrument]: level as Level })
                }
                size="medium"
                value={value[instrument]}
              >
                {LEVEL_OPTIONS.map((level) => (
                  <SegmentedControlItem key={level} value={level}>
                    {LEVEL_LABEL[level]}
                  </SegmentedControlItem>
                ))}
              </SegmentedControl>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default SessionPicker;
