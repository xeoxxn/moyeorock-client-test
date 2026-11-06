import { useNavigate } from "react-router-dom";

import EmptyState from "@/components/ui/EmptyState";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

interface CrewFallbackProps {
  title: string;
  description: string;
  headerTitle?: string;
  action?: { label: string; onClick: () => void };
}

// 없는 모임·공지이거나, 모임장 전용 화면에 권한 없이 들어왔을 때. 헤더(뒤로가기)는 남겨서 막다른
// 화면이 되지 않게 한다. 권한 없는 사람에게는 애초에 버튼을 숨기지만, 주소로 직접 들어올 수 있다.
function CrewFallback({
  action,
  description,
  headerTitle,
  title,
}: CrewFallbackProps) {
  useScreenHeader(<ScreenHeader title={headerTitle} />);

  return (
    <div className="flex flex-1 flex-col justify-center pb-16">
      <EmptyState action={action} description={description} title={title} />
    </div>
  );
}

export function CrewNotFound({ headerTitle }: { headerTitle?: string }) {
  const navigate = useNavigate();
  return (
    <CrewFallback
      action={{
        label: "내 모임 보기",
        onClick: () => navigate("/crew", { replace: true }),
      }}
      description="해체됐거나 주소가 잘못된 모임이에요."
      headerTitle={headerTitle}
      title="없는 모임이에요"
    />
  );
}

export function CrewOwnerOnly({
  crewId,
  headerTitle,
}: {
  crewId: number;
  headerTitle?: string;
}) {
  const navigate = useNavigate();
  return (
    <CrewFallback
      action={{
        label: "모임 홈으로",
        onClick: () => navigate(`/crew/${crewId}`, { replace: true }),
      }}
      description="모임 정보 수정·가입 승인·공지는 모임장만 할 수 있어요."
      headerTitle={headerTitle}
      title="모임장만 볼 수 있어요"
    />
  );
}

export default CrewFallback;
