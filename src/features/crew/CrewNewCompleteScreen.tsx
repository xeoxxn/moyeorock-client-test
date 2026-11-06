import { Typography } from "@wanteddev/wds";
import { useLocation, useNavigate } from "react-router-dom";

import neonGlow from "@/assets/decorative/neon-glow-complete.svg";
import mascotMegaphone from "@/assets/mascot/megaphone.png";
import BottomActionArea from "@/components/ui/BottomActionArea";

// Figma: 모임/10 모임 생성 완료 (nodeId 101:21197). Figma 문구는 "운영 검토 후 승인 결과를 알림으로"였지만
// 서버는 POST /groups 즉시 모임을 만들고 나를 모임장으로 넣는다 — 검토 단계가 없어 문구를 바꿨다.
// 모임에 새 사람이 들어오는 길은 공고·초대뿐이라, 다음 할 일로 모집 공고 쓰기를 함께 둔다.
//
// 목업은 모임을 실제로 만들 수 없어 새 모임 id가 없다 — 데모에서는 내가 모임장인 1번 모임으로 보낸다.
// API가 붙으면 생성 응답의 id로 바꾼다.
const CREATED_GROUP_ID = 1;

function CrewNewCompleteScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const name = (location.state as { name?: string } | null)?.name;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
        <div className="relative flex w-1/2 max-w-48 items-center justify-center">
          <img
            alt=""
            className="pointer-events-none absolute inset-0 size-full scale-150"
            src={neonGlow}
          />
          <img
            alt=""
            className="relative aspect-square w-full object-contain drop-shadow-neon-lg"
            src={mascotMegaphone}
          />
        </div>
        <Typography
          as="p"
          className="text-center"
          color="semantic.label.strong"
          variant="heading1"
          weight="bold"
        >
          모임을 만들었어요!
        </Typography>
        <Typography
          as="p"
          className="text-center"
          color="semantic.label.alternative"
          variant="body1"
          weight="regular"
        >
          {name ? `${name}의 모임장이 됐어요.` : "이제 내가 모임장이에요."}
          <br />
          모집 공고를 올려 함께할 멤버를 모아 보세요.
        </Typography>
      </div>
      <BottomActionArea
        label="모임으로 이동"
        onClick={() => navigate(`/crew/${CREATED_GROUP_ID}`, { replace: true })}
        secondary={{
          label: "모집 공고 쓰기",
          onClick: () =>
            navigate(
              `/board/write?targetType=GROUP&targetId=${CREATED_GROUP_ID}`,
              { replace: true },
            ),
        }}
      />
    </div>
  );
}

export default CrewNewCompleteScreen;
