import { Typography } from "@wanteddev/wds";
import {
  IconBell,
  IconChevronRight,
  IconLocation,
  IconMusicMicrophone,
} from "@wanteddev/wds-icon";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import logoWordmark from "@/assets/logo/moyeorock-wordmark.png";
import mascotMusic from "@/assets/mascot/music.png";
import mascotPeace from "@/assets/mascot/peace.png";

import Badge from "@/components/ui/Badge";
import CarouselDots from "@/components/ui/CarouselDots";
import Chip from "@/components/ui/Chip";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SectionHeader from "@/components/ui/SectionHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

// Figma: 홈/01 홈 대시보드 (nodeId 101:11527). "Status Bar"(9:41 등)는 폰 프레임 목업 장식이라
// 구현하지 않는다 — 실제 상단 안전영역은 ScreenLayout의 pt-safe-top이 담당한다.
// "홈/02 홈 - 일정 없는 날"(101:11660)은 이 화면의 빈 상태(empty state) 변형이다 — 별도 라우트가
// 아니라 아래 "오늘의 일정" 섹션에서 오늘 일정 건수(WEEK_DAYS의 isToday 항목)로 분기한다.
//
// Figma에는 본문 뒤에 레드 원형 그라데이션(neon-glow-home-*.svg) 장식이 깔려 있었는데, 워드마크
// 로고를 크게 쓰면서 배경까지 붉으면 지저분해져서 홈에서는 걷어냈다(사용자 요청). 다른 화면의
// 글로우 장식은 그대로 둔다.

const PROFILE_TAGS = ["서울", "어쿠스틱", "입문", "키보드"];

// 공연 상세로 보낼 id. 백엔드가 붙기 전까지는 화면들이 전부 고정 플레이스홀더를 그리므로
// 라우트 파라미터는 "어디로 가는지"만 맞으면 된다.
const NEXT_SHOW_ID = "fall-2026";

interface WeekDay {
  label: string;
  date: number;
  count: number;
  isToday: boolean;
}

const WEEK_DAYS: WeekDay[] = [
  { count: 1, date: 17, isToday: true, label: "오늘" },
  { count: 0, date: 18, isToday: false, label: "금" },
  { count: 0, date: 19, isToday: false, label: "토" },
  { count: 1, date: 20, isToday: false, label: "일" },
  { count: 0, date: 21, isToday: false, label: "월" },
];

interface RecommendedTrack {
  title: string;
  artist: string;
}

const RECOMMENDED_TRACKS: RecommendedTrack[] = [
  { artist: "CORTIS", title: "BIRDS" },
  { artist: "DAY6", title: "한 페이지가 될 수 있게" },
];

interface MyGroup {
  category: string;
  name: string;
  meta: string;
  /** 모임은 /crew/:crewId, 팀은 /team/:teamId — 각 목록 화면의 id와 맞춰 둔다. */
  to: string;
}

const MY_GROUPS: MyGroup[] = [
  {
    category: "모임 · 운영진",
    meta: "멤버 11명 · 서울",
    name: "프로젝트 모임",
    to: "/crew/project-crew",
  },
  {
    category: "팀 · 멤버",
    meta: "멤버 9명 · 봄날 록 페스티벌",
    name: "블루 웨이브",
    to: "/team/1",
  },
];

interface MemberRecruit {
  title: string[];
  place: string;
  ratio: string;
  postId: string;
}

const MEMBER_RECRUITS: MemberRecruit[] = [
  {
    place: "잠실 모여락 스튜디오",
    postId: "p1",
    ratio: "3/5명",
    title: ["잠실 주말 합주", "보컬을 찾고 있어요"],
  },
  {
    place: "성수 모여락 스튜디오",
    postId: "p2",
    ratio: "2/5명",
    title: ["성수 주말 합주", "보컬을 찾고 있어요"],
  },
];

// 캐러셀 컨테이너의 px-5(20px). 카드 위치 계산 시 보정값으로 사용한다.
const RECRUIT_PADDING = 20;

