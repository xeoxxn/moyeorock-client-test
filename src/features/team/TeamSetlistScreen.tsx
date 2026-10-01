import { ContentBadge, TextButton, Typography } from "@wanteddev/wds";
import { IconChevronRight, IconPlus } from "@wanteddev/wds-icon";
import { useNavigate, useParams } from "react-router-dom";

import TeamHeroTabs from "@/features/team/components/TeamHeroTabs";

// Figma: 팀/04 셋리스트 (nodeId 101:22257)

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

function TeamSetlistScreen() {
  const navigate = useNavigate();
  const { teamId = "" } = useParams();

  return (
    <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto">
      <TeamHeroTabs active="setlist" teamId={teamId} />

      <div className="flex flex-col gap-2 px-5 pt-6 pb-8">
        <div className="flex items-center gap-1.5">
          <Typography
            color="semantic.label.normal"
            variant="headline1"
            weight="bold"
          >
            셋리스트
          </Typography>
          <Typography
            className="text-glow-sm"
            color="semantic.primary.normal"
            variant="label1"
            weight="bold"
          >
            {SETLIST.length}
          </Typography>
          <div className="flex-1" />
          <TextButton
            color="assistive"
            onClick={() => navigate(`/team/${teamId}/setlist/add`)}
            size="small"
          >
            곡 추가
          </TextButton>
        </div>
        <Typography
          color="semantic.label.alternative"
          variant="label2"
          weight="medium"
        >
          함께 연주할 곡을 순서대로 모아두세요.
        </Typography>

        <div className="flex flex-col">
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

        <button
          className="flex items-center gap-2 rounded-xl border border-line-neutral p-4"
          onClick={() => navigate(`/team/${teamId}/show`)}
          type="button"
        >
          <IconPlus className="size-5 text-label-normal" />
          <Typography
            className="flex-1 text-left"
            color="semantic.label.normal"
            variant="body1"
            weight="medium"
          >
            추천곡에서 추가하기
          </Typography>
          <IconChevronRight className="size-5 text-label-normal" />
        </button>
      </div>
    </div>
  );
}

export default TeamSetlistScreen;
