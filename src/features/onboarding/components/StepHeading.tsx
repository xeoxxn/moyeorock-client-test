import { Typography } from "@wanteddev/wds";
import type { ReactNode } from "react";

// 온보딩·가입 화면 맨 위 질문 — 화면 제목 22 Bold(heading1) + 설명 본문 15(body2 · text/secondary). Figma 22의
// "어떤 세션을 맡고 있나요? / 여러 개를 골라도 괜찮아요" 모양을 로그인·가입·약관에도 같이 쓴다.
interface StepHeadingProps {
  title: ReactNode;
  description?: ReactNode;
}

function StepHeading({ description, title }: StepHeadingProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Typography
        as="h1"
        className="whitespace-pre-line"
        color="semantic.label.strong"
        variant="heading1"
        weight="bold"
      >
        {title}
      </Typography>
      {description && (
        <Typography color="semantic.label.alternative" variant="body2">
          {description}
        </Typography>
      )}
    </div>
  );
}

export default StepHeading;
