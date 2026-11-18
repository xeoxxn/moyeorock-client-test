import { Typography } from "@wanteddev/wds";
import { IconMoreVertical } from "@wanteddev/wds-icon";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CoverRow from "@/components/list/CoverRow";
import TrackRow from "@/components/list/TrackRow";
import { coverToneOf } from "@/components/music/Cover";
import ActionSheet from "@/components/ui/ActionSheet";
import BottomActionArea from "@/components/ui/BottomActionArea";
import CoverHero from "@/components/ui/CoverHero";
import EmptyState from "@/components/ui/EmptyState";
import HeaderIconButton from "@/components/ui/HeaderIconButton";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SectionHeader from "@/components/ui/SectionHeader";
import Status from "@/components/ui/Status";
import {
  useScreenBackdrop,
  useScreenHeader,
} from "@/components/ui/useScreenHeader";
import {
  canManagePerformance,
  getMyPerformanceTeams,
  isPerformanceGroupMember,
} from "@/features/show/performanceAccess";
import { formatDateTime, formatDday } from "@/lib/domain/format";
import { PERFORMANCE_STATUS_LABEL } from "@/lib/domain/labels";
import type { Performance, Team } from "@/lib/domain/types";
import {
  getGroup,
  getPerformance,
  getSong,
  getSubmittedSongCount,
  getTeam,
  isUpcoming,
  toId,
} from "@/mocks/selectors";

// Figma 20 공연 상세 — 커버 히어로(모임 · 공연 / 이름 / 공연 예정 · D-8) + 일시·장소 + 소개 + 참가 팀.
// - 참가 팀 행: "내 팀 · 멤버 4명 · 3곡 넘김". 셋리스트를 확정하면 확정곡 목록도 보인다(확정 전엔 팀별
//   넘긴 곡 수만 — 순서가 없어서).
// - 하단 버튼: 내 팀이 나가면 "내 팀 보기", 아니면 모임원에게 "공연 팀 만들기"(진행 중인 공연만).
// - 모임장: ⋮ → 공연 관리 · 셋리스트 확정
// 끝난 공연(종료·취소)은 서버가 소속 팀을 모두 해체해서 참가 팀이 빈 목록으로 온다.

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline gap-3">
      <Typography
        as="dt"
        className="w-18 shrink-0"
        color="semantic.label.assistive"
        variant="label1"
        weight="medium"
      >
        {label}
      </Typography>
      <Typography
        as="dd"
        className="min-w-0 flex-1"
        color="semantic.label.strong"
        variant="body1"
        weight="medium"
      >
        {value}
      </Typography>
    </div>
  );
}

function TeamMeta({
  confirmed,
  isMine,
  performance,
  team,
}: {
  confirmed: boolean;
  isMine: boolean;
  performance: Performance;
  team: Team;
}) {
  const songCount = getSubmittedSongCount(performance, team.id);
  const rest = [
    `멤버 ${team.members.length}명`,
    `${songCount}곡 ${confirmed ? "확정" : "넘김"}`,
  ].join(" · ");
  return (
    <span className="truncate">
      {isMine && <span className="text-accent-text">내 팀 · </span>}
      {rest}
    </span>
  );
}

