import { Chip, Typography } from "@wanteddev/wds";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomActionArea from "@/components/ui/BottomActionArea";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SelectField from "@/components/ui/SelectField";
import StepProgress from "@/components/ui/StepProgress";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import {
  GENRE_LABEL,
  GENRE_OPTIONS,
  REGION_LABEL,
  REGION_OPTIONS,
} from "@/lib/domain/labels";
import type { Genre, Region } from "@/lib/domain/types";

const REGION_SELECT_OPTIONS = REGION_OPTIONS.map((region) => ({
  label: REGION_LABEL[region],
  value: region,
}));

// Figma: 온보딩/05 프로필 설정 - 지역·장르 (nodeId 101:11454). 프로필 설정 3단계 중 3단계.
// 완료하면 앞 단계 값과 함께 POST /users/me/onboarding {nickname, region, genres, instruments}로
// 보내는 자리다. 지역은 서버 enum(시·도 단위)에서만 고른다.
function OnboardingPreferenceScreen() {
  const navigate = useNavigate();
  const [region, setRegion] = useState<Region | "">("");
  const [genres, setGenres] = useState<Genre[]>([]);

  useScreenHeader(<ScreenHeader />);

  const toggleGenre = (genre: Genre) => {
    setGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((item) => item !== genre)
        : [...prev, genre],
    );
  };

  // 온보딩이 끝나면 프로필 입력 단계로 되돌아오지 않게 replace.
  const complete = () => {
    navigate("/onboarding/complete", { replace: true });
  };

  return (
    <div className="flex h-full w-full flex-col bg-background">
      <div className="scrollbar-hidden flex flex-1 flex-col gap-7 overflow-y-auto px-5 pt-2 pb-6">
        <StepProgress current={3} total={3} />
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
        <SelectField
          label="활동 지역"
          onChange={setRegion}
          options={REGION_SELECT_OPTIONS}
          placeholder="지역을 골라 주세요"
          value={region}
        />
        <div className="flex flex-col gap-3">
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="medium"
          >
            좋아하는 장르
          </Typography>
          <div className="flex flex-wrap gap-2">
            {GENRE_OPTIONS.map((genre) => (
              <Chip
                active={genres.includes(genre)}
                key={genre}
                onClick={() => toggleGenre(genre)}
                size="large"
                variant="outlined"
              >
                {GENRE_LABEL[genre]}
              </Chip>
            ))}
          </div>
        </div>
      </div>
      <BottomActionArea
        disabled={region === "" || genres.length === 0}
        label="완료"
        onClick={complete}
      />
    </div>
  );
}

export default OnboardingPreferenceScreen;
