import { Typography } from "@wanteddev/wds";
import type { ReactNode } from "react";

// 세션·지역·취향처럼 "내 프로필에 붙는 태그"를 보여주는 알약. Badge(상태 라벨)와 달리 선택
// 가능한 값의 나열이라, 홈 히어로·마이·유저 프로필에서 같은 모양이어야 하는데 화면마다
// rounded-xl px-2.5 py-0.5 / rounded-md px-1.5 py-1로 제각각이었다. 홈 쪽 모양으로 통일했다.
//
// 온보딩의 SelectableChip(탭해서 고르는 칩)은 선택 상태·인터랙션이 따로 있어서 별도 컴포넌트로 둔다.
interface ChipProps {
  children: ReactNode;
  /** 선택/강조된 태그 — 레드 테두리와 글자색을 쓴다. */
  active?: boolean;
}

function Chip({ children, active = false }: ChipProps) {
  return (
    <span
      className={
        active
          ? "inline-flex w-fit shrink-0 items-center justify-center rounded-xl border border-accent px-2.5 py-0.5"
          : "inline-flex w-fit shrink-0 items-center justify-center rounded-xl border border-line-solid px-2.5 py-0.5"
      }
    >
      <Typography
        as="span"
        color={
          active ? "semantic.primary.normal" : "semantic.label.alternative"
        }
        variant="caption1"
        weight="medium"
      >
        {children}
      </Typography>
    </span>
  );
}

export default Chip;
