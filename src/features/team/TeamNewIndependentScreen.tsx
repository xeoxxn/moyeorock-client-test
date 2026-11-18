import { useToast } from "@wanteddev/wds";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomActionArea from "@/components/ui/BottomActionArea";
import ChipGrid from "@/components/ui/ChipGrid";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SelectField from "@/components/ui/SelectField";
import TextInputField from "@/components/ui/TextInputField";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import {
  GENRE_LABEL,
  GENRE_OPTIONS,
  INSTRUMENT_LABEL,
  INSTRUMENT_OPTIONS,
  REGION_LABEL,
  REGION_OPTIONS,
} from "@/lib/domain/labels";
import type { Genre, Instrument, Region } from "@/lib/domain/types";
import { getMe, getMyTeams } from "@/mocks/selectors";

// 서버 TeamCreateRequest 제한
const NAME_MAX_LENGTH = 50;
const DESCRIPTION_MAX_LENGTH = 500;
const GENRE_MAX_COUNT = 5;

const REGION_SELECT_OPTIONS = REGION_OPTIONS.map((region) => ({
  label: REGION_LABEL[region],
  value: region,
}));

// 독립 팀 만들기 — 서버 POST /teams {name(≤50), description, region, genres(≤5), instrument(내 세션,
// 필수)}. 만든 사람이 팀장이 된다. Figma 21·24 폼 모양(라벨 + 입력, 같은 폭 3열 칩, 하단 버튼).
// 만들면 완료 화면 없이 새 팀으로 replace 이동 + 토스트. 팀원은 만든 뒤 멤버 탭에서 초대한다.
function TeamNewIndependentScreen() {
  const navigate = useNavigate();
  const toast = useToast();
  const me = getMe();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  // 지역·세션은 내 프로필 값으로 미리 채운다 — 대부분 그대로 쓴다.
  const [region, setRegion] = useState<Region>(me.region);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [instrument, setInstrument] = useState<Instrument | null>(
    me.instruments[0]?.instrument ?? null,
  );

  useScreenHeader(useMemo(() => <ScreenHeader title="독립 팀 만들기" />, []));

  const toggleGenre = (genre: Genre) => {
    if (genres.includes(genre)) {
      setGenres((prev) => prev.filter((item) => item !== genre));
      return;
    }
    if (genres.length >= GENRE_MAX_COUNT) {
      toast({
        content: `장르는 ${GENRE_MAX_COUNT}개까지 고를 수 있어요`,
        variant: "cautionary",
      });
      return;
    }
    setGenres((prev) => [...prev, genre]);
  };

  const canSubmit = name.trim() !== "" && instrument !== null;

  const create = () => {
    toast({ content: `${name.trim()} 팀을 만들었어요`, variant: "positive" });
    // 목업에는 새 팀을 저장할 곳이 없어 내가 팀장인 독립 팀을 대신 연다. 서버가 붙으면 POST /teams
    // 응답의 id로 간다. 폼으로 되돌아오지 않게 replace.
    const created = getMyTeams().find(
      (team) => team.performanceId === null && team.myRole === "LEADER",
    );
    navigate(created ? `/team/${created.id}` : "/crew?tab=team", {
      replace: true,
    });
  };

  return (
    <>
      <ScreenBody>
        <div className="flex flex-col gap-6 px-5 pt-2">
          <TextInputField
            label="팀 이름"
            maxLength={NAME_MAX_LENGTH}
            onChange={setName}
            placeholder="팀 이름"
            value={name}
          />
          <TextInputField
            label="소개"
            maxLength={DESCRIPTION_MAX_LENGTH}
            multiline
            onChange={setDescription}
            placeholder="어떤 음악을 연주하나요?"
            value={description}
          />
          <SelectField
            label="활동 지역"
            onChange={setRegion}
            options={REGION_SELECT_OPTIONS}
            value={region}
          />
          <ChipGrid
            isSelected={(genre) => genres.includes(genre)}
            label="장르"
            message={`최대 ${GENRE_MAX_COUNT}개`}
            onToggle={toggleGenre}
            options={GENRE_OPTIONS.map((value) => ({
              label: GENRE_LABEL[value],
              value,
            }))}
          />
          <ChipGrid
            isSelected={(option) => instrument === option}
            label="내 세션"
            onToggle={setInstrument}
            options={INSTRUMENT_OPTIONS.map((value) => ({
              label: INSTRUMENT_LABEL[value],
              value,
            }))}
          />
        </div>
      </ScreenBody>

      <BottomActionArea
        caption="내가 팀장이 돼요. 팀원은 만든 뒤 초대해요."
        disabled={!canSubmit}
        label="만들기"
        onClick={create}
      />
    </>
  );
}

export default TeamNewIndependentScreen;
