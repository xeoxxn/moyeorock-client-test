import {
  List,
  ListCell,
  ListCellContent,
  TextButton,
  Typography,
} from "@wanteddev/wds";
import {
  IconCalendar,
  IconChevronRightTightSmall,
  IconLocation,
  IconPersons,
} from "@wanteddev/wds-icon";
import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";

import mascotMusic from "@/assets/mascot/music.png";
import Badge from "@/components/ui/Badge";
import BottomActionArea from "@/components/ui/BottomActionArea";
import EmptyState from "@/components/ui/EmptyState";
import PressableCard from "@/components/ui/PressableCard";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SectionHeader from "@/components/ui/SectionHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import ShowSectionTabBar from "@/features/show/components/ShowSectionTabBar";
import {
  getMyPerformanceTeams,
  isPerformanceGroupMember,
} from "@/features/show/performanceAccess";
import { formatDateTime, formatDday } from "@/lib/domain/format";
import { GENRE_LABEL, PERFORMANCE_STATUS_LABEL } from "@/lib/domain/labels";
import type { SetlistItem } from "@/lib/domain/types";
import {
  getGroup,
  getPerformance,
  getSong,
  getTeam,
  isUpcoming,
  toId,
} from "@/mocks/selectors";

// Figma: 공연/01 공연 정보. 모임장이면 위에 "공연 정보 | 관리" 탭이 붙는다(ShowSectionTabBar).

function InfoCell({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <ListCell
      alignItems="center"
      disableInteraction
      leadingContent={<ListCellContent variant="icon">{icon}</ListCellContent>}
      textProps={{
        color: "semantic.label.assistive",
        variant: "label1",
        weight: "medium",
      }}
      trailingContent={
        <ListCellContent>
          <Typography
            color="semantic.label.normal"
            variant="label1"
            weight="medium"
          >
            {value}
          </Typography>
        </ListCellContent>
      }
      verticalPadding="small"
    >
      {label}
    </ListCell>
  );
}

function SongCell({ item, order }: { item: SetlistItem; order?: number }) {
  const song = getSong(item.songId);
  const teamName = getTeam(item.teamId)?.name;

  return (
    <ListCell
      alignItems="center"
      disableInteraction
      leadingContent={
        order !== undefined ? (
          <ListCellContent>
            <Typography
              color="semantic.primary.normal"
              variant="body1"
              weight="bold"
            >
              {String(order).padStart(2, "0")}
            </Typography>
          </ListCellContent>
        ) : undefined
      }
      textProps={{
        caption: [song?.artist, order !== undefined ? teamName : undefined]
          .filter(Boolean)
          .join(" · "),
      }}
      verticalPadding="small"
    >
      {song?.title ?? "삭제된 곡"}
    </ListCell>
  );
}

/** 확정 전 셋리스트 — 팀이 넘긴 곡을 팀별로 묶는다(넘긴 순서 유지) */
function groupByTeam(items: SetlistItem[]) {
  const groups = new Map<number, SetlistItem[]>();
  for (const item of items) {
    groups.set(item.teamId, [...(groups.get(item.teamId) ?? []), item]);
  }
  return [...groups.entries()];
}

