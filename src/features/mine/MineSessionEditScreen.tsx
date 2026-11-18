import { useToast } from "@wanteddev/wds";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomActionArea from "@/components/ui/BottomActionArea";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import SessionPicker, {
  getSelectedInstruments,
  type SessionLevels,
} from "@/features/onboarding/components/SessionPicker";
import { getMe } from "@/mocks/selectors";

// 세션 편집(/mine/session) — 마이의 "세션 편집"에서 들어온다. Figma 화면은 없어서 온보딩 세션 선택
// (Figma 22)과 같은 본문을 쓴다. 서버 PUT /users/me/instruments {instruments[{instrument, level}]}는 전체
// 교체라 빠진 세션은 지워지고, 빈 목록은 받지 않는다(@NotEmpty).
function MineSessionEditScreen() {
  const navigate = useNavigate();
  const toast = useToast();
  const me = getMe();
  const [levels, setLevels] = useState<SessionLevels>(() =>
    Object.fromEntries(
      me.instruments.map((item) => [item.instrument, item.level]),
    ),
  );

  useScreenHeader(useMemo(() => <ScreenHeader title="세션 편집" />, []));

  const save = () => {
    toast({ content: "세션을 저장했어요", variant: "positive" });
    navigate(-1);
  };

  return (
    <>
      <ScreenBody className="pt-4">
        <SessionPicker onChange={setLevels} value={levels} />
      </ScreenBody>
      <BottomActionArea
        caption={
          getSelectedInstruments(levels).length === 0
            ? "세션을 하나 이상 골라 주세요"
            : undefined
        }
        disabled={getSelectedInstruments(levels).length === 0}
        label="저장"
        onClick={save}
      />
    </>
  );
}

export default MineSessionEditScreen;
