import {
  Avatar,
  Tab,
  TabList,
  TabListItem,
  TabPanel,
  TextButton,
  Typography,
} from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

// Figma: 마이/05 받은 초대(142:19702) + 마이/06 내 신청(142:19826). 두 노드는 같은 "초대 · 신청"
// 화면의 탭 2개(받은 초대 / 내 신청)라 하나의 화면·라우트(`/mine/invitations`)로 합쳤다 —
// MineScreen.tsx의 "초대 · 신청" 버튼이 이미 이 경로로 navigate한다.
interface ReceivedInvite {
  id: string;
  name: string;
  meta: string;
  location: string;
}

const RECEIVED_INVITES: ReceivedInvite[] = [
  {
    id: "i1",
    location: "서울 · 인디",
    meta: "드럼 세션 제안 · 서비스 2팀",
    name: "블루 웨이브",
  },
  {
    id: "i2",
    location: "서울 · 록",
    meta: "보컬 세션 제안 · 김모임",
    name: "프로젝트 모임",
  },
];

interface SentApplication {
  id: string;
  name: string;
  meta: string;
  status: string;
  pending: boolean;
}

const SENT_APPLICATIONS: SentApplication[] = [
  {
    id: "a1",
    meta: "모임 모집 공고 · 보컬",
    name: "홍대 주말 합주",
    pending: true,
    status: "대기 중 · 2일 전",
  },
  {
    id: "a2",
    meta: "팀 가입 신청 · 키보드",
    name: "나이트 드라이브",
    pending: false,
    status: "승인됨 · 5일 전",
  },
];

function MineInvitationsScreen() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("received");
  const [invites, setInvites] = useState(RECEIVED_INVITES);
  const [applications, setApplications] = useState(SENT_APPLICATIONS);

  useScreenHeader(
    <ScreenHeader
      leading={
        <button onClick={() => navigate(-1)} type="button">
          <IconChevronLeft className="size-6 text-label-normal" />
        </button>
      }
      title="초대 · 신청"
      variant="normal"
    />,
  );

  return (
    <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto">
      <Tab onValueChange={setTab} value={tab}>
        <TabList resize="fill">
          <TabListItem value="received">받은 초대 {invites.length}</TabListItem>
          <TabListItem value="sent">내 신청 {applications.length}</TabListItem>
        </TabList>
        <TabPanel value="received">
          <div className="flex flex-col gap-1 px-5 pt-4 pb-8">
            <Typography
              color="semantic.label.alternative"
              variant="label2"
              weight="bold"
            >
              나를 초대한 팀과 모임이에요
            </Typography>
            {invites.map((invite) => (
              <div className="flex items-center gap-3 py-3" key={invite.id}>
                <Avatar size={48} variant="person" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <Typography
                    color="semantic.label.normal"
                    variant="body1"
                    weight="bold"
                  >
                    {invite.name}
                  </Typography>
                  <Typography
                    color="semantic.label.alternative"
                    variant="label2"
                    weight="medium"
                  >
                    {invite.meta}
                  </Typography>
                  <Typography
                    color="semantic.label.disable"
                    variant="caption1"
                    weight="bold"
                  >
                    {invite.location}
                  </Typography>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <TextButton
                    color="assistive"
                    onClick={() =>
                      setInvites((prev) =>
                        prev.filter((i) => i.id !== invite.id),
                      )
                    }
                    size="small"
                  >
                    거절
                  </TextButton>
                  <TextButton
                    color="primary"
                    onClick={() =>
                      setInvites((prev) =>
                        prev.filter((i) => i.id !== invite.id),
                      )
                    }
                    size="small"
                  >
                    수락
                  </TextButton>
                </div>
              </div>
            ))}
          </div>
        </TabPanel>
        <TabPanel value="sent">
          <div className="flex flex-col gap-1 px-5 pt-4 pb-8">
            <Typography
              color="semantic.label.alternative"
              variant="label2"
              weight="bold"
            >
              내가 보낸 가입 신청이에요
            </Typography>
            {applications.map((application) => (
              <div
                className="flex items-center gap-3 py-3"
                key={application.id}
              >
                <Avatar size={48} variant="person" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <Typography
                    color="semantic.label.normal"
                    variant="body1"
                    weight="bold"
                  >
                    {application.name}
                  </Typography>
                  <Typography
                    color="semantic.label.alternative"
                    variant="label2"
                    weight="medium"
                  >
                    {application.meta}
                  </Typography>
                  <Typography
                    color="semantic.label.disable"
                    variant="caption1"
                    weight="bold"
                  >
                    {application.status}
                  </Typography>
                </div>
                {application.pending && (
                  <TextButton
                    color="assistive"
                    onClick={() =>
                      setApplications((prev) =>
                        prev.filter((a) => a.id !== application.id),
                      )
                    }
                    size="small"
                  >
                    신청 취소
                  </TextButton>
                )}
              </div>
            ))}
          </div>
        </TabPanel>
      </Tab>
    </div>
  );
}

export default MineInvitationsScreen;
