import { Button, Typography } from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import FormField from "@/features/onboarding/components/FormField";

// Figma: 온보딩/02 이메일 로그인 (nodeId 101:11345)
function OnboardingEmailLoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      <div className="flex flex-1 flex-col gap-6 pt-2">
        <Typography
          color="semantic.label.strong"
          variant="title3"
          weight="bold"
        >
          이메일로 로그인할게요
        </Typography>
        <FormField
          label="이메일"
          onChange={setEmail}
          placeholder="이메일을 입력해 주세요"
          type="email"
          value={email}
        />
        <FormField
          label="비밀번호"
          onChange={setPassword}
          placeholder="비밀번호를 입력해 주세요"
          type="password"
          value={password}
        />
        <button
          className="flex w-full justify-center"
          onClick={() => navigate("/login/email-signup")}
          type="button"
        >
          <Typography
            color="semantic.label.assistive"
            variant="label2"
            weight="medium"
          >
            이메일로 가입하기
          </Typography>
        </button>
      </div>
      <div className="flex flex-col items-center pt-3 pb-[34px]">
        <Button
          color="primary"
          disabled={!email || !password}
          fullWidth
          // 로그인 성공 = 프로필 설정으로 진입. 인증 서버가 붙기 전까지는 입력값만 채워지면 통과한다.
          onClick={() => navigate("/onboarding/nickname")}
          size="large"
          variant="solid"
        >
          로그인
        </Button>
      </div>
    </div>
  );
}

export default OnboardingEmailLoginScreen;
