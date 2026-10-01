import { IconChevronLeft } from "@wanteddev/wds-icon";
import { useNavigate, useParams } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import CrewNoticeForm from "@/features/crew/components/CrewNoticeForm";

// Figma: 모임/11 공지 작성 (nodeId 142:19296)
function CrewNoticeNewScreen() {
  const navigate = useNavigate();
  const { crewId } = useParams<{ crewId: string }>();

  useScreenHeader(
    <ScreenHeader
      leading={
        <button onClick={() => navigate(-1)} type="button">
          <IconChevronLeft className="size-6 text-label-normal" />
        </button>
      }
      title="공지 작성"
      variant="normal"
    />,
  );

  return (
    <CrewNoticeForm
      description="모임원 모두에게 알림이 가요"
      heading="모임에 알릴 소식을 적어주세요"
      onSubmit={() => navigate(`/crew/${crewId}`)}
      submitLabel="공지 올리기"
    />
  );
}

export default CrewNoticeNewScreen;
