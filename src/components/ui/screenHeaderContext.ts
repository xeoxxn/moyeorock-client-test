import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

export type SetScreenHeader = Dispatch<SetStateAction<ReactNode>>;

export const ScreenHeaderContext = createContext<SetScreenHeader | null>(null);

/**
 * 화면 위쪽에 까는 그라데이션 — 탭 화면은 주홍(Stage Glow), 팀·모임·공연 상세는 커버색(Cover Glow).
 * 헤더 뒤까지 깔려야 해서 화면이 아니라 ScreenLayout이 그린다.
 */
export type ScreenBackdrop =
  | "stage"
  | "cover-red"
  | "cover-blue"
  | "cover-green"
  | "cover-violet"
  | "cover-teal";

export interface ScreenChrome {
  setBackdrop: Dispatch<SetStateAction<ScreenBackdrop | null>>;
  /** 미니 플레이어가 떠 있어 본문 아래를 비워야 하는지 */
  hasMiniPlayer: boolean;
}

export const ScreenChromeContext = createContext<ScreenChrome | null>(null);
