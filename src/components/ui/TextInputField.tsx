import {
  FormControl,
  FormErrorMessage,
  FormField,
  FormLabel,
  FormMessage,
  TextArea,
  TextField,
} from "@wanteddev/wds";
import type { HTMLInputTypeAttribute } from "react";

// 라벨 + 입력 칸 + 안내/에러 문구 — WDS `FormField`·`FormLabel`·`FormControl` 위에 `TextField`
// (또는 여러 줄이면 `TextArea`)를 얹는다. 화면에서 <input>을 직접 쓰지 않고 이걸 쓴다.
interface TextInputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  /** 여러 줄 입력(소개·본문) */
  multiline?: boolean;
  /** 아래 안내 문구 */
  message?: string;
  /** 있으면 에러 상태로 그리고 안내 문구 대신 보여준다 */
  error?: string;
  maxLength?: number;
  autoComplete?: string;
}

function TextInputField({
  autoComplete,
  error,
  label,
  maxLength,
  message,
  multiline = false,
  onChange,
  placeholder,
  type = "text",
  value,
}: TextInputFieldProps) {
  return (
    <FormField>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        {multiline ? (
          <TextArea
            maxLength={maxLength}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            value={value}
            width="100%"
          />
        ) : (
          <TextField
            autoComplete={autoComplete}
            invalid={error !== undefined}
            maxLength={maxLength}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            type={type}
            value={value}
            width="100%"
          />
        )}
      </FormControl>
      {error !== undefined ? (
        <FormErrorMessage>{error}</FormErrorMessage>
      ) : (
        <FormMessage>{message}</FormMessage>
      )}
    </FormField>
  );
}

export default TextInputField;
