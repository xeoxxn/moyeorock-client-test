import { Button, Typography } from "@wanteddev/wds";
import { IconChevronDown, IconChevronLeft } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import OnboardingProgress from "@/features/onboarding/components/OnboardingProgress";
import SelectableChip from "@/features/onboarding/components/SelectableChip";

const GENRES = [
  "인디",
  "펑크",
  "록",
  "어쿠스틱",
  "발라드",
  "메탈",
  "팝",
  "재즈",
];

// Figma: 온보딩/05 프로필 설정 - 지역·장르 (nodeId 101:11454). 프로필 설정 3단계 중 3단계.
// "활동 지역" 필드는 실제로는 지역 선택 시트를 열어야 하지만 백엔드/지역 목록이 아직 없어
// 고정값을 보여주는 트리거 버튼으로만 둔다.
function OnboardingPreferenceScreen() {
  const navigate = useNavigate();
  const [genres, setGenres] = useState<string[]>(["펑크", "어쿠스틱"]);

  useScreenHeader(
    <ScreenHeader
      leading={
        <button onClick={() => navigate(-1)} type="button">
          <IconChevronLeft className="size-6 text-label-strong" />
        </button>
      }
      variant="normal"
    />,
  );

  const toggleGenre = (genre: string) => {
    setGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((item) => item !== genre)
        : [...prev, genre],
    );
  };

  return (
    <div className="flex h-full w-full flex-col bg-background px-5">
      <div className="flex flex-1 flex-col gap-7 overflow-y-auto pt-2">
        <OnboardingProgress step={3} total={3} />
        <div className="flex flex-col gap-2">
          <Typography
            color="semantic.label.strong"
            variant="title3"
            weight="bold"
          >
            어디서, 어떤 음악을
            <br />
            즐기시나요?
          </Typography>
          <Typography
            color="semantic.label.assistive"
            variant="label1"
            weight="regular"
          >
            가까운 모임과 팀을 추천해 드릴게요
          </Typography>
        </div>
        <div className="flex flex-col gap-2">
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="medium"
          >
            활동 지역
          </Typography>
          <button
            className="flex h-[52px] w-full items-center justify-between rounded-xl border border-line-solid bg-surface px-4"
            type="button"
          >
            <Typography
              color="semantic.label.strong"
              variant="body1"
              weight="medium"
            >
              서울
            </Typography>
            <IconChevronDown className="size-[18px] text-label-alternative" />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="medium"
          >
            좋아하는 장르
          </Typography>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => (
              <SelectableChip
                key={genre}
                label={genre}
                onClick={() => toggleGenre(genre)}
                selected={genres.includes(genre)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center pt-3 pb-[34px]">
        <Button
          color="primary"
          disabled={genres.length === 0}
          fullWidth
          onClick={() => navigate("/onboarding/complete")}
          size="large"
          variant="solid"
        >
          완료
        </Button>
      </div>
    </div>
  );
}

export default OnboardingPreferenceScreen;
