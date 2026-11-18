// 로그인 여부. 아직 백엔드 연동 전이라 액세스 토큰 대신 "로그인했다"는 표시만 localStorage에 둔다 —
// 연동되면 이 함수들 안이 토큰 저장·삭제로 바뀐다. 저장소를 못 쓰는 환경(사생활 보호 모드 등)에선
// 로그인하지 않은 것으로 본다.
const SESSION_KEY = "moyeorock:session";

export function hasSession(): boolean {
  try {
    return window.localStorage.getItem(SESSION_KEY) !== null;
  } catch {
    return false;
  }
}

/** 로그인·가입을 마쳤을 때(POST /v1/auth/login · 온보딩 완료) */
export function saveSession(): void {
  try {
    window.localStorage.setItem(SESSION_KEY, "1");
  } catch {
    // 저장하지 못하면 다음 실행 때 다시 로그인하게 될 뿐이다.
  }
}

/** 로그아웃·회원 탈퇴 — 서버에 로그아웃 API가 없어 앱이 들고 있는 것만 지운다 */
export function clearSession(): void {
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // 지우지 못해도 화면은 로그인으로 보낸다.
  }
}
