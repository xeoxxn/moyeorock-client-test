import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomActionArea from "@/components/ui/BottomActionArea";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SelectField from "@/components/ui/SelectField";
import StepProgress from "@/components/ui/StepProgress";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import GenrePicker from "@/features/onboarding/components/GenrePicker";
import StepHeading from "@/features/onboarding/components/StepHeading";
import { REGION_LABEL, REGION_OPTIONS } from "@/lib/domain/labels";
import type { Genre, Region } from "@/lib/domain/types";

const REGION_SELECT_OPTIONS = REGION_OPTIONS.map((region) => ({
  label: REGION_LABEL[region],
  value: region,
}));

// 프로필 설정 3단계 중 3단계(Figma 22와 같은 모양). 완료하면 앞 단계 값과 함께
// POST /users/me/onboarding {nickname, region, genres, instruments}로 보내는 자리다. 지역은 서버
// enum(시·도 단위)에서만 고른다.
function OnboardingPreferenceScreen() {
  const navigate = useNavigate();
  const [region, setRegion] = useState<Region | "">("");
  const [genres, setGenres] = useState<Genre[]>([]);

  useScreenHeader(useMemo(() => <ScreenHeader />, []));

  return (
    <>
      <ScreenBody className="px-5 pt-5">
        <StepProgress current={3} total={3} />
        <div className="mt-8 mb-8">
          <StepHeading
            description="가까운 모임과 팀을 추천해 드릴게요"
            title={"어디서, 어떤 음악을\n즐기시나요?"}
          />
        </div>
        <div className="flex flex-col gap-6">
          <SelectField
            label="활동 지역"
            onChange={setRegion}
            options={REGION_SELECT_OPTIONS}
            placeholder="지역을 골라 주세요"
            value={region}
          />
          <GenrePicker
            label="좋아하는 장르"
            onChange={setGenres}
            value={genres}
          />
        </div>
      </ScreenBody>
      <BottomActionArea
        disabled={region === "" || genres.length === 0}
        label="완료"
        // 온보딩이 끝나면 프로필 입력 단계로 되돌아오지 않게 replace.
        onClick={() => navigate("/onboarding/complete", { replace: true })}
      />
    </>
  );
}

export default OnboardingPreferenceScreen;
