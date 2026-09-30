import {
  ContentBadge,
  Option,
  Select,
  TextButton,
  Typography,
} from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import ShowSectionTabBar from "@/features/show/components/ShowSectionTabBar";

// Figma: 공연/02 공연 관리 (nodeId 101:23868). 모임 관리자 전용 편집 폼이라 열람용
// 공연/01 공연 정보(ShowDetailScreen.tsx)와는 별도 라우트로 뺐다 — 상단 탭 바는
// ShowSectionTabBar가 공유한다.

interface ManagedTeam {
  name: string;
  meta: string;
}

const MANAGED_TEAMS: ManagedTeam[] = [
  { meta: "메탈 · 멤버 5명", name: "RED NOISE" },
  { meta: "펑크 · 멤버 4명", name: "문샷" },
];

function ShowManageScreen() {
  const navigate = useNavigate();
  const { showId = "" } = useParams();
  const [status, setStatus] = useState("scheduled");

  useScreenHeader(
    <ScreenHeader
      leading={
        <button onClick={() => navigate(-1)} type="button">
          <IconChevronLeft className="size-6 text-label-normal" />
        </button>
      }
      title="공연"
      variant="normal"
    />,
  );

  return (
    <>
      <ShowSectionTabBar active="manage" showId={showId} />
      <div className="scrollbar-hidden flex flex-1 flex-col gap-3.5 overflow-y-auto px-5 pt-5 pb-6">
        <div className="flex flex-col gap-1.5">
          <Typography
            color="semantic.label.normal"
            variant="title3"
            weight="bold"
          >
            2026 가을 정기공연
          </Typography>
          <ContentBadge
            color="neutral"
            neutralColor="semantic.label.alternative"
            size="small"
            variant="outlined"
          >
            모임 관리자 전용
          </ContentBadge>
        </div>

        <label className="flex flex-col gap-2">
          <Typography
            color="semantic.label.normal"
            variant="label1"
            weight="bold"
          >
            공연 상태
          </Typography>
          <Select onChange={setStatus} value={status} width="100%">
            <Option value="scheduled">예정</Option>
            <Option value="recruiting">팀 모집 중</Option>
            <Option value="closed">종료</Option>
          </Select>
        </label>

        <div className="flex flex-col gap-3 pt-4">
          <div className="flex items-center gap-1.5">
            <Typography
              color="semantic.label.normal"
              variant="headline1"
              weight="bold"
            >
              참가 팀 · 멤버 관리
            </Typography>
            <Typography
              className="text-glow-sm"
              color="semantic.primary.normal"
              variant="label1"
              weight="bold"
            >
              {MANAGED_TEAMS.length}
            </Typography>
          </div>
          {MANAGED_TEAMS.map((team) => (
            <div
              className="flex items-center gap-3 rounded-2xl bg-surface p-3.5"
              key={team.name}
            >
              <div className="flex min-w-0 flex-1 flex-col">
                <Typography
                  color="semantic.label.normal"
                  variant="body1"
                  weight="bold"
                >
                  {team.name}
                </Typography>
                <Typography
                  color="semantic.label.assistive"
                  variant="label2"
                  weight="medium"
                >
                  {team.meta}
                </Typography>
              </div>
              <TextButton color="assistive" size="small">
                관리
              </TextButton>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ShowManageScreen;
