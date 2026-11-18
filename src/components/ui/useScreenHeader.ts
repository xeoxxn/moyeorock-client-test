import type { ReactNode } from "react";
import { useContext, useEffect } from "react";

import {
  type ScreenBackdrop,
  ScreenChromeContext,
  ScreenHeaderContext,
} from "@/components/ui/screenHeaderContext";

// 화면(라우트)이 자신의 헤더를 ScreenLayout의 header 슬롯에 등록한다. ScreenLayout이 라우터에서
// 부모 route로 화면을 감싸기 때문에, 화면은 <ScreenLayout>을 직접 감쌀 필요 없이 이 훅만
// 호출하면 된다.
export function useScreenHeader(header: ReactNode) {
  const setHeader = useContext(ScreenHeaderContext);

  if (!setHeader) {
    throw new Error(
      "useScreenHeader는 ScreenLayout의 하위 라우트에서만 쓸 수 있다",
    );
  }

  useEffect(() => {
    setHeader(header);
    return () => setHeader(null);
  }, [header, setHeader]);
}

/** 화면 위쪽 그라데이션(Stage Glow · Cover Glow)을 정한다. */
export function useScreenBackdrop(backdrop: ScreenBackdrop | null) {
  const chrome = useContext(ScreenChromeContext);

  if (!chrome) {
    throw new Error(
      "useScreenBackdrop은 ScreenLayout의 하위 라우트에서만 쓸 수 있다",
    );
  }

  const { setBackdrop } = chrome;
  useEffect(() => {
    setBackdrop(backdrop);
    return () => setBackdrop(null);
  }, [backdrop, setBackdrop]);
}
