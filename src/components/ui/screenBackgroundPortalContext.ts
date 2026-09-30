import { createContext } from "react";

// 화면 전용 배경 레이어(네온 글로우 등)가 포털로 렌더링될 위치. ScreenLayout 프레임 최상단에,
// 헤더보다도 먼저(DOM 순서상 맨 아래) 깔리는 빈 div를 가리켜서 헤더(투명 배경)·본문 뒤로
// 자연스럽게 비쳐 보이면서도 프레임 안에서만 그려진다. sheet 포털과 반대로 항상 맨 아래 레이어다.
export const ScreenBackgroundPortalContext =
  createContext<HTMLDivElement | null>(null);
