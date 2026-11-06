import { SectionMessage } from "@wanteddev/wds";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BottomActionArea from "@/components/ui/BottomActionArea";
import EmptyState from "@/components/ui/EmptyState";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import PerformanceFormFields, {
  EMPTY_PERFORMANCE_FORM,
  isPerformanceFormComplete,
} from "@/features/show/components/PerformanceFormFields";
import { getGroup, toId } from "@/mocks/selectors";

// Figma: 공연/03 공연 만들기. 공연은 모임에 속해서 모임 공연 탭(/crew/:crewId/show)에서 들어오고,
// 서버 규칙상 모임장만 만들 수 있다(진입 버튼도 모임장에게만 보인다).
function ShowCreateScreen() {
  const navigate = useNavigate();
  const { crewId } = useParams();
  const group = getGroup(toId(crewId));
  const [form, setForm] = useState(EMPTY_PERFORMANCE_FORM);

  useScreenHeader(<ScreenHeader title="공연 만들기" />);

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
    // 백엔드가 붙기 전이라 새 공연 id를 받을 수 없다 — 데모 공연(1)의 완료 화면으로 보낸다.
    // 완료 화면에서 뒤로가기로 이 폼에 다시 들어오지 않게 replace.
    navigate("/show/1/complete", { replace: true });
  };

  return (
    <>
      <div className="scrollbar-hidden flex flex-1 flex-col gap-6 overflow-y-auto px-5 pt-2 pb-6">
        <SectionMessage variant="info">
          {group.name}에서 운영할 공연이에요
        </SectionMessage>
        <PerformanceFormFields
          minDate={new Date()}
          onChange={setForm}
          value={form}
        />
      </div>
      <BottomActionArea
        disabled={!isPerformanceFormComplete(form)}
        label="공연 만들기"
        onClick={create}
      />
    </>
  );
}

export default ShowCreateScreen;
