import { Checkbox, Divider, Typography } from "@wanteddev/wds";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import BottomActionArea from "@/components/ui/BottomActionArea";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

interface TermsLocationState {
  kakaoNickname?: string;
}

interface AgreementRowProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  strong?: boolean;
}

// 체크박스와 문구를 label로 묶어 문구를 눌러도 체크된다(WDS Checkbox는 role="checkbox" 버튼이라
// htmlFor로 연결된다).
function AgreementRow({
  checked,
  id,
  label,
  onCheckedChange,
  strong = false,
}: AgreementRowProps) {
  return (
    <label className="flex items-center gap-3" htmlFor={id}>
      <Checkbox checked={checked} id={id} onCheckedChange={onCheckedChange} />
      <Typography
        color={strong ? "semantic.label.strong" : "semantic.label.normal"}
        variant={strong ? "body1" : "body2"}
        weight={strong ? "bold" : "regular"}
      >
        {label}
      </Typography>
    </label>
  );
}

// 카카오 신규 회원 약관 동의 — Figma에는 없는 화면이다. 서버가 신규 카카오 회원에게 signupToken만
// 주고, POST /v1/auth/kakao/signup {signupToken, privacyAgreed}에서 privacyAgreed=true를 받아야
// 계정을 만들기 때문에 끼워 넣었다. 동의 항목은 서버 기준 개인정보 처리방침(필수) 하나라 "전체 동의"는
// 그 항목과 같이 움직인다 — 선택 항목이 생기면 여기서 따로 상태를 둔다.
function OnboardingTermsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const kakaoNickname = (location.state as TermsLocationState | null)
    ?.kakaoNickname;
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  useScreenHeader(<ScreenHeader />);

  // 가입이 끝나면 약관 화면으로 되돌아오지 않게 replace. 카카오 닉네임은 닉네임 단계의 기본값으로 넘긴다.
  const signup = () => {
    navigate("/onboarding/nickname", {
      replace: true,
      state: { nickname: kakaoNickname },
    });
  };

  return (
    <div className="flex h-full w-full flex-col bg-background">
      <div className="scrollbar-hidden flex flex-1 flex-col gap-8 overflow-y-auto px-5 pt-2">
        <div className="flex flex-col gap-2">
          <Typography
            color="semantic.label.strong"
            variant="title3"
            weight="bold"
          >
            {kakaoNickname ? `${kakaoNickname}님, 반가워요!` : "반가워요!"}
          </Typography>
          <Typography
            color="semantic.label.assistive"
            variant="label1"
            weight="regular"
          >
            모여락을 시작하려면 약관에 동의해 주세요
          </Typography>
        </div>
        <div className="flex flex-col gap-4 rounded-2xl border border-line-solid bg-surface p-4">
          <AgreementRow
            checked={privacyAgreed}
            id="terms-all"
            label="전체 동의"
            onCheckedChange={setPrivacyAgreed}
            strong
          />
          <Divider />
          <AgreementRow
            checked={privacyAgreed}
            id="terms-privacy"
            label="[필수] 개인정보 처리방침 동의"
            onCheckedChange={setPrivacyAgreed}
          />
        </div>
      </div>
      <BottomActionArea
        disabled={!privacyAgreed}
        label="동의하고 시작하기"
        onClick={signup}
      />
    </div>
  );
}

export default OnboardingTermsScreen;
