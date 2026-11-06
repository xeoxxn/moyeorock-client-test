import { useToast } from "@wanteddev/wds";
import { useNavigate, useParams } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import {
  CrewNotFound,
  CrewOwnerOnly,
} from "@/features/crew/components/CrewFallback";
import CrewNoticeForm from "@/features/crew/components/CrewNoticeForm";
import type { Group } from "@/lib/domain/types";
import { getGroup, toId } from "@/mocks/selectors";

// Figma: 모임/11 공지 작성 (nodeId 142:19296) — POST /groups/{id}/notices, 모임장 전용.
// 올리면 모임 홈으로 replace — 뒤로가기로 다 쓴 폼에 다시 들어오지 않게.
const HEADER_TITLE = "공지 작성";

function CrewNoticeNew({ group }: { group: Group }) {
  const navigate = useNavigate();
  const toast = useToast();

  useScreenHeader(<ScreenHeader title={HEADER_TITLE} />);

  return (
    <CrewNoticeForm
      description="모임원 모두에게 알림이 가요"
      heading="모임에 알릴 소식을 적어주세요"
      onSubmit={() => {
        toast({ content: "공지를 올렸어요", variant: "positive" });
        navigate(`/crew/${group.id}`, { replace: true });
      }}
      submitLabel="공지 올리기"
    />
  );
}

function CrewNoticeNewScreen() {
  const { crewId } = useParams();
  const group = getGroup(toId(crewId));
  if (!group) return <CrewNotFound headerTitle={HEADER_TITLE} />;
  if (group.myRole !== "OWNER") {
    return <CrewOwnerOnly crewId={group.id} headerTitle={HEADER_TITLE} />;
  }
  return <CrewNoticeNew group={group} />;
}

export default CrewNoticeNewScreen;
