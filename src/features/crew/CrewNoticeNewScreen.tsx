import { useToast } from "@wanteddev/wds";
import { useMemo } from "react";
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

// 공지 쓰기 — POST /groups/{id}/notices, 현재 모임장만(서버). 모임 홈 공지 구역의 "쓰기"와 모임 설정에서
// 들어온다. 올리면 모임 홈으로 replace — 뒤로가기로 다 쓴 폼에 다시 들어오지 않게.
const HEADER_TITLE = "공지 쓰기";

function CrewNoticeNew({ group }: { group: Group }) {
  const navigate = useNavigate();
  const toast = useToast();

  useScreenHeader(useMemo(() => <ScreenHeader title={HEADER_TITLE} />, []));

  return (
    <CrewNoticeForm
      onSubmit={() => {
        toast({ content: "공지를 올렸어요", variant: "positive" });
        navigate(`/crew/${group.id}`, { replace: true });
      }}
      submitLabel="올리기"
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
