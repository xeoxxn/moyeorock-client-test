import {
  Avatar,
  Button,
  List,
  ListCell,
  ListCellContent,
  Typography,
  useSnackbar,
  useToast,
} from "@wanteddev/wds";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import EmptyState from "@/components/ui/EmptyState";
import PressableCard from "@/components/ui/PressableCard";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import {
  CrewNotFound,
  CrewOwnerOnly,
} from "@/features/crew/components/CrewFallback";
import { formatRelative } from "@/lib/domain/format";
import { formatInstruments } from "@/lib/domain/labels";
import type { Group, JoinRequest } from "@/lib/domain/types";
import {
  getGroup,
  getReceivedJoinRequests,
  getUser,
  toId,
} from "@/mocks/selectors";

// Figma: 모임/13 가입 신청 관리 (nodeId 142:19578) — 모임장 전용. 서버 GET /join-requests
// ?targetType=GROUP&targetId=로 받은 대기 중 신청을 승인/거절(PATCH status)한다. 모임 신청은 세션을
// 받지 않으니(서버 규칙) 신청자 프로필의 세션을 대신 보여준다. Figma의 "처리 완료" 탭은 서버가 대기
// 중인 신청만 관리 대상으로 내려줘서 뺐다. 승인하면 플로우(모임/13 → 모임/05)대로 멤버 보기를 권한다.
const HEADER_TITLE = "가입 신청 관리";

function ApplicationCard({
  onApprove,
  onReject,
  request,
}: {
  onApprove: () => void;
  onReject: () => void;
  request: JoinRequest;
}) {
  const navigate = useNavigate();
  const applicant = getUser(request.applicantId);
  if (!applicant) return null;

  return (
    <PressableCard>
      <div className="flex flex-col gap-3">
        <List>
          <ListCell
            alignItems="center"
            leadingContent={
              <ListCellContent variant="avatar">
                <Avatar
                  alt=""
                  size="medium"
                  src={applicant.profileImage ?? undefined}
                  variant="person"
                />
              </ListCellContent>
            }
            textProps={{
              caption: formatInstruments(applicant.instruments, true),
              weight: "bold",
            }}
            trailingContent={
              // 셀 어디를 눌러도 WDS ListCell이 이 chevron을 대신 눌러 준다(셀에도 달면 두 번 불린다).
              <ListCellContent
                aria-label={`${applicant.nickname} 프로필 보기`}
                onClick={() => navigate(`/users/${applicant.id}`)}
                variant="chevron"
              />
            }
            verticalPadding="small"
          >
            {applicant.nickname}
          </ListCell>
        </List>
        <Typography
          color="semantic.label.assistive"
          variant="caption1"
          weight="medium"
        >
          {request.recruitPostId !== null ? "공고 보고 신청" : "직접 신청"} ·{" "}
          {formatRelative(request.createdAt)}
        </Typography>
        {request.message !== "" && (
          <Typography
            color="semantic.label.normal"
            variant="body2"
            weight="regular"
          >
            {request.message}
          </Typography>
        )}
        <div className="flex gap-2">
          <Button
            color="assistive"
            fullWidth
            onClick={onReject}
            size="medium"
            variant="outlined"
          >
            거절
          </Button>
          <Button
            color="primary"
            fullWidth
            onClick={onApprove}
            size="medium"
            variant="solid"
          >
            승인
          </Button>
        </div>
      </div>
    </PressableCard>
  );
}

function CrewApplications({ group }: { group: Group }) {
  const navigate = useNavigate();
  const toast = useToast();
  const snackbar = useSnackbar();
  const [requests, setRequests] = useState(() =>
    getReceivedJoinRequests("GROUP", group.id),
  );

  useScreenHeader(<ScreenHeader title={HEADER_TITLE} />);

  const goMembers = () => navigate(`/crew/${group.id}/members`);

  const resolve = (request: JoinRequest, approved: boolean) => {
    setRequests((prev) => prev.filter((item) => item.id !== request.id));
    const nickname = getUser(request.applicantId)?.nickname ?? "신청자";
    if (approved) {
      snackbar({
        action: { children: "멤버 보기", onClick: goMembers },
        description: `${nickname}님이 모임 멤버가 됐어요`,
      });
    } else {
      toast({ content: `${nickname}님의 신청을 거절했어요` });
    }
  };

  return (
    <div className="scrollbar-hidden flex flex-1 flex-col gap-4 overflow-y-auto px-5 pt-4 pb-8">
      {requests.length === 0 ? (
        <div className="flex flex-1 flex-col justify-center pb-16">
          <EmptyState
            action={{ label: "멤버 보기", onClick: goMembers }}
            description="모집 공고를 올리면 들어온 신청이 여기에 모여요."
            title="대기 중인 가입 신청이 없어요"
          />
        </div>
      ) : (
        <>
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="bold"
          >
            {group.name}에 온 가입 신청 {requests.length}건
          </Typography>
          {requests.map((request) => (
            <ApplicationCard
              key={request.id}
              onApprove={() => resolve(request, true)}
              onReject={() => resolve(request, false)}
              request={request}
            />
          ))}
        </>
      )}
    </div>
  );
}

function CrewApplicationsScreen() {
  const { crewId } = useParams();
  const group = getGroup(toId(crewId));
  if (!group) return <CrewNotFound headerTitle={HEADER_TITLE} />;
  if (group.myRole !== "OWNER") {
    return <CrewOwnerOnly crewId={group.id} headerTitle={HEADER_TITLE} />;
  }
  return <CrewApplications group={group} />;
}

export default CrewApplicationsScreen;
