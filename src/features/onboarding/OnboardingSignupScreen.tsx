import { Checkbox, Typography } from "@wanteddev/wds";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomActionArea from "@/components/ui/BottomActionArea";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import TextInputField from "@/components/ui/TextInputField";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import StepHeading from "@/features/onboarding/components/StepHeading";

const PASSWORD_RULE = "8~64자, 영문·숫자·특수문자를 각각 1자 이상";

// 서버 POST /v1/auth/signup 비밀번호 규칙과 같게 맞춘다 — 여기서 통과한 값이 서버에서 400으로 튕기지 않게.
function isValidPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    password.length <= 64 &&
    /[A-Za-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9\s]/.test(password)
  );
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// 이메일 회원가입(/login/email-signup) — 08 로그인의 "회원가입" 링크에서 들어온다. Figma 화면은 없어서
// 온보딩 단계 화면(22)과 같은 모양으로 둔다.
// 서버 POST /v1/auth/signup {email, password, name, privacyAgreed}. privacyAgreed=true가 아니면 가입이
// 안 되므로 개인정보 처리방침 동의를 하단 버튼 위에 붙였다. 이름은 서버가 임시 닉네임으로 쓰기 때문에
// 다음 닉네임 단계의 기본값으로 넘긴다.
function OnboardingSignupScreen() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  useScreenHeader(useMemo(() => <ScreenHeader />, []));

  // 입력을 시작한 뒤에만 에러를 보여 준다 — 빈 칸부터 빨간 문구가 뜨지 않게.
  const emailError =
    email && !isValidEmail(email) ? "이메일 형식을 확인해 주세요" : undefined;
  const passwordError =
    password && !isValidPassword(password) ? PASSWORD_RULE : undefined;
  const passwordConfirmError =
    passwordConfirm && passwordConfirm !== password
      ? "비밀번호가 일치하지 않아요"
      : undefined;

  const canSubmit =
    name.trim() !== "" &&
    isValidEmail(email) &&
    isValidPassword(password) &&
    passwordConfirm === password &&
    privacyAgreed;

  // 계정이 만들어진 뒤에는 가입 폼으로 되돌아오지 않게 replace.
  const signup = () => {
    navigate("/onboarding/nickname", {
      replace: true,
      state: { nickname: name.trim() },
    });
  };

  return (
    <>
      <ScreenBody className="flex flex-col gap-6 px-5 pt-2">
        <div className="pb-2">
          <StepHeading
            description="가입한 뒤 프로필을 이어서 정해요"
            title="이메일로 가입"
          />
        </div>
        <TextInputField
          autoComplete="name"
          label="이름"
          onChange={setName}
          placeholder="이름을 입력해 주세요"
          value={name}
        />
        <TextInputField
          autoComplete="email"
          error={emailError}
          label="이메일"
          onChange={setEmail}
          placeholder="example@email.com"
          type="email"
          value={email}
        />
        <TextInputField
          autoComplete="new-password"
          error={passwordError}
          label="비밀번호"
          maxLength={64}
          message={PASSWORD_RULE}
          onChange={setPassword}
          placeholder="비밀번호를 입력해 주세요"
          type="password"
          value={password}
        />
        <TextInputField
          autoComplete="new-password"
          error={passwordConfirmError}
          label="비밀번호 확인"
          maxLength={64}
          onChange={setPasswordConfirm}
          placeholder="비밀번호를 한 번 더 입력해 주세요"
          type="password"
          value={passwordConfirm}
        />
      </ScreenBody>
      <BottomActionArea
        disabled={!canSubmit}
        extraContent={
          <label
            className="flex w-full items-center gap-2"
            htmlFor="signup-privacy"
          >
            <Checkbox
              checked={privacyAgreed}
              id="signup-privacy"
              onCheckedChange={setPrivacyAgreed}
              size="small"
            />
            <Typography color="semantic.label.normal" variant="label1">
              [필수] 개인정보 처리방침 동의
            </Typography>
          </label>
        }
        label="가입"
        onClick={signup}
      />
    </>
  );
}

export default OnboardingSignupScreen;
