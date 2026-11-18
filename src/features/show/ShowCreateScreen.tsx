import { useToast } from "@wanteddev/wds";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BottomActionArea from "@/components/ui/BottomActionArea";
import EmptyState from "@/components/ui/EmptyState";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import PerformanceFormFields, {
  EMPTY_PERFORMANCE_FORM,
  isPerformanceFormComplete,
} from "@/features/show/components/PerformanceFormFields";
import {
  getGroup,
  getGroupPerformances,
  isUpcoming,
  toId,
} from "@/mocks/selectors";

// 공연 만들기 — 공연은 모임에 속해서 모임 홈에서 들어오고(/crew/:crewId/show/new), 서버 규칙상 모임장만
// 만들 수 있다(진입 버튼도 모임장에게만 보인다). 폼은 Figma 21 모양. 만든 뒤에는 완료 화면 없이 공연
// 상세로 바로 간다(replace + 토스트).
function ShowCreateScreen() {
  const navigate = useNavigate();
  const toast = useToast();
  const { crewId } = useParams();
  const group = getGroup(toId(crewId));
  const [form, setForm] = useState(EMPTY_PERFORMANCE_FORM);
  // 지난 날짜는 고를 수 없다(서버 @Future). 렌더마다 새 Date가 생기지 않게 한 번만 만든다.
  const [today] = useState(() => new Date());

  useScreenHeader(useMemo(() => <ScreenHeader title="공연 만들기" />, []));

  if (!group) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyState
          description="삭제됐거나 주소가 잘못된 모임이에요"
          title="없는 모임이에요"
        />
      </div>
    );
  }

  if (group.myRole !== "OWNER") {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyState
          description="공연은 모임장만 만들 수 있어요"
          title="공연을 만들 수 없어요"
        />
      </div>
    );
  }

  const create = () => {
    toast({ content: "공연을 만들었어요", variant: "positive" });
    // 백엔드가 붙기 전이라 새 공연 id를 받을 수 없다 — 이 모임의 진행 중 공연이 있으면 그 상세로, 없으면
    // 모임 홈으로 보낸다. 서버에 붙이면 응답의 id로 /show/:id에 간다. 폼으로 되돌아오지 않게 replace.
    const created = getGroupPerformances(group.id).find(isUpcoming);
    navigate(created ? `/show/${created.id}` : `/crew/${group.id}`, {
      replace: true,
    });
  };

  return (
    <>
      <ScreenBody className="flex flex-col gap-6 px-5 pt-2">
        <PerformanceFormFields
          minDate={today}
          onChange={setForm}
          value={form}
        />
      </ScreenBody>
      <BottomActionArea
        disabled={!isPerformanceFormComplete(form)}
        label="만들기"
        onClick={create}
      />
    </>
  );
}

export default ShowCreateScreen;
