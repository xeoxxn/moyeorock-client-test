import { ContentBadge, TextButton, Typography } from "@wanteddev/wds";
import { useParams } from "react-router-dom";

import TeamHeroTabs from "@/features/team/components/TeamHeroTabs";

// Figma: 팀/03 팀 공연 (nodeId 101:21978). 독립 팀(공연에 연결되지 않은 팀)이라 안내 카드만
// 보여준다 — 공연에 참가 중인 팀은 공연 정보 카드로 대체될 자리(아직 데이터 없음, TODO).

interface SetlistSong {
  order: string;
  title: string;
  artist: string;
  selected?: boolean;
}

const SETLIST: SetlistSong[] = [
  { artist: "Radiohead", order: "01", selected: true, title: "High and Dry" },
  { artist: "검정치마", order: "02", title: "Antifreeze" },
  { artist: "혁오", order: "03", title: "TOMBOY" },
];

function TeamShowScreen() {
  const { teamId = "" } = useParams();

  return (
    <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto">
      <TeamHeroTabs active="show" teamId={teamId} />

      <div className="flex flex-col gap-4 px-5 pt-6 pb-8">
        <div className="flex flex-col gap-1 rounded-2xl bg-surface p-5">
          <ContentBadge
            accentColor="semantic.primary.normal"
            color="accent"
            size="small"
          >
            자체 합주팀
          </ContentBadge>
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="medium"
          >
            연결된 공연 없이 자유롭게 합주하고 있어요. 공연 참가가 확정되면
            이곳에 공연 정보가 표시돼요.
          </Typography>
        </div>

        <div className="flex flex-col gap-1 pt-2">
          <Typography
            color="semantic.label.normal"
            variant="headline1"
            weight="bold"
          >
            공연 셋리스트
          </Typography>
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="medium"
          >
            현재 확정된 연주곡과 팀원의 추천곡이에요.
          </Typography>
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
              {song.selected && (
                <ContentBadge
                  accentColor="semantic.primary.normal"
                  className="shadow-neon-sm"
                  color="accent"
                  size="small"
                >
                  선정
                </ContentBadge>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-surface p-4">
          <Typography
            className="flex-1"
            color="semantic.label.normal"
            variant="body1"
            weight="medium"
          >
            이 곡은 어때요?
          </Typography>
          <TextButton color="primary" size="small">
            추천곡 보기
          </TextButton>
        </div>
      </div>
    </div>
  );
}

export default TeamShowScreen;
