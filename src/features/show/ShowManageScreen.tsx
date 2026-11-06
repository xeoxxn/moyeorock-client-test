import {
  List,
  ListCell,
  ListCellContent,
  SectionMessage,
  Typography,
  useToast,
} from "@wanteddev/wds";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Badge from "@/components/ui/Badge";
import BottomActionArea from "@/components/ui/BottomActionArea";
import EmptyState from "@/components/ui/EmptyState";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SectionHeader from "@/components/ui/SectionHeader";
import SelectField from "@/components/ui/SelectField";
import { useAppAlert } from "@/components/ui/useAppAlert";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import PerformanceFormFields, {
  EMPTY_PERFORMANCE_FORM,
  isPerformanceFormComplete,
  toPerformanceForm,
} from "@/features/show/components/PerformanceFormFields";
import ShowSectionTabBar from "@/features/show/components/ShowSectionTabBar";
import { canManagePerformance } from "@/features/show/performanceAccess";
import { PERFORMANCE_STATUS_LABEL } from "@/lib/domain/labels";
import type { PerformanceStatus } from "@/lib/domain/types";
import { getPerformance, toId } from "@/mocks/selectors";

// Figma: 공연/02 공연 관리 — 모임장(서버 canEdit) 전용. Figma의 "참가 팀 · 멤버 관리"(팀별 관리 버튼)는
// 뺐다: 서버에서 팀 관리(팀원·위임·해체)는 그 팀의 팀장만 할 수 있어서 모임장이 눌러도 막힌다.

const STATUS_OPTIONS = (
  ["PLANNED", "RECRUITING", "DONE", "CANCELED"] as PerformanceStatus[]
).map((status) => ({ label: PERFORMANCE_STATUS_LABEL[status], value: status }));

// 종료·취소는 서버가 소속 팀을 모두 해체하고 되돌릴 수 없게 막는다 — 누르기 전에 한 번 더 묻는다.
const FINISH_CONFIRM: Partial<
  Record<PerformanceStatus, { title: string; confirm: string }>
> = {
  CANCELED: { confirm: "공연 취소", title: "공연을 취소할까요?" },
  DONE: { confirm: "종료하기", title: "공연을 종료할까요?" },
};

function ShowManageScreen() {
  const navigate = useNavigate();
  const alert = useAppAlert();
  const toast = useToast();
  const { showId } = useParams();
  const performance = getPerformance(toId(showId));
  const [form, setForm] = useState(() =>
    performance ? toPerformanceForm(performance) : EMPTY_PERFORMANCE_FORM,
  );
  const [status, setStatus] = useState<PerformanceStatus>(
    performance?.status ?? "PLANNED",
  );

  useScreenHeader(<ScreenHeader title="공연" />);

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
          action={{
            label: "공연 정보 보기",
            onClick: () =>
              navigate(`/show/${performance.id}`, { replace: true }),
          }}
          description="공연 관리는 모임장만 할 수 있어요"
          title="관리 권한이 없어요"
        />
      </div>
    );
  }

  const finished = status === "DONE" || status === "CANCELED";
  const submittedCount = performance.setlist.length;

  const changeStatus = async (next: PerformanceStatus) => {
    if (next === status) return;
    const finish = FINISH_CONFIRM[next];
    if (finish) {
      const result = await alert({
        cancel: "닫기",
        confirm: finish.confirm,
        content: "소속 팀이 모두 해체되고 되돌릴 수 없어요.",
        title: finish.title,
      });
      if (result !== "confirm") return;
    }
    setStatus(next);
    toast({ content: "공연 상태를 바꿨어요", variant: "positive" });
  };

  const save = () => {
    toast({ content: "공연 정보를 저장했어요", variant: "positive" });
  };

  return (
    <>
      <ShowSectionTabBar active="manage" performance={performance} />
      <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto">
        <section className="flex flex-col gap-5 px-5 pt-5 pb-6">
          <div className="flex flex-col items-start gap-1.5">
            <Typography
              as="h1"
              color="semantic.label.normal"
              variant="title3"
              weight="bold"
            >
              {performance.title}
            </Typography>
            <Badge tone="outline">모임장 전용</Badge>
          </div>

          {finished && (
            <SectionMessage
              description="소속 팀이 모두 해체돼 공연 정보와 상태를 바꿀 수 없어요."
              variant="cautionary"
            >
              끝난 공연은 수정할 수 없어요
            </SectionMessage>
          )}

          <SelectField
            disabled={finished}
            label="공연 상태"
            message={
              finished ? undefined : "종료·취소로 바꾸면 되돌릴 수 없어요"
            }
            onChange={changeStatus}
            options={STATUS_OPTIONS}
            value={status}
          />

          <List>
            <ListCell
              // WDS ListCell은 행을 누르면 안의 버튼(role="button"인 chevron 포함)을 한 번 더 눌러 줘서
              // 이동이 두 번 일어난다 — 행 자체가 이동하므로 그 전달을 막는다.
              onClick={(event) => {
                event.preventDefault();
                navigate(`/show/${performance.id}/setlist/confirm`);
              }}
              textProps={{
                caption: performance.setlistConfirmed
                  ? `확정했어요 · ${submittedCount}곡`
                  : submittedCount > 0
                    ? `팀들이 넘긴 곡 ${submittedCount}개 · 확정 전`
                    : "아직 팀들이 넘긴 곡이 없어요",
                weight: "bold",
              }}
              trailingContent={<ListCellContent variant="chevron" />}
            >
              셋리스트 확정
            </ListCell>
          </List>
        </section>

        {!finished && (
          <>
            <div className="h-3 bg-surface" />
            <section className="flex flex-col gap-4 px-5 pt-6 pb-8">
              <SectionHeader title="공연 정보 수정" />
              <PerformanceFormFields onChange={setForm} value={form} />
            </section>
          </>
        )}
      </div>
      {!finished && (
        <BottomActionArea
          disabled={!isPerformanceFormComplete(form)}
          label="저장"
          onClick={save}
        />
      )}
    </>
  );
}

export default ShowManageScreen;
