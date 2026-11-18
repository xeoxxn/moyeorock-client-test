import { Button, useToast } from "@wanteddev/wds";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import MediaRow from "@/components/list/MediaRow";
import Cover, { coverToneOf } from "@/components/music/Cover";
import ConfirmSheet from "@/components/ui/ConfirmSheet";
import EmptyState from "@/components/ui/EmptyState";
import HeroTabs from "@/components/ui/HeroTabs";
import { innerClick } from "@/components/ui/listCellEvents";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Status, { type StatusTone } from "@/components/ui/Status";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import { formatRelative } from "@/lib/domain/format";
import {
  INSTRUMENT_LABEL,
  JOIN_STATUS_LABEL,
  TARGET_TYPE_LABEL,
} from "@/lib/domain/labels";
import type {
  Invitation,
  JoinRequest,
  JoinStatus,
  TargetType,
} from "@/lib/domain/types";
import {
  getMyJoinRequests,
  getReceivedInvitations,
  getTargetName,
  getUser,
} from "@/mocks/selectors";

// 받은 초대 + 내 신청(/mine/invitations) — 마이(Figma 07)의 "받은 신청·초대" 메뉴에서 들어온다. Figma
// 화면은 없다. 두 목록은 같은 화면의 두 탭이고 ?tab=received|applied에 묶는다(가입 신청 시트가 신청
// 직후 ?tab=applied로 바로 연다). 탭을 바꿀 땐 replace로 히스토리를 쌓지 않는다(HeroTabs).

type InvitationTab = "received" | "applied";

function toTab(value: string | null): InvitationTab {
  return value === "applied" ? "applied" : "received";
}

function targetPath(targetType: TargetType, targetId: number) {
  return targetType === "TEAM" ? `/team/${targetId}` : `/crew/${targetId}`;
}

function TargetCover({
  targetId,
  targetType,
}: {
  targetType: TargetType;
  targetId: number;
}) {
  return (
    <Cover
      className="size-14 rounded-sm"
      tone={coverToneOf(targetType === "TEAM" ? "team" : "group", targetId)}
    />
  );
}

/** 신청·초대 상태 — 대기는 Figma Status의 "대기"(neutral) */
const JOIN_STATUS_TONE: Record<JoinStatus, StatusTone> = {
  APPROVED: "positive",
  CANCELED: "neutral",
  PENDING: "neutral",
  REJECTED: "negative",
};

const byNewest = (a: { createdAt: string }, b: { createdAt: string }) =>
  b.createdAt.localeCompare(a.createdAt);

