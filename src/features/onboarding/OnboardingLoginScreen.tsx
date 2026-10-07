import { Button, Typography } from "@wanteddev/wds";
import { useNavigate } from "react-router-dom";

import neonGlow from "@/assets/decorative/neon-glow-hero.svg";
import mascotFlag from "@/assets/mascot/flag.png";
import mascotFriendly from "@/assets/mascot/friendly.png";

// Figma: 온보딩/01 로그인 (nodeId 101:11297). "01-1 로그인 (버튼 눌림)"은 별도 화면이 아니라
// 이 화면의 눌림 인터랙션 상태라 라우트를 따로 만들지 않았다(버튼 자체의 active 스타일로 흡수).
// Figma의 "Status Bar"(9:41·신호 아이콘)는 디자인 목업용 폰 프레임 장식이라 구현하지 않는다 —
// 실제 상단 안전영역은 ScreenLayout의 pt-safe-top이 담당한다.
function OnboardingLoginScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex h-full w-full flex-col bg-background px-6">
      <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
        <img
          alt=""
          className="pointer-events-none absolute top-1/2 left-1/2 h-[280px] w-[320px] -translate-x-1/2 -translate-y-1/2"
          src={neonGlow}
        />
        <div className="relative flex items-center gap-1.5">
          <img alt="" className="size-[30px]" src={mascotFlag} />
          <Typography
            as="p"
            className="text-glow-sm"
            color="semantic.label.strong"
            variant="headline1"
            weight="bold"
          >
            모여락
          </Typography>
        </div>
        <img
          alt="모여락 마스코트"
          className="relative size-[210px] drop-shadow-neon-lg"
          src={mascotFriendly}
        />
        <div className="relative flex flex-col items-center text-center">
          <Typography
            as="p"
            color="semantic.label.strong"
            variant="title3"
            weight="bold"
          >
            함께 연주할 사람,
          </Typography>
          <Typography
            as="p"
            className="text-glow"
            color="semantic.primary.normal"
            variant="title3"
            weight="bold"
          >
            모여락에서 찾아요
          </Typography>
        </div>
        <Typography
          as="p"
          className="relative text-center"
          color="semantic.label.alternative"
          variant="body2"
          weight="regular"
        >
          합주 일정부터 공연 준비까지
          <br />
          밴드 활동을 한 곳에서 관리하세요
        </Typography>
      </div>
      <div className="flex flex-col items-center gap-2.5 pt-3 pb-[34px]">
        <Button
          color="primary"
          fullWidth
          // 백엔드가 없으므로 소셜 로그인도 바로 프로필 설정(온보딩 1단계)으로 넘긴다.
          onClick={() => navigate("/onboarding/nickname")}
          size="large"
          sx={{
            backgroundColor: "var(--color-kakao)",
            color: "var(--color-kakao-label)",
          }}
          variant="solid"
        >
          카카오로 시작하기
        </Button>
        <Button
          color="assistive"
          fullWidth
          onClick={() => navigate("/login/email-signup")}
          size="large"
          sx={{ backgroundColor: "var(--color-surface)" }}
          variant="outlined"
        >
          이메일로 가입하기
        </Button>
        <button onClick={() => navigate("/login/email")} type="button">
          <Typography
            as="span"
            color="semantic.label.assistive"
            variant="label1"
            weight="medium"
          >
            이메일 로그인
          </Typography>
        </button>
      </div>
    </div>
  );
}

export default OnboardingLoginScreen;
