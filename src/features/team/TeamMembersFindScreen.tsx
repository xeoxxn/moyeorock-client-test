import {
  Category,
  CategoryList,
  CategoryListItem,
  List,
  ListCellContent,
  SearchField,
  TextButton,
  Typography,
} from "@wanteddev/wds";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import EmptyState from "@/components/ui/EmptyState";
import { innerClick } from "@/components/ui/listCellEvents";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SectionHeader from "@/components/ui/SectionHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import InviteSheet from "@/features/join/InviteSheet";
import MemberCell from "@/features/team/components/MemberCell";
import TeamFallback from "@/features/team/components/TeamFallback";
import {
  isTeamLeader,
  useTeamParam,
} from "@/features/team/components/teamHelpers";
import {
  formatInstruments,
  GENRE_LABEL,
  INSTRUMENT_LABEL,
  INSTRUMENT_OPTIONS,
  LEVEL_LABEL,
  LEVEL_OPTIONS,
  REGION_LABEL,
} from "@/lib/domain/labels";
import type { Instrument, Team, User } from "@/lib/domain/types";
import { USERS } from "@/mocks/data";
import { getSentInvitations } from "@/mocks/selectors";

// Figma: 팀/10 팀원 찾기 (AI 추천) (nodeId 142:19921) — 팀장만. 검색어가 없으면 세션별 AI 추천
// (GET /teams/{id}/members/recommendations?instrument), 있으면 닉네임 검색(GET /users/search?nickname)
// 결과를 보여준다. Figma의 두 탭을 검색창 하나로 합쳤다 — 검색어를 지우면 다시 추천이 보인다.
// 후보를 누르면 프로필(초대 버튼이 이 팀을 미리 고르도록 teamId를 넘긴다), "초대"는 공용 초대 시트.
function TeamMembersFindScreen() {
  const team = useTeamParam();
  if (!team) return <TeamFallback kind="notFound" />;
  if (!isTeamLeader(team))
    return <TeamFallback kind="leaderOnly" team={team} />;
  return <TeamMembersFindContent team={team} />;
}

/**
 * 추천 이유와 점수 — 서버 AI 추천 응답이 붙기 전까지 장르·지역·실력으로 흉내 낸다.
 * 화면에는 앞의 두 가지만 보여준다.
 */
function recommend(user: User, team: Team, instrument: Instrument | null) {
  const reasons: string[] = [];
  let score = 0;
  const sharedGenres = user.genres.filter((genre) =>
    team.genres.includes(genre),
  );
  if (sharedGenres.length > 0) {
    reasons.push(
      `장르 일치: ${sharedGenres.map((genre) => GENRE_LABEL[genre]).join(", ")}`,
    );
    score += sharedGenres.length * 2;
  }
  if (user.region === team.region) {
    reasons.push(`활동 지역 같음: ${REGION_LABEL[user.region]}`);
    score += 1;
  }
  const skill = user.instruments.find((item) => item.instrument === instrument);
  if (skill) {
    reasons.push(
      `${INSTRUMENT_LABEL[skill.instrument]} ${LEVEL_LABEL[skill.level]}`,
    );
    score += LEVEL_OPTIONS.indexOf(skill.level);
  }
  return { reasons: reasons.slice(0, 2), score };
}