function MineInvitationsScreen() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const tab = toTab(searchParams.get("tab"));
  // 수락·거절·취소는 서버 PATCH …/status 자리 — 목업에선 화면 안에서만 상태를 바꿔 둔다.
  const [invitationStatus, setInvitationStatus] = useState<
    Record<number, JoinStatus>
  >({});
  const [requestStatus, setRequestStatus] = useState<
    Record<number, JoinStatus>
  >({});
  const [cancelTarget, setCancelTarget] = useState<{
    request: JoinRequest;
    targetName: string;
  } | null>(null);
  // 닫히는 동안 문구가 비지 않게 대상은 남겨 두고 열림만 따로 든다.
  const [cancelOpen, setCancelOpen] = useState(false);

  useScreenHeader(useMemo(() => <ScreenHeader title="신청·초대" />, []));

  const invitations: Invitation[] = getReceivedInvitations()
    .map((item) => ({
      ...item,
      status: invitationStatus[item.id] ?? item.status,
    }))
    .sort(byNewest);
  const requests: JoinRequest[] = getMyJoinRequests()
    .map((item) => ({ ...item, status: requestStatus[item.id] ?? item.status }))
    .sort(byNewest);

  // 수락 → 팀 홈(모임 초대면 모임 홈). 들어간 뒤 뒤로가기로 이 목록에 돌아올 수 있게 push.
  const accept = (invitation: Invitation, targetName: string) => {
    setInvitationStatus((prev) => ({ ...prev, [invitation.id]: "APPROVED" }));
    toast({
      content: `${targetName}에 함께하게 됐어요`,
      variant: "positive",
    });
    navigate(targetPath(invitation.targetType, invitation.targetId));
  };

  const decline = (invitation: Invitation) => {
    setInvitationStatus((prev) => ({ ...prev, [invitation.id]: "REJECTED" }));
    toast({ content: "초대를 거절했어요", variant: "positive" });
  };

  const cancelRequest = (request: JoinRequest) => {
    setRequestStatus((prev) => ({ ...prev, [request.id]: "CANCELED" }));
    toast({ content: "신청을 취소했어요", variant: "positive" });
  };

  const renderInvitation = (invitation: Invitation) => {
    const targetName = getTargetName(
      invitation.targetType,
      invitation.targetId,
    );
    const inviter = getUser(invitation.inviterId);
    const pending = invitation.status === "PENDING";
    const offer =
      invitation.targetType === "TEAM" && invitation.instrument
        ? `${INSTRUMENT_LABEL[invitation.instrument]} 제안`
        : `${TARGET_TYPE_LABEL[invitation.targetType]} 초대`;

    return (
      <MediaRow
        footer={
          pending &&
          targetName && (
            <span className="flex gap-2 pt-1.5">
              <Button
                color="assistive"
                onClick={innerClick(() => decline(invitation))}
                size="small"
                variant="solid"
              >
                거절
              </Button>
              <Button
                color="primary"
                onClick={innerClick(() => accept(invitation, targetName))}
                size="small"
                variant="solid"
              >
                수락
              </Button>
            </span>
          )
        }
        key={invitation.id}
        leading={
          <TargetCover
            targetId={invitation.targetId}
            targetType={invitation.targetType}
          />
        }
        meta={[
          offer,
          inviter?.nickname ?? "탈퇴한 사용자",
          formatRelative(invitation.createdAt),
        ].join(" · ")}
        onClick={
          targetName
            ? () =>
                navigate(targetPath(invitation.targetType, invitation.targetId))
            : undefined
        }
        overline={
          pending ? undefined : (
            <Status tone={JOIN_STATUS_TONE[invitation.status]}>
              {JOIN_STATUS_LABEL[invitation.status]}
            </Status>
          )
        }
        title={
          targetName ?? `삭제된 ${TARGET_TYPE_LABEL[invitation.targetType]}`
        }
      />
    );
  };

  const renderRequest = (request: JoinRequest) => {
    const targetName = getTargetName(request.targetType, request.targetId);
    const pending = request.status === "PENDING";
    const kind = request.recruitPostId
      ? `${TARGET_TYPE_LABEL[request.targetType]} 모집글 지원`
      : `${TARGET_TYPE_LABEL[request.targetType]} 가입 신청`;

    return (
      <MediaRow
        footer={
          pending &&
          targetName && (
            <span className="flex gap-2 pt-1.5">
              <Button
                color="assistive"
                onClick={innerClick(() => {
                  setCancelTarget({ request, targetName });
                  setCancelOpen(true);
                })}
                size="small"
                variant="outlined"
              >
                취소
              </Button>
            </span>
          )
        }
        key={request.id}
        leading={
          <TargetCover
            targetId={request.targetId}
            targetType={request.targetType}
          />
        }
        meta={[
          kind,
          request.instrument ? INSTRUMENT_LABEL[request.instrument] : undefined,
          formatRelative(request.createdAt),
        ]
          .filter(Boolean)
          .join(" · ")}
        onClick={
          targetName
            ? () => navigate(targetPath(request.targetType, request.targetId))
            : undefined
        }
        overline={
          <Status tone={JOIN_STATUS_TONE[request.status]}>
            {JOIN_STATUS_LABEL[request.status]}
          </Status>
        }
        title={targetName ?? `삭제된 ${TARGET_TYPE_LABEL[request.targetType]}`}
      />
    );
  };

  const tabs = [
    {
      label: `받은 초대 ${invitations.length}`,
      path: "/mine/invitations?tab=received",
      value: "received",
    },
    {
      label: `내 신청 ${requests.length}`,
      path: "/mine/invitations?tab=applied",
      value: "applied",
    },
  ];

  const emptyState =
    tab === "received" ? (
      <EmptyState
        description="팀장·모임장이 초대하면 여기에서 수락할 수 있어요"
        title="받은 초대가 없어요"
      />
    ) : (
      <EmptyState
        action={{ label: "모집글 보기", onClick: () => navigate("/board") }}
        description="모집글에 지원하면 여기에서 결과를 볼 수 있어요"
        title="보낸 신청이 없어요"
      />
    );
  const rows =
    tab === "received"
      ? invitations.map(renderInvitation)
      : requests.map(renderRequest);

  return (
    <>
      <HeroTabs tabs={tabs} value={tab} />
      <ScreenBody className="flex flex-col pt-2">
        {rows.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            {emptyState}
          </div>
        ) : (
          rows
        )}
      </ScreenBody>
      <ConfirmSheet
        cancelLabel="닫기"
        confirmLabel="신청 취소"
        description={
          cancelTarget
            ? `${cancelTarget.targetName}에 보낸 신청을 취소해요.`
            : undefined
        }
        onConfirm={() => {
          if (cancelTarget) cancelRequest(cancelTarget.request);
        }}
        onOpenChange={setCancelOpen}
        open={cancelOpen}
        title="신청을 취소할까요?"
      />
    </>
  );
}

export default MineInvitationsScreen;
