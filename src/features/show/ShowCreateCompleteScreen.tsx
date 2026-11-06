import { Typography } from "@wanteddev/wds";
import { useNavigate, useParams } from "react-router-dom";

import neonGlow from "@/assets/decorative/neon-glow-show-complete.svg";
import mascotMegaphone from "@/assets/mascot/megaphone.png";
import BottomActionArea from "@/components/ui/BottomActionArea";
import EmptyState from "@/components/ui/EmptyState";
import { getPerformance, toId } from "@/mocks/selectors";

// Figma: 공연/04 공연 생성 완료. 헤더 없이 축하 화면만 보여 주고, 다음 화면으로는 replace로 넘어가서
// 뒤로가기로 완료 화면·만들기 폼에 다시 들어오지 않게 한다.
function ShowCreateCompleteScreen() {
  const navigate = useNavigate();
  const { showId } = useParams();
  const performance = getPerformance(toId(showId));

  if (!performance) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyState
          action={{
            label: "모임으로",
            onClick: () => navigate("/crew", { replace: true }),
          }}
          description="삭제됐거나 주소가 잘못된 공연이에요"
          title="없는 공연이에요"
        />
      </div>
    );
  }

  return (
    <>
      <div className="relative flex flex-1 flex-col items-center justify-center gap-4 px-6">
        <div className="relative flex w-1/2 max-w-48 items-center justify-center">
          <img
            alt=""
            className="pointer-events-none absolute inset-0 size-full scale-150 object-contain"
            src={neonGlow}
          />
          <img
            alt=""
            className="relative aspect-square w-full drop-shadow-neon-lg"
            src={mascotMegaphone}
          />
        </div>
        <Typography
          as="p"
          className="relative text-center"
          color="semantic.label.normal"
          variant="heading2"
          weight="bold"
        >
          공연을 만들었어요!
        </Typography>
        {/* 서버가 공연을 만들면 모임원에게 PERFORMANCE_CREATED 알림을 보낸다. 공연 팀은 공연 예정·팀
            모집 중 상태면 바로 만들 수 있다. */}
        <Typography
          as="p"
          className="relative text-center"
          color="semantic.label.alternative"
          variant="body1"
          weight="regular"
        >
          모임 멤버에게 새 공연 알림을 보냈어요
          <br />
          이제 멤버들이 공연 팀을 만들 수 있어요
        </Typography>
      </div>
      <BottomActionArea
        label="공연 보기"
        onClick={() => navigate(`/show/${performance.id}`, { replace: true })}
        secondary={{
          label: "모임으로",
          onClick: () =>
            navigate(`/crew/${performance.groupId}`, { replace: true }),
        }}
      />
    </>
  );
}

export default ShowCreateCompleteScreen;
