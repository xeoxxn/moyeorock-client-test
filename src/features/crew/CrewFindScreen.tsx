import { Tab, TabList, TabListItem, Typography } from "@wanteddev/wds";
import {
  IconChevronLeft,
  IconLocation,
  IconPersons,
} from "@wanteddev/wds-icon";
import { useNavigate } from "react-router-dom";

import { useScreenHeader } from "@/components/ui/useScreenHeader";

// Figma: 모임/07 모임 찾기 (nodeId 101:20662). Figma에서는 모임 목록 화면 위에 뜨는 바텀시트지만,
// 웹에서는 독립된 화면으로 승격했다(Dim + Bottom Sheet를 그대로 흉내 내는 대신 일반 라우트로).
interface RecruitingCrew {
  id: string;
  title: string;
  description: string;
  place: string;
  memberRatio: string;
}

const RECRUITING_CREWS: RecruitingCrew[] = [
  {
    description: "홍대에서 활동해요. 인디 록과 얼터너티브를 좋아해요.",
    id: "hongdae-weekend",
    memberRatio: "3/5명",
    place: "홍대 모여락 스튜디오",
    title: "홍대 주말 합주 보컬을 찾고 있어요",
  },
  {
    description: "합정에서 활동해요. 인디 록과 얼터너티브를 좋아해요.",
    id: "hapjeong-bass",
    memberRatio: "4/5명",
    place: "합정 모여락 스튜디오",
    title: "합정 퇴근 후 베이스 세션 구해요",
  },
];

function CrewFindScreen() {
  const navigate = useNavigate();

  useScreenHeader(
    <div className="flex w-full items-center gap-3 px-5 py-2.5">
      <button onClick={() => navigate(-1)} type="button">
        <IconChevronLeft className="size-6 text-label-normal" />
      </button>
      <Typography
        as="h1"
        color="semantic.label.normal"
        variant="title3"
        weight="bold"
      >
        모임 찾기
      </Typography>
    </div>,
  );

  return (
    <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto">
      <Tab value="crew">
        <TabList resize="fill" size="medium">
          <TabListItem value="crew">모임</TabListItem>
          <TabListItem value="team">팀</TabListItem>
        </TabList>
      </Tab>
      <div className="flex flex-col gap-3.5 px-5 pt-4 pb-6">
        <Typography
          color="semantic.label.alternative"
          variant="body2"
          weight="regular"
        >
          모임은 공연을 운영하고, 팀은 함께 연주해요.
          <br />
          먼저 활동할 모임을 선택하세요.
        </Typography>
        <div className="flex items-center justify-between">
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="regular"
          >
            모임을 선택해 소식과 공연을 확인하세요.
          </Typography>
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="bold"
          >
            모집 중인 모임 {RECRUITING_CREWS.length}개
          </Typography>
        </div>
        {RECRUITING_CREWS.map((crew) => (
          <button
            className="flex flex-col gap-1 rounded-2xl border border-line-solid p-4 text-left"
            key={crew.id}
            onClick={() => navigate(`/crew/${crew.id}`)}
            type="button"
          >
            <div className="rounded-md bg-accent-subtle px-1.5 py-0.5 shadow-neon-sm">
              <Typography
                color="semantic.primary.normal"
                variant="caption2"
                weight="medium"
              >
                모집중
              </Typography>
            </div>
            <Typography
              color="semantic.label.normal"
              variant="body1"
              weight="bold"
            >
              {crew.title}
            </Typography>
            <Typography
              color="semantic.label.alternative"
              variant="label2"
              weight="medium"
            >
              {crew.description}
            </Typography>
            <div className="flex items-center gap-2.5 pt-0.5">
              <div className="flex items-center gap-1">
                <IconLocation className="size-3.5 text-label-alternative" />
                <Typography
                  color="semantic.label.alternative"
                  variant="label2"
                  weight="medium"
                >
                  {crew.place}
                </Typography>
              </div>
              <div className="flex items-center gap-1">
                <IconPersons className="size-3.5 text-label-alternative" />
                <Typography
                  color="semantic.label.alternative"
                  variant="label2"
                  weight="medium"
                >
                  {crew.memberRatio}
                </Typography>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CrewFindScreen;
