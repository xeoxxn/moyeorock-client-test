import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  Option,
  Select,
} from "@wanteddev/wds";

// 라벨 + 단일 선택(지역 · 모임 유형 · 팀 · 공연 …) — WDS `FormField` + `Select`/`Option`.
// 선택지는 화면 이동이 아니라 그 자리에서 고르는 값이라 라우트를 만들지 않는다.
export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface SelectFieldProps<T extends string> {
  label: string;
  options: SelectOption<T>[];
  value: T | "";
  onChange: (value: T) => void;
  placeholder?: string;
  message?: string;
  disabled?: boolean;
}

function SelectField<T extends string>({
  disabled = false,
  label,
  message,
  onChange,
  options,
  placeholder = "선택해 주세요",
  value,
}: SelectFieldProps<T>) {
  return (
    <FormField>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Select
          disabled={disabled}
          onChange={(next) => onChange(next as T)}
          placeholder={placeholder}
          value={value}
          width="100%"
        >
          {options.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </FormControl>
      <FormMessage>{message}</FormMessage>
    </FormField>
  );
}

export default SelectField;