function ShowDetailScreen() {
  const navigate = useNavigate();
  const { showId } = useParams();
  const performance = getPerformance(toId(showId));

  useScreenHeader(<ScreenHeader title="공연" />);

  if (!performance) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyState
          description="삭제됐거나 주소가 잘못된 공연이에요"
          title="없는 공연이에요"
        />
      </div>
    );
  }

  const group = getGroup(performance.groupId);
  const open = isUpcoming(performance);
  // 끝난 공연(종료·취소)은 서버가 소속 팀을 모두 해체해서 참가 팀을 빈 목록으로 준다.
  const teams = open
    ? performance.teamIds.flatMap((id) => getTeam(id) ?? [])
    : [];
  const myTeams = getMyPerformanceTeams(performance);
  const myTeamIds = new Set(myTeams.map((team) => team.id));

  // 공연 팀은 진행 중인 공연(공연 예정·팀 모집 중)에만 만들 수 있다. 이미 이 공연에 내 팀이 있으면
  // 새로 만들게 하지 않고 그 팀으로 보낸다. 모임원이 아니면 만들 수 없어서 버튼을 숨긴다.
  let cta: { label: string; to: string } | null = null;
  if (open && myTeams[0]) {
    cta = { label: "내 팀 보기", to: `/team/${myTeams[0].id}` };
  } else if (open && isPerformanceGroupMember(performance)) {
    cta = { label: "공연 팀 만들기", to: `/show/${performance.id}/team/new` };
  }

  const confirmedSetlist = [...performance.setlist].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );

  return (
    <>
      <ShowSectionTabBar active="info" performance={performance} />
      <div className="scrollbar-hidden flex-1 overflow-y-auto">
        <div className="px-5 pt-4">
          <div className="relative flex aspect-3/2 w-full flex-col justify-end gap-2 overflow-hidden rounded-3xl border border-line-solid bg-surface p-6">
            {performance.posterImage ? (
              <>
                <img
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                  src={performance.posterImage}
                />
                <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />
              </>
            ) : (
              <img
                alt=""
                className="absolute top-5 right-5 w-1/4 max-w-28 drop-shadow-neon-sm"
                src={mascotMusic}
              />
            )}
            <div className="relative flex items-center gap-1.5">
              <Badge tone={open ? "accent" : "outline"}>
                {PERFORMANCE_STATUS_LABEL[performance.status]}
              </Badge>
              {open && (
                <Badge tone="solid">
                  {formatDday(performance.performedAt)}
                </Badge>
              )}
            </div>
            <Typography
              as="h1"
              className="relative"
              color="semantic.label.strong"
              variant="title3"
              weight="bold"
            >
              {performance.title}
            </Typography>
            {group && (
              <div className="relative">
                <TextButton
                  color="assistive"
                  onClick={() => navigate(`/crew/${group.id}`)}
                  size="small"
                  trailingContent={<IconChevronRightTightSmall />}
                >
                  {group.name}
                </TextButton>
              </div>
            )}
          </div>
        </div>

        <div className="px-5 py-3">
          <List>
            <InfoCell
              icon={<IconCalendar />}
              label="일시"
              value={formatDateTime(performance.performedAt)}
            />
            <InfoCell
              icon={<IconLocation />}
              label="장소"
              value={performance.venue}
            />
            {open && (
              <InfoCell
                icon={<IconPersons />}
                label="참가 팀"
                value={`${teams.length}팀`}
              />
            )}
          </List>
        </div>

        {performance.description && (
          <>
            <div className="h-3 bg-surface" />
            <section className="flex flex-col gap-2 px-5 py-6">
              <SectionHeader title="공연 소개" />
              <Typography
                color="semantic.label.normal"
                variant="body1"
                weight="regular"
              >
                {performance.description}
              </Typography>
            </section>
          </>
        )}

        {open && (
          <>
            <div className="h-3 bg-surface" />
            <section className="flex flex-col gap-3 px-5 py-6">
              <SectionHeader count={teams.length} title="참가 팀" />
              {teams.length === 0 ? (
                <Typography
                  color="semantic.label.assistive"
                  variant="label1"
                  weight="regular"
                >
                  아직 참가한 팀이 없어요
                </Typography>
              ) : (
                teams.map((team) => (
                  <PressableCard
                    key={team.id}
                    onClick={() => navigate(`/team/${team.id}`)}
                  >
                    <div className="flex items-center gap-1.5">
                      <Typography
                        color="semantic.label.normal"
                        variant="body1"
                        weight="bold"
                      >
                        {team.name}
                      </Typography>
                      {myTeamIds.has(team.id) && <Badge>내 팀</Badge>}
                    </div>
                    <Typography
                      color="semantic.label.assistive"
                      variant="label2"
                      weight="medium"
                    >
                      {[
                        team.genres
                          .map((genre) => GENRE_LABEL[genre])
                          .join(", "),
                        `멤버 ${team.members.length}명`,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </Typography>
                  </PressableCard>
                ))
              )}
            </section>
          </>
        )}

        <div className="h-3 bg-surface" />
        <section className="flex flex-col gap-3 px-5 pt-6 pb-8">
          <SectionHeader
            title="셋리스트"
            trailing={
              <Badge tone={performance.setlistConfirmed ? "accent" : "outline"}>
                {performance.setlistConfirmed ? "확정" : "확정 전"}
              </Badge>
            }
          />
          {performance.setlist.length === 0 ? (
            <Typography
              color="semantic.label.assistive"
              variant="label1"
              weight="regular"
            >
              아직 팀들이 넘긴 곡이 없어요
            </Typography>
          ) : performance.setlistConfirmed ? (
            <List>
              {confirmedSetlist.map((item, index) => (
                <SongCell
                  item={item}
                  key={`${item.teamId}-${item.songId}`}
                  order={index + 1}
                />
              ))}
            </List>
          ) : (
            // 확정 전에는 순서가 없다 — 팀이 넘긴 곡을 팀별로 보여 준다.
            groupByTeam(performance.setlist).map(([teamId, items]) => (
              <div className="flex flex-col gap-1" key={teamId}>
                <Typography
                  color="semantic.label.alternative"
                  variant="label2"
                  weight="bold"
                >
                  {getTeam(teamId)?.name ?? "해체된 팀"} · {items.length}곡
                </Typography>
                <List>
                  {items.map((item) => (
                    <SongCell item={item} key={item.songId} />
                  ))}
                </List>
              </div>
            ))
          )}
        </section>
      </div>
      {cta && (
        <BottomActionArea label={cta.label} onClick={() => navigate(cta.to)} />
      )}
    </>
  );
}

export default ShowDetailScreen;
