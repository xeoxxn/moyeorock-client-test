import { Button, Typography } from "@wanteddev/wds";
import { useNavigate } from "react-router-dom";

import neonGlow from "@/assets/decorative/neon-glow-complete.svg";
import mascotMegaphone from "@/assets/mascot/megaphone.png";

// Figma: 모임/10 모임 생성 완료 (nodeId 101:21197).
function CrewNewCompleteScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="relative flex flex-1 flex-col items-center justify-center gap-4 px-6">
        <img
          alt=""
          className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/2 left-1/2 h-[220px] w-[250px]"
          src={neonGlow}
        />
        <img alt="" className="relative size-[180px] shadow-neon-lg" src={mascotMegaphone} />
        <Typography
          as="p"
          className="relative text-center"
          color="semantic.label.normal"
          variant="heading1"
          weight="bold"
        >
          모임을 만들었어요!
        </Typography>
        <Typography
          as="p"
          className="relative text-center"
          color="semantic.label.alternative"
          variant="body1"
          weight="regular"
        >
          운영 검토 후 승인 결과를
          <br />
          알림으로 알려드릴게요
        </Typography>
      </div>
      <div className="shrink-0 px-5 pt-3 pb-[34px]">
        <Button
          color="primary"
          fullWidth
          onClick={() => navigate("/crew")}
          size="large"
          sx={{ backgroundColor: "var(--color-accent-strong)" }}
          variant="solid"
        >
          확인
        </Button>
      </div>
    </div>
  );
}

export default CrewNewCompleteScreen;
