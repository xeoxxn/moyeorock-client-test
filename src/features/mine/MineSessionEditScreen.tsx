import {
  Chip,
  FormErrorMessage,
  FormField,
  FormLabel,
  FormMessage,
  SegmentedControl,
  SegmentedControlItem,
  TopNavigationButton,
  Typography,
  useToast,
} from "@wanteddev/wds";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import PressableCard from "@/components/ui/PressableCard";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import {
  INSTRUMENT_LABEL,
  INSTRUMENT_OPTIONS,
  LEVEL_LABEL,
  LEVEL_OPTIONS,
} from "@/lib/domain/labels";
import type { Instrument, Level } from "@/lib/domain/types";
import { getMe } from "@/mocks/selectors";

// Figma: 마이/03 세션 수정 — 서버 PUT /users/me/instruments {instruments[{instrument, level}]}. 전체
// 교체라 빠진 세션은 지워지고, 빈 목록은 받지 않는다(@NotEmpty). 세션은 칩으로 켜고 끄고, 켠 세션마다
// 실력을 따로 고른다.

function MineSessionEditScreen() {
  const navigate = useNavigate();
  const toast = useToast();
  const me = getMe();
  const [levels, setLevels] = useState<Partial<Record<Instrument, Level>>>(() =>
    Object.fromEntries(
      me.instruments.map((item) => [item.instrument, item.level]),
    ),
  );

  const selected = INSTRUMENT_OPTIONS.filter(
    (instrument) => levels[instrument] !== undefined,
  );
  const canSave = selected.length > 0;

  const toggle = (instrument: Instrument) =>
    setLevels((prev) => {
      const next = { ...prev };
      if (next[instrument] !== undefined) {
        delete next[instrument];
      } else {
        next[instrument] = "BEGINNER";
      }
      return next;
    });

  const save = () => {
    toast({ content: "세션을 저장했어요", variant: "positive" });
    navigate(-1);
  };

  useScreenHeader(
    <ScreenHeader
      title="세션 수정"
      trailing={
        <TopNavigationButton
          color="primary"
          disabled={!canSave}
          onClick={save}
          variant="text"
        >
          저장
        </TopNavigationButton>
      }
    />,
  );

  return (
    <div className="scrollbar-hidden flex flex-1 flex-col gap-6 overflow-y-auto px-5 pt-2 pb-8">
      <div className="flex flex-col gap-2">
        <Typography
          as="p"
          color="semantic.label.normal"
          variant="title3"
          weight="bold"
        >
          맡고 있는 세션과
          <br />
          실력을 알려주세요
        </Typography>
        <Typography
          color="semantic.label.alternative"
          variant="body2"
          weight="regular"
        >
          세션마다 실력을 따로 고를 수 있어요
        </Typography>
      </div>

      <FormField>
        <FormLabel>세션</FormLabel>
        <div className="flex flex-wrap gap-2">
          {INSTRUMENT_OPTIONS.map((instrument) => (
            <Chip
              active={levels[instrument] !== undefined}
              key={instrument}
              onClick={() => toggle(instrument)}
              size="large"
              variant="outlined"
            >
              {INSTRUMENT_LABEL[instrument]}
            </Chip>
          ))}
        </div>
        {canSave ? (
          <FormMessage>여러 개 고를 수 있어요</FormMessage>
        ) : (
          <FormErrorMessage>세션을 하나 이상 골라 주세요</FormErrorMessage>
        )}
      </FormField>

      {selected.map((instrument) => (
        <PressableCard key={instrument}>
          <div className="flex flex-col gap-3">
            <Typography
              color="semantic.label.normal"
              variant="body1"
              weight="bold"
            >
              {INSTRUMENT_LABEL[instrument]}
            </Typography>
            <SegmentedControl
              aria-label={`${INSTRUMENT_LABEL[instrument]} 실력`}
              onValueChange={(level) =>
                setLevels((prev) => ({ ...prev, [instrument]: level as Level }))
              }
              size="small"
              value={levels[instrument]}
            >
              {LEVEL_OPTIONS.map((level) => (
                <SegmentedControlItem key={level} value={level}>
                  {LEVEL_LABEL[level]}
                </SegmentedControlItem>
              ))}
            </SegmentedControl>
          </div>
        </PressableCard>
      ))}
    </div>
  );
}

export default MineSessionEditScreen;
