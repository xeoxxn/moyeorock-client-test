import { Button, Typography } from "@wanteddev/wds";
import { useNavigate } from "react-router-dom";

import neonGlow from "@/assets/decorative/neon-glow-complete.svg";
import mascotLaugh from "@/assets/mascot/laugh.png";

const PROFILE_TAGS = ["서울", "어쿠스틱", "입문", "키보드"];

// Figma: 온보딩/06 가입 완료 (nodeId 101:11500). 헤더·Bottom Nav 없이 전체 화면.
function OnboardingCompleteScreen() {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-full w-full flex-col bg-background px-6">
      <div className="relative flex flex-1 flex-col items-center justify-center gap-3.5">
        <img
          alt=""
          className="pointer-events-none absolute top-1/2 left-1/2 h-[190px] w-[220px] -translate-x-1/2 -translate-y-1/2"
          src={neonGlow}
        />
        <img
          alt="모여락 마스코트"
          className="relative size-[190px] shadow-neon-lg"
          src={mascotLaugh}
        />
        <div className="relative flex flex-col items-center text-center">
          <Typography
            color="semantic.label.strong"
            variant="title3"
            weight="bold"
          >
            반가워요,
          </Typography>
          <Typography
            className="text-glow"
            color="semantic.primary.normal"
            variant="title3"
            weight="bold"
          >
            김광철님!
          </Typography>
        </div>
        <div className="relative flex flex-wrap justify-center gap-1.5">
          {PROFILE_TAGS.map((tag) => (
            <div
              className="rounded-xl border border-line-solid px-2.5 py-1"
              key={tag}
            >
              <Typography
                color="semantic.label.alternative"
                variant="caption1"
                weight="medium"
              >
                {tag}
              </Typography>
            </div>
          ))}
        </div>
        <Typography
          className="relative"
          color="semantic.label.alternative"
          variant="body2"
          weight="regular"
        >
          이제 함께할 모임과 팀을 둘러볼까요?
        </Typography>
      </div>
      <div className="flex flex-col items-center pt-3 pb-[34px]">
        <Button
          color="primary"
          fullWidth
          onClick={() => navigate("/")}
          size="large"
          variant="solid"
        >
          모여락 시작하기
        </Button>
      </div>
    </div>
  );
}

export default OnboardingCompleteScreen;
