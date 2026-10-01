import {
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

// Figma: 팀/11 곡 추가 (nodeId 142:20057). "AI 추천"/"곡 검색"은 같은 화면 안의 패널
// 전환이라(별도 라우트로 나갈 근거가 없음) 로컬 state로 처리한다.

interface SongCandidate {
  id: string;
  title: string;
  artist: string;
  matchRate: number;
  reason: string;
}

const AI_CANDIDATES: SongCandidate[] = [
  {
    artist: "Radiohead",
    id: "1",
    matchRate: 92,
    reason: "팀 장르 일치: 록",
    title: "Creep",
  },
  {
    artist: "혁오",
    id: "2",
    matchRate: 88,
    reason: "다른 팀이 이미 선택했어요",
    title: "위잉위잉",
  },
  {
    artist: "Oasis",
    id: "3",
    matchRate: 85,
    reason: "드럼 난이도 중급",
    title: "Wonderwall",
  },
];

function TeamSetlistAddScreen() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"ai" | "search">("ai");

  useScreenHeader(
    <ScreenHeader
      leading={
        <button onClick={() => navigate(-1)} type="button">
          <IconChevronLeft className="size-6 text-label-normal" />
        </button>
      }
      title="곡 추가"
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
          <TabListItem value="search">곡 검색</TabListItem>
        </TabList>
      </Tab>

      {tab === "ai" ? (
        <div className="flex flex-col gap-1 px-5 pt-4 pb-8">
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="medium"
          >
            블루 웨이브 취향으로 고른 추천곡이에요
          </Typography>
          {AI_CANDIDATES.map((song) => (
            <div className="flex items-center gap-3 py-3" key={song.id}>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <Typography
                  color="semantic.label.strong"
                  variant="body1"
                  weight="bold"
                >
                  {song.title}
                </Typography>
                <Typography
                  color="semantic.label.normal"
                  variant="label2"
                  weight="medium"
                >
                  {song.artist}
                </Typography>
                <Typography
                  color="semantic.label.disable"
                  variant="caption1"
                  weight="bold"
                >
                  {song.matchRate}% · {song.reason}
                </Typography>
              </div>
              <TextButton color="primary" size="small">
                추가
              </TextButton>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 px-5 pt-4 pb-8">
          <div className="flex items-center gap-2 rounded-xl bg-surface px-3.5 py-3">
            <IconSearch className="size-5 text-label-disable" />
            <TextField placeholder="곡 제목이나 아티스트로 검색" width="100%" />
          </div>
          <Typography
            className="pt-10 text-center"
            color="semantic.label.assistive"
            variant="body2"
            weight="medium"
          >
            곡을 검색해서 셋리스트에 추가해 보세요.
          </Typography>
        </div>
      )}
    </div>
  );
}

export default TeamSetlistAddScreen;
