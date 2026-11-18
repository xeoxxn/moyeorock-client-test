import { useToast } from "@wanteddev/wds";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CoverRow from "@/components/list/CoverRow";
import { coverToneOf } from "@/components/music/Cover";
import BottomActionArea from "@/components/ui/BottomActionArea";
import ChipGrid from "@/components/ui/ChipGrid";
import EmptyState from "@/components/ui/EmptyState";
import FieldLabel from "@/components/ui/FieldLabel";
import ScreenBody from "@/components/ui/ScreenBody";
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
import { getMe, getPerformance, isUpcoming, toId } from "@/mocks/selectors";

// 공연 팀 만들기 — 공연 상세의 "공연 팀 만들기"에서 들어온다. 서버 PerformanceTeamCreateRequest
// {name(≤50), description, region, genres(≤5), instrument(만든 사람의 세션, 필수)}를 그대로 받고 만든
// 사람이 팀장이 된다. 폼은 Figma 21·24 모양(라벨 + 칸, 같은 폭 3열 칩). 공연 팀은 모집글을 올릴 수
// 없어(서버 409) 팀원은 초대로 모은다. 만든 뒤에는 완료 화면 없이 상세로 간다(replace + 토스트).

const MAX_GENRES = 5;

const REGION_SELECT_OPTIONS = REGION_OPTIONS.map((region) => ({
  label: REGION_LABEL[region],
  value: region,
}));

const INSTRUMENT_CHOICES = INSTRUMENT_OPTIONS.map((item) => ({
  label: INSTRUMENT_LABEL[item],
  value: item,
}));

const GENRE_CHOICES = GENRE_OPTIONS.map((genre) => ({
  label: GENRE_LABEL[genre],
  value: genre,
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

  useScreenHeader(useMemo(() => <ScreenHeader title="공연 팀 만들기" />, []));

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
    // 백엔드가 붙기 전이라 새 팀 id를 받을 수 없다 — 공연 상세로 돌려보낸다. 서버에 붙이면 응답의 id로
    // /team/:id에 간다. 폼으로 되돌아오지 않게 replace.
    navigate(`/show/${performance.id}`, { replace: true });
  };

  return (
    <>
      <ScreenBody className="flex flex-col gap-6 pt-2">
        <CoverRow
          meta={`${formatDateTime(performance.performedAt)} · ${performance.venue}`}
          title={performance.title}
          tone={coverToneOf("performance", performance.id)}
        />

        <div className="flex flex-col gap-6 px-5">
          <TextInputField
            label="팀 이름"
            maxLength={50}
            onChange={setName}
            placeholder="블루 웨이브"
            value={name}
          />

          <div className="flex flex-col gap-3">
            <FieldLabel>내 세션</FieldLabel>
            <ChipGrid
              isSelected={(item) => item === instrument}
              onToggle={setInstrument}
              options={INSTRUMENT_CHOICES}
            />
          </div>

          <SelectField
            label="활동 지역"
            onChange={setRegion}
            options={REGION_SELECT_OPTIONS}
            value={region}
          />

          <div className="flex flex-col gap-3">
            <FieldLabel>장르 · 최대 {MAX_GENRES}개</FieldLabel>
            <ChipGrid
              isDisabled={(genre) =>
                !genres.includes(genre) && genres.length >= MAX_GENRES
              }
              isSelected={(genre) => genres.includes(genre)}
              onToggle={toggleGenre}
              options={GENRE_CHOICES}
            />
          </div>

          <TextInputField
            label="소개"
            maxLength={1000}
            multiline
            onChange={setDescription}
            placeholder="어떤 음악을 연주하나요?"
            value={description}
          />
        </div>
      </ScreenBody>
      <BottomActionArea disabled={!canSubmit} label="만들기" onClick={create} />
    </>
  );
}

export default ShowTeamCreateScreen;
