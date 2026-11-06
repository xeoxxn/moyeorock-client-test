import { AlertActionAreaButton, useAlert } from "@wanteddev/wds";
import type { ReactNode } from "react";

type AlertResult = "confirm" | "cancel";

interface AppAlertOptions {
  title?: ReactNode;
  content: ReactNode;
  /** 확인 버튼 라벨 */
  confirm: string;
  /** 취소 버튼 라벨. 없으면 확인 버튼 하나(안내용)만 뜬다. */
  cancel?: string;
}

// 확인 대화상자(해체 · 탈퇴 · 내보내기 · 확정 …) — WDS `useAlert`를 감싼다.
// WDS AlertArea는 confirm/cancel을 Slot으로 감싸 onClick을 꽂기 때문에 문자열을 넘기면
// "Slot failed to slot onto its Slottable"로 앱 전체가 내려간다. 그래서 라벨만 받아 여기서
// AlertActionAreaButton으로 만들어 넘긴다. 화면에서는 useAlert를 직접 쓰지 말고 이걸 쓴다.
//
// 버튼 순서는 WDS reverse 방향 — 오른쪽 끝이 확인, 그 왼쪽이 취소다.
export function useAppAlert() {
  const alert = useAlert();

  return ({
    cancel,
    confirm,
    content,
    title,
  }: AppAlertOptions): Promise<AlertResult> =>
    alert({
      cancel:
        cancel !== undefined ? (
          <AlertActionAreaButton variant="assistive">
            {cancel}
          </AlertActionAreaButton>
        ) : undefined,
      confirm: <AlertActionAreaButton>{confirm}</AlertActionAreaButton>,
      content,
      direction: "reverse",
      title,
    });
}
