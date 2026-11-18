import { useToast } from "@wanteddev/wds";
import { IconMoreVertical } from "@wanteddev/wds-icon";
import { type ReactNode, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { coverToneOf } from "@/components/music/Cover";
import ActionSheet from "@/components/ui/ActionSheet";
import ConfirmSheet from "@/components/ui/ConfirmSheet";
import CoverHero from "@/components/ui/CoverHero";
import HeaderIconButton from "@/components/ui/HeaderIconButton";
import HeroTabs, { type HeroTab } from "@/components/ui/HeroTabs";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import {
  useScreenBackdrop,
  useScreenHeader,
} from "@/components/ui/useScreenHeader";
import {
  isTeamLeader,
  isTeamMember,
  teamKindLabel,
  teamMetaLine,
} from "@/features/team/components/teamHelpers";
import type { Team } from "@/lib/domain/types";

export type TeamTab = "home" | "schedule" | "songs" | "members";

function teamTabs(teamId: number): HeroTab[] {
  return [
    { label: "홈", path: `/team/${teamId}`, value: "home" },
    { label: "합주", path: `/team/${teamId}/schedule`, value: "schedule" },
    { label: "선택곡", path: `/team/${teamId}/songs`, value: "songs" },
    { label: "멤버", path: `/team/${teamId}/members`, value: "members" },
  ];
}

interface TeamScreenFrameProps {
  team: Team;
  tab: TeamTab;
  children: ReactNode;
  /** 본문 아래 고정 영역(BottomActionArea) */
  footer?: ReactNode;
}

// Figma 04 · 12 팀 화면의 공통 틀 — 뒤로가기 + 더보기 헤더, 커버색 글로우, Cover Hero(종류 · 이름 ·
// 지역·인원·장르), 탭 "홈 · 합주 · 선택곡 · 멤버". 탭은 라우트라 HeroTabs가 replace로 옮긴다.
// 더보기: 팀장은 팀 관리로 가고, 팀원은 팀 나가기 시트를 연다(팀장은 위임한 뒤에야 나갈 수 있다 —
// 서버 LEADER_MUST_DELEGATE_FIRST). 팀원이 아니면(공연 상세 등에서 들어온 남의 팀) 공개 정보인 팀
// 홈만 보여 주고 탭·더보기를 숨긴다.
function TeamScreenFrame({
  children,
  footer,
  tab,
  team,
}: TeamScreenFrameProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);

  const isMember = isTeamMember(team);
  const isLeader = isTeamLeader(team);
  const teamId = team.id;
  const tone = coverToneOf("team", teamId);

  useScreenHeader(
    useMemo(
      () => (
        <ScreenHeader
          trailing={
            isMember ? (
              <HeaderIconButton
                icon={<IconMoreVertical />}
                label={isLeader ? "팀 관리" : "더보기"}
                onClick={() =>
                  isLeader
                    ? navigate(`/team/${teamId}/manage`)
                    : setMenuOpen(true)
                }
              />
            ) : undefined
          }
        />
      ),
      [isLeader, isMember, navigate, teamId],
    ),
  );
  useScreenBackdrop(`cover-${tone}`);

  // PATCH /teams/{teamId}/members/{me}/status { status: LEFT }
  const leave = () => {
    toast({ content: `${team.name}에서 나왔어요`, variant: "positive" });
    navigate("/crew?tab=team", { replace: true });
  };

  return (
    <>
      <ScreenBody>
        <CoverHero
          kicker={teamKindLabel(team)}
          meta={teamMetaLine(team)}
          title={team.name}
          tone={tone}
        />
        {isMember && <HeroTabs tabs={teamTabs(teamId)} value={tab} />}
        {children}
      </ScreenBody>
      {footer}

      {isMember && !isLeader && (
        <>
          <ActionSheet
            items={[
              {
                destructive: true,
                label: "팀 나가기",
                onSelect: () => setLeaveOpen(true),
              },
            ]}
            onOpenChange={setMenuOpen}
            open={menuOpen}
            title={team.name}
          />
          <ConfirmSheet
            confirmLabel="나가기"
            description={
              "나가면 선택곡·합주 일정을 더 볼 수 없어요.\n다시 들어오려면 초대가 필요해요."
            }
            onConfirm={leave}
            onOpenChange={setLeaveOpen}
            open={leaveOpen}
            title={`${team.name}에서 나갈까요?`}
          />
        </>
      )}
    </>
  );
}

export default TeamScreenFrame;