function HomeScreen() {
  const navigate = useNavigate();

  useScreenHeader(
    <ScreenHeader
      trailing={
        <button
          aria-label="알림"
          onClick={() => navigate("/notifications")}
          type="button"
        >
          <IconBell className="size-6 text-label-strong" />
        </button>
      }
      variant="home"
    />,
  );

  const recruitScrollRef = useRef<HTMLDivElement>(null);
  const [activeRecruit, setActiveRecruit] = useState(0);

  const handleRecruitScroll = () => {
    const el = recruitScrollRef.current;
    if (!el) return;
    const cards = Array.from(el.children) as HTMLElement[];
    let closest = 0;
    let minDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft - RECRUIT_PADDING - el.scrollLeft);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setActiveRecruit(closest);
  };

  const scrollToRecruit = (index: number) => {
    const el = recruitScrollRef.current;
    const card = el?.children[index] as HTMLElement | undefined;
    if (!el || !card) return;
    el.scrollTo({
      behavior: "smooth",
      left: card.offsetLeft - RECRUIT_PADDING,
    });
  };

  return (
    <div className="scrollbar-hidden relative flex-1 overflow-y-auto">
      <div className="relative flex flex-col gap-6 px-5 pb-8">
        <section className="flex items-center gap-2.5">
          <div className="flex min-w-0 flex-1 flex-col gap-2.5">
            {/* 홈의 주인공은 워드마크다 — 그래서 날짜 줄은 빼고(아래 "오늘의 일정"이 날짜를
                이미 보여준다) 인사말도 title3 2줄에서 headline2 1줄로 줄였다. 로고는 원본
                이미지를 누끼 따서 돌 질감(균열·파편)을 입힌 PNG이다. 네온 글로우는 일부러
                넣지 않는다(사용자 요청) — 균열·파편 실루엣이 글로우에 묻힌다. */}
            <img
              alt="모여락"
              className="h-[88px] w-auto max-w-full self-start object-contain object-left"
              src={logoWordmark}
            />
            <div className="flex flex-wrap items-baseline gap-x-1.5">
              <Typography
                color="semantic.label.strong"
                variant="headline2"
                weight="bold"
              >
                광철님,
              </Typography>
              <Typography
                className="text-glow-sm"
                color="semantic.primary.normal"
                variant="headline2"
                weight="bold"
              >
                오늘도 무대 위로
              </Typography>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PROFILE_TAGS.map((tag) => (
                <Chip key={tag}>{tag}</Chip>
              ))}
            </div>
          </div>
          <img
            alt=""
            className="size-[104px] shrink-0 drop-shadow-neon-md"
            src={mascotPeace}
          />
        </section>

        <section className="flex flex-col gap-3">
          <SectionHeader
            actionLabel="전체보기"
            onAction={() => navigate("/schedule")}
            title="오늘의 일정"
          />
          <div className="flex gap-1.5">
            {WEEK_DAYS.map((day) => (
              <button
                className={
                  day.isToday
                    ? "flex flex-1 flex-col items-center gap-0.5 rounded-2xl bg-accent-strong py-2.5 shadow-neon-md"
                    : "flex flex-1 flex-col items-center gap-0.5 rounded-2xl border border-line-neutral bg-surface py-2.5"
                }
                key={day.date}
                onClick={() => navigate("/schedule")}
                type="button"
              >
                <Typography
                  color={
                    day.isToday
                      ? "semantic.static.white"
                      : "semantic.label.assistive"
                  }
                  variant="caption2"
                  weight="bold"
                >
                  {day.label}
                </Typography>
                <Typography
                  color={
                    day.isToday
                      ? "semantic.static.white"
                      : "semantic.label.strong"
                  }
                  variant="headline1"
                  weight="bold"
                >
                  {day.date}
                </Typography>
                <Typography
                  color={
                    day.isToday
                      ? "semantic.static.white"
                      : "semantic.primary.normal"
                  }
                  variant="caption2"
                  weight="medium"
                >
                  {day.count > 0 ? `${day.count}건` : " "}
                </Typography>
              </button>
            ))}
          </div>
          <button
            className="flex items-center gap-3.5 rounded-[20px] border border-line-solid bg-surface p-4 text-left"
            onClick={() => navigate("/schedule")}
            type="button"
          >
            <div className="h-[52px] w-1 shrink-0 rounded-sm bg-accent shadow-neon-sm" />
            <div className="flex flex-col gap-0.5">
              <Typography
                className="text-glow-sm"
                color="semantic.primary.normal"
                variant="caption1"
                weight="bold"
              >
                19:00 ~ 21:00
              </Typography>
              <Typography
                color="semantic.label.strong"
                variant="headline2"
                weight="bold"
              >
                밴드 합주
              </Typography>
              <Typography
                color="semantic.label.alternative"
                variant="label2"
                weight="regular"
              >
                합주실 A · 블루 웨이브
              </Typography>
            </div>
          </button>
        </section>

        <section className="flex flex-col gap-3">
          <SectionHeader
            actionLabel="공연 전체"
            onAction={() => navigate("/board?category=show")}
            title="다음 공연"
          />
          <button
            className="flex flex-col gap-1.5 rounded-[22px] border border-line-solid bg-surface p-5 text-left"
            onClick={() => navigate(`/show/${NEXT_SHOW_ID}`)}
            type="button"
          >
            <div className="flex w-full items-center">
              <Badge glow size="md" tone="solid">
                D-30 · 팀 모집 중
              </Badge>
              <div className="flex-1" />
              <img
                alt=""
                className="size-16 drop-shadow-neon-md"
                src={mascotMusic}
              />
            </div>
            <Typography
              color="semantic.label.strong"
              variant="heading1"
              weight="bold"
            >
              2026 가을 정기공연
            </Typography>
            <Typography
              color="semantic.label.alternative"
              variant="label2"
              weight="medium"
            >
              10월 17일 (토) 18:00 · 홍대 롤링홀
            </Typography>
            <div className="h-2 w-full overflow-hidden rounded-sm bg-white/10">
              <div className="h-1.5 w-[50%] rounded-sm bg-accent shadow-neon-sm" />
            </div>
            <Typography
              color="semantic.label.assistive"
              variant="caption1"
              weight="medium"
            >
              참가 팀 3팀
            </Typography>
          </button>
        </section>

        <section className="flex flex-col gap-1">
          <SectionHeader title="오늘의 추천곡" />
          {RECOMMENDED_TRACKS.map((track) => (
            <div className="flex items-center gap-3 py-2.5" key={track.title}>
              <div className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-surface">
                <IconMusicMicrophone className="size-5 text-label-normal" />
              </div>
              <div className="flex min-w-0 flex-col">
                <Typography
                  color="semantic.label.normal"
                  variant="body1"
                  weight="bold"
                >
                  {track.title}
                </Typography>
                <Typography
                  color="semantic.label.assistive"
                  variant="label2"
                  weight="medium"
                >
                  {track.artist}
                </Typography>
              </div>
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-2.5">
          <SectionHeader
            actionLabel="전체보기"
            onAction={() => navigate("/crew")}
            title="나의 모임·팀"
          />
          {MY_GROUPS.map((group) => (
            <button
              className="flex items-center gap-3.5 rounded-[20px] border border-line-neutral bg-surface p-3.5 text-left"
              key={group.name}
              onClick={() => navigate(group.to)}
              type="button"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-px">
                <Typography
                  color="semantic.primary.normal"
                  variant="caption2"
                  weight="bold"
                >
                  {group.category}
                </Typography>
                <Typography
                  color="semantic.label.strong"
                  variant="body2"
                  weight="bold"
                >
                  {group.name}
                </Typography>
                <Typography
                  color="semantic.label.assistive"
                  variant="caption1"
                  weight="regular"
                >
                  {group.meta}
                </Typography>
              </div>
              <IconChevronRight className="size-[18px] shrink-0 text-label-assistive" />
            </button>
          ))}
        </section>

        <section className="flex flex-col gap-2.5">
          <SectionHeader
            actionLabel="더보기"
            onAction={() => navigate("/crew/find")}
            title="함께할 멤버를 찾고 있어요"
          />
          <div
            className="scrollbar-hidden relative -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5"
            onScroll={handleRecruitScroll}
            ref={recruitScrollRef}
          >
            {MEMBER_RECRUITS.map((recruit) => (
              <button
                className="flex w-full shrink-0 snap-start flex-col items-start gap-2 rounded-[20px] border border-line-neutral bg-surface p-4 text-left"
                key={recruit.postId}
                onClick={() => navigate(`/board/${recruit.postId}`)}
                type="button"
              >
                <Badge>모임 모집</Badge>
                <div className="flex flex-col">
                  {recruit.title.map((line) => (
                    <Typography
                      color="semantic.label.strong"
                      key={line}
                      variant="body2"
                      weight="bold"
                    >
                      {line}
                    </Typography>
                  ))}
                </div>
                <div className="flex w-full items-center gap-1">
                  <IconLocation className="size-3.5 shrink-0 text-label-assistive" />
                  <Typography
                    className="min-w-0 flex-1 truncate"
                    color="semantic.label.assistive"
                    variant="caption1"
                    weight="regular"
                  >
                    {recruit.place}
                  </Typography>
                  <Typography
                    color="semantic.primary.normal"
                    variant="caption1"
                    weight="bold"
                  >
                    {recruit.ratio}
                  </Typography>
                </div>
              </button>
            ))}
          </div>

          {MEMBER_RECRUITS.length > 1 && (
            <CarouselDots
              active={activeRecruit}
              count={MEMBER_RECRUITS.length}
              itemLabel="모집"
              onSelect={scrollToRecruit}
            />
          )}
        </section>
      </div>
    </div>
  );
}

export default HomeScreen;
