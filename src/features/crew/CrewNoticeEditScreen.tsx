import { useToast } from "@wanteddev/wds";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ConfirmSheet from "@/components/ui/ConfirmSheet";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import CrewFallback, {
  CrewNotFound,
  CrewOwnerOnly,
} from "@/features/crew/components/CrewFallback";
import CrewNoticeForm from "@/features/crew/components/CrewNoticeForm";
import type { Group, Notice } from "@/lib/domain/types";
import { getGroup, getNotice, toId } from "@/mocks/selectors";

// 공지 수정 — PUT/DELETE /notices/{id}, 현재 모임장만(서버). 모임장이 모임 홈의 공지를 누르면 들어온다.
// 삭제는 되돌릴 수 없어 확정 시트로 한 번 더 묻는다. 저장·삭제 뒤에는 모임 홈으로 replace.
const HEADER_TITLE = "공지 수정";

function CrewNoticeEdit({ group, notice }: { group: Group; notice: Notice }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);

  useScreenHeader(useMemo(() => <ScreenHeader title={HEADER_TITLE} />, []));

  const backToGroup = () => navigate(`/crew/${group.id}`, { replace: true });

  return (
    <>
      <CrewNoticeForm
        initialValues={{
          body: notice.body,
          isPinned: notice.isPinned,
          title: notice.title,
        }}
        onDelete={() => setDeleteOpen(true)}
        onSubmit={() => {
          toast({ content: "공지를 저장했어요", variant: "positive" });
          backToGroup();
        }}
        submitLabel="저장"
      />
      <ConfirmSheet
        confirmLabel="삭제"
        description="삭제한 공지는 되돌릴 수 없어요."
        onConfirm={() => {
          toast({ content: "공지를 삭제했어요" });
          backToGroup();
        }}
        onOpenChange={setDeleteOpen}
        open={deleteOpen}
        title="공지를 삭제할까요?"
      />
    </>
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
          label: "모임 홈",
          onClick: () => navigate(`/crew/${group.id}`, { replace: true }),
        }}
        description="삭제됐거나 주소가 잘못된 공지예요"
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
