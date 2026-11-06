import {
  Avatar,
  List,
  ListCell,
  ListCellContent,
  Tab,
  TabList,
  TabListItem,
  TextButton,
  Typography,
  useToast,
} from "@wanteddev/wds";
import { IconMusicMicrophone, IconPersons } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { innerClick, rowClick } from "@/components/ui/listCellEvents";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useAppAlert } from "@/components/ui/useAppAlert";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import CaptionLines from "@/features/mine/components/CaptionLines";
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

// Figma: 마이/05 받은 초대 + 마이/06 내 신청 — 같은 "초대 · 신청" 화면의 두 탭이다. 탭은
// ?tab=received|applied에 묶는다(가입 신청 시트가 신청 직후 ?tab=applied로 바로 연다). 탭을 바꿀 땐
// replace로 히스토리를 쌓지 않는다.

type InvitationTab = "received" | "applied";

function toTab(value: string | null): InvitationTab {
  return value === "applied" ? "applied" : "received";
}

function targetPath(targetType: TargetType, targetId: number) {
  return targetType === "TEAM" ? `/team/${targetId}` : `/crew/${targetId}`;
}

const byNewest = (a: { createdAt: string }, b: { createdAt: string }) =>
  b.createdAt.localeCompare(a.createdAt);

function MineInvitationsScreen() {
  const navigate = useNavigate();
  const alert = useAppAlert();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = toTab(searchParams.get("tab"));
  // 수락·거절·취소는 서버 PATCH …/status 자리 — 목업에선 화면 안에서만 상태를 바꿔 둔다.
  const [invitationStatus, setInvitationStatus] = useState<
    Record<number, JoinStatus>
  >({});
  const [requestStatus, setRequestStatus] = useState<
    Record<number, JoinStatus>
  >({});

  useScreenHeader(<ScreenHeader title="초대 · 신청" />);

  const invitations: Invitation[] = getReceivedInvitations()
    .map((item) => ({
      ...item,
      status: invitationStatus[item.id] ?? item.status,
    }))
    .sort(byNewest);
  const requests: JoinRequest[] = getMyJoinRequests()
    .map((item) => ({ ...item, status: requestStatus[item.id] ?? item.status }))
    .sort(byNewest);

  // 마이/05 → 수락 → 팀/02 팀 홈(모임 초대면 모임 홈). 들어간 뒤 뒤로가기로 이 목록에 돌아올 수 있게 push.
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

  const cancelRequest = async (request: JoinRequest, targetName: string) => {
    const result = await alert({
      cancel: "닫기",
      confirm: "신청 취소",
      content: `${targetName}에 보낸 가입 신청을 취소해요.`,
      title: "신청을 취소할까요?",
    });
    if (result !== "confirm") return;
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
        ? `${INSTRUMENT_LABEL[invitation.instrument]} 세션 제안`
        : `${TARGET_TYPE_LABEL[invitation.targetType]} 초대`;

    return (
      <ListCell
        alignItems="center"
        disabled={!targetName}
        key={invitation.id}
        leadingContent={
          <ListCellContent variant="avatar">
            <Avatar size="large" variant="person" />
          </ListCellContent>
        }
        onClick={rowClick(() => {
          if (targetName) {
            navigate(targetPath(invitation.targetType, invitation.targetId));
          }
        })}
        textProps={{
          caption: (
            <CaptionLines
              lines={[
                `${offer} · ${inviter?.nickname ?? "탈퇴한 사용자"}`,
                invitation.message || undefined,
                formatRelative(invitation.createdAt),
              ]}
            />
          ),
          weight: "bold",
        }}
        trailingContent={
          <ListCellContent>
            {pending && targetName ? (
              <div className="flex items-center gap-2">
                <TextButton
                  color="assistive"
                  onClick={innerClick(() => decline(invitation))}
                  size="small"
                >
                  거절
                </TextButton>
                <TextButton
                  color="primary"
                  onClick={innerClick(() => accept(invitation, targetName))}
                  size="small"
                >
                  수락
                </TextButton>
              </div>
            ) : (
              <Badge tone="outline">
                {JOIN_STATUS_LABEL[invitation.status]}
              </Badge>
            )}
          </ListCellContent>
        }
      >
        {targetName ?? `삭제된 ${TARGET_TYPE_LABEL[invitation.targetType]}`}
      </ListCell>
    );
  };

  const renderRequest = (request: JoinRequest) => {
    const targetName = getTargetName(request.targetType, request.targetId);
    const pending = request.status === "PENDING";
    const kind = request.recruitPostId
      ? `${TARGET_TYPE_LABEL[request.targetType]} 모집 공고`
      : `${TARGET_TYPE_LABEL[request.targetType]} 가입 신청`;

    return (
      <ListCell
        alignItems="center"
        disabled={!targetName}
        key={request.id}
        leadingContent={
          <ListCellContent variant="large-icon">
            {request.targetType === "TEAM" ? (
              <IconMusicMicrophone />
            ) : (
              <IconPersons />
            )}
          </ListCellContent>
        }
        onClick={rowClick(() => {
          if (targetName) {
            navigate(targetPath(request.targetType, request.targetId));
          }
        })}
        textProps={{
          caption: (
            <CaptionLines
              lines={[
                request.instrument
                  ? `${kind} · ${INSTRUMENT_LABEL[request.instrument]}`
                  : kind,
                formatRelative(request.createdAt),
              ]}
            />
          ),
          weight: "bold",
        }}
        trailingContent={
          <ListCellContent>
            <div className="flex flex-col items-end gap-1">
              <Badge tone={pending ? "accent" : "outline"}>
                {JOIN_STATUS_LABEL[request.status]}
              </Badge>
              {pending && targetName && (
                <TextButton
                  color="assistive"
                  onClick={innerClick(() => cancelRequest(request, targetName))}
                  size="small"
                >
                  신청 취소
                </TextButton>
              )}
            </div>
          </ListCellContent>
        }
      >
        {targetName ?? `삭제된 ${TARGET_TYPE_LABEL[request.targetType]}`}
      </ListCell>
    );
  };

  return (
    <>
      <Tab
        onValueChange={(next) =>
          setSearchParams({ tab: next }, { replace: true })
        }
        value={tab}
      >
        <TabList resize="fill" size="medium">
          <TabListItem value="received">
            받은 초대 {invitations.length}
          </TabListItem>
          <TabListItem value="applied">내 신청 {requests.length}</TabListItem>
        </TabList>
      </Tab>
      <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-8">
        {tab === "received" ? (
          invitations.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <EmptyState
                description="팀장·모임장이 초대하면 여기에서 수락할 수 있어요"
                title="받은 초대가 없어요"
              />
            </div>
          ) : (
            <>
              <Typography
                color="semantic.label.alternative"
                variant="label2"
                weight="bold"
              >
                나를 초대한 팀과 모임이에요
              </Typography>
              <List>{invitations.map(renderInvitation)}</List>
            </>
          )
        ) : requests.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              action={{
                label: "모집 공고 보기",
                onClick: () => navigate("/board"),
              }}
              description="모집 공고에서 지원하면 여기에서 결과를 볼 수 있어요"
              title="보낸 신청이 없어요"
            />
          </div>
        ) : (
          <>
            <Typography
              color="semantic.label.alternative"
              variant="label2"
              weight="bold"
            >
              내가 보낸 가입 신청이에요
            </Typography>
            <List>{requests.map(renderRequest)}</List>
          </>
        )}
      </div>
    </>
  );
}

export default MineInvitationsScreen;
