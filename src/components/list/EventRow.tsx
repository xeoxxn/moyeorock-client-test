import { Typography } from "@wanteddev/wds";
import { IconChevronRight } from "@wanteddev/wds-icon";
import type { ReactNode } from "react";

import MediaRow from "@/components/list/MediaRow";
import { weekdayLabel } from "@/lib/domain/format";

// Figma "List/Event"(536:24432) — 왼쪽 날짜(브랜드 숫자 + 요일) + (라벨) + 제목 + 시간·장소.
// 일정·모임 홈의 다음 공연·멤버 프로필의 참여 공연에서 쓴다. 오늘 일정처럼 날짜 대신 시간을 크게
// 둘 때는 leadingText로 바꾼다.
interface EventRowProps {
  date: Date;
  title: ReactNode;
  meta?: ReactNode;
  /** 제목 위 상태(공연 예정 · D-8 등) */
  label?: ReactNode;
  /** 날짜 대신 왼쪽에 둘 글자(예: "19:00") */
  leadingText?: string;
  onClick?: () => void;
  dimmed?: boolean;
}

function EventRow({
  date,
  dimmed,
  label,
  leadingText,
  meta,
  onClick,
  title,
}: EventRowProps) {
  return (
    <MediaRow
      dimmed={dimmed}
      leading={
        leadingText !== undefined ? (
          <Typography
            as="span"
            className="w-10 shrink-0"
            color="semantic.label.strong"
            variant="label1"
            weight="medium"
          >
            {leadingText}
          </Typography>
        ) : (
          <span className="flex w-10 shrink-0 flex-col items-center">
            <span className="font-number text-label-strong text-number">
              {date.getDate()}
            </span>
            <Typography
              as="span"
              color="semantic.label.assistive"
              variant="caption1"
              weight="medium"
            >
              {weekdayLabel(date)}
            </Typography>
          </span>
        )
      }
      meta={meta}
      onClick={onClick}
      overline={label}
      padding="compact"
      title={title}
      trailing={
        onClick ? (
          <IconChevronRight className="size-5 shrink-0 text-label-assistive" />
        ) : undefined
      }
    />
  );
}

export default EventRow;
