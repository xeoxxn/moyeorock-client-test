import { Typography } from "@wanteddev/wds";
import type { ReactNode } from "react";

// 칩 묶음·버튼 묶음처럼 "입력 칸이 아닌" 필드의 제목 — Figma 필드 라벨(14 Medium · text/secondary).
// 한 칸에 붙는 <label>이 아니라서 WDS FormLabel 대신 글자로 둔다. TextInputField·SelectField의
// FormLabel도 같은 모양으로 맞춰 뒀다.
/** WDS FormLabel(굵게 · label.neutral)을 Figma 필드 라벨 모양으로 덮는 sx — 폼의 모든 FormLabel에 쓴다. */
export const fieldLabelSx = {
  color: "var(--color-label-alternative)",
  fontWeight: 500,
};

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <Typography
      as="p"
      color="semantic.label.alternative"
      variant="label1"
      weight="medium"
    >
      {children}
    </Typography>
  );
}

export default FieldLabel;
