import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomActionArea from "@/components/ui/BottomActionArea";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import StepProgress from "@/components/ui/StepProgress";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import SessionPicker, {
  getSelectedInstruments,
  type SessionLevels,
} from "@/features/onboarding/components/SessionPicker";
import StepHeading from "@/features/onboarding/components/StepHeading";

// Figma 22 온보딩·세션 선택(502:19879) — 프로필 설정 3단계 중 2단계. 뒤로가기만 있는 헤더 + 진행 바 +
// 질문 + 세션 타일 + 세션마다 연주 실력. 값은 3단계에서 닉네임·지역·장르와 함께
// POST /users/me/onboarding으로 보내는 자리다.
function OnboardingSessionScreen() {
  const navigate = useNavigate();
  const [levels, setLevels] = useState<SessionLevels>({});

  useScreenHeader(useMemo(() => <ScreenHeader />, []));

  return (
    <>
      <ScreenBody className="pt-5">
        <div className="px-5">
          <StepProgress current={2} total={3} />
        </div>
        <div className="mt-8 mb-8 px-5">
          <StepHeading
            description="여러 개를 골라도 괜찮아요"
            title="어떤 세션을 맡고 있나요?"
          />
        </div>
        <SessionPicker onChange={setLevels} value={levels} />
      </ScreenBody>
      <BottomActionArea
        disabled={getSelectedInstruments(levels).length === 0}
        label="다음"
        onClick={() => navigate("/onboarding/preference")}
      />
    </>
  );
}

export default OnboardingSessionScreen;
