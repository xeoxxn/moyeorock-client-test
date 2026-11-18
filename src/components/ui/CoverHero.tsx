import { Typography } from "@wanteddev/wds";
import type { ReactNode } from "react";

import Cover, { type CoverTone } from "@/components/music/Cover";

// Figma "Header/Cover Hero"(534:21983) — 팀·모임·공연 상세 맨 위: 큰 커버(120) + 종류(12) + 이름(22 Bold)
// + 정보(13). 화면 위쪽엔 같은 커버색 글로우(useScreenBackdrop)를 깐다.
interface CoverHeroProps {
  tone: CoverTone;
  kicker: ReactNode;
  title: ReactNode;
  meta?: ReactNode;
}

function CoverHero({ kicker, meta, title, tone }: CoverHeroProps) {
  return (
    <div className="flex items-end gap-4 px-5 pt-2 pb-6">
      <Cover className="size-30 rounded-lg" tone={tone} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Typography
          color="semantic.label.assistive"
          variant="caption1"
          weight="medium"
        >
          {kicker}
        </Typography>
        <Typography
          as="h1"
          color="semantic.label.strong"
          variant="heading1"
          weight="bold"
        >
          {title}
        </Typography>
        {meta && (
          <Typography color="semantic.label.alternative" variant="label2">
            {meta}
          </Typography>
        )}
      </div>
    </div>
  );
}

export default CoverHero;
