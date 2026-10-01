import { Avatar, TextButton, Typography } from "@wanteddev/wds";
import { useNavigate, useParams } from "react-router-dom";

import TeamHeroTabs from "@/features/team/components/TeamHeroTabs";

// Figma: 팀/02 팀 홈 (nodeId 101:21590). 헤더·히어로·Tab 구조는 TeamHeroTabs가 공유한다(팀/03~07
// 화면과 동일 — CrewHomeScreen과 같은 이유로 Tab의 onValueChange는 실제 라우트 네비게이션).

interface Member {
  id: string;
  name: string;
  session: string;
}

const MEMBERS: Member[] = [
  { id: "1", name: "서비스 2팀", session: "어쿠스틱 · 팀장" },
  { id: "2", name: "이보컬", session: "보컬" },
  { id: "3", name: "박베이스", session: "베이스" },
  { id: "4", name: "강보컬", session: "보컬" },
  { id: "5", name: "정일렉", session: "일렉" },
  { id: "6", name: "오어쿠", session: "어쿠스틱" },
];

interface SetlistSong {
  order: string;
  title: string;
  artist: string;
}

const SETLIST: SetlistSong[] = [
  { artist: "Radiohead", order: "01", title: "High and Dry" },
  { artist: "검정치마", order: "02", title: "Antifreeze" },
];

function TeamHomeScreen() {
  const navigate = useNavigate();
  const { teamId = "" } = useParams();

  return (
    <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto">
      <TeamHeroTabs active="home" teamId={teamId} />

      <div className="flex flex-col gap-3 px-5 py-6">
        <div className="flex items-center gap-1.5">
          <Typography
            className="flex-1"
            color="semantic.label.normal"
            variant="headline1"
            weight="bold"
          >
            함께하는 멤버
          </Typography>
          <Typography
            className="text-glow-sm"
            color="semantic.primary.normal"
            variant="label1"
            weight="bold"
          >
            {MEMBERS.length}
          </Typography>
        </div>
        <div className="flex flex-wrap gap-3">
          {MEMBERS.map((member) => (
            <div
              className="flex w-[88px] flex-col items-center gap-1"
              key={member.id}
            >
              <Avatar size="medium" variant="person" />
              <Typography
                color="semantic.label.normal"
                variant="label2"
                weight="bold"
              >
                {member.name}
              </Typography>
              <Typography
                color="semantic.label.assistive"
                variant="caption1"
                weight="bold"
              >
                {member.session}
              </Typography>
            </div>
          ))}
        </div>
      </div>

      <div className="h-3 w-full bg-surface" />

      <div className="flex flex-col gap-3 px-5 py-6">
        <Typography
          color="semantic.label.normal"
          variant="headline1"
          weight="bold"
        >
          참가 공연
        </Typography>
        <div className="flex items-center rounded-2xl bg-surface p-4">
          <Typography
            color="semantic.label.alternative"
            variant="body2"
            weight="medium"
          >
            아직 참가 공연이 없어요
          </Typography>
        </div>
      </div>

      <div className="h-3 w-full bg-surface" />

      <div className="flex flex-col gap-1 px-5 pt-6 pb-8">
        <div className="flex items-center gap-1.5 pb-2">
          <Typography
            className="flex-1"
            color="semantic.label.normal"
            variant="headline1"
            weight="bold"
          >
            셋리스트
          </Typography>
          <TextButton
            color="assistive"
            onClick={() => navigate(`/team/${teamId}/setlist/add`)}
            size="small"
          >
            곡 추가
          </TextButton>
        </div>
        {SETLIST.map((song) => (
          <div className="flex items-center gap-3.5 py-3" key={song.order}>
            <Typography
              color="semantic.label.disable"
              variant="headline2"
              weight="bold"
            >
              {song.order}
            </Typography>
            <div className="flex min-w-0 flex-1 flex-col">
              <Typography
                color="semantic.label.normal"
                variant="body1"
                weight="bold"
              >
                {song.title}
              </Typography>
              <Typography
                color="semantic.label.assistive"
                variant="label2"
                weight="medium"
              >
                {song.artist}
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamHomeScreen;
