import type { ReactNode } from "react";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import BottomNav, {
  BOTTOM_NAV_ORDER,
  type BottomNavValue,
} from "@/components/ui/BottomNav";
import { ScreenBackgroundPortalContext } from "@/components/ui/screenBackgroundPortalContext";
import { ScreenHeaderContext } from "@/components/ui/screenHeaderContext";
import { ScreenSheetPortalContext } from "@/components/ui/screenSheetPortalContext";
import { useNativeSafeAreaColors } from "@/components/ui/useNativeSafeAreaColors";

// Bottom Nav 탭 ↔ 라우트 경로 매핑. 화면이 늘어나면 여기에 추가한다.
const BOTTOM_NAV_PATHS: Record<BottomNavValue, string> = {
  board: "/board",
  crew: "/crew",
  home: "/",
  mine: "/mine",
  schedule: "/schedule",
};

function getBottomNavValueFromPath(pathname: string): BottomNavValue {
  const matched = (
    Object.entries(BOTTOM_NAV_PATHS) as [BottomNavValue, string][]
  ).find(([, path]) => path === pathname);
  return matched?.[0] ?? "home";
}

interface ScreenLayoutProps {
  hasBottomNav?: boolean;
}

// 모든 화면이 공유하는 라우트 레이아웃 — router.tsx에서 부모 route로 두고 화면들을
// 자식 route(Outlet)로 넣는다. 화면마다 다른 헤더는 useScreenHeader 훅으로 이 레이아웃에
// 등록한다. Bottom Nav의 활성 탭도 화면 state가 아니라 현재 라우트에서 파생시킨다.
// 하단 고정 버튼(Action Area)이 있는 화면은 라우트 handle에 hasBottomNav: false를 지정한다.
//
// 높이는 폰이든 데스크톱이든 뷰포트를 꽉 채운다(h-dvh) — 데스크톱에서 높이를 고정하면 낮은
// 뷰포트에서 화면 아래가 잘리고 Bottom Nav가 밀려난다. 폭만 데스크톱 뷰포트(sm 이상)에서
// 480px로 묶는다 — Figma는 402 기준이지만 데스크톱에서 그대로 쓰면 너무 좁다.
//
// 세이프에어리어 자리는 앱 셸이 담당하므로 여기서 env(safe-area-inset-*)를 더하지 않는다(중복
// 여백이 된다). 대신 그 자리를 무슨 색으로 칠할지는 useNativeSafeAreaColors로 앱에 알려준다.
// 세이프에어리어는 env(safe-area-inset-*)로 확보한다(index.html의 viewport-fit=cover와 한 쌍).
function ScreenLayout({ hasBottomNav = true }: ScreenLayoutProps) {
  const [header, setHeader] = useState<ReactNode>(null);
  const [sheetPortalEl, setSheetPortalEl] = useState<HTMLDivElement | null>(
    null,
  );
  const [backgroundPortalEl, setBackgroundPortalEl] =
    useState<HTMLDivElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const bottomNavValue = getBottomNavValueFromPath(location.pathname);

  useNativeSafeAreaColors(hasBottomNav);

  // 탭 전환을 View Transitions API로 감싸 Shared Axis(이전 화면은 페이드아웃하며 밀려 나가고
  // 새 화면이 반대쪽에서 밀려 들어옴) 전환을 건다 — 애니메이션 자체는 index.css에 있다.
  // 미끄러지는 방향은 CSS가 알 수 없으므로(라우터는 "어느 탭에서 어느 탭으로"를 모른다) 여기서
  // 탭 순서를 비교해 html의 data-nav-direction에 심어 둔다.
  // startViewTransition이 없는 브라우저(iOS 18 미만 WKWebView 등)에서는 React Router가 그냥
  // 즉시 전환한다 — 동작에는 차이가 없고 애니메이션만 빠진다.
  const handleBottomNavChange = (next: BottomNavValue) => {
    if (next === bottomNavValue) return;
    const forward =
      BOTTOM_NAV_ORDER.indexOf(next) > BOTTOM_NAV_ORDER.indexOf(bottomNavValue);
    document.documentElement.dataset.navDirection = forward
      ? "forward"
      : "back";
    navigate(BOTTOM_NAV_PATHS[next], { viewTransition: true });
  };

  return (
    <ScreenHeaderContext.Provider value={setHeader}>
      <ScreenSheetPortalContext.Provider value={sheetPortalEl}>
        <ScreenBackgroundPortalContext.Provider value={backgroundPortalEl}>
          <div className="view-transition-frame relative flex h-dvh w-full flex-col overflow-hidden bg-background sm:w-[480px] sm:shadow-[0_0_20px_rgba(0,0,0,0.4)]">
            {/* 화면 전용 배경 포털 대상(네온 글로우 등) — 프레임 안에서 가장 먼저(맨 아래)
                그려져서, 투명한 헤더까지 자연스럽게 비쳐 보인다. */}
            <div
              className="pointer-events-none absolute inset-0"
              ref={setBackgroundPortalEl}
            />
            <div className="relative shrink-0 pt-safe-top">{header}</div>
            {/* 스크롤 처리는 각 화면이 스스로 결정한다. overflow-y-auto가 동작하려면 자식 높이가
                명확해야 해서, 화면마다 h-full을 직접 챙기지 않아도 되도록 여기서 기본으로 보장한다. */}
            <div className="relative flex-1 overflow-hidden">
              <div className="flex h-full flex-col">
                <Outlet />
              </div>
            </div>
            {/* view-transition-name이 붙은 자손은 조상(프레임)의 스냅샷에서 빠진다 — 그래서
                아래 한 클래스만으로 화면이 미끄러지는 동안 Bottom Nav는 제자리에 남는다. */}
            {hasBottomNav && (
              <div className="view-transition-bottom-nav relative shrink-0">
                <BottomNav
                  onValueChange={handleBottomNavChange}
                  value={bottomNavValue}
                />
              </div>
            )}
            {/* BottomSheet 포털 대상 — 헤더/본문/Bottom Nav보다 위(z-50)에 겹쳐서, 화면 하나가
                열어도 화면 프레임 전체를 딤 처리할 수 있다. */}
            <div
              className="pointer-events-none absolute inset-0 z-50"
              ref={setSheetPortalEl}
            />
          </div>
        </ScreenBackgroundPortalContext.Provider>
      </ScreenSheetPortalContext.Provider>
    </ScreenHeaderContext.Provider>
  );
}

export default ScreenLayout;
