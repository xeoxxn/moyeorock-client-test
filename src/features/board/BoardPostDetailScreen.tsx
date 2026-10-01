import { Button, Typography } from "@wanteddev/wds";
import { IconBell, IconChevronLeft } from "@wanteddev/wds-icon";
import { useNavigate } from "react-router-dom";

import mascotMegaphone from "@/assets/mascot/megaphone.png";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

// Figma: 게시판/02 모집글 상세 (nodeId 101:24612)

interface Member {
  name: string;
  session: string;
}

const MEMBERS: Member[] = [
  { name: "김모임", session: "보컬" },
  { name: "박드럼", session: "드럼" },
  { name: "박베이스", session: "베이스" },
];

function BoardPostDetailScreen() {
  const navigate = useNavigate();

  useScreenHeader(
    <ScreenHeader
      leading={
        <button onClick={() => navigate(-1)} type="button">
          <IconChevronLeft className="size-6 text-label-normal" />
        </button>
      }
      trailing={<IconBell className="size-6 text-label-normal" />}
      variant="normal"
    />,
  );

  return (
    <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto">
      <div className="flex flex-col gap-3 px-5 pt-2 pb-6">
        <div className="flex items-center gap-1.5">
          <div className="rounded-md bg-accent-subtle px-1.5 py-0.5">
            <Typography
              color="semantic.primary.normal"
              variant="caption2"
              weight="medium"
            >
              모집중
            </Typography>
          </div>
          <Typography
            color="semantic.label.assistive"
            variant="caption1"
            weight="bold"
          >
            인디 · 펑크
          </Typography>
        </div>
        <Typography
          color="semantic.label.strong"
          variant="title3"
          weight="bold"
        >
          홍대 주말 합주
          <br />
          보컬을 찾고 있어요
        </Typography>
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-full bg-surface" />
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="medium"
          >
            김모임 · 프로젝트 모임 · 운영진 · 2일 전
          </Typography>
        </div>

        <div className="flex items-center justify-center rounded-2xl bg-surface py-8">
          <img
            alt=""
            className="size-[120px] drop-shadow-neon-md"
            src={mascotMegaphone}
          />
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between">
            <Typography
              color="semantic.label.assistive"
              variant="label1"
              weight="medium"
            >
              모집 인원
            </Typography>
            <Typography
              color="semantic.label.normal"
              variant="label1"
              weight="bold"
            >
              3/5명
            </Typography>
          </div>
          <div className="flex items-center justify-between">
            <Typography
              color="semantic.label.assistive"
              variant="label1"
              weight="medium"
            >
              모집 세션
            </Typography>
            <Typography
              color="semantic.label.normal"
              variant="label1"
              weight="bold"
            >
              보컬 1명
            </Typography>
          </div>
          <div className="flex items-center justify-between">
            <Typography
              color="semantic.label.assistive"
              variant="label1"
              weight="medium"
            >
              합주 장소
            </Typography>
            <Typography
              color="semantic.label.normal"
              variant="label1"
              weight="bold"
            >
              홍대 모여락 스튜디오
            </Typography>
          </div>
          <div className="flex items-center justify-between">
            <Typography
              color="semantic.label.assistive"
              variant="label1"
              weight="medium"
            >
              합주 일정
            </Typography>
            <Typography
              color="semantic.label.normal"
              variant="label1"
              weight="bold"
            >
              매주 토요일 14:00
            </Typography>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-4">
          <Typography
            color="semantic.label.strong"
            variant="headline1"
            weight="bold"
          >
            소개
          </Typography>
          <Typography
            color="semantic.label.alternative"
            variant="label1-reading"
            weight="regular"
          >
            홍대에서 활동해요. 인디 록과 얼터너티브를 좋아하는 분이면 좋아요.
            실력보다 꾸준히 함께할 수 있는 분을 찾고 있어요!
          </Typography>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Typography
            color="semantic.label.strong"
            variant="headline1"
            weight="bold"
          >
            함께하는 멤버{" "}
            <Typography
              as="span"
              color="semantic.primary.normal"
              variant="headline1"
              weight="bold"
            >
              {MEMBERS.length}
            </Typography>
          </Typography>
          <div className="flex gap-4">
            {MEMBERS.map((member) => (
              <div
                className="flex flex-col items-center gap-1"
                key={member.name}
              >
                <div className="size-11 rounded-full bg-surface" />
                <Typography
                  color="semantic.label.normal"
                  variant="caption1"
                  weight="medium"
                >
                  {member.name}
                </Typography>
                <Typography
                  color="semantic.label.assistive"
                  variant="caption2"
                  weight="regular"
                >
                  {member.session}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 flex-col bg-surface-elevated px-5 pt-3 pb-[34px]">
        <Button color="primary" fullWidth size="large" variant="solid">
          참여 신청하기
        </Button>
      </div>
    </div>
  );
}

export default BoardPostDetailScreen;
