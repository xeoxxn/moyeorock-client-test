import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import MiniPlayer from "@/components/music/MiniPlayer";
import BottomNav, {
  BOTTOM_NAV_ORDER,
  type BottomNavValue,
} from "@/components/ui/BottomNav";
import {
  type ScreenBackdrop,
  ScreenChromeContext,
  ScreenHeaderContext,
} from "@/components/ui/screenHeaderContext";
import { useNativeSafeAreaColors } from "@/components/ui/useNativeSafeAreaColors";
import { cn } from "@/lib/cn";

// Bottom Nav 탭 ↔ 탭 루트 경로. 탭을 누르면 이 경로로 간다.
const BOTTOM_NAV_PATHS: Record<BottomNavValue, string> = {
  board: "/board",
  crew: "/crew",
  home: "/",
  mine: "/mine",
  schedule: "/schedule",
};

// 경로 → 활성 탭. 모임 탭은 모임(/crew)·팀(/team)·공연(/show)·다른 사용자(/users)를 묶고,
// 연습 분석(/practice)은 홈의 '다시 듣기'에서 들어가므로 홈으로 본다.
const TAB_PREFIXES: [string, BottomNavValue][] = [
  ["/schedule", "schedule"],
  ["/crew", "crew"],
  ["/team", "crew"],
  ["/show", "crew"],
  ["/users", "crew"],
  ["/board", "board"],
  ["/mine", "mine"],
];

function getBottomNavValueFromPath(pathname: string): BottomNavValue {
  const matched = TAB_PREFIXES.find(
    ([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  return matched?.[1] ?? "home";
}

const BACKDROP_CLASS: Record<ScreenBackdrop, string> = {
  "cover-blue": "cover-glow-blue h-90",
  "cover-green": "cover-glow-green h-90",
  "cover-red": "cover-glow-red h-90",
  "cover-teal": "cover-glow-teal h-90",
  "cover-violet": "cover-glow-violet h-90",
  stage: "stage-glow h-80",
};

interface ScreenLayoutProps {
  hasBottomNav?: boolean;
  hasMiniPlayer?: boolean;
  /** 헤더 자리 없이 화면이 프레임 맨 위(상단 안전영역 포함)부터 그린다 */
  fullBleed?: boolean;
  /** 프레임 전체를 덮는 층(앱 첫 진입 스플래시) — 데스크톱에서도 앱 컬럼 안만 덮는다 */
  overlay?: ReactNode;
}

// 모든 화면이 공유하는 라우트 레이아웃 — router.tsx에서 부모 route로 두고 화면들을 자식 route(Outlet)로
// 넣는다. 화면마다 다른 헤더·위쪽 그라데이션은 useScreenHeader·useScreenBackdrop 훅으로 등록한다.
// 하단 탭·미니 플레이어 유무는 라우트 handle(hasBottomNav·hasMiniPlayer)로 정한다.
//
// 폰에서는 프레임을 화면 네 변에 붙여(fixed inset-0) 꽉 채운다. 높이를 100dvh로 잡으면 iOS 홈 화면
// 앱(standalone + black-translucent 상태 표시줄)이 처음 켤 때 dvh를 상태 표시줄만큼 짧게 계산해
// 바닥이 비어 있다가, 한 번 쓸어 올려야 다시 재서 채워진다. 네 변 고정은 처음부터 정확하다.
// 데스크톱(sm 이상)에서만 480px 가운데 컬럼으로 세우고 높이는 h-dvh로 둔다.
// 세이프에어리어는 env(safe-area-inset-*)로 확보한다(index.html의 viewport-fit=cover와 한 쌍).
function ScreenLayout({
  fullBleed = false,
  hasBottomNav = true,
  hasMiniPlayer = false,
  overlay,
}: ScreenLayoutProps) {
  const [header, setHeader] = useState<ReactNode>(null);
  const [backdrop, setBackdrop] = useState<ScreenBackdrop | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const bottomNavValue = getBottomNavValueFromPath(location.pathname);
  const chrome = useMemo(
    () => ({ hasMiniPlayer, setBackdrop }),
    [hasMiniPlayer],
  );

  useNativeSafeAreaColors(hasBottomNav);

  // 탭 전환을 View Transitions API로 감싸 Shared Axis 전환을 건다 — 애니메이션은 index.css에 있다.
  // 미끄러지는 방향은 CSS가 알 수 없으므로 탭 순서를 비교해 html의 data-nav-direction에 심는다.
  const handleBottomNavChange = (next: BottomNavValue) => {
    if (
      next === bottomNavValue &&
      location.pathname === BOTTOM_NAV_PATHS[next]
    ) {
      return;
    }
    const forward =
      BOTTOM_NAV_ORDER.indexOf(next) > BOTTOM_NAV_ORDER.indexOf(bottomNavValue);
    document.documentElement.dataset.navDirection = forward
      ? "forward"
      : "back";
    navigate(BOTTOM_NAV_PATHS[next], { viewTransition: true });
  };

  return (
    <ScreenHeaderContext.Provider value={setHeader}>
      <ScreenChromeContext.Provider value={chrome}>
        <div className="view-transition-frame fixed inset-0 flex flex-col overflow-hidden bg-background sm:relative sm:inset-auto sm:h-dvh sm:w-120 sm:shadow-2xl">
          {backdrop && (
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-x-0 top-0",
                BACKDROP_CLASS[backdrop],
              )}
            />
          )}
          {!fullBleed && (
            <div className="relative shrink-0 pt-safe-top">{header}</div>
          )}
          {/* 스크롤은 각 화면(ScreenBody)이 맡는다. overflow-y-auto가 동작하려면 자식 높이가 명확해야
              해서 여기서 h-full을 보장한다. */}
          <div className="relative flex-1 overflow-hidden">
            <div className="flex h-full flex-col">
              <Outlet />
            </div>
            {hasMiniPlayer && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0">
                <div className="absolute inset-x-0 bottom-0 bottom-fade h-24" />
                <div className="pointer-events-auto relative px-2 pb-2">
                  <MiniPlayer />
                </div>
              </div>
            )}
          </div>
          {/* view-transition-name이 붙은 자손은 조상(프레임)의 스냅샷에서 빠진다 — 그래서 화면이
              미끄러지는 동안 Bottom Nav는 제자리에 남는다. */}
          {hasBottomNav && (
            <div className="view-transition-bottom-nav relative shrink-0">
              <BottomNav
                onValueChange={handleBottomNavChange}
                value={bottomNavValue}
              />
            </div>
          )}
          {overlay}
        </div>
      </ScreenChromeContext.Provider>
    </ScreenHeaderContext.Provider>
  );
}

export default ScreenLayout;
