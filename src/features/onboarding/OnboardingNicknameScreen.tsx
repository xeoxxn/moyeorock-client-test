import { Button, Typography } from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import FormField from "@/features/onboarding/components/FormField";
import OnboardingProgress from "@/features/onboarding/components/OnboardingProgress";

// Figma: 온보딩/03 프로필 설정 - 닉네임 (nodeId 101:11375). 프로필 설정 3단계 중 1단계.
function OnboardingNicknameScreen() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");

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

  return (
    <div className="flex h-full w-full flex-col bg-background px-5">
      <div className="flex flex-1 flex-col gap-7 pt-2">
        <OnboardingProgress step={1} total={3} />
        <div className="flex flex-col gap-2">
          <Typography
            color="semantic.label.strong"
            variant="title3"
            weight="bold"
          >
            어떻게 불러드릴까요?
          </Typography>
          <Typography
            color="semantic.label.assistive"
            variant="label1"
            weight="regular"
          >
            모임과 팀에서 보여질 이름이에요
          </Typography>
        </div>
        <FormField
          label="닉네임"
          onChange={setNickname}
          placeholder="닉네임을 입력해 주세요"
          value={nickname}
        />
      </div>
      <div className="flex flex-col items-center pt-3 pb-[34px]">
        <Button
          color="primary"
          disabled={!nickname}
          fullWidth
          onClick={() => navigate("/onboarding/session")}
          size="large"
          variant="solid"
        >
          다음
        </Button>
      </div>
    </div>
  );
}

export default OnboardingNicknameScreen;
