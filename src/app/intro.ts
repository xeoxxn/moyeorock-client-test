import { useSyncExternalStore } from "react";

// 앱 첫 진입 스플래시(Figma 00 604:26169)의 진행 단계. 스플래시(AppSplash)와 로그인 화면(08)이 같이
// 본다 — 로그인 화면은 스플래시가 끝날 때까지 자기 로고를 숨기고 사진·부제·버튼을 페이드인한다.
// 페이지를 새로 열 때마다 한 번만 지나간다(모듈 상태라 화면 이동으로는 다시 뜨지 않는다).
// - splash: 주홍 바탕 + 검은 세로 로고, 막대 웨이브 한 번(인증 확인 동안)
// - toLogin: 로그인 화면 로고 자리로 작아지며 옮겨 가고 색이 원래대로 돌아온다(0.8초)
// - toApp: 이미 로그인했으면 로고째 페이드아웃(0.8초)
// - done: 스플래시를 걷어 냄
export type IntroPhase = "splash" | "toLogin" | "toApp" | "done";

let phase: IntroPhase = "splash";
const listeners = new Set<() => void>();

export function setIntroPhase(next: IntroPhase): void {
  if (phase === next) return;
  phase = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useIntroPhase(): IntroPhase {
  return useSyncExternalStore(subscribe, () => phase);
}

// 스플래시 로고가 옮겨 갈 자리 — 로그인 화면의 세로 로고가 ref로 등록한다.
let loginLogo: SVGSVGElement | null = null;

export function registerLoginLogo(element: SVGSVGElement | null): void {
  loginLogo = element;
}

export function getLoginLogo(): SVGSVGElement | null {
  return loginLogo;
}
