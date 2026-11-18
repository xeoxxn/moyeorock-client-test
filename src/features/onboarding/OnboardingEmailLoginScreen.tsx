import { TextButton } from "@wanteddev/wds";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomActionArea from "@/components/ui/BottomActionArea";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import TextInputField from "@/components/ui/TextInputField";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import StepHeading from "@/features/onboarding/components/StepHeading";

// 이메일 로그인(/login/email) — 08 로그인의 "이메일로 로그인"에서 들어온다. Figma 화면은 없어서 온보딩
// 단계 화면(22)과 같은 모양(뒤로가기 + 질문 + 입력 + 하단 버튼)으로 둔다.
function OnboardingEmailLoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useScreenHeader(useMemo(() => <ScreenHeader />, []));

  // 서버 POST /v1/auth/login은 onboardingCompleted로 갈린다 — false면 /onboarding/nickname, true면 홈.
  // 목업에서 이메일로 로그인하는 사람은 이미 온보딩을 마친 기존 회원으로 본다. 로그인 화면으로 뒤로
  // 가지 않게 replace.
  const login = () => {
    navigate("/", { replace: true });
  };

  return (
    <>
      <ScreenBody className="flex flex-col gap-6 px-5 pt-2">
        <div className="pb-2">
          <StepHeading
            description="가입할 때 쓴 이메일로 로그인해요"
            title="이메일로 로그인"
          />
        </div>
        <TextInputField
          autoComplete="email"
          label="이메일"
          onChange={setEmail}
          placeholder="이메일을 입력해 주세요"
          type="email"
          value={email}
        />
        <TextInputField
          autoComplete="current-password"
          label="비밀번호"
          onChange={setPassword}
          placeholder="비밀번호를 입력해 주세요"
          type="password"
          value={password}
        />
        <div className="flex justify-center">
          <TextButton
            color="assistive"
            onClick={() => navigate("/login/email-signup")}
            size="small"
          >
            회원가입
          </TextButton>
        </div>
      </ScreenBody>
      <BottomActionArea
        disabled={!email.trim() || !password}
        label="로그인"
        onClick={login}
      />
    </>
  );
}

export default OnboardingEmailLoginScreen;
