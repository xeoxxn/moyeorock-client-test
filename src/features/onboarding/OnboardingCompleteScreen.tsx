import { Typography } from "@wanteddev/wds";
import { useNavigate } from "react-router-dom";

import neonGlow from "@/assets/decorative/neon-glow-complete.svg";
import mascotLaugh from "@/assets/mascot/laugh.png";
import BottomActionArea from "@/components/ui/BottomActionArea";
import Tag from "@/components/ui/Tag";
import { formatInstruments, REGION_LABEL } from "@/lib/domain/labels";
import { getMe } from "@/mocks/selectors";

// Figma: 온보딩/06 가입 완료 (nodeId 101:11500). 헤더·Bottom Nav 없이 전체 화면.
// 인사말·태그는 방금 저장된 내 프로필(GET /users/me)에서 그린다.
function OnboardingCompleteScreen() {
  const navigate = useNavigate();
  const me = getMe();

  return (
    <div className="flex h-full w-full flex-col bg-background">
      <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto px-6">
        <div className="m-auto flex w-full flex-col items-center gap-3.5 py-6">
          <div className="relative w-1/2 max-w-52">
            <img
              alt=""
              className="pointer-events-none absolute inset-0 size-full scale-125"
              src={neonGlow}
            />
            <img
              alt="모여락 마스코트"
              className="relative aspect-square w-full object-contain drop-shadow-neon-lg"
              src={mascotLaugh}
            />
          </div>
          <div className="flex flex-col items-center text-center">
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
              {me.nickname}님!
            </Typography>
          </div>
          <div className="flex flex-wrap justify-center gap-1.5">
            <Tag>{REGION_LABEL[me.region]}</Tag>
            {me.instruments.map((item) => (
              <Tag key={item.instrument}>{formatInstruments([item], true)}</Tag>
            ))}
          </div>
          <Typography
            color="semantic.label.alternative"
            variant="body2"
            weight="regular"
          >
            이제 함께할 모임과 팀을 둘러볼까요?
          </Typography>
        </div>
      </div>
      <BottomActionArea
        label="모여락 시작하기"
        // 온보딩 화면들로 뒤로 가지 않게 replace.
        onClick={() => navigate("/", { replace: true })}
      />
    </div>
  );
}

export default OnboardingCompleteScreen;
