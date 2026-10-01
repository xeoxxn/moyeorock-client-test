import { Button, Typography } from "@wanteddev/wds";
import { useNavigate, useParams } from "react-router-dom";

import neonGlow from "@/assets/decorative/neon-glow-show-complete.svg";
import mascotMegaphone from "@/assets/mascot/megaphone.png";

// Figma: 공연/04 공연 생성 완료 (nodeId 101:24155)
function ShowCreateCompleteScreen() {
  const navigate = useNavigate();
  const { showId } = useParams();

  return (
    <div className="flex flex-1 flex-col bg-background px-6">
      <div className="relative flex flex-1 flex-col items-center justify-center gap-4">
        <img
          alt=""
          className="pointer-events-none absolute top-1/2 left-1/2 h-[180px] w-[200px] -translate-x-1/2 -translate-y-1/2"
          src={neonGlow}
        />
        <img
          alt=""
          className="relative size-[180px] drop-shadow-neon-lg"
          src={mascotMegaphone}
        />
        <Typography
          as="p"
          color="semantic.label.normal"
          variant="heading2"
          weight="bold"
        >
          공연을 만들었어요!
        </Typography>
        <Typography
          as="p"
          className="text-center"
          color="semantic.label.alternative"
          variant="body1"
          weight="regular"
        >
          참가 팀 모집을 시작하면
          <br />
          모임 멤버에게 알림이 가요
        </Typography>
      </div>
      <div className="flex flex-col items-center gap-2 pt-3 pb-[34px]">
        <Button
          color="primary"
          fullWidth
          onClick={() => navigate(`/show/${showId}`, { replace: true })}
          size="large"
          variant="solid"
        >
          공연 보기
        </Button>
      </div>
    </div>
  );
}

export default ShowCreateCompleteScreen;
