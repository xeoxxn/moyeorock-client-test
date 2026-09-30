import { Button, Typography } from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import FormField from "@/features/onboarding/components/FormField";

// Figma: 온보딩/07 이메일 회원가입 (nodeId 142:19196). 이 화면은 실제 WDS `Textinput/Textfield`
// 인스턴스(19:4270, 블러 배경)를 쓰지만, 온보딩 흐름 전체(02/03/05)가 더 단순한 로컬 박스
// 스타일을 쓰고 있어 흐름 안에서 입력 박스 모양을 통일하려고 같은 FormField를 재사용했다.
function OnboardingSignupScreen() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

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

  const canSubmit = name && email && password && password === passwordConfirm;

  return (
    <div className="flex h-full w-full flex-col bg-background px-5">
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto pt-2">
        <Typography
          color="semantic.label.strong"
          variant="title3"
          weight="bold"
        >
          이메일로 가입할게요
        </Typography>
        <FormField
          label="이름"
          onChange={setName}
          placeholder="이름을 입력해 주세요"
          value={name}
        />
        <FormField
          label="이메일"
          onChange={setEmail}
          placeholder="example@email.com"
          type="email"
          value={email}
        />
        <FormField
          label="비밀번호"
          onChange={setPassword}
          placeholder="영문, 숫자 포함 8자 이상"
          type="password"
          value={password}
        />
        <FormField
          label="비밀번호 확인"
          onChange={setPasswordConfirm}
          placeholder="비밀번호를 한 번 더 입력해 주세요"
          type="password"
          value={passwordConfirm}
        />
      </div>
      <div className="flex flex-col items-center bg-surface-elevated px-5 pt-3 pb-[34px]">
        <Button
          className="shadow-neon-sm"
          color="primary"
          disabled={!canSubmit}
          fullWidth
          onClick={() => navigate("/onboarding/nickname")}
          size="large"
          sx={{ paddingBlock: "16px" }}
          variant="solid"
        >
          가입하기
        </Button>
      </div>
    </div>
  );
}

export default OnboardingSignupScreen;
