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

// Figma: 마이/04 관심 목록 (nodeId 101:25857, "저장 목록"). 유저/팀/곡 3개 탭 중 "유저"만
// 실제 콘텐츠가 그려져 있어 팀·곡은 빈 상태 문구로 채웠다.
interface SavedUser {
  id: string;
  name: string;
  role: string;
  meta: string;
}

const SAVED_USERS: SavedUser[] = [
  { id: "u1", meta: "서울 · 인디", name: "이보컬", role: "보컬 · 중급" },
  { id: "u2", meta: "서울 · 메탈", name: "박드럼", role: "드럼 · 고급" },
  {
    id: "u3",
    meta: "서울 · 어쿠스틱",
    name: "오어쿠",
    role: "어쿠스틱 · 초급",
  },
];

function EmptyTabPanel({ label }: { label: string }) {
  return (
    <div className="flex flex-1 items-center justify-center py-16">
      <Typography
        color="semantic.label.assistive"
        variant="label1"
        weight="regular"
      >
        {label}
      </Typography>
    </div>
  );
}

function MineInterestsScreen() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("user");

  useScreenHeader(
    <ScreenHeader
      leading={
        <button onClick={() => navigate(-1)} type="button">
          <IconChevronLeft className="size-6 text-label-normal" />
        </button>
      }
      title="저장 목록"
      variant="normal"
    />,
  );

  return (
    <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto">
      <Tab onValueChange={setTab} value={tab}>
        <TabList resize="fill">
          <TabListItem value="user">유저</TabListItem>
          <TabListItem value="team">팀</TabListItem>
          <TabListItem value="song">곡</TabListItem>
        </TabList>
        <TabPanel value="user">
          <div className="flex flex-col gap-1 px-5 pt-4 pb-8">
            <Typography
              color="semantic.label.alternative"
              variant="label2"
              weight="bold"
            >
              저장한 유저 {SAVED_USERS.length}명
            </Typography>
            {SAVED_USERS.map((user) => (
              <div className="flex items-center gap-3 py-3" key={user.id}>
                <Avatar size={48} variant="person" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <Typography
                    color="semantic.label.normal"
                    variant="body1"
                    weight="bold"
                  >
                    {user.name}
                  </Typography>
                  <Typography
                    color="semantic.label.alternative"
                    variant="label2"
                    weight="medium"
                  >
                    {user.role}
                  </Typography>
                  <Typography
                    color="semantic.label.disable"
                    variant="caption1"
                    weight="bold"
                  >
                    {user.meta}
                  </Typography>
                </div>
                <TextButton
                  color="primary"
                  size="small" // 초대 전용 화면이 없어 팀 멤버 찾기(초대) 화면으로 보낸다.
                  onClick={() => navigate("/team/1/members/find")}
                >
                  팀 초대
                </TextButton>
              </div>
            ))}
          </div>
        </TabPanel>
        <TabPanel value="team">
          <EmptyTabPanel label="아직 저장한 팀이 없어요" />
        </TabPanel>
        <TabPanel value="song">
          <EmptyTabPanel label="아직 저장한 곡이 없어요" />
        </TabPanel>
      </Tab>
    </div>
  );
}

export default MineInterestsScreen;
