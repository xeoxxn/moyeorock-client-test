import { TextArea, TextField, Typography } from "@wanteddev/wds";
import { IconChevronDown, IconClose, IconPlus } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import MonthCalendar from "@/features/schedule/components/MonthCalendar";

// Figma: 일정/03 일정 추가 (nodeId 101:12846). "일정/05 날짜 선택"(101:13144)과 "일정/06 시간
// 선택"(101:13396)은 별도 화면이 아니라 이 폼에서 "시작"/"종료" 행을 누르면 그 아래로 캘린더나
// 시간 휠이 펼쳐지는 같은 화면의 상태 변형이다(두 스크린샷 모두 동일한 제목/장소 필드와 저장
// 버튼을 그대로 갖고 있고 시작 행만 펼쳐진 모습) — 그래서 /schedule/add/date, /schedule/add/time
// 라우트를 따로 만들지 않았다.

type Field = "start" | "end";
type PickerMode = "none" | "date" | "time";

function formatDateTime(
  date: Date,
  period: "오전" | "오후",
  hour: number,
  minute: number,
) {
  const h = period === "오전" ? hour : hour === 12 ? 12 : hour;
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.  ${period} ${h}:${String(minute).padStart(2, "0")}`;
}

function TimeWheelColumn({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="scrollbar-hidden flex h-[150px] flex-1 snap-y snap-mandatory flex-col overflow-y-auto py-[60px]">
      {options.map((option) => (
        <button
          className="flex h-10 shrink-0 snap-center items-center justify-center"
          key={option}
          onClick={() => onChange(option)}
          type="button"
        >
          <Typography
            color={
              option === value
                ? "semantic.label.strong"
                : "semantic.label.assistive"
            }
            variant={option === value ? "headline2" : "body1"}
            weight={option === value ? "bold" : "regular"}
          >
            {option}
          </Typography>
        </button>
      ))}
    </div>
  );
}

function ScheduleAddScreen() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("밴드 합주");
  const [place, setPlace] = useState("합주실 A");
  const [activeField, setActiveField] = useState<Field | null>(null);
  const [pickerMode, setPickerMode] = useState<PickerMode>("none");

  const [startDate, setStartDate] = useState(new Date(2026, 7, 2));
  const [startPeriod, setStartPeriod] = useState<"오전" | "오후">("오전");
  const [startHour, setStartHour] = useState(9);
  const [startMinute, setStartMinute] = useState(0);

  const [endDate, setEndDate] = useState(new Date(2026, 7, 2));
  const [endPeriod, setEndPeriod] = useState<"오전" | "오후">("오전");
  const [endHour, setEndHour] = useState(10);
  const [endMinute, setEndMinute] = useState(0);

  useScreenHeader(
    <ScreenHeader
      leading={
        <button onClick={() => navigate(-1)} type="button">
          <IconClose className="size-6 text-label-normal" />
        </button>
      }
      title="일정 추가"
      trailing={
        <button onClick={() => navigate("/schedule")} type="button">
          <Typography
            className="text-glow-sm"
            color="semantic.primary.normal"
            variant="body1"
            weight="bold"
          >
            저장
          </Typography>
        </button>
      }
      variant="normal"
    />,
  );

  const openPicker = (field: Field, mode: PickerMode) => {
    if (activeField === field && pickerMode === mode) {
      setPickerMode("none");
      setActiveField(null);
      return;
    }
    setActiveField(field);
    setPickerMode(mode);
  };

  const periodState =
    activeField === "start"
      ? {
          hour: startHour,
          minute: startMinute,
          period: startPeriod,
          setHour: setStartHour,
          setMinute: setStartMinute,
          setPeriod: setStartPeriod,
        }
      : {
          hour: endHour,
          minute: endMinute,
          period: endPeriod,
          setHour: setEndHour,
          setMinute: setEndMinute,
          setPeriod: setEndPeriod,
        };

  return (
    <div className="scrollbar-hidden flex flex-1 flex-col gap-4 overflow-y-auto px-5 pt-2 pb-6">
      <label className="flex flex-col gap-2" htmlFor="schedule-title">
        <Typography
          color="semantic.label.normal"
          variant="label1"
          weight="bold"
        >
          제목
        </Typography>
        <TextField
          id="schedule-title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          width="100%"
        />
      </label>

      <label className="flex flex-col gap-2" htmlFor="schedule-place">
        <Typography
          color="semantic.label.normal"
          variant="label1"
          weight="bold"
        >
          장소
        </Typography>
        <TextField
          id="schedule-place"
          onChange={(e) => setPlace(e.target.value)}
          value={place}
          width="100%"
        />
      </label>

      <div className="flex flex-col rounded-xl border border-line-solid px-4">
        <button
          className="flex items-center gap-2 border-line-neutral border-b py-4"
          onClick={() => openPicker("start", "date")}
          type="button"
        >
          <Typography
            className="flex-1 text-left"
            color="semantic.label.alternative"
            variant="body1"
            weight="medium"
          >
            시작
          </Typography>
          <Typography
            color={
              activeField === "start"
                ? "semantic.primary.normal"
                : "semantic.label.normal"
            }
            variant="body1"
            weight="medium"
          >
            {formatDateTime(startDate, startPeriod, startHour, startMinute)}
          </Typography>
        </button>
        <button
          className="flex items-center gap-2 py-4"
          onClick={() => openPicker("end", "date")}
          type="button"
        >
          <Typography
            className="flex-1 text-left"
            color="semantic.label.alternative"
            variant="body1"
            weight="medium"
          >
            종료
          </Typography>
          <Typography
            color={
              activeField === "end"
                ? "semantic.primary.normal"
                : "semantic.label.normal"
            }
            variant="body1"
            weight="medium"
          >
            {formatDateTime(endDate, endPeriod, endHour, endMinute)}
          </Typography>
        </button>

        {activeField && pickerMode === "date" && (
          <div className="-mx-4 border-line-neutral border-t">
            <MonthCalendar
              month={activeField === "start" ? startDate : endDate}
              onMonthChange={
                activeField === "start" ? setStartDate : setEndDate
              }
              onSelectDate={(date) => {
                if (activeField === "start") setStartDate(date);
                else setEndDate(date);
                setPickerMode("time");
              }}
              selectedDate={activeField === "start" ? startDate : endDate}
            />
          </div>
        )}

        {activeField && pickerMode === "time" && (
          <div className="-mx-4 flex flex-col border-line-neutral border-t px-4 py-2">
            <div className="relative flex">
              <div className="pointer-events-none absolute inset-x-0 top-1/2 h-10 -translate-y-1/2 rounded-lg bg-surface" />
              <TimeWheelColumn
                onChange={(v) => periodState.setPeriod(v as "오전" | "오후")}
                options={["오전", "오후"]}
                value={periodState.period}
              />
              <TimeWheelColumn
                onChange={(v) => periodState.setHour(Number(v))}
                options={Array.from({ length: 12 }, (_, i) => String(i + 1))}
                value={String(periodState.hour)}
              />
              <TimeWheelColumn
                onChange={(v) => periodState.setMinute(Number(v))}
                options={[
                  "00",
                  "05",
                  "10",
                  "15",
                  "20",
                  "25",
                  "30",
                  "35",
                  "40",
                  "45",
                  "50",
                  "55",
                ]}
                value={String(periodState.minute).padStart(2, "0")}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Typography
          color="semantic.label.alternative"
          variant="label1"
          weight="bold"
        >
          팀
        </Typography>
        <div className="flex items-center gap-2 rounded-xl border border-line-solid px-4 py-3.5">
          <IconPlus className="size-5 text-label-assistive" />
          <Typography
            className="flex-1"
            color="semantic.label.assistive"
            variant="body1"
            weight="regular"
          >
            블루 웨이브
          </Typography>
          <IconChevronDown className="size-5 text-label-assistive" />
        </div>
      </div>

      <label className="flex flex-col gap-2" htmlFor="schedule-memo">
        <Typography
          color="semantic.label.normal"
          variant="label1"
          weight="bold"
        >
          메모
        </Typography>
        <TextArea
          id="schedule-memo"
          minRows={2}
          placeholder="메모를 입력해 주세요"
          width="100%"
        />
      </label>
    </div>
  );
}

export default ScheduleAddScreen;
