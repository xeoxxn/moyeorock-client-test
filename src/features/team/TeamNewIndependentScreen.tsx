import { Chip, Typography, useToast } from "@wanteddev/wds";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomActionArea from "@/components/ui/BottomActionArea";
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
import { getMe } from "@/mocks/selectors";

// 서버 TeamCreateRequest 제한
const NAME_MAX_LENGTH = 50;
const GENRE_MAX_COUNT = 5;

const REGION_SELECT_OPTIONS = REGION_OPTIONS.map((region) => ({
  label: REGION_LABEL[region],
  value: region,
}));

// Figma: 팀/09 독립 팀 만들기 (nodeId 101:23564). 서버 POST /teams
// {name(≤50), description, region, genres(≤5), instrument(내 세션, 필수)} — 만든 사람이 팀장이 된다.
// Figma의 "함께할 세션 모집" 칸은 서버 요청에 없어서 뺐다. 모집은 팀을 만든 뒤 게시판 공고나
// 팀원 찾기로 한다.
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

  useScreenHeader(<ScreenHeader title="독립 팀 만들기" />);

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
    // 목업에는 새 팀을 저장할 곳이 없어서, 만들어진 팀 대신 기존 독립 팀(나이트 드라이브) 홈을 연다.
    // 서버가 붙으면 POST /teams 응답의 id로 간다. 폼으로 되돌아오지 않게 replace.
    navigate("/team/2", { replace: true });
  };

  return (
    <>
      <div className="scrollbar-hidden flex flex-1 flex-col gap-6 overflow-y-auto px-5 pt-2 pb-8">
        <Typography
          as="p"
          color="semantic.label.strong"
          variant="headline1"
          weight="bold"
        >
          모임 가입 없이 팀을 만들고
          <br />
          합주를 시작할 수 있어요
        </Typography>

        <TextInputField
          label="팀 이름"
          maxLength={NAME_MAX_LENGTH}
          onChange={setName}
          placeholder="팀 이름 입력"
          value={name}
        />
        <TextInputField
          label="팀 소개"
          maxLength={500}
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

        <div className="flex flex-col gap-3">
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="medium"
          >
            장르 (최대 {GENRE_MAX_COUNT}개)
          </Typography>
          <div className="flex flex-wrap gap-2">
            {GENRE_OPTIONS.map((genre) => (
              <Chip
                active={genres.includes(genre)}
                key={genre}
                onClick={() => toggleGenre(genre)}
                size="large"
                variant="outlined"
              >
                {GENRE_LABEL[genre]}
              </Chip>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="medium"
          >
            내 연주 세션
          </Typography>
          <div className="flex flex-wrap gap-2">
            {INSTRUMENT_OPTIONS.map((option) => (
              <Chip
                active={instrument === option}
                key={option}
                onClick={() => setInstrument(option)}
                size="large"
                variant="outlined"
              >
                {INSTRUMENT_LABEL[option]}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <BottomActionArea
        caption="내가 팀장이 되어 시작해요. 팀원은 만든 뒤 초대하거나 공고로 모아요."
        disabled={!canSubmit}
        label="만들기"
        onClick={create}
      />
    </>
  );
}

export default TeamNewIndependentScreen;
