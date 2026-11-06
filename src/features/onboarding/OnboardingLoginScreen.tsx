import { ActionArea, ActionAreaButton, Typography } from "@wanteddev/wds";
import { IconLogoKakao } from "@wanteddev/wds-icon";
import { useNavigate } from "react-router-dom";

import neonGlow from "@/assets/decorative/neon-glow-hero.svg";
import mascotFlag from "@/assets/mascot/flag.png";
import mascotFriendly from "@/assets/mascot/friendly.png";
import { getMe } from "@/mocks/selectors";

// Figma: 온보딩/01 로그인 (nodeId 101:11297). "01-1 로그인 (버튼 눌림)"은 별도 화면이 아니라 버튼의
// 눌림 상태라 라우트를 따로 두지 않는다. "Status Bar"(9:41)는 목업 장식이라 구현하지 않는다.
//
// 하단 버튼 셋(카카오 · 이메일 가입 · 이메일 로그인)은 WDS ActionArea `strong`의 main · alternative ·
// sub 구성과 그대로 맞아서 BottomActionArea(버튼 둘까지) 대신 ActionArea를 직접 쓴다.
function OnboardingLoginScreen() {
  const navigate = useNavigate();

  // 서버: POST /v1/auth/kakao → 신규(isNewUser)면 signupToken·kakaoNickname을 받아 약관 동의로,
  // 기존 회원이면 onboardingCompleted에 따라 홈/온보딩으로 간다. 목업은 신규 회원 흐름을 보여 주려고
  // 항상 신규로 보고, 카카오 닉네임 자리에 데모 사용자의 닉네임을 넘긴다.
  const startWithKakao = () => {
    navigate("/login/terms", { state: { kakaoNickname: getMe().nickname } });
  };

  return (
    <div className="flex h-full w-full flex-col bg-background">
      <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto px-6">
        {/* justify-center 대신 m-auto — 낮은 화면에서 내용이 넘쳐도 위쪽이 잘리지 않고 스크롤된다. */}
        <div className="m-auto flex w-full flex-col items-center gap-5 py-6">
          <div className="flex items-center gap-1.5">
            <img alt="" className="size-7.5" src={mascotFlag} />
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
          <div className="relative w-1/2 max-w-56">
            <img
              alt=""
              className="pointer-events-none absolute inset-0 size-full scale-150"
              src={neonGlow}
            />
            <img
              alt="모여락 마스코트"
              className="relative aspect-square w-full object-contain drop-shadow-neon-lg"
              src={mascotFriendly}
            />
          </div>
          <div className="flex flex-col items-center text-center">
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
            className="text-center"
            color="semantic.label.alternative"
            variant="body2"
            weight="regular"
          >
            합주 일정부터 공연 준비까지
            <br />
            밴드 활동을 한 곳에서 관리하세요
          </Typography>
        </div>
      </div>
      <div className="shrink-0 pb-safe-bottom">
        <ActionArea background variant="strong">
          <ActionAreaButton
            leadingContent={<IconLogoKakao />}
            onClick={startWithKakao}
            sx={{
              backgroundColor: "var(--color-kakao)",
              color: "var(--color-kakao-label)",
            }}
          >
            카카오로 시작하기
          </ActionAreaButton>
          <ActionAreaButton
            buttonColor="assistive"
            onClick={() => navigate("/login/email-signup")}
            sx={{ backgroundColor: "var(--color-surface)" }}
            variant="alternative"
          >
            이메일로 가입하기
          </ActionAreaButton>
          <ActionAreaButton
            onClick={() => navigate("/login/email")}
            variant="sub"
          >
            이메일 로그인
          </ActionAreaButton>
        </ActionArea>
      </div>
    </div>
  );
}

export default OnboardingLoginScreen;
