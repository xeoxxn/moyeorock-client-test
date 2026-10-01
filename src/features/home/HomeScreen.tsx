import { Typography } from "@wanteddev/wds";
import {
  IconBell,
  IconChevronRight,
  IconLocation,
  IconMusicMicrophone,
} from "@wanteddev/wds-icon";
import { useRef, useState } from "react";

import neonGlow1 from "@/assets/decorative/neon-glow-home-1.svg";
import neonGlow2 from "@/assets/decorative/neon-glow-home-2.svg";
import mascotMusic from "@/assets/mascot/music.png";
import mascotPeace from "@/assets/mascot/peace.png";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

// Figma: 홈/01 홈 대시보드 (nodeId 101:11527). "Status Bar"(9:41 등)는 폰 프레임 목업 장식이라
// 구현하지 않는다 — 실제 상단 안전영역은 ScreenLayout의 pt-safe-top이 담당한다.
// "홈/02 홈 - 일정 없는 날"(101:11660)은 이 화면의 빈 상태(empty state) 변형이다 — 별도 라우트가
// 아니라 아래 "오늘의 일정" 섹션에서 오늘 일정 건수(WEEK_DAYS의 isToday 항목)로 분기한다.

const PROFILE_TAGS = ["서울", "어쿠스틱", "입문", "키보드"];

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
}

const MY_GROUPS: MyGroup[] = [
  {
    category: "모임 · 운영진",
    meta: "멤버 11명 · 서울",
    name: "프로젝트 모임",
  },
  {
    category: "팀 · 멤버",
    meta: "멤버 9명 · 봄날 록 페스티벌",
    name: "블루 웨이브",
  },
];

interface MemberRecruit {
  title: string[];
  place: string;
  ratio: string;
}

const MEMBER_RECRUITS: MemberRecruit[] = [
  {
    place: "잠실 모여락 스튜디오",
    ratio: "3/5명",
    title: ["잠실 주말 합주", "보컬을 찾고 있어요"],
  },
  {
    place: "성수 모여락 스튜디오",
    ratio: "2/5명",
    title: ["성수 주말 합주", "보컬을 찾고 있어요"],
  },
];

// 캐러셀 컨테이너의 px-5(20px). 카드 위치 계산 시 보정값으로 사용한다.
const RECRUIT_PADDING = 20;

function HomeScreen() {
  useScreenHeader(
    <ScreenHeader
      trailing={<IconBell className="size-6 text-label-strong" />}
      variant="logo"
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
      <img
        alt=""
        className="pointer-events-none absolute top-[176px] left-[92px] h-[300px] w-[300px] opacity-80"
        src={neonGlow1}
      />
      <img
        alt=""
        className="pointer-events-none absolute top-[600px] left-[-40px] h-[220px] w-[280px] opacity-70"
        src={neonGlow2}
      />

      <div className="relative flex flex-col gap-6 px-5 pt-2 pb-8">
        <section className="flex items-center gap-2.5">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <Typography
              color="semantic.label.assistive"
              variant="label2"
              weight="medium"
            >
              9월 17일 목요일
            </Typography>
            <div className="flex flex-col">
              <Typography
                color="semantic.label.strong"
                variant="title3"
                weight="bold"
              >
                광철님,
              </Typography>
              <Typography
                className="text-glow"
                color="semantic.primary.normal"
                variant="title3"
                weight="bold"
              >
                오늘도 무대 위로
              </Typography>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              {PROFILE_TAGS.map((tag) => (
                <div
                  className="rounded-xl border border-line-solid px-2.5 py-0.5"
                  key={tag}
                >
                  <Typography
                    color="semantic.label.alternative"
                    variant="caption1"
                    weight="medium"
                  >
                    {tag}
                  </Typography>
                </div>
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
          <div className="flex items-center justify-between">
            <Typography
              color="semantic.label.strong"
              variant="headline1"
              weight="bold"
            >
              오늘의 일정
            </Typography>
            <Typography
              color="semantic.label.assistive"
              variant="label2"
              weight="medium"
            >
              전체보기
            </Typography>
          </div>
          <div className="flex gap-1.5">
            {WEEK_DAYS.map((day) => (
              <div
                className={
                  day.isToday
                    ? "flex flex-1 flex-col items-center gap-0.5 rounded-2xl bg-accent-strong py-2.5 shadow-neon-md"
                    : "flex flex-1 flex-col items-center gap-0.5 rounded-2xl border border-line-neutral bg-surface py-2.5"
                }
                key={day.date}
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
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3.5 rounded-[20px] border border-line-solid bg-surface p-4">
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
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Typography
              color="semantic.label.strong"
              variant="headline1"
              weight="bold"
            >
              다음 공연
            </Typography>
            <Typography
              color="semantic.label.assistive"
              variant="label2"
              weight="medium"
            >
              공연 전체
            </Typography>
          </div>
          <div className="flex flex-col gap-1.5 rounded-[22px] border border-line-solid bg-surface p-5">
            <div className="flex items-center">
              <div className="flex items-center rounded-[10px] bg-accent px-2 py-0.5 shadow-neon-sm">
                <Typography
                  color="semantic.static.white"
                  variant="caption2"
                  weight="bold"
                >
                  D-30 · 팀 모집 중
                </Typography>
              </div>
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
          </div>
        </section>

        <section className="flex flex-col gap-1">
          <Typography
            color="semantic.label.normal"
            variant="headline1"
            weight="bold"
          >
            오늘의 추천곡
          </Typography>
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
          <div className="flex items-center justify-between">
            <Typography
              color="semantic.label.strong"
              variant="headline1"
              weight="bold"
            >
              나의 모임·팀
            </Typography>
            <Typography
              color="semantic.label.assistive"
              variant="label2"
              weight="medium"
            >
              전체보기
            </Typography>
          </div>
          {MY_GROUPS.map((group) => (
            <div
              className="flex items-center gap-3.5 rounded-[20px] border border-line-neutral bg-surface p-3.5"
              key={group.name}
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
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <Typography
              color="semantic.label.strong"
              variant="headline1"
              weight="bold"
            >
              함께할 멤버를 찾고 있어요
            </Typography>
            <Typography
              color="semantic.label.assistive"
              variant="label2"
              weight="medium"
            >
              더보기
            </Typography>
          </div>
          <div
            className="scrollbar-hidden relative -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5"
            onScroll={handleRecruitScroll}
            ref={recruitScrollRef}
          >
            {MEMBER_RECRUITS.map((recruit) => (
              <div
                className="flex w-full shrink-0 snap-start flex-col gap-2 rounded-[20px] border border-line-neutral bg-surface p-4"
                key={recruit.title.join()}
              >
                <div className="flex w-fit rounded-lg bg-accent-subtle px-1.5 py-0.5">
                  <Typography
                    color="semantic.primary.normal"
                    variant="caption2"
                    weight="bold"
                  >
                    모임 모집
                  </Typography>
                </div>
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
                <div className="flex items-center gap-1">
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
              </div>
            ))}
          </div>

          {MEMBER_RECRUITS.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {MEMBER_RECRUITS.map((recruit, i) => (
                <button
                  aria-label={`${i + 1}번째 모집 보기`}
                  className={
                    i === activeRecruit
                      ? "h-1.5 w-4 rounded-full bg-accent shadow-neon-sm transition-all duration-300"
                      : "size-1.5 rounded-full bg-white/20 transition-all duration-300"
                  }
                  key={recruit.title.join()}
                  onClick={() => scrollToRecruit(i)}
                  type="button"
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default HomeScreen;
