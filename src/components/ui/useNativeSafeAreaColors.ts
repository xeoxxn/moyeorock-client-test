import { useEffect } from "react";

import { isInAppShell, postBridgeMessage } from "@/lib/bridge/bridge";
import { SAFE_AREA_COLORS_MESSAGE_TYPE } from "@/lib/bridge/messages/safeAreaColors";

function readCssVariable(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

// React Native 앱은 WebView 위아래에 세이프에어리어 인셋 높이만큼 스트립을 깔고, 맞닿는 웹
// 화면과 같은 색으로 칠해 경계선을 없앤다. 앱은 웹의 DOM을 볼 수 없으므로(별도 저장소·별도
// 배포, WebView 안은 픽셀만 보인다) 웹이 자기 색을 알려주지 않으면 알 방법이 없다.
//
// 모여락은 화면마다 캔버스 색이 바뀌지 않는 다크(네온) 단일 테마라(#0b0b0d 고정), Stream처럼
// 화면별 background variant를 받을 필요가 없다 — 상단은 항상 캔버스, 하단은 Bottom Nav가
// 있으면 그 표면색(elevated), 없으면 캔버스 색 그대로다.
export function useNativeSafeAreaColors(hasBottomNav: boolean) {
  useEffect(() => {
    if (!isInAppShell()) {
      return;
    }

    const top = readCssVariable("--semantic-background-normal-alternative");
    const bottom = hasBottomNav
      ? readCssVariable("--semantic-background-elevated-normal")
      : top;

    // 토큰을 못 읽었으면(WDS 로드 전 등) 보내지 않는다 — 앱이 자기 기본값을 유지하는 편이
    // 빈 문자열을 받아 검정으로 칠하는 것보다 낫다.
    if (!top || !bottom) {
      return;
    }

    postBridgeMessage(SAFE_AREA_COLORS_MESSAGE_TYPE, { bottom, top });
  }, [hasBottomNav]);
}
