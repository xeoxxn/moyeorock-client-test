import { TextButton, Typography } from "@wanteddev/wds";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomActionArea from "@/components/ui/BottomActionArea";
import ScreenHeader from "@/components/ui/ScreenHeader";
import TextInputField from "@/components/ui/TextInputField";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

// Figma: 온보딩/02 이메일 로그인 (nodeId 101:11345)
function OnboardingEmailLoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useScreenHeader(<ScreenHeader />);

  // 서버는 로그인 응답의 onboardingCompleted로 갈린다 — false면 /onboarding/nickname, true면 홈.
  // 목업에서 이메일로 로그인하는 사람은 이미 온보딩을 마친 기존 회원(Figma 플로우 B: 로그인 → 홈)으로
  // 본다. 로그인 화면으로 뒤로 가지 않게 replace.
  const login = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="flex h-full w-full flex-col bg-background">
      <div className="scrollbar-hidden flex flex-1 flex-col gap-6 overflow-y-auto px-5 pt-2">
        <Typography
          color="semantic.label.strong"
          variant="title3"
          weight="bold"
        >
          이메일로 로그인할게요
        </Typography>
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
            이메일로 가입하기
          </TextButton>
        </div>
      </div>
      <BottomActionArea
        disabled={!email.trim() || !password}
        label="로그인"
        onClick={login}
      />
    </div>
  );
}

export default OnboardingEmailLoginScreen;
