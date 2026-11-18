import { useToast } from "@wanteddev/wds";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomActionArea from "@/components/ui/BottomActionArea";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import CrewInfoFields, {
  type CrewInfo,
  isCrewInfoValid,
} from "@/features/crew/components/CrewInfoFields";
import { getMe, getMyGroups } from "@/mocks/selectors";

// 모임 만들기(/crew/new) — Figma에는 없고 03 모임의 + 에서 들어온다. 21 합주 일정 추가·24 모집글 쓰기와
// 같은 한 화면 폼이다(예전 2단계 + 완료 화면을 합쳤다). 만들면 내가 모임장이 되고, 완료 화면 없이
// 토스트와 함께 새 모임 홈으로 replace — 뒤로가기로 다 쓴 폼에 돌아오지 않게.
function CrewCreateScreen() {
  const navigate = useNavigate();
  const toast = useToast();
  const [info, setInfo] = useState<CrewInfo>(() => ({
    description: "",
    name: "",
    region: getMe().region,
    type: "REGULAR",
  }));

  useScreenHeader(useMemo(() => <ScreenHeader title="모임 만들기" />, []));

  const create = () => {
    toast({ content: "모임을 만들었어요", variant: "positive" });
    // 목업은 새 모임을 만들지 못해서 내가 모임장인 모임으로 대신 간다. 서버에 붙이면 응답의 id로 간다.
    const created = getMyGroups().find((group) => group.myRole === "OWNER");
    navigate(created ? `/crew/${created.id}` : "/crew", { replace: true });
  };

  return (
    <>
      <ScreenBody className="flex flex-col gap-6 px-5 pt-2">
        <CrewInfoFields onChange={setInfo} value={info} />
      </ScreenBody>
      <BottomActionArea
        disabled={!isCrewInfoValid(info)}
        label="만들기"
        onClick={create}
      />
    </>
  );
}

export default CrewCreateScreen;
