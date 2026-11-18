import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import EmptyState from "@/components/ui/EmptyState";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

// 팀 화면에 들어왔지만 보여 줄 수 없을 때(없는 팀 · 팀장 전용 화면). 버튼은 권한대로 숨기지만 알림·
// 주소창으로 바로 들어오는 길이 있어서 화면마다 이걸로 막는다. 팀원이 아닌 사람은 팀 홈(공개 정보)만
// 보고, 팀원 전용 탭은 각 화면이 팀 홈으로 돌려보낸다.
const COPY = {
  leaderOnly: {
    description: "팀 정보 수정·팀원 관리는 팀장만 할 수 있어요.",
    title: "팀장만 쓸 수 있어요",
  },
  notFound: {
    description: "해체됐거나 주소가 잘못된 팀이에요.",
    title: "없는 팀이에요",
  },
} as const;

interface TeamFallbackProps {
  kind: keyof typeof COPY;
  /** leaderOnly일 때 돌아갈 팀 */
  teamId?: number;
}

function TeamFallback({ kind, teamId }: TeamFallbackProps) {
  const navigate = useNavigate();
  const copy = COPY[kind];

  useScreenHeader(useMemo(() => <ScreenHeader />, []));

  return (
    <ScreenBody className="flex flex-col justify-center">
      <EmptyState
        action={
          teamId !== undefined
            ? {
                label: "팀 홈",
                onClick: () => navigate(`/team/${teamId}`, { replace: true }),
              }
            : {
                label: "내 팀",
                onClick: () => navigate("/crew?tab=team", { replace: true }),
              }
        }
        description={copy.description}
        title={copy.title}
      />
    </ScreenBody>
  );
}

export default TeamFallback;
