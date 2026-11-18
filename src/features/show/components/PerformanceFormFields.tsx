import {
  DatePicker,
  type DateType,
  FormControl,
  FormField,
  FormLabel,
  TimePicker,
} from "@wanteddev/wds";
import { useState } from "react";

import { fieldLabelSx } from "@/components/ui/FieldLabel";
import TextInputField from "@/components/ui/TextInputField";
import type { Performance } from "@/lib/domain/types";

// 공연 만들기와 공연 관리가 같은 필드를 쓴다 — 서버 PerformanceCreateRequest와 PerformanceUpdateRequest가
// {title, description, performedAt, venue(필수), posterImage}로 같다. 모양은 Figma 21 합주 일정 추가
// (라벨 + 칸, 날짜 한 줄 · 시간 한 줄)를 따른다. 공연 일시는 서버에선 하나(performedAt)지만 고르기 쉽게
// 날짜와 시작 시간을 따로 받는다. 포스터(posterImage)는 파일 업로드 API가 없고 리디자인은 커버를 그려
// 쓰므로 받지 않는다.
export interface PerformanceFormValue {
  title: string;
  description: string;
  date: Date | null;
  time: Date | null;
  venue: string;
}

export const EMPTY_PERFORMANCE_FORM: PerformanceFormValue = {
  date: null,
  description: "",
  time: null,
  title: "",
  venue: "",
};

export function toPerformanceForm(
  performance: Performance,
): PerformanceFormValue {
  const performedAt = new Date(performance.performedAt);
  return {
    date: performedAt,
    description: performance.description,
    time: performedAt,
    title: performance.title,
    venue: performance.venue,
  };
}

/** 서버 필수값(제목·일시·장소)이 다 찼는지 */
export function isPerformanceFormComplete(value: PerformanceFormValue) {
  return (
    value.title.trim() !== "" &&
    value.venue.trim() !== "" &&
    value.date !== null &&
    value.time !== null
  );
}

function toDate(value: DateType): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

interface PerformanceFormFieldsProps {
  value: PerformanceFormValue;
  onChange: (value: PerformanceFormValue) => void;
  /** 새 공연은 지난 날짜로 만들 수 없다(서버 @Future). 수정은 막지 않는다. */
  minDate?: Date;
}

function PerformanceFormFields({
  minDate,
  onChange,
  value,
}: PerformanceFormFieldsProps) {
  // 장소는 서버 필수값이라, 한 번 손댄 뒤 비우면 바로 알려 준다(처음부터 빨갛게 보이지 않게).
  const [venueTouched, setVenueTouched] = useState(false);

  const update = (patch: Partial<PerformanceFormValue>) =>
    onChange({ ...value, ...patch });

  return (
    <>
      <TextInputField
        label="공연 이름"
        maxLength={100}
        onChange={(title) => update({ title })}
        placeholder="2026 가을 정기공연"
        value={value.title}
      />

      <FormField>
        <FormLabel sx={fieldLabelSx}>날짜</FormLabel>
        <FormControl>
          <DatePicker
            min={minDate}
            onChange={(date) => update({ date: toDate(date) })}
            value={value.date}
            width="100%"
          />
        </FormControl>
      </FormField>

      <FormField>
        <FormLabel sx={fieldLabelSx}>시작 시간</FormLabel>
        <FormControl>
          <TimePicker
            onChange={(time) => update({ time: toDate(time) })}
            value={value.time}
            width="100%"
          />
        </FormControl>
      </FormField>

      <TextInputField
        error={
          venueTouched && value.venue.trim() === ""
            ? "공연 장소를 입력해 주세요"
            : undefined
        }
        label="장소"
        maxLength={100}
        onChange={(venue) => {
          setVenueTouched(true);
          update({ venue });
        }}
        placeholder="홍대 롤링홀"
        value={value.venue}
      />

      <TextInputField
        label="소개"
        maxLength={1000}
        multiline
        onChange={(description) => update({ description })}
        placeholder="공연 순서, 리허설 시간처럼 팀들이 알아야 할 것을 적어 주세요"
        value={value.description}
      />
    </>
  );
}

export default PerformanceFormFields;