function ShowDetailScreen() {
  const navigate = useNavigate();
  const { showId } = useParams();
  const performance = getPerformance(toId(showId));
  const canManage = performance ? canManagePerformance(performance) : false;
  const [menuOpen, setMenuOpen] = useState(false);

  useScreenHeader(
    useMemo(
      () => (
        <ScreenHeader
          trailing={
            canManage ? (
              <HeaderIconButton
                icon={<IconMoreVertical />}
                label="공연 메뉴"
                onClick={() => setMenuOpen(true)}
              />
            ) : undefined
          }
        />
      ),
      [canManage],
    ),
  );
  useScreenBackdrop(
    performance ? `cover-${coverToneOf("performance", performance.id)}` : null,
  );

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
  const teams = performance.teamIds.flatMap((id) => getTeam(id) ?? []);
  const myTeams = getMyPerformanceTeams(performance);
  const myTeamIds = new Set(myTeams.map((team) => team.id));
  const confirmed = performance.setlistConfirmed;
  const confirmedSetlist = confirmed
    ? [...performance.setlist].sort(
        (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
      )
    : [];

  // 공연 팀은 진행 중인 공연(공연 예정·팀 모집 중)에만 만들 수 있다. 이미 이 공연에 내 팀이 있으면
  // 새로 만들게 하지 않고 그 팀으로 보낸다. 모임원이 아니면 만들 수 없어서 버튼을 숨긴다.
  let cta: { label: string; to: string } | null = null;
  if (open && myTeams[0]) {
    cta = { label: "내 팀 보기", to: `/team/${myTeams[0].id}` };
  } else if (open && isPerformanceGroupMember(performance)) {
    cta = { label: "공연 팀 만들기", to: `/show/${performance.id}/team/new` };
  }

  const statusLabel = PERFORMANCE_STATUS_LABEL[performance.status];

  return (
    <>
      <ScreenBody>
        <CoverHero
          kicker={group ? `${group.name} · 공연` : "공연"}
          meta={
            open ? (
              <span className="text-accent-text">
                {statusLabel} · {formatDday(performance.performedAt)}
              </span>
            ) : (
              <span className="text-label-assistive">{statusLabel}</span>
            )
          }
          title={performance.title}
          tone={coverToneOf("performance", performance.id)}
        />

        <dl className="flex flex-col gap-3 px-5">
          <InfoRow
            label="일시"
            value={formatDateTime(performance.performedAt)}
          />
          <InfoRow label="장소" value={performance.venue} />
        </dl>

        {performance.description && (
          <>
            <hr className="mx-5 my-5 border-line-neutral" />
            <Typography
              as="p"
              className="whitespace-pre-line px-5"
              color="semantic.label.alternative"
              variant="body2"
            >
              {performance.description}
            </Typography>
          </>
        )}

        {open && (
          <section>
            <SectionHeader
              status={
                confirmed ? (
                  <Status tone="positive">셋리스트 확정</Status>
                ) : (
                  <Status tone="neutral">셋리스트 확정 전</Status>
                )
              }
              title={`참가 팀 ${teams.length}`}
            />
            {teams.length === 0 ? (
              <Typography
                as="p"
                className="px-5"
                color="semantic.label.assistive"
                variant="label2"
              >
                아직 참가한 팀이 없어요
              </Typography>
            ) : (
              teams.map((team) => (
                <CoverRow
                  key={team.id}
                  meta={
                    <TeamMeta
                      confirmed={confirmed}
                      isMine={myTeamIds.has(team.id)}
                      performance={performance}
                      team={team}
                    />
                  }
                  onClick={() => navigate(`/team/${team.id}`)}
                  title={team.name}
                  tone={coverToneOf("team", team.id)}
                />
              ))
            )}
          </section>
        )}

        {confirmedSetlist.length > 0 && (
          <section>
            <SectionHeader title={`셋리스트 ${confirmedSetlist.length}곡`} />
            {confirmedSetlist.map((item, index) => {
              const song = getSong(item.songId);
              const teamName = getTeam(item.teamId)?.name;
              return (
                <TrackRow
                  artist={[song?.artist, teamName].filter(Boolean).join(" · ")}
                  index={index + 1}
                  key={`${item.teamId}-${item.songId}`}
                  title={song?.title ?? "삭제된 곡"}
                />
              );
            })}
          </section>
        )}
      </ScreenBody>

      {cta && (
        <BottomActionArea label={cta.label} onClick={() => navigate(cta.to)} />
      )}

      {canManage && (
        <ActionSheet
          items={[
            {
              label: "공연 관리",
              onSelect: () => navigate(`/show/${performance.id}/manage`),
            },
            {
              label: "셋리스트 확정",
              onSelect: () =>
                navigate(`/show/${performance.id}/setlist/confirm`),
            },
          ]}
          onOpenChange={setMenuOpen}
          open={menuOpen}
        />
      )}
    </>
  );
}

export default ShowDetailScreen;
