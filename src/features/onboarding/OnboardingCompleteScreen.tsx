import { Typography } from "@wanteddev/wds";
import { IconCheck } from "@wanteddev/wds-icon";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import BottomActionArea from "@/components/ui/BottomActionArea";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import { getMe } from "@/mocks/selectors";

// Figma 09 가입 완료(421:13717) — 오른쪽 닫기만 있는 헤더 + 가운데 주홍 체크 + "가입했어요" + 시작하기.
// 인사말 닉네임은 방금 저장된 내 프로필(GET /users/me)에서 그린다. 온보딩 화면들로 뒤로 가지 않게
// 닫기·시작하기 모두 홈으로 replace.
function OnboardingCompleteScreen() {
  const navigate = useNavigate();
  const me = getMe();

  useScreenHeader(
    useMemo(
      () => (
        <ScreenHeader
          onClose={() => navigate("/", { replace: true })}
          variant="close"
        />
      ),
      [navigate],
    ),
  );

  return (
    <>
      <ScreenBody className="flex flex-col items-center px-5 pt-32 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-accent">
          <IconCheck className="size-6 text-static-white" />
        </span>
        <Typography
          as="h1"
          className="mt-6"
          color="semantic.label.strong"
          variant="heading1"
          weight="bold"
        >
          가입했어요
        </Typography>
        <Typography
          className="mt-1.5"
          color="semantic.label.alternative"
          variant="body2"
        >
          {me.nickname}님, 모여락에 오신 걸 환영해요.
        </Typography>
      </ScreenBody>
      <BottomActionArea
        label="시작하기"
        onClick={() => navigate("/", { replace: true })}
      />
    </>
  );
}

export default OnboardingCompleteScreen;
