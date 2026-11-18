import { Typography, useToast } from "@wanteddev/wds";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BottomActionArea from "@/components/ui/BottomActionArea";
import ConfirmSheet from "@/components/ui/ConfirmSheet";
import EmptyState from "@/components/ui/EmptyState";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SelectField from "@/components/ui/SelectField";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import PerformanceFormFields, {
  EMPTY_PERFORMANCE_FORM,
  isPerformanceFormComplete,
  toPerformanceForm,
} from "@/features/show/components/PerformanceFormFields";
import { canManagePerformance } from "@/features/show/performanceAccess";
import { PERFORMANCE_STATUS_LABEL } from "@/lib/domain/labels";
import type { PerformanceStatus } from "@/lib/domain/types";
import { getPerformance, toId } from "@/mocks/selectors";

// 공연 관리 — 모임장(서버 canEdit) 전용, 공연 상세 ⋮ → 공연 관리. 상태 바꾸기(PATCH status)는 고르는
// 즉시 반영되고, 정보 수정(PUT)은 아래 저장으로 보낸다. 폼은 Figma 21 모양.
// 종료·취소는 서버가 소속 팀을 모두 해체하고 되돌릴 수 없게 막아서 확정 시트로 한 번 더 묻는다.
// 끝난 공연은 정보도 상태도 바꿀 수 없다.

const STATUS_OPTIONS = (
  ["PLANNED", "RECRUITING", "DONE", "CANCELED"] as PerformanceStatus[]
).map((status) => ({ label: PERFORMANCE_STATUS_LABEL[status], value: status }));

const FINISH_CONFIRM: Partial<
  Record<PerformanceStatus, { title: string; confirmLabel: string }>
> = {
  CANCELED: { confirmLabel: "공연 취소", title: "공연을 취소할까요?" },
  DONE: { confirmLabel: "종료", title: "공연을 종료할까요?" },
};

function ShowManageScreen() {
  const navigate = useNavigate();
  const toast = useToast();
  const { showId } = useParams();
  const performance = getPerformance(toId(showId));
  const [form, setForm] = useState(() =>
    performance ? toPerformanceForm(performance) : EMPTY_PERFORMANCE_FORM,
  );
  const [status, setStatus] = useState<PerformanceStatus>(
    performance?.status ?? "PLANNED",
  );
  // 확정 시트가 닫히는 동안에도 문구가 남도록 고른 상태와 열림을 따로 둔다.
  const [pendingStatus, setPendingStatus] = useState<PerformanceStatus>("DONE");
  const [confirmOpen, setConfirmOpen] = useState(false);

  useScreenHeader(useMemo(() => <ScreenHeader title="공연 관리" />, []));

  if (!performance) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyState
          description="삭제됐거나 주소가 잘못된 공연이에요"
          title="없는 공연이에요"
        />
      </div>
    );
  }

  if (!canManagePerformance(performance)) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyState
          description="공연 관리는 모임장만 할 수 있어요"
          title="관리 권한이 없어요"
        />
      </div>
    );
  }

  const finished = status === "DONE" || status === "CANCELED";
  const finishConfirm = FINISH_CONFIRM[pendingStatus];

  const applyStatus = (next: PerformanceStatus) => {
    setStatus(next);
    toast({ content: "공연 상태를 바꿨어요", variant: "positive" });
  };

  const changeStatus = (next: PerformanceStatus) => {
    if (next === status) return;
    if (FINISH_CONFIRM[next]) {
      setPendingStatus(next);
      setConfirmOpen(true);
      return;
    }
    applyStatus(next);
  };

  const save = () => {
    toast({ content: "공연 정보를 저장했어요", variant: "positive" });
    navigate(-1);
  };

  return (
    <>
      <ScreenBody className="flex flex-col gap-6 px-5 pt-2">
        <SelectField
          disabled={finished}
          label="공연 상태"
          message={finished ? undefined : "종료·취소로 바꾸면 되돌릴 수 없어요"}
          onChange={changeStatus}
          options={STATUS_OPTIONS}
          value={status}
        />
        {finished ? (
          <Typography color="semantic.label.assistive" variant="label2">
            끝난 공연은 소속 팀이 모두 해체돼 정보를 바꿀 수 없어요
          </Typography>
        ) : (
          <PerformanceFormFields onChange={setForm} value={form} />
        )}
      </ScreenBody>

      {!finished && (
        <BottomActionArea
          disabled={!isPerformanceFormComplete(form)}
          label="저장"
          onClick={save}
        />
      )}

      <ConfirmSheet
        confirmLabel={finishConfirm?.confirmLabel ?? ""}
        description="소속 팀이 모두 해체되고 되돌릴 수 없어요."
        onConfirm={() => applyStatus(pendingStatus)}
        onOpenChange={setConfirmOpen}
        open={confirmOpen}
        title={finishConfirm?.title ?? ""}
      />
    </>
  );
}

export default ShowManageScreen;
