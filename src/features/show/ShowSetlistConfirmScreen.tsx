import {
  Button,
  Tab,
  TabList,
  TabListItem,
  TabPanel,
  Typography,
} from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

// Figma: 공연/06 셋리스트 확정 (nodeId 142:20145)

interface SavedSong {
  order: number;
  title: string;
  artist: string;
  savedBy: string;
}

interface TeamSetlist {
  teamId: string;
  teamName: string;
  songs: SavedSong[];
}

const TEAM_SETLISTS: TeamSetlist[] = [
  {
    songs: [
      {
        artist: "Radiohead",
        order: 1,
        savedBy: "팀장 서비스 2팀 저장",
        title: "High and Dry",
      },
      {
        artist: "검정치마",
        order: 2,
        savedBy: "팀장 서비스 2팀 저장",
        title: "Antifreeze",
      },
      {
        artist: "혁오",
        order: 3,
        savedBy: "팀장 서비스 2팀 저장",
        title: "TOMBOY",
      },
    ],
    teamId: "blue-wave",
    teamName: "블루 웨이브",
  },
  { songs: [], teamId: "red-noise", teamName: "RED NOISE" },
  { songs: [], teamId: "moonshot", teamName: "문샷" },
];

function ShowSetlistConfirmScreen() {
  const navigate = useNavigate();
  const { showId = "" } = useParams();
  const [team, setTeam] = useState(TEAM_SETLISTS[0].teamId);

  useScreenHeader(
    <ScreenHeader
      leading={
        <button onClick={() => navigate(-1)} type="button">
          <IconChevronLeft className="size-6 text-label-normal" />
        </button>
      }
      title="셋리스트 확정"
      variant="normal"
    />,
  );

  return (
    <Tab onValueChange={setTeam} value={team}>
      <TabList resize="fill" size="medium">
        {TEAM_SETLISTS.map((t) => (
          <TabListItem key={t.teamId} value={t.teamId}>
            {t.teamName}
          </TabListItem>
        ))}
      </TabList>
      <div className="scrollbar-hidden flex-1 overflow-y-auto">
        {TEAM_SETLISTS.map((t) => (
          <TabPanel key={t.teamId} value={t.teamId}>
            <div className="flex flex-col gap-1 px-5 pt-4 pb-8">
              <Typography
                color="semantic.label.assistive"
                variant="label2"
                weight="bold"
              >
                {t.teamName}가 저장한 곡 {t.songs.length}개
              </Typography>
              {t.songs.map((song) => (
                <div className="flex flex-col gap-0.5 py-3" key={song.order}>
                  <Typography
                    color="semantic.static.white"
                    variant="body1"
                    weight="bold"
                  >
                    {String(song.order).padStart(2, "0")} {song.title}
                  </Typography>
                  <Typography
                    color="semantic.label.normal"
                    variant="label2"
                    weight="medium"
                  >
                    {song.artist}
                  </Typography>
                  <Typography
                    color="semantic.label.assistive"
                    variant="caption1"
                    weight="bold"
                  >
                    {song.savedBy}
                  </Typography>
                </div>
              ))}
            </div>
          </TabPanel>
        ))}
      </div>
      <div className="flex shrink-0 flex-col bg-surface-elevated px-5 pt-3 pb-[34px]">
        <Button
          className="shadow-neon-sm"
          color="primary"
          fullWidth
          size="large"
          variant="solid" // 확정 완료 화면이 없다 — 확정하면 공연 상세로 돌아간다.
          onClick={() => navigate(`/show/${showId}`)}
        >
          셋리스트 확정하기
        </Button>
      </div>
    </Tab>
  );
}

export default ShowSetlistConfirmScreen;
