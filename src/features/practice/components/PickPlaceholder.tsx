import { Typography, WithInteraction } from "@wanteddev/wds";
import type { ReactNode } from "react";

// 새 연습 분석에서 아직 고르지 않은 칸(곡 · 녹음) — 고른 뒤의 SongPickCard·RecordingCard와 같은 표면
// 카드에 아이콘 타일 + 할 일 + 안내를 둔다. 누르면 곡 시트를 열거나 파일 고르기를 띄운다.
interface PickPlaceholderProps {
  icon: ReactNode;
  title: string;
  meta: string;
  onClick: () => void;
}

function PickPlaceholder({ icon, meta, onClick, title }: PickPlaceholderProps) {
  return (
    <WithInteraction variant="light">
      <button
        className="flex w-full items-center gap-3.5 rounded-lg bg-surface py-3 pr-4 pl-3 text-left"
        onClick={onClick}
        type="button"
      >
        <span className="flex size-12 shrink-0 items-center justify-center rounded-sm bg-press text-label-strong">
          {icon}
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <Typography
            as="span"
            color="semantic.label.strong"
            variant="body1"
            weight="bold"
          >
            {title}
          </Typography>
          <Typography
            as="span"
            className="truncate"
            color="semantic.label.alternative"
            variant="label2"
          >
            {meta}
          </Typography>
        </span>
      </button>
    </WithInteraction>
  );
}

export default PickPlaceholder;
