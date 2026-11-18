import {
  Chip,
  DatePicker,
  type DateType,
  FormControl,
  FormErrorMessage,
  FormField,
  FormLabel,
  TimePicker,
  useToast,
} from "@wanteddev/wds";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import BottomActionArea from "@/components/ui/BottomActionArea";
import EmptyState from "@/components/ui/EmptyState";
import FieldLabel, { fieldLabelSx } from "@/components/ui/FieldLabel";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import TextInputField from "@/components/ui/TextInputField";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import { startOfDay } from "@/features/schedule/scheduleHelpers";
import { getMyTeams, toId } from "@/mocks/selectors";

// Figma 21 합주 일정 추가(501:20118) — 일정 탭의 + 와 팀 합주 탭에서 들어온다. 합주는 팀 단위라
// (POST /teams/{teamId}/rehearsals) 맨 위에서 내 팀을 고르고, 팀에서 들어오면 ?teamId=로 미리 골라 둔다.
// 제목은 고른 팀 이름으로 "{팀} 합주"를 채워 두고, 직접 고치면 그 뒤로는 팀을 바꿔도 두지 않는다.
// 날짜·시간 칸은 WDS DatePicker·TimePicker 팝오버로 고른다(모바일에서 키패드 대신 바로 열리게 inputMode none).
//
// 서버 검증(RehearsalCreateRequest): 제목 필수 100자 · 종료가 시작보다 늦게 · 24시간 이내 · 장소 100자 ·
// 메모 20,000자. 한 날짜 안에서 시작·종료 시간을 고르니 24시간은 넘을 수 없다.
const TITLE_MAX = 100;
const PLACE_MAX = 100;
const MEMO_MAX = 20000;

function toDateOrNull(value: DateType): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function atTime(hours: number): Date {
  const date = new Date();
  date.setHours(hours, 0, 0, 0);
  return date;
}

function minutesOfDay(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

function ScheduleAddScreen() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const myTeams = getMyTeams();

  const [teamId, setTeamId] = useState(() => {
    const fromParam = myTeams.find(
      (team) => team.id === toId(searchParams.get("teamId") ?? undefined),
    );
    return (fromParam ?? myTeams[0])?.id;
  });
  // null이면 고른 팀 이름으로 채운 제목을 쓴다.
  const [customTitle, setCustomTitle] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(() => startOfDay(new Date()));
  const [startTime, setStartTime] = useState<Date | null>(() => atTime(19));
  const [endTime, setEndTime] = useState<Date | null>(() => atTime(21));
  const [place, setPlace] = useState("");
  const [memo, setMemo] = useState("");
  const [dateOpen, setDateOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  useScreenHeader(useMemo(() => <ScreenHeader title="합주 일정 추가" />, []));

  if (myTeams.length === 0) {
    return (
      <div className="flex flex-1 flex-col justify-center pb-16">
        <EmptyState
          action={{
            label: "팀 찾아보기",
            onClick: () => navigate("/board?type=team"),
          }}
          description="합주 일정은 팀 단위로 만들어요. 먼저 팀에 들어가 보세요"
          title="아직 함께하는 팀이 없어요"
        />
      </div>
    );
  }

  const team = myTeams.find((item) => item.id === teamId);
  const title = customTitle ?? (team ? `${team.name} 합주` : "");
  const rangeError =
    startTime && endTime && minutesOfDay(endTime) <= minutesOfDay(startTime)
      ? "종료 시간은 시작 시간보다 늦어야 해요"
      : undefined;
  const canSave =
    team !== undefined &&
    title.trim() !== "" &&
    date !== null &&
    startTime !== null &&
    endTime !== null &&
    rangeError === undefined;

  const save = () => {
    // 목업이라 저장하지 않는다. 서버에 붙일 때 startsAt·endsAt = 날짜 + 각 시간(오프셋 없는 로컬 ISO).
    toast({ content: "합주 일정을 추가했어요", variant: "positive" });
    navigate(-1);
  };

  return (
    <>
      <ScreenBody className="flex flex-col gap-6 px-5 pt-2">
        <div className="flex flex-col gap-2">
          <FieldLabel>팀</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {myTeams.map((item) => (
              <Chip
                active={item.id === teamId}
                key={item.id}
                onClick={() => setTeamId(item.id)}
                size="medium"
                variant="solid"
              >
                {item.name}
              </Chip>
            ))}
          </div>
        </div>

        <TextInputField
          label="제목"
          maxLength={TITLE_MAX}
          onChange={setCustomTitle}
          placeholder="팀 합주"
          value={title}
        />

        <FormField>
          <FormLabel sx={fieldLabelSx}>날짜</FormLabel>
          <FormControl>
            <DatePicker
              format="M월 D일"
              inputMode="none"
              min={startOfDay(new Date())}
              onChange={(value) => setDate(toDateOrNull(value))}
              onClick={() => setDateOpen(true)}
              onOpenChange={setDateOpen}
              open={dateOpen}
              placeholder="날짜를 골라 주세요"
              value={date}
              width="100%"
            />
          </FormControl>
        </FormField>

        <div className="flex gap-3">
          <div className="min-w-0 flex-1">
            <FormField>
              <FormLabel sx={fieldLabelSx}>시작 시간</FormLabel>
              <FormControl>
                <TimePicker
                  format="HH:mm"
                  inputMode="none"
                  onChange={(value) => setStartTime(toDateOrNull(value))}
                  onClick={() => setStartOpen(true)}
                  onOpenChange={setStartOpen}
                  open={startOpen}
                  value={startTime}
                  width="100%"
                />
              </FormControl>
            </FormField>
          </div>
          <div className="min-w-0 flex-1">
            <FormField>
              <FormLabel sx={fieldLabelSx}>종료 시간</FormLabel>
              <FormControl>
                <TimePicker
                  format="HH:mm"
                  inputMode="none"
                  invalid={rangeError !== undefined}
                  onChange={(value) => setEndTime(toDateOrNull(value))}
                  onClick={() => setEndOpen(true)}
                  onOpenChange={setEndOpen}
                  open={endOpen}
                  value={endTime}
                  width="100%"
                />
              </FormControl>
              <FormErrorMessage>{rangeError}</FormErrorMessage>
            </FormField>
          </div>
        </div>

        <TextInputField
          label="장소"
          maxLength={PLACE_MAX}
          onChange={setPlace}
          placeholder="합주실 A"
          value={place}
        />

        <TextInputField
          label="메모"
          maxLength={MEMO_MAX}
          multiline
          onChange={setMemo}
          placeholder="준비물이나 연습할 곡을 적어 두세요"
          value={memo}
        />
      </ScreenBody>

      <BottomActionArea disabled={!canSave} label="저장" onClick={save} />
    </>
  );
}

export default ScheduleAddScreen;
