import { Typography } from "@wanteddev/wds";
import type { ReactNode } from "react";

// 29 비교 중 · 30 실패의 윗부분 — 큰 그림(로딩 피크 · 회색 피크) + 22 Bold 한 줄 + 곡 · 파트 · 길이.
interface AnalysisHeroProps {
  icon: ReactNode;
  title: string;
  meta: string;
}

function AnalysisHero({ icon, meta, title }: AnalysisHeroProps) {
  return (
    <div className="flex flex-col items-center">
      {icon}
      <div className="flex flex-col items-center gap-1.5 pt-6">
        <Typography
          align="center"
          as="h1"
          color="semantic.label.strong"
          variant="heading1"
          weight="bold"
        >
          {title}
        </Typography>
        <Typography
          align="center"
          color="semantic.label.alternative"
          variant="label2"
        >
          {meta}
        </Typography>
      </div>
    </div>
  );
}

export default AnalysisHero;
