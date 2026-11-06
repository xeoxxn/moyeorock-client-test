import { useToast } from "@wanteddev/wds";
import { useNavigate, useParams } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useAppAlert } from "@/components/ui/useAppAlert";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import CrewFallback, {
  CrewNotFound,
  CrewOwnerOnly,
} from "@/features/crew/components/CrewFallback";
import CrewNoticeForm from "@/features/crew/components/CrewNoticeForm";
import type { Group, Notice } from "@/lib/domain/types";
import { getGroup, getNotice, toId } from "@/mocks/selectors";

// Figma: 모임/12 공지 수정 (nodeId 142:19369) — PUT/DELETE /notices/{id}, 모임장 전용. 모임 홈의
// 공지 시트에서 "수정"으로 들어온다. 저장·삭제 뒤에는 모임 홈으로 replace.
const HEADER_TITLE = "공지 수정";

function CrewNoticeEdit({ group, notice }: { group: Group; notice: Notice }) {
  const navigate = useNavigate();
  const alert = useAppAlert();
  const toast = useToast();

  useScreenHeader(<ScreenHeader title={HEADER_TITLE} />);

  const backToGroup = () => navigate(`/crew/${group.id}`, { replace: true });

  const remove = async () => {
    const result = await alert({
      cancel: "취소",
      confirm: "삭제",
      content: "삭제한 공지는 되돌릴 수 없어요.",
      title: "공지를 삭제할까요?",
    });
    if (result !== "confirm") return;
    toast({ content: "공지를 삭제했어요" });
    backToGroup();
  };

  return (
    <CrewNoticeForm
      description="수정한 내용은 바로 반영돼요"
      heading="공지를 수정할게요"
      initialValues={{
        body: notice.body,
        isPinned: notice.isPinned,
        title: notice.title,
      }}
      onDelete={remove}
      onSubmit={() => {
        toast({ content: "공지를 수정했어요", variant: "positive" });
        backToGroup();
      }}
      submitLabel="수정 완료"
    />
  );
}

function CrewNoticeEditScreen() {
  const navigate = useNavigate();
  const { crewId, noticeId } = useParams();
  const group = getGroup(toId(crewId));
  const notice = getNotice(toId(noticeId));

  if (!group) return <CrewNotFound headerTitle={HEADER_TITLE} />;
  if (!notice || notice.groupId !== group.id) {
    return (
      <CrewFallback
        action={{
          label: "모임 홈으로",
          onClick: () => navigate(`/crew/${group.id}`, { replace: true }),
        }}
        description="삭제됐거나 주소가 잘못된 공지예요."
        headerTitle={HEADER_TITLE}
        title="없는 공지예요"
      />
    );
  }
  if (group.myRole !== "OWNER") {
    return <CrewOwnerOnly crewId={group.id} headerTitle={HEADER_TITLE} />;
  }
  return <CrewNoticeEdit group={group} notice={notice} />;
}

export default CrewNoticeEditScreen;
