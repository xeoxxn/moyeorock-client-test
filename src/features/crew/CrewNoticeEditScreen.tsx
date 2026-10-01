import { IconChevronLeft } from "@wanteddev/wds-icon";
import { useNavigate, useParams } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import CrewNoticeForm from "@/features/crew/components/CrewNoticeForm";

// Figma: 모임/12 공지 수정 (nodeId 142:19369). 실제로는 API에서 받아올 기존 공지 값을
// 지금은 Figma 샘플 콘텐츠로 자리표시했다(백엔드 부재).
function CrewNoticeEditScreen() {
  const navigate = useNavigate();
  const { crewId } = useParams<{ crewId: string }>();

  useScreenHeader(
    <ScreenHeader
      leading={
        <button onClick={() => navigate(-1)} type="button">
          <IconChevronLeft className="size-6 text-label-normal" />
        </button>
      }
      title="공지 수정"
      variant="normal"
    />,
  );

  return (
    <CrewNoticeForm
      defaultContent="9월 20일까지 팀 단위로 참가 신청을 받아요. 공연 페이지에서 팀을 만들어 주세요."
      defaultTitle="가을 정기공연 참가 신청 안내"
      description="수정한 내용은 바로 반영돼요"
      heading="공지를 수정할게요"
      onDelete={() => navigate(`/crew/${crewId}`)}
      onSubmit={() => navigate(`/crew/${crewId}`)}
      submitLabel="수정 완료"
    />
  );
}

export default CrewNoticeEditScreen;
