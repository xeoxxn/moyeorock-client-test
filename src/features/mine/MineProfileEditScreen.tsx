import {
  Avatar,
  Chip,
  FormField,
  FormLabel,
  TextButton,
  TopNavigationButton,
  useToast,
} from "@wanteddev/wds";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import mascotPeace from "@/assets/mascot/peace.png";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SelectField from "@/components/ui/SelectField";
import TextInputField from "@/components/ui/TextInputField";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import {
  GENRE_LABEL,
  GENRE_OPTIONS,
  REGION_LABEL,
  REGION_OPTIONS,
} from "@/lib/domain/labels";
import type { Genre, Region } from "@/lib/domain/types";
import { getMe } from "@/mocks/selectors";

// Figma: 마이/02 프로필 수정 — 서버 PUT /users/me(UserUpdateRequest: nickname·region·genres·bio·
// profileImage·isRecommendable·isActivityPublic). 세션은 별도 API(PUT /users/me/instruments)라
// 마이의 "세션 수정"(/mine/session)에서 바꾼다. Figma의 "세션 · 실력 수정" 행은 뺐다 — 눌러서
// 넘어가면 이 화면에서 고친 내용이 저장 없이 사라진다.

const NICKNAME_MAX_LENGTH = 20;

const REGION_SELECT_OPTIONS = REGION_OPTIONS.map((region) => ({
  label: REGION_LABEL[region],
  value: region,
}));

function MineProfileEditScreen() {
  const navigate = useNavigate();
  const toast = useToast();
  const me = getMe();
  const [nickname, setNickname] = useState(me.nickname);
  const [bio, setBio] = useState(me.bio);
  const [region, setRegion] = useState<Region | "">(me.region);
  const [genres, setGenres] = useState<Genre[]>(me.genres);

  const canSave = nickname.trim() !== "";

  const toggleGenre = (genre: Genre) =>
    setGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((item) => item !== genre)
        : [...prev, genre],
    );

  const save = () => {
    toast({ content: "프로필을 저장했어요", variant: "positive" });
    navigate(-1);
  };

  useScreenHeader(
    <ScreenHeader
      title="프로필 수정"
      trailing={
        <TopNavigationButton
          color="primary"
          disabled={!canSave}
          onClick={save}
          variant="text"
        >
          저장
        </TopNavigationButton>
      }
    />,
  );

  return (
    <div className="scrollbar-hidden flex flex-1 flex-col gap-6 overflow-y-auto px-5 pt-4 pb-8">
      <div className="flex flex-col items-center gap-2">
        <Avatar
          alt=""
          size="xlarge"
          src={me.profileImage ?? mascotPeace}
          variant="person"
        />
        {/* 프로필 이미지 업로드(파일 API)는 아직 붙지 않았다 — 자리만 잡아 둔다. */}
        <TextButton
          color="primary"
          onClick={() =>
            toast({ content: "프로필 사진 바꾸기는 준비 중이에요" })
          }
          size="small"
        >
          사진 바꾸기
        </TextButton>
      </div>

      <TextInputField
        error={canSave ? undefined : "닉네임을 입력해 주세요"}
        label="닉네임"
        maxLength={NICKNAME_MAX_LENGTH}
        onChange={setNickname}
        value={nickname}
      />

      <TextInputField
        label="한 줄 소개"
        multiline
        onChange={setBio}
        placeholder="나를 소개해 주세요"
        value={bio}
      />

      <SelectField
        label="활동 지역"
        onChange={setRegion}
        options={REGION_SELECT_OPTIONS}
        value={region}
      />

      <FormField>
        <FormLabel>음악 취향</FormLabel>
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
      </FormField>
    </div>
  );
}

export default MineProfileEditScreen;
