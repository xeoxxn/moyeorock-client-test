import { Typography } from "@wanteddev/wds";
import { useId, useState } from "react";

interface FormFieldProps {
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
  value: string;
  onChange: (value: string) => void;
}

// Figma의 "Field/이메일", "Field/닉네임" 등(예: nodeId 101:11357, 101:11393) — 라벨 + 박스 조합.
// 포커스되면 라벨이 accent로 바뀌고 박스 테두리가 accent + 네온 글로우로 바뀐다(nodeId 101:11359).
// WDS `TextField`는 이 라벨 슬롯이 없고(순수 input), "온보딩/07 이메일 회원가입"(142:19196)의
// 블러 배경 박스와도 비주얼이 달라 — 온보딩 전체에서 입력 박스 스타일을 하나로 통일하기 위해
// 로컬로 공용 컴포넌트를 뺐다(docs/conventions/wds-component-usage.md 4번 규칙: 스타일이 눈에
// 띄게 다르면 WDS를 그대로 쓰지 않는다).
function FormField({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: FormFieldProps) {
  const [focused, setFocused] = useState(false);
  const id = useId();
  const active = focused || value.length > 0;

  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={id}>
        <Typography
          color={
            active ? "semantic.primary.normal" : "semantic.label.alternative"
          }
          variant="label2"
          weight="medium"
        >
          {label}
        </Typography>
      </label>
      <input
        className={
          active
            ? "h-[52px] w-full rounded-xl border border-accent bg-surface px-4 text-[16px] text-label-strong shadow-neon-sm outline-none placeholder:text-label-assistive"
            : "h-[52px] w-full rounded-xl border border-line-solid bg-surface px-4 text-[16px] text-label-strong outline-none placeholder:text-label-assistive"
        }
        id={id}
        onBlur={() => setFocused(false)}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setFocused(true)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </div>
  );
}

export default FormField;
