import {
  Chip,
  FormField,
  FormLabel,
  FormMessage,
  Typography,
  useToast,
} from "@wanteddev/wds";
import { IconCalendar, IconLocation } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BottomActionArea from "@/components/ui/BottomActionArea";
import EmptyState from "@/components/ui/EmptyState";
import MetaItem from "@/components/ui/MetaItem";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SelectField from "@/components/ui/SelectField";
import TextInputField from "@/components/ui/TextInputField";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import { isPerformanceGroupMember } from "@/features/show/performanceAccess";
import { formatDateTime } from "@/lib/domain/format";
import {
  GENRE_LABEL,
  GENRE_OPTIONS,
  INSTRUMENT_LABEL,
  INSTRUMENT_OPTIONS,
  REGION_LABEL,
  REGION_OPTIONS,
} from "@/lib/domain/labels";
import type { Genre, Instrument, Region } from "@/lib/domain/types";
import {
  getGroup,
  getMe,
  getPerformance,
  isUpcoming,
  toId,
} from "@/mocks/selectors";

// Figma: 공연/05 공연 팀 만들기. 서버 PerformanceTeamCreateRequest {name(≤50), description, region,
// genres(≤5), instrument(만든 사람의 세션, 필수)}를 그대로 받는다 — 만든 사람이 팀장이 된다.
// Figma의 "함께할 세션 모집" 칸은 서버 요청에 없어서 뺐다(팀원 모집은 게시판 공고로 한다).

const MAX_GENRES = 5;

const REGION_SELECT_OPTIONS = REGION_OPTIONS.map((region) => ({
  label: REGION_LABEL[region],
  value: region,
}));

function ShowTeamCreateScreen() {
  const navigate = useNavigate();
  const toast = useToast();
  const { showId } = useParams();
  const performance = getPerformance(toId(showId));
  const me = getMe();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [region, setRegion] = useState<Region | "">(me.region);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [instrument, setInstrument] = useState<Instrument | null>(
    me.instruments[0]?.instrument ?? null,
  );

  useScreenHeader(<ScreenHeader title="공연 팀 만들기" />);

  if (!performance) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyState
          description="삭제됐거나 주소가 잘못된 공연이에요"
          title="없는 공연이에요"
        />
      </div>
    );
  }

  // 서버 규칙: 공연이 속한 모임의 모임원만, 진행 중인(공연 예정·팀 모집 중) 공연에만 팀을 만들 수 있다.
  if (!isPerformanceGroupMember(performance) || !isUpcoming(performance)) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyState
          action={{
            label: "공연 정보 보기",
            onClick: () =>
              navigate(`/show/${performance.id}`, { replace: true }),
          }}
          description={
            isUpcoming(performance)
              ? "공연 팀은 이 공연을 여는 모임의 멤버만 만들 수 있어요"
              : "끝난 공연에는 팀을 만들 수 없어요"
          }
          title="공연 팀을 만들 수 없어요"
        />
      </div>
    );
  }

  const groupName = getGroup(performance.groupId)?.name;
  const canSubmit = name.trim() !== "" && region !== "" && instrument !== null;

  const toggleGenre = (genre: Genre) =>
    setGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((item) => item !== genre)
        : prev.length < MAX_GENRES
          ? [...prev, genre]
          : prev,
    );

  const create = () => {
    toast({ content: `${name.trim()} 팀을 만들었어요`, variant: "positive" });
    // 백엔드가 붙기 전이라 새 팀 id를 받을 수 없다 — 데모 공연의 공연 팀(블루 웨이브, 1)으로 보낸다.
    // 만들기 폼으로 되돌아오지 않게 replace.
    navigate("/team/1", { replace: true });
  };

  return (
    <>
      <div className="scrollbar-hidden flex flex-1 flex-col gap-6 overflow-y-auto px-5 pt-2 pb-6">
        <div className="flex flex-col gap-2">
          <Typography
            as="p"
            color="semantic.label.normal"
            variant="headline1"
            weight="bold"
          >
            {performance.title}에 참가할
            <br />
            팀을 만들어요
          </Typography>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <MetaItem icon={<IconCalendar />}>
              {formatDateTime(performance.performedAt)}
            </MetaItem>
            <MetaItem icon={<IconLocation />}>{performance.venue}</MetaItem>
          </div>
          {groupName && (
            <Typography
              color="semantic.label.assistive"
              variant="label2"
              weight="medium"
            >
              {groupName}의 공연
            </Typography>
          )}
        </div>

        <TextInputField
          label="팀 이름"
          maxLength={50}
          onChange={setName}
          placeholder="팀 이름 입력"
          value={name}
        />

        <TextInputField
          label="팀 소개"
          maxLength={1000}
          multiline
          onChange={setDescription}
          placeholder="어떤 음악을 연주하나요?"
          value={description}
        />

        <FormField>
          <FormLabel>내 연주 세션</FormLabel>
          <div className="flex flex-wrap gap-2">
            {INSTRUMENT_OPTIONS.map((item) => (
              <Chip
                active={instrument === item}
                key={item}
                onClick={() => setInstrument(item)}
                size="large"
                variant="outlined"
              >
                {INSTRUMENT_LABEL[item]}
              </Chip>
            ))}
          </div>
          <FormMessage>
            만든 사람이 팀장이 되고, 이 세션으로 들어가요
          </FormMessage>
        </FormField>

        <SelectField
          label="활동 지역"
          onChange={setRegion}
          options={REGION_SELECT_OPTIONS}
          value={region}
        />

        <FormField>
          <FormLabel>장르</FormLabel>
          <div className="flex flex-wrap gap-2">
            {GENRE_OPTIONS.map((genre) => (
              <Chip
                active={genres.includes(genre)}
                disabled={
                  !genres.includes(genre) && genres.length >= MAX_GENRES
                }
                key={genre}
                onClick={() => toggleGenre(genre)}
                size="large"
                variant="outlined"
              >
                {GENRE_LABEL[genre]}
              </Chip>
            ))}
          </div>
          <FormMessage>최대 {MAX_GENRES}개까지 고를 수 있어요</FormMessage>
        </FormField>
      </div>
      <BottomActionArea
        caption="팀을 만들면 이 공연의 공연 팀으로 바로 등록돼요"
        disabled={!canSubmit}
        label="공연 팀 만들기"
        onClick={create}
      />
    </>
  );
}

export default ShowTeamCreateScreen;
