import { Button, TextButton, Typography, useToast } from "@wanteddev/wds";
import { IconLogoKakao } from "@wanteddev/wds-icon";
import { useNavigate } from "react-router-dom";

import rehearsalRoomPhoto from "@/assets/photo/rehearsal-room.jpg";
import { BrandLogoStacked } from "@/components/music/Brand";
import { getMe } from "@/mocks/selectors";

// Figma 08 온보딩·로그인(421:13581). 헤더 없이 합주실 사진을 화면 가득 깔고 스크림(onboarding-scrim)으로
// 어둡게 덮은 뒤, 세로 로고 + 두 줄 소개 + 아래 버튼(카카오 · 이메일 로그인 · 회원가입 링크)을 얹는다.
// 상태 표시줄(9:41)은 실기기 장식이라 구현하지 않는다.

const kakaoButtonSx = {
  backgroundColor: "var(--color-kakao)",
  color: "var(--color-kakao-label)",
};

// 사진 위 반투명 흰 버튼(흰색 14% + 배경 흐림)
const glassButtonSx = {
  backdropFilter: "blur(1.25rem)",
  backgroundColor:
    "color-mix(in srgb, var(--color-static-white) 14%, transparent)",
  color: "var(--color-static-white)",
};

const linkSx = { color: "var(--color-static-white)" };
const dimLinkSx = {
  color: "color-mix(in srgb, var(--color-static-white) 75%, transparent)",
};

function OnboardingLoginScreen() {
  const navigate = useNavigate();
  const toast = useToast();

  // 서버: POST /v1/auth/kakao → 신규(isNewUser)면 signupToken·kakaoNickname을 받아 약관 동의로,
  // 기존 회원이면 onboardingCompleted에 따라 홈/온보딩으로 간다. 목업은 신규 회원 흐름을 보여 주려고
  // 항상 신규로 보고, 카카오 닉네임 자리에 데모 사용자의 닉네임을 넘긴다.
  const startWithKakao = () => {
    navigate("/login/terms", { state: { kakaoNickname: getMe().nickname } });
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <img
        alt=""
        className="absolute inset-0 size-full object-cover"
        src={rehearsalRoomPhoto}
      />
      <div aria-hidden className="onboarding-scrim absolute inset-0" />

      <div className="relative flex min-h-0 flex-1 flex-col items-center px-5">
        {/* 로고는 화면 위에서 4분의 1쯤 — 스크림이 가장 밝은 자리 바로 위에 온다. */}
        <div className="shrink basis-1/4" />
        <BrandLogoStacked className="w-55" />
        <Typography
          as="p"
          className="mt-9 whitespace-pre-line text-center"
          color="semantic.static.white"
          variant="body1"
          weight="bold"
        >
          {"함께 모여 무대까지,\n밴드 활동을 하나의 흐름으로 이어요"}
        </Typography>
      </div>

      <div className="relative flex shrink-0 flex-col gap-2.5 px-5 pb-safe-bottom">
        <Button
          fullWidth
          leadingContent={<IconLogoKakao />}
          onClick={startWithKakao}
          size="large"
          sx={kakaoButtonSx}
        >
          카카오로 시작하기
        </Button>
        {/* 이메일은 로그인만 큰 버튼으로 두고 가입은 아래 링크로 — 기존 회원은 이메일 로그인 →
            onboardingCompleted에 따라 홈 또는 /onboarding/nickname으로 간다. */}
        <Button
          color="assistive"
          fullWidth
          onClick={() => navigate("/login/email")}
          size="large"
          sx={glassButtonSx}
        >
          이메일로 로그인
        </Button>
        <div className="flex justify-center gap-4 py-3">
          <TextButton
            onClick={() => navigate("/login/email-signup")}
            size="small"
            sx={linkSx}
          >
            회원가입
          </TextButton>
          {/* 처리방침 문서 주소가 아직 없다 — 자리만 잡아 둔다. */}
          <TextButton
            onClick={() =>
              toast({ content: "개인정보 처리방침은 준비 중이에요" })
            }
            size="small"
            sx={dimLinkSx}
          >
            개인정보 처리방침
          </TextButton>
        </div>
      </div>
    </div>
  );
}

export default OnboardingLoginScreen;
