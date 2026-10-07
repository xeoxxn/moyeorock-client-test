import { Typography } from "@wanteddev/wds";

// 섹션 제목 + 오른쪽 보조 액션("전체보기", "더보기", "공연 전체"). 홈에만 네 번, 모임·마이에도
// 같은 모양이 반복돼서 하나로 모았다. 액션은 onAction이 있을 때만 버튼으로 렌더해서,
// 아직 갈 곳이 없는 섹션에서 누를 수 있는 것처럼 보이지 않게 한다.
interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

function SectionHeader({ actionLabel, onAction, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Typography
        color="semantic.label.strong"
        variant="headline1"
        weight="bold"
      >
        {title}
      </Typography>
      {actionLabel !== undefined && onAction !== undefined && (
        <button className="shrink-0 py-0.5" onClick={onAction} type="button">
          <Typography
            as="span"
            color="semantic.label.assistive"
            variant="label2"
            weight="medium"
          >
            {actionLabel}
          </Typography>
        </button>
      )}
    </div>
  );
}

export default SectionHeader;
