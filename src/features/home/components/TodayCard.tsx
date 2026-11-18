import { Typography, WithInteraction } from "@wanteddev/wds";

import { BrandSymbol } from "@/components/music/Brand";

// Figma 01 홈의 Today Card(482:18605) — 주홍 카드에 오늘(없으면 가장 가까운) 합주 하나를 크게: 작은 라벨 +
// 큰 시작 시각(Archivo Black) + 팀 · 장소 · 멤버 수, 얇은 선 아래 그다음 합주 한 줄. 오른쪽 위엔 잘린
// 심볼 워터마크. 합주엔 참석 인원 필드가 없어 Figma의 "4명 참석" 대신 팀 멤버 수를 쓴다.
interface TodayCardProps {
  /** "오늘 합주" · "다음 합주 · 15일(일)" */
  label: string;
  time: string;
  teamName: string;
  /** "합주실 A · 멤버 4명" */
  meta: string;
  /** 그다음 합주 "15일(일) 14:00 · 나이트 드라이브" */
  next?: string;
  onClick: () => void;
}

function TodayCard({
  label,
  meta,
  next,
  onClick,
  teamName,
  time,
}: TodayCardProps) {
  return (
    <WithInteraction variant="light">
      <button
        className="today-card relative flex w-full flex-col overflow-hidden rounded-lg px-5 py-4.5 text-left"
        onClick={onClick}
        type="button"
      >
        <BrandSymbol className="absolute -top-6.5 -right-10 h-54 w-50 text-background opacity-10" />
        <Typography
          as="span"
          className="relative opacity-92"
          color="semantic.static.white"
          variant="label1"
          weight="medium"
        >
          {label}
        </Typography>
        <span className="relative mt-0.5 flex items-center gap-4">
          <span className="shrink-0 font-number text-number-lg text-static-white">
            {time}
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <Typography
              as="span"
              className="truncate"
              color="semantic.static.white"
              variant="body1"
              weight="bold"
            >
              {teamName}
            </Typography>
            <Typography
              as="span"
              className="truncate opacity-90"
              color="semantic.static.white"
              variant="label2"
            >
              {meta}
            </Typography>
          </span>
        </span>
        {next && (
          <>
            <span className="relative mt-3.5 h-px w-full bg-static-white/18" />
            <span className="relative mt-3 flex min-w-0 items-center gap-2">
              <Typography
                as="span"
                className="shrink-0 opacity-75"
                color="semantic.static.white"
                variant="caption1"
                weight="medium"
              >
                다음
              </Typography>
              <Typography
                as="span"
                className="truncate"
                color="semantic.static.white"
                variant="label1"
                weight="medium"
              >
                {next}
              </Typography>
            </span>
          </>
        )}
      </button>
    </WithInteraction>
  );
}

export default TodayCard;
