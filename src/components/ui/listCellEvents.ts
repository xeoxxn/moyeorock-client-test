import type { MouseEvent } from "react";

// WDS ListCell은 행을 누르면 행 안의 첫 버튼(role="button"·체크박스·링크)을 대신 한 번 더 눌러 준다.
// 그래서 chevron(ListCellContent variant="chevron"도 role="button"이다)이 있는 행은 onClick이 두 번
// 불리고, "팀 초대"·"거절"·저장 토글처럼 버튼이 들어 있는 행은 행만 눌러도 그 버튼이 눌린다.
// 행 자체가 할 일이 있는 경우엔 rowClick으로 그 전달을 막고, 행 안의 버튼은 innerClick으로 행의
// onClick(화면 이동)이 같이 불리지 않게 한다.

/** 행 전체를 눌렀을 때 — WDS의 "안쪽 버튼 대신 누르기"를 막고 handler만 부른다 */
export function rowClick(handler?: () => void) {
  return (event: MouseEvent) => {
    event.preventDefault();
    handler?.();
  };
}

/** 행 안의 버튼 — 눌러도 행의 onClick이 같이 불리지 않게 */
export function innerClick(handler?: () => void) {
  return (event: MouseEvent) => {
    event.stopPropagation();
    handler?.();
  };
}
