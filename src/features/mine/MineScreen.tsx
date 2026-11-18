import { Button, ListCell, ListCellContent } from "@wanteddev/wds";
import { IconSetting } from "@wanteddev/wds-icon";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import CoverRow from "@/components/list/CoverRow";
import { coverToneOf } from "@/components/music/Cover";
import EmptyState from "@/components/ui/EmptyState";
import HeaderIconButton from "@/components/ui/HeaderIconButton";
import { rowClick } from "@/components/ui/listCellEvents";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SectionHeader from "@/components/ui/SectionHeader";
import Stat from "@/components/ui/Stat";
import {
  useScreenBackdrop,
  useScreenHeader,
} from "@/components/ui/useScreenHeader";
import ProfileSummary from "@/features/mine/components/ProfileSummary";
import { daysUntil } from "@/lib/domain/format";
import { INSTRUMENT_LABEL } from "@/lib/domain/labels";
import type { Team } from "@/lib/domain/types";
import {
  getBookmarkedIds,
  getMe,
  getMyInstrumentInTeam,
  getMyTeams,
  getNextTeamRehearsal,
  getPracticeRecordings,
} from "@/mocks/selectors";

// Figma 07 마이(419:13011) — Bottom Nav "마이" 탭 루트. 프로필 + 통계(연습 분석 · 팔로잉 · 저장한 곡)
// + 내 팀 + 메뉴(받은 신청·초대 · 알림 설정 · 계정). 로그아웃·탈퇴와 공개 설정은 /mine/account로 옮겼다.

/** "보컬 · 멤버 4명 · 다음 합주 오늘" — 오늘 합주가 없으면 선택곡 수 */
function getTeamMeta(team: Team): string {
  const instrument = getMyInstrumentInTeam(team);
  const nextRehearsal = getNextTeamRehearsal(team.id);
  return [
    instrument ? INSTRUMENT_LABEL[instrument] : undefined,
    `멤버 ${team.members.length}명`,
    nextRehearsal && daysUntil(nextRehearsal.startsAt) === 0
      ? "다음 합주 오늘"
      : `선택곡 ${team.songIds.length}곡`,
  ]
    .filter(Boolean)
    .join(" · ");
}

const MENU = [
  { label: "받은 신청·초대", path: "/mine/invitations" },
  { label: "알림 설정", path: "/mine/notifications" },
  { label: "계정", path: "/mine/account" },
];

function MineScreen() {
  const navigate = useNavigate();
  const me = getMe();
  const teams = getMyTeams();

  useScreenHeader(
    useMemo(
      () => (
        <ScreenHeader
          title="마이"
          trailing={
            <HeaderIconButton
              icon={<IconSetting />}
              label="계정 설정"
              onClick={() => navigate("/mine/account")}
            />
          }
          variant="title"
        />
      ),
      [navigate],
    ),
  );
  useScreenBackdrop("stage");

  return (
    <ScreenBody>
      <section className="flex flex-col items-start gap-4 px-5 pt-4">
        <ProfileSummary user={me} />
        {/* Figma엔 "프로필 편집"만 있다. 세션은 서버 API가 따로라(PUT /users/me/instruments) 편집 화면도
            따로인데 들어갈 곳이 없어 옆에 하나 더 둔다 — 멤버 프로필(23)의 "초대 · 저장" 두 버튼과 같은 줄. */}
        <div className="flex gap-2">
          <Button
            color="assistive"
            onClick={() => navigate("/mine/profile")}
            size="small"
            variant="outlined"
          >
            프로필 편집
          </Button>
          <Button
            color="assistive"
            onClick={() => navigate("/mine/session")}
            size="small"
            variant="outlined"
          >
            세션 편집
          </Button>
        </div>
      </section>

      {/* 팔로잉 = 유저 북마크(서버 북마크 대상은 유저·팀·곡) */}
      <div className="flex px-5 pt-7">
        <Stat
          label="연습 분석"
          onClick={() => navigate("/practice")}
          value={getPracticeRecordings().length}
        />
        <Stat
          label="팔로잉"
          onClick={() => navigate("/mine/interests?tab=user")}
          value={getBookmarkedIds("USER").length}
        />
        <Stat
          label="저장한 곡"
          onClick={() => navigate("/mine/interests?tab=song")}
          value={getBookmarkedIds("SONG").length}
        />
      </div>

      <SectionHeader title="내 팀" />
      {teams.length === 0 ? (
        <EmptyState
          description="모집글에 지원하거나 초대를 받으면 여기에 모여요"
          title="아직 팀이 없어요"
        />
      ) : (
        teams.map((team) => (
          <CoverRow
            key={team.id}
            meta={getTeamMeta(team)}
            onClick={() => navigate(`/team/${team.id}`)}
            title={team.name}
            tone={coverToneOf("team", team.id)}
          />
        ))
      )}

      <div className="pt-4">
        {MENU.map((item) => (
          <ListCell
            fillWidth
            key={item.path}
            onClick={rowClick(() => navigate(item.path))}
            trailingContent={<ListCellContent variant="chevron" />}
          >
            {item.label}
          </ListCell>
        ))}
      </div>
    </ScreenBody>
  );
}

export default MineScreen;
