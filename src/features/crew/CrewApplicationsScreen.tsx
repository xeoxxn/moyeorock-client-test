import { Avatar, Button, List, Typography, useToast } from "@wanteddev/wds";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MediaRow from "@/components/list/MediaRow";
import EmptyState from "@/components/ui/EmptyState";
import { innerClick } from "@/components/ui/listCellEvents";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import {
  CrewNotFound,
  CrewOwnerOnly,
} from "@/features/crew/components/CrewFallback";
import { profilePath } from "@/features/crew/components/crewHelpers";
import { formatRelative } from "@/lib/domain/format";
import { formatInstruments } from "@/lib/domain/labels";
import type { Group, JoinRequest } from "@/lib/domain/types";
import {
  getGroup,
  getReceivedJoinRequests,
  getUser,
  toId,
} from "@/mocks/selectors";

// 받은 신청(/crew/:id/applications) — 모임 설정의 "받은 신청"에서 들어온다(Figma에는 없는 화면). 서버
// GET /join-requests?targetType=GROUP&targetId=로 대기 중 신청을 받아 승인·거절(PATCH status)한다.
// 모임 신청은 세션을 받지 않아서(서버 규칙) 신청자 프로필의 세션을 보조 줄에 둔다. 행을 누르면
// 신청자 프로필, 오른쪽 버튼은 innerClick으로 행 이동과 겹치지 않게 한다.
const HEADER_TITLE = "받은 신청";

function ApplicationRow({
  onResolve,
  request,
}: {
  onResolve: (approved: boolean) => void;
  request: JoinRequest;
}) {
  const navigate = useNavigate();
  const applicant = getUser(request.applicantId);
  if (!applicant) return null;

  return (
    <MediaRow
      alignTop
      footer={
        request.message !== "" && (
          <Typography
            as="span"
            className="line-clamp-2 pt-1"
            color="semantic.label.normal"
            variant="label2"
          >
            {request.message}
          </Typography>
        )
      }
      leading={
        <Avatar
          alt=""
          size="medium"
          src={applicant.profileImage ?? undefined}
          variant="person"
        />
      }
      meta={`${formatInstruments(applicant.instruments)} · ${formatRelative(request.createdAt)}`}
      onClick={() => navigate(profilePath(applicant.id))}
      title={applicant.nickname}
      trailing={
        <span className="flex shrink-0 gap-2">
          <Button
            color="assistive"
            onClick={innerClick(() => onResolve(false))}
            size="small"
            variant="solid"
          >
            거절
          </Button>
          <Button
            color="primary"
            onClick={innerClick(() => onResolve(true))}
            size="small"
            variant="solid"
          >
            승인
          </Button>
        </span>
      }
    />
  );
}

function CrewApplications({ group }: { group: Group }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [requests, setRequests] = useState(() =>
    getReceivedJoinRequests("GROUP", group.id),
  );

  useScreenHeader(useMemo(() => <ScreenHeader title={HEADER_TITLE} />, []));

  const resolve = (request: JoinRequest, approved: boolean) => {
    setRequests((prev) => prev.filter((item) => item.id !== request.id));
    const nickname = getUser(request.applicantId)?.nickname ?? "신청자";
    toast(
      approved
        ? { content: `${nickname}님이 멤버가 됐어요`, variant: "positive" }
        : { content: `${nickname}님의 신청을 거절했어요` },
    );
  };

  if (requests.length === 0) {
    return (
      <div className="flex flex-1 flex-col justify-center pb-16">
        <EmptyState
          action={{
            label: "멤버 보기",
            onClick: () =>
              navigate(`/crew/${group.id}/members`, { replace: true }),
          }}
          description="모집 공고를 올리면 들어온 가입 신청이 여기에 모여요"
          title="대기 중인 신청이 없어요"
        />
      </div>
    );
  }

  return (
    <ScreenBody className="pt-2">
      <List>
        {requests.map((request) => (
          <ApplicationRow
            key={request.id}
            onResolve={(approved) => resolve(request, approved)}
            request={request}
          />
        ))}
      </List>
    </ScreenBody>
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
