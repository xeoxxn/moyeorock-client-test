import {
  DatePicker,
  type DateType,
  FormControl,
  FormErrorMessage,
  FormField,
  FormLabel,
  TimePicker,
  useToast,
} from "@wanteddev/wds";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import BottomActionArea from "@/components/ui/BottomActionArea";
import EmptyState from "@/components/ui/EmptyState";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SelectField from "@/components/ui/SelectField";
import TextInputField from "@/components/ui/TextInputField";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import { getMyTeams, toId } from "@/mocks/selectors";

// Figma: 일정/03 일정 추가 (101:12846). "일정/05 날짜 선택"(101:13144)·"일정/06 시간 선택"(101:13396)은
// 이 폼에서 날짜·시간 칸을 눌렀을 때 펼쳐지는 선택기 상태라 라우트가 아니라 WDS DatePicker·TimePicker의
// 팝오버로 대신한다.
//
// 서버: POST /teams/{teamId}/rehearsals {title(필수, 100자), startsAt, endsAt(> startsAt), place, memo}.
// 합주는 팀 단위라 팀 일정에서 오면(?teamId=) 팀이 고정이고, 일정 탭에서 오면 내 팀 중 하나를 먼저
// 고른다(Figma 플로우 S5-B "어느 팀? teamId 선택 필요").

const TITLE_MAX = 100;

function toDateOrNull(value: DateType): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function atTime(hours: number, minutes = 0): Date {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function minutesOfDay(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

function ScheduleAddScreen() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const teamIdParam = searchParams.get("teamId");
  const myTeams = getMyTeams();
  const fixedTeam =
    teamIdParam !== null
      ? myTeams.find((team) => team.id === toId(teamIdParam))
      : undefined;

  const [teamId, setTeamId] = useState(() => {
    if (fixedTeam) return String(fixedTeam.id);
    // 팀이 하나뿐이면 고를 게 없으니 미리 채운다.
    return myTeams.length === 1 ? String(myTeams[0].id) : "";
  });
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(() => atTime(19));
  const [endTime, setEndTime] = useState<Date | null>(() => atTime(21));
  const [place, setPlace] = useState("");
  const [memo, setMemo] = useState("");
  // 모바일에서 칸을 누르면 숫자 키패드 대신 바로 캘린더·시간 목록이 열리게 한다(Figma 05·06처럼).
  const [dateOpen, setDateOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  useScreenHeader(<ScreenHeader title="합주 일정 추가" variant="normal" />);

  // 팀 일정에서 넘어온 teamId가 내 팀이 아니면(주소를 직접 고친 경우 등) 폼을 열지 않는다.
  if (teamIdParam !== null && !fixedTeam) {
    return (
      <div className="flex flex-1 flex-col justify-center">
        <EmptyState
          description="내가 속한 팀에서만 합주 일정을 추가할 수 있어요"
          title="팀을 찾을 수 없어요"
        />
      </div>
    );
  }

  if (myTeams.length === 0) {
    return (
      <div className="flex flex-1 flex-col justify-center">
        <EmptyState
          action={{
            label: "팀 모집 공고 보기",
            onClick: () => navigate("/board?type=team"),
          }}
          description="합주 일정은 팀 단위로 만들어요. 먼저 팀에 들어가 보세요"
          title="아직 함께하는 팀이 없어요"
        />
      </div>
    );
  }

  const rangeError =
    startTime && endTime && minutesOfDay(endTime) <= minutesOfDay(startTime)
      ? "종료 시간은 시작 시간보다 늦어야 해요"
      : undefined;
  const canSave =
    teamId !== "" &&
    title.trim() !== "" &&
    date !== null &&
    startTime !== null &&
    endTime !== null &&
    rangeError === undefined;

  const save = () => {
    // 목업이라 실제로 저장하지는 않는다. 서버에 붙일 때 startsAt·endsAt = date + 각 시간으로 보낸다.
    toast({ content: "합주 일정을 추가했어요", variant: "positive" });
    navigate(fixedTeam ? `/team/${fixedTeam.id}/schedule` : "/schedule", {
      replace: true,
    });
  };

  const startOfToday = atTime(0);

  return (
    <>
      <div className="scrollbar-hidden flex flex-1 flex-col gap-6 overflow-y-auto px-5 pt-2 pb-8">
        <SelectField
          disabled={fixedTeam !== undefined}
          label="팀"
          message={fixedTeam ? undefined : "합주 일정은 팀 단위로 추가돼요"}
          onChange={setTeamId}
          options={myTeams.map((team) => ({
            label: team.name,
            value: String(team.id),
          }))}
          placeholder="팀을 골라 주세요"
          value={teamId}
        />

        <TextInputField
          label="제목"
          maxLength={TITLE_MAX}
          onChange={setTitle}
          placeholder="밴드 합주"
          value={title}
        />

        <FormField>
          <FormLabel>날짜</FormLabel>
          <FormControl>
            <DatePicker
              inputMode="none"
              min={startOfToday}
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
              <FormLabel>시작 시간</FormLabel>
              <FormControl>
                <TimePicker
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
              <FormLabel>종료 시간</FormLabel>
              <FormControl>
                <TimePicker
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
          message="선택 사항이에요"
          onChange={setPlace}
          placeholder="합주실 A"
          value={place}
        />

        <TextInputField
          label="메모"
          message="선택 사항이에요"
          multiline
          onChange={setMemo}
          placeholder="준비물이나 연습할 곡을 적어 두세요"
          value={memo}
        />
      </div>

      <BottomActionArea disabled={!canSave} label="저장" onClick={save} />
    </>
  );
}

export default ScheduleAddScreen;
