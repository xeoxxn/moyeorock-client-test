import { useNavigate } from "react-router-dom";

import EmptyState from "@/components/ui/EmptyState";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import type { Team } from "@/lib/domain/types";

// 팀 화면에 들어왔지만 보여줄 수 없을 때(없는 팀 · 권한 없음 · 독립 팀의 공연 탭). 탭과 버튼은
// 권한대로 숨기지만, 알림·공고·주소창으로 바로 들어오는 길이 있어서 화면마다 이걸로 막는다.
type TeamFallbackProps =
  | { kind: "notFound" }
  | { kind: "memberOnly" | "leaderOnly" | "noPerformance"; team: Team };

const COPY = {
  leaderOnly: {
    description: "팀 관리·곡 추가·팀원 초대는 팀장만 할 수 있어요.",
    title: "팀장만 쓸 수 있어요",
  },
  memberOnly: {
    description: "팀에 들어가면 선택곡·일정·멤버를 함께 볼 수 있어요.",
    title: "팀원만 볼 수 있어요",
  },
  noPerformance: {
    description:
      "독립 팀은 공연 없이 합주해요. 공연에 나가려면 모임 공연에서 공연 팀을 만들어 주세요.",
    title: "공연에 나가지 않는 팀이에요",
  },
  notFound: {
    description: "해체됐거나 주소가 잘못된 팀이에요.",
    title: "없는 팀이에요",
  },
} as const;

function TeamFallback(props: TeamFallbackProps) {
  const navigate = useNavigate();
  const copy = COPY[props.kind];

  useScreenHeader(
    <ScreenHeader title={props.kind === "notFound" ? "" : props.team.name} />,
  );

  const action =
    props.kind === "notFound"
      ? {
          label: "내 팀 목록",
          onClick: () => navigate("/crew?tab=team", { replace: true }),
        }
      : {
          label: "팀 홈으로",
          onClick: () => navigate(`/team/${props.team.id}`, { replace: true }),
        };

  return (
    <div className="flex flex-1 flex-col justify-center px-5">
      <EmptyState
        action={action}
        description={copy.description}
        title={copy.title}
      />
    </div>
  );
}

export default TeamFallback;
