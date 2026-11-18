import {
  type CSSProperties,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  getLoginLogo,
  type IntroPhase,
  setIntroPhase,
  useIntroPhase,
} from "@/app/intro";
import { BrandLogoStacked } from "@/components/music/Brand";
import { hasSession } from "@/lib/auth/session";
import { cn } from "@/lib/cn";

// Figma 00 스플래시(604:26169) → 08 로그인(421:13581). 앱을 새로 열면 인증을 확인하는 동안 주홍 바탕에
// 검은 세로 로고(로그인 로고의 1.5배)를 화면 가운데 띄우고, 피크 안 막대 웨이브를 한 번 돌린다
// (index.css splash-logo-bars). 그다음 0.8초 ease-in-out으로
// - 로그인 전이면: 주홍 바탕이 사라지고, 로고가 작아지며 로그인 화면 로고 자리로 옮겨 가고(공유 요소),
//   색이 검정에서 원래 색(피크 주홍 · 막대 진한색 · 워드마크 흰색)으로 돌아온다. 사진·부제·버튼은
//   로그인 화면이 같은 시간에 페이드인한다(useIntroPhase).
// - 이미 로그인했으면: 로고째 페이드아웃하고 열려던 화면(기본 홈)을 그대로 보여 준다.
// 스플래시 뒤에는 처음부터 갈 화면을 깔아 둬서, 걷히는 순간 그 화면이 이미 그려져 있다.

/**
 * 로그인 자리로 넘어가기 시작하는 때(Figma 00의 AFTER_TIMEOUT 2.0초) — 막대 웨이브는 마지막 막대가
 * 0.66초에 시작해 0.8초 움직여 1.5초쯤 끝나고, 0.5초 쉬었다가 넘어간다.
 */
const HANDOFF_START_MS = 2000;
/** 로그인 로고 자리로 옮겨 가거나 페이드아웃하는 시간(duration-800과 같아야 한다) */
const HANDOFF_MS = 800;
/** 동작 줄이기 설정이면 웨이브·전환 없이 잠깐만 보여 준다 */
const REDUCED_HOLD_MS = 600;
/** 스플래시 로고는 로그인 로고의 1.5배 */
const SPLASH_SCALE = 1.5;

const HANDOFF_TRANSITION =
  "duration-800 ease-in-out motion-reduce:transition-none";

/** 로그인하지 않아도 머물 수 있는 경로 — 로그인·가입·온보딩 */
function isAuthPath(pathname: string): boolean {
  return (
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname.startsWith("/onboarding/")
  );
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface Offset {
  x: number;
  y: number;
}

function AppSplash() {
  const phase = useIntroPhase();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  // 처음 연 경로 — 인증 확인 결과로 어디를 깔지 정하는 기준이라 이후 이동에는 따라가지 않는다.
  const [entryPath] = useState(pathname);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState<Offset | null>(null);

  useEffect(() => {
    if (phase !== "splash") return;
    const signedIn = hasSession();
    // 로그인 전이면 로그인 화면을, 로그인했는데 로그인 화면으로 들어왔으면 홈을 스플래시 뒤에 깐다.
    const toLogin =
      !signedIn && (entryPath === "/login" || !isAuthPath(entryPath));
    if (!signedIn && !isAuthPath(entryPath)) {
      navigate("/login", { replace: true });
    } else if (signedIn && isAuthPath(entryPath)) {
      navigate("/", { replace: true });
    }

    const reduced = prefersReducedMotion();
    const timer = window.setTimeout(
      () => {
        if (reduced) {
          setIntroPhase("done");
          return;
        }
        const target = getLoginLogo();
        const overlay = overlayRef.current;
        if (!toLogin || !target || !overlay) {
          setIntroPhase("toApp");
          return;
        }
        // 스플래시 로고는 화면 가운데에 있다 — 로그인 로고 가운데까지의 거리만큼 옮긴다.
        const from = overlay.getBoundingClientRect();
        const to = target.getBoundingClientRect();
        setOffset({
          x: to.left + to.width / 2 - (from.left + from.width / 2),
          y: to.top + to.height / 2 - (from.top + from.height / 2),
        });
        setIntroPhase("toLogin");
      },
      reduced ? REDUCED_HOLD_MS : HANDOFF_START_MS,
    );
    return () => window.clearTimeout(timer);
  }, [entryPath, navigate, phase]);

  useEffect(() => {
    if (phase !== "toLogin" && phase !== "toApp") return;
    const timer = window.setTimeout(() => setIntroPhase("done"), HANDOFF_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (phase === "done") return null;
  return (
    <SplashOverlay offset={offset} overlayRef={overlayRef} phase={phase} />
  );
}

interface SplashOverlayProps {
  phase: Exclude<IntroPhase, "done">;
  offset: Offset | null;
  overlayRef: RefObject<HTMLDivElement | null>;
}

function SplashOverlay({ offset, overlayRef, phase }: SplashOverlayProps) {
  const moving = phase === "toLogin" && offset !== null;
  const logoStyle: CSSProperties = {
    transform: moving
      ? `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px)`
      : `translate(-50%, -50%) scale(${SPLASH_SCALE})`,
  };

  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 z-50 transition-opacity",
        HANDOFF_TRANSITION,
        phase === "toApp" && "opacity-0",
        phase !== "splash" && "pointer-events-none",
      )}
      ref={overlayRef}
    >
      <div
        className={cn(
          "absolute inset-0 bg-accent transition-opacity",
          HANDOFF_TRANSITION,
          moving && "opacity-0",
        )}
      />
      <div
        className={cn(
          "absolute top-1/2 left-1/2 transition-transform",
          HANDOFF_TRANSITION,
        )}
        style={logoStyle}
      >
        {/* 주홍 바탕 위에선 피크·워드마크가 검정(stage/ink = bg/base)이고 막대는 바탕색처럼 주홍이다. */}
        <BrandLogoStacked
          barClassName={cn(
            "transition-[fill]",
            HANDOFF_TRANSITION,
            moving ? "fill-background" : "fill-accent",
          )}
          barsMotionClassName="splash-logo-bars"
          className="w-55"
          pickClassName={cn(
            "transition-[fill]",
            HANDOFF_TRANSITION,
            moving ? "fill-accent" : "fill-background",
          )}
          wordmarkClassName={cn(
            "transition-[fill]",
            HANDOFF_TRANSITION,
            moving ? "fill-label-strong" : "fill-background",
          )}
        />
      </div>
    </div>
  );
}

export default AppSplash;
