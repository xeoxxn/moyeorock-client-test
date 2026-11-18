import { Typography } from "@wanteddev/wds";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Cover, { coverToneOf } from "@/components/music/Cover";
import BottomActionArea from "@/components/ui/BottomActionArea";
import EmptyState from "@/components/ui/EmptyState";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import RadioOptionList from "@/features/team/components/RadioOptionList";
import { formatDate, formatTime } from "@/lib/domain/format";
import {
  getGroup,
  getJoinablePerformances,
  getMyTeams,
} from "@/mocks/selectors";

// 팀 만들기 → 공연 팀 → 참가할 공연 고르기. 공연 팀은 공연에 속해서(POST /performances/{id}/teams)
// 공연을 먼저 정해야 하고, 서버는 내가 모임원인 모임의 진행 중(공연 예정·팀 모집 중) 공연에만 팀을
// 만들게 한다. 고르면 공연 쪽의 공연 팀 만들기 화면으로 넘긴다.
function TeamNewShowSelectScreen() {
  const navigate = useNavigate();
  const performances = getJoinablePerformances();
  const myTeams = getMyTeams();
  const [selectedId, setSelectedId] = useState<number | null>(
    performances[0]?.id ?? null,
  );

  useScreenHeader(useMemo(() => <ScreenHeader title="공연 선택" />, []));

  if (performances.length === 0) {
    return (
      <ScreenBody className="flex flex-col justify-center">
        <EmptyState
          action={{
            label: "모임 모집글 보기",
            onClick: () => navigate("/board?type=group"),
          }}
          description="모임에 가입하면 그 모임의 공연에 팀으로 나갈 수 있어요."
          title="나갈 수 있는 공연이 없어요"
        />
      </ScreenBody>
    );
  }

  return (
    <>
      <ScreenBody>
        <div className="flex flex-col gap-1 px-5 pt-2 pb-4">
          <Typography
            as="h1"
            color="semantic.label.strong"
            variant="heading1"
            weight="bold"
          >
            어느 공연에 나갈까요?
          </Typography>
          <Typography color="semantic.label.alternative" variant="body2">
            내 모임의 진행 중인 공연이에요
          </Typography>
        </div>
        <RadioOptionList
          onValueChange={(value) => setSelectedId(Number(value))}
          options={performances.map((performance) => {
            // 이미 이 공연에 나가는 내 팀이 있으면 알려 준다.
            const myTeam = myTeams.find(
              (team) => team.performanceId === performance.id,
            );
            const group = getGroup(performance.groupId);
            const when = `${formatDate(performance.performedAt)} ${formatTime(performance.performedAt)}`;
            return {
              caption: (
                <>
                  {group ? `${group.name} · ${when}` : when}
                  {myTeam && (
                    <>
                      <br />
                      참가 중인 내 팀 · {myTeam.name}
                    </>
                  )}
                </>
              ),
              leading: (
                <Cover
                  className="size-14 rounded-sm"
                  tone={coverToneOf("performance", performance.id)}
                />
              ),
              title: performance.title,
              value: String(performance.id),
            };
          })}
          value={selectedId !== null ? String(selectedId) : ""}
        />
      </ScreenBody>

      <BottomActionArea
        disabled={selectedId === null}
        label="다음"
        onClick={() => {
          if (selectedId !== null) navigate(`/show/${selectedId}/team/new`);
        }}
      />
    </>
  );
}

export default TeamNewShowSelectScreen;
