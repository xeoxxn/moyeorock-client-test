import {
  Avatar,
  Tab,
  TabList,
  TabListItem,
  TextButton,
  TextField,
  Typography,
} from "@wanteddev/wds";
import { IconChevronLeft, IconSearch } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

// Figma: 팀/10 팀원 찾기 (AI 추천) (nodeId 142:19921). "AI 추천"/"닉네임 검색"은 같은 화면
// 안의 패널 전환이라(별도 라우트로 나갈 근거가 없음) 로컬 state로 처리한다.

interface Candidate {
  id: string;
  name: string;
  session: string;
  matchRate: number;
  reason: string;
}

const AI_CANDIDATES: Candidate[] = [
  {
    id: "1",
    matchRate: 92,
    name: "박드럼",
    reason: "장르 일치: 록, 활동 지역 동일",
    session: "드럼 · 고급",
  },
  {
    id: "2",
    matchRate: 87,
    name: "최드럼",
    reason: "장르 일치: 인디",
    session: "드럼 · 중급",
  },
  {
    id: "3",
    matchRate: 81,
    name: "한비트",
    reason: "실력 중급",
    session: "드럼 · 중급",
  },
];

function TeamMembersFindScreen() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"ai" | "search">("ai");
  // 초대는 화면 이동이 아니라 그 자리에서 끝나는 액션이라, 누른 멤버를 로컬로 기억해 둔다.
  const [invitedIds, setInvitedIds] = useState<string[]>([]);

  useScreenHeader(
    <ScreenHeader
      leading={
        <button onClick={() => navigate(-1)} type="button">
          <IconChevronLeft className="size-6 text-label-normal" />
        </button>
      }
      title="팀원 찾기"
      variant="normal"
    />,
  );

  return (
    <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto">
      <Tab
        onValueChange={(value) => setTab(value as "ai" | "search")}
        value={tab}
      >
        <TabList resize="fill" size="large">
          <TabListItem value="ai">AI 추천</TabListItem>
          <TabListItem value="search">닉네임 검색</TabListItem>
        </TabList>
      </Tab>

      {tab === "ai" ? (
        <div className="flex flex-col gap-1 px-5 pt-4 pb-8">
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="medium"
          >
            드럼 세션 AI 추천 후보예요
          </Typography>
          {AI_CANDIDATES.map((candidate) => (
            <div className="flex items-center gap-3 py-3" key={candidate.id}>
              <Avatar size="medium" variant="person" />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <Typography
                  color="semantic.label.strong"
                  variant="body1"
                  weight="bold"
                >
                  {candidate.name}
                </Typography>
                <Typography
                  color="semantic.label.normal"
                  variant="label2"
                  weight="medium"
                >
                  {candidate.session}
                </Typography>
                <Typography
                  color="semantic.label.disable"
                  variant="caption1"
                  weight="bold"
                >
                  추천 {candidate.matchRate}% · {candidate.reason}
                </Typography>
              </div>
              <TextButton
                color={
                  invitedIds.includes(candidate.id) ? "assistive" : "primary"
                }
                disabled={invitedIds.includes(candidate.id)}
                onClick={() => setInvitedIds((prev) => [...prev, candidate.id])}
                size="small"
              >
                {invitedIds.includes(candidate.id) ? "초대함" : "초대"}
              </TextButton>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 px-5 pt-4 pb-8">
          <div className="flex items-center gap-2 rounded-xl bg-surface px-3.5 py-3">
            <IconSearch className="size-5 text-label-disable" />
            <TextField placeholder="닉네임으로 검색" width="100%" />
          </div>
          <Typography
            className="pt-10 text-center"
            color="semantic.label.assistive"
            variant="body2"
            weight="medium"
          >
            닉네임을 검색해서 팀원을 초대해 보세요.
          </Typography>
        </div>
      )}
    </div>
  );
}

export default TeamMembersFindScreen;
