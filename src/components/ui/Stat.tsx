import { Typography, WithInteraction } from "@wanteddev/wds";

// Figma "Stat"(553:23030) — 숫자(브랜드 글꼴 22) + 작은 라벨. 마이의 연습 분석·팔로잉·저장한 곡.
interface StatProps {
  value: number;
  label: string;
  onClick?: () => void;
}

function Stat({ label, onClick, value }: StatProps) {
  const content = (
    <>
      <span className="font-number text-label-strong text-number">{value}</span>
      <Typography
        as="span"
        color="semantic.label.assistive"
        variant="caption1"
        weight="medium"
      >
        {label}
      </Typography>
    </>
  );

  if (!onClick) {
    return <div className="flex flex-1 flex-col gap-0.5">{content}</div>;
  }
  return (
    <WithInteraction variant="light">
      <button
        className="flex flex-1 flex-col items-start gap-0.5 text-left"
        onClick={onClick}
        type="button"
      >
        {content}
      </button>
    </WithInteraction>
  );
}

export default Stat;
