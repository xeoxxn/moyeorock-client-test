import { IconMoreVertical } from "@wanteddev/wds-icon";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { coverToneOf } from "@/components/music/Cover";
import CoverHero from "@/components/ui/CoverHero";
import HeaderIconButton from "@/components/ui/HeaderIconButton";
import HeroTabs from "@/components/ui/HeroTabs";
import ScreenHeader from "@/components/ui/ScreenHeader";
import {
  useScreenBackdrop,
  useScreenHeader,
} from "@/components/ui/useScreenHeader";
import { groupHeroMeta } from "@/features/crew/components/crewHelpers";
import { GROUP_TYPE_LABEL } from "@/lib/domain/labels";
import type { Group } from "@/lib/domain/types";

export type CrewTab = "home" | "show" | "members";

interface CrewHeroProps {
  group: Group;
  tab: CrewTab;
}

// Figma 19 모임 홈 — 홈 · 공연 · 멤버 세 탭 화면이 함께 쓰는 위쪽: 헤더(뒤로 + ⋮) + 커버색 글로우 +
// Cover Hero + 탭. 탭은 각각 라우트라 HeroTabs가 replace로 옮긴다.
// ⋮(모임 설정)는 모임원에게만 보인다. 모임장은 받은 신청·공지·정보 수정·해체를, 그 밖의 모임원은
// 나가기를 거기서 한다(서버: 공지·가입 승인·수정·해체는 모임장만, 모임장은 나갈 수 없다).
function CrewHero({ group, tab }: CrewHeroProps) {
  const navigate = useNavigate();
  const tone = coverToneOf("group", group.id);
  const isMember = group.myRole !== null;

  useScreenHeader(
    useMemo(
      () => (
        <ScreenHeader
          trailing={
            isMember ? (
              <HeaderIconButton
                icon={<IconMoreVertical />}
                label="모임 설정"
                onClick={() => navigate(`/crew/${group.id}/manage`)}
              />
            ) : undefined
          }
        />
      ),
      [group.id, isMember, navigate],
    ),
  );
  useScreenBackdrop(`cover-${tone}` as const);

  const tabs = useMemo(
    () => [
      { label: "홈", path: `/crew/${group.id}`, value: "home" },
      { label: "공연", path: `/crew/${group.id}/show`, value: "show" },
      { label: "멤버", path: `/crew/${group.id}/members`, value: "members" },
    ],
    [group.id],
  );

  return (
    <>
      <CoverHero
        kicker={GROUP_TYPE_LABEL[group.type]}
        meta={groupHeroMeta(group)}
        title={group.name}
        tone={tone}
      />
      <HeroTabs tabs={tabs} value={tab} />
    </>
  );
}

export default CrewHero;
