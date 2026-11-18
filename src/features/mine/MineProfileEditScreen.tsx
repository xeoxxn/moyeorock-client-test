import { Avatar, TextButton, useToast } from "@wanteddev/wds";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomActionArea from "@/components/ui/BottomActionArea";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SelectField from "@/components/ui/SelectField";
import TextInputField from "@/components/ui/TextInputField";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import GenrePicker from "@/features/onboarding/components/GenrePicker";
import { REGION_LABEL, REGION_OPTIONS } from "@/lib/domain/labels";
import type { Genre, Region } from "@/lib/domain/types";
import { getMe } from "@/mocks/selectors";

// 프로필 편집(/mine/profile) — Figma 07 마이의 "프로필 편집"에서 들어온다. Figma 화면은 없어서 온보딩과
// 같은 입력 모양으로 둔다. 서버 PUT /users/me(UserUpdateRequest: nickname·region·genres·bio·
// profileImage·isRecommendable·isActivityPublic). 세션은 별도 API(PUT /users/me/instruments)라
// 마이의 "세션 편집"(/mine/session)에서 바꾸고, 공개 설정은 /mine/account에 있다.

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

  useScreenHeader(useMemo(() => <ScreenHeader title="프로필 편집" />, []));

  const canSave = nickname.trim() !== "" && region !== "";

  const save = () => {
    toast({ content: "프로필을 저장했어요", variant: "positive" });
    navigate(-1);
  };

  return (
    <>
      <ScreenBody className="flex flex-col gap-6 px-5 pt-2">
        <div className="flex flex-col items-center gap-2">
          <Avatar
            alt=""
            size={80}
            src={me.profileImage ?? undefined}
            variant="person"
          />
          {/* 프로필 이미지 업로드(파일 API)는 아직 붙지 않았다 — 자리만 잡아 둔다. */}
          <TextButton
            color="assistive"
            onClick={() => toast({ content: "사진 변경은 준비 중이에요" })}
            size="small"
          >
            사진 변경
          </TextButton>
        </div>

        <TextInputField
          error={nickname.trim() === "" ? "닉네임을 입력해 주세요" : undefined}
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
        <GenrePicker
          label="좋아하는 장르"
          onChange={setGenres}
          value={genres}
        />
      </ScreenBody>
      <BottomActionArea disabled={!canSave} label="저장" onClick={save} />
    </>
  );
}

export default MineProfileEditScreen;
