import {
  DatePicker,
  type DateType,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  TextButton,
  TimePicker,
  useToast,
} from "@wanteddev/wds";
import { IconImage } from "@wanteddev/wds-icon";
import { useState } from "react";

import TextInputField from "@/components/ui/TextInputField";
import type { Performance } from "@/lib/domain/types";

// 공연 만들기(공연/03)와 공연 관리(공연/02)가 같은 필드를 쓴다 — 서버 PerformanceCreateRequest와
// PerformanceUpdateRequest가 {title, description, performedAt, venue(필수), posterImage}로 같다.
// 공연 일시는 서버에선 하나(performedAt)지만 고르기 쉽게 날짜와 시작 시간을 따로 받는다.
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
  const toast = useToast();
  // 장소는 서버 필수값이라, 한 번 손댄 뒤 비우면 바로 알려 준다(처음부터 빨갛게 보이지 않게).
  const [venueTouched, setVenueTouched] = useState(false);

  const update = (patch: Partial<PerformanceFormValue>) =>
    onChange({ ...value, ...patch });

  return (
    <div className="flex flex-col gap-6">
      <TextInputField
        label="공연 이름"
        maxLength={100}
        onChange={(title) => update({ title })}
        placeholder="예: 2026 가을 정기공연"
        value={value.title}
      />

      <div className="flex gap-2">
        <FormField className="min-w-0 flex-1">
          <FormLabel>공연 날짜</FormLabel>
          <FormControl>
            <DatePicker
              min={minDate}
              onChange={(date) => update({ date: toDate(date) })}
              value={value.date}
              width="100%"
            />
          </FormControl>
        </FormField>
        <FormField className="min-w-0 flex-1">
          <FormLabel>시작 시간</FormLabel>
          <FormControl>
            <TimePicker
              onChange={(time) => update({ time: toDate(time) })}
              value={value.time}
              width="100%"
            />
          </FormControl>
        </FormField>
      </div>

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
        placeholder="예: 홍대 롤링홀"
        value={value.venue}
      />

      <TextInputField
        label="공연 설명"
        maxLength={1000}
        multiline
        onChange={(description) => update({ description })}
        placeholder="공연을 소개해 주세요"
        value={value.description}
      />

      {/* 포스터 업로드(파일 API)는 아직 붙지 않았다 — 자리만 잡아 둔다. */}
      <FormField>
        <FormLabel>포스터</FormLabel>
        <div className="flex aspect-3/2 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-line-solid bg-surface text-label-assistive">
          <IconImage className="size-8" />
          <TextButton
            color="assistive"
            onClick={() => toast({ content: "포스터 올리기는 준비 중이에요" })}
            size="small"
          >
            포스터 올리기
          </TextButton>
        </div>
        <FormMessage>선택 사항이에요</FormMessage>
      </FormField>
    </div>
  );
}

export default PerformanceFormFields;
