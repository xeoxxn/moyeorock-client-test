import { useMatches } from "react-router-dom";

import ScreenLayout from "@/components/ui/ScreenLayout";

// 화면별 레이아웃 옵션 — router.tsx의 각 라우트에 `handle: { ... } satisfies ScreenRouteHandle`로 지정한다.
export interface ScreenRouteHandle {
  hasBottomNav?: boolean;
}

// useMatches()는 handle을 unknown으로 준다. ScreenRouteHandle은 필드가 전부 선택이라 객체면 이 타입으로 본다.
function isScreenRouteHandle(handle: unknown): handle is ScreenRouteHandle {
  return typeof handle === "object" && handle !== null;
}

// 옵션 필드마다, 그 필드를 지정한 라우트 중 가장 안쪽 값을 고른다(handles는 바깥 → 안쪽 순서).
function resolveScreenRouteOption<K extends keyof ScreenRouteHandle>(
  handles: ScreenRouteHandle[],
  key: K,
): ScreenRouteHandle[K] {
  for (const handle of [...handles].reverse()) {
    if (handle[key] !== undefined) {
      return handle[key];
    }
  }
  return undefined;
}

// ScreenLayout은 라우터를 모르는 prop 기반 레이아웃으로 두고, 이 컴포넌트가 현재 라우트의 handle을
// 읽어 prop으로 넘기기만 한다.
function ScreenLayoutRoute() {
  const handles = useMatches()
    .map((match) => match.handle)
    .filter(isScreenRouteHandle);

  return (
    <ScreenLayout
      hasBottomNav={resolveScreenRouteOption(handles, "hasBottomNav") ?? true}
    />
  );
}

export default ScreenLayoutRoute;
