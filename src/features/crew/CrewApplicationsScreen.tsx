import {
  Avatar,
  Tab,
  TabList,
  TabListItem,
  TextButton,
  Typography,
} from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

// Figma: 모임/13 가입 신청 관리 (nodeId 142:19578)
interface Applicant {
  id: string;
  name: string;
  summary: string;
  appliedVia: string;
}

const PENDING: Applicant[] = [
  {
    appliedVia: "공고 보고 신청 · 5분 전",
    id: "1",
    name: "이보컬",
    summary: "보컬 · 중급",
  },
  {
    appliedVia: "직접 신청 · 1일 전",
    id: "2",
    name: "박드럼",
    summary: "드럼 · 고급",
  },
];

function CrewApplicationsScreen() {
  const navigate = useNavigate();
  const [pending, setPending] = useState(PENDING);
  const [tab, setTab] = useState<"pending" | "done">("pending");

  useScreenHeader(
    <ScreenHeader
      leading={
        <button onClick={() => navigate(-1)} type="button">
          <IconChevronLeft className="size-6 text-label-normal" />
        </button>
      }
      title="가입 신청 관리"
      variant="normal"
    />,
  );

  const removeApplicant = (id: string) => {
    setPending((prev) => prev.filter((applicant) => applicant.id !== id));
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Tab onValueChange={(value) => setTab(value as typeof tab)} value={tab}>
        <TabList resize="fill" size="medium">
          <TabListItem value="pending">대기 중 {pending.length}</TabListItem>
          <TabListItem value="done">처리 완료</TabListItem>
        </TabList>
      </Tab>
      <div className="scrollbar-hidden flex flex-1 flex-col gap-1 overflow-y-auto px-5 pt-4 pb-6">
        {tab === "pending" ? (
          <>
            <Typography
              color="semantic.label.alternative"
              variant="label2"
              weight="bold"
            >
              프로젝트 모임에 온 가입 신청 {pending.length}건
            </Typography>
            {pending.map((applicant) => (
              <div className="flex items-center gap-3 py-3" key={applicant.id}>
                <Avatar size="medium" variant="person" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <Typography
                    color="semantic.label.normal"
                    variant="body1"
                    weight="bold"
                  >
                    {applicant.name}
                  </Typography>
                  <Typography
                    color="semantic.label.normal"
                    variant="label2"
                    weight="medium"
                  >
                    {applicant.summary}
                  </Typography>
                  <Typography
                    color="semantic.label.assistive"
                    variant="caption1"
                    weight="bold"
                  >
                    {applicant.appliedVia}
                  </Typography>
                </div>
                <TextButton
                  color="assistive"
                  onClick={() => removeApplicant(applicant.id)}
                  size="small"
                >
                  거절
                </TextButton>
                <TextButton
                  className="shadow-neon-sm"
                  color="primary"
                  onClick={() => removeApplicant(applicant.id)}
                  size="small"
                >
                  승인
                </TextButton>
              </div>
            ))}
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <Typography
              color="semantic.label.assistive"
              variant="label1"
              weight="regular"
            >
              처리한 신청이 없어요
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
}

export default CrewApplicationsScreen;