function TeamMembersFindContent({ team }: { team: Team }) {
  const navigate = useNavigate();
  const memberIds = new Set(team.members.map((member) => member.user.id));
  // 처음엔 팀에 아직 없는 세션부터 추천한다(블루 웨이브면 드럼).
  const [instrument, setInstrument] = useState<Instrument>(
    () =>
      INSTRUMENT_OPTIONS.find(
        (option) =>
          !team.members.some((member) => member.instrument === option),
      ) ?? INSTRUMENT_OPTIONS[0],
  );
  const [keyword, setKeyword] = useState("");
  const [invitedIds, setInvitedIds] = useState(
    () =>
      new Set(
        getSentInvitations("TEAM", team.id)
          .filter((invitation) => invitation.status === "PENDING")
          .map((invitation) => invitation.inviteeId),
      ),
  );
  const [invitee, setInvitee] = useState<User | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useScreenHeader(<ScreenHeader title="팀원 찾기" />);

  const query = keyword.trim();
  const searching = query !== "";
  const outsiders = USERS.filter((user) => !memberIds.has(user.id));
  const candidates = (
    searching
      ? outsiders.filter((user) => user.nickname.includes(query))
      : outsiders.filter((user) =>
          user.instruments.some((item) => item.instrument === instrument),
        )
  )
    .map((user) => ({
      user,
      ...recommend(user, team, searching ? null : instrument),
    }))
    .sort((a, b) => b.score - a.score);

  const openInvite = (user: User) => {
    setInvitee(user);
    setSheetOpen(true);
  };

  return (
    <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto">
      <div className="px-5 pt-2">
        <SearchField
          onChange={(event) => setKeyword(event.target.value)}
          onReset={() => setKeyword("")}
          placeholder="닉네임으로 검색"
          value={keyword}
          width="100%"
        />
      </div>

      {!searching && (
        <Category
          onValueChange={(value) => setInstrument(value as Instrument)}
          value={instrument}
        >
          <CategoryList horizontalPadding size="small" verticalPadding>
            {INSTRUMENT_OPTIONS.map((option) => (
              <CategoryListItem key={option} value={option}>
                {INSTRUMENT_LABEL[option]}
              </CategoryListItem>
            ))}
          </CategoryList>
        </Category>
      )}

      <section className="flex flex-col gap-1 px-5 pt-4 pb-8">
        <SectionHeader
          count={candidates.length}
          title={
            searching
              ? "닉네임 검색 결과"
              : `${INSTRUMENT_LABEL[instrument]} 세션 AI 추천`
          }
        />
        {!searching && (
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="medium"
          >
            {team.name}의 장르·지역과 실력을 보고 골랐어요.
          </Typography>
        )}

        {candidates.length === 0 ? (
          <EmptyState
            description={
              searching
                ? "닉네임을 다시 확인해 주세요."
                : "다른 세션을 골라 보거나 게시판에 모집 공고를 올려 보세요."
            }
            title={searching ? "찾는 사람이 없어요" : "추천할 사람이 없어요"}
          />
        ) : (
          <List>
            {candidates.map(({ reasons, user }) => {
              const invited = invitedIds.has(user.id);
              return (
                <MemberCell
                  caption={
                    <span className="flex flex-col gap-0.5">
                      <span>{formatInstruments(user.instruments, true)}</span>
                      <span>
                        {REGION_LABEL[user.region]}
                        {user.genres.length > 0 &&
                          ` · ${user.genres.map((genre) => GENRE_LABEL[genre]).join(", ")}`}
                      </span>
                      {reasons.length > 0 && (
                        <Typography
                          color="semantic.primary.normal"
                          variant="caption1"
                          weight="bold"
                        >
                          {reasons.join(" · ")}
                        </Typography>
                      )}
                    </span>
                  }
                  key={user.id}
                  nickname={user.nickname}
                  onPress={() =>
                    navigate(`/users/${user.id}?teamId=${team.id}`)
                  }
                  trailing={
                    <ListCellContent variant="button">
                      <TextButton
                        color={invited ? "assistive" : "primary"}
                        disabled={invited}
                        onClick={innerClick(() => openInvite(user))}
                        size="small"
                      >
                        {invited ? "초대함" : "초대"}
                      </TextButton>
                    </ListCellContent>
                  }
                />
              );
            })}
          </List>
        )}
      </section>

      {invitee && (
        <InviteSheet
          defaultTargetKey={`TEAM:${team.id}`}
          invitee={invitee}
          // 초대 시트는 열 때의 대상으로 세션 기본값을 잡으므로, 사람이 바뀌면 새로 만든다.
          key={invitee.id}
          onInvited={(targetKey) => {
            if (targetKey === `TEAM:${team.id}`) {
              setInvitedIds((prev) => new Set(prev).add(invitee.id));
            }
          }}
          onOpenChange={setSheetOpen}
          open={sheetOpen}
        />
      )}
    </div>
  );
}

export default TeamMembersFindScreen;
