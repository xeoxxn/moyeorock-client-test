import { Outlet } from "react-router-dom";

// 모든 화면의 루트 레이아웃 — 라우트 정의는 router.tsx에 있다.
// 실사용자는 React Native 앱의 WebView 안에서 보므로 폰(꽉 채움)이 기본이고, 데스크톱
// 뷰포트(sm 이상)에서는 화면을 가운데 컬럼으로 세운다. 폰에서는 ScreenLayout 프레임이 화면 네 변에
// 붙고(fixed inset-0), 데스크톱 컬럼은 뷰포트를 위아래로 꽉 채우므로(sm:h-dvh) 여기서 세로 여백을 주지 않는다.
function App() {
  return (
    <div className="sm:flex sm:min-h-dvh sm:justify-center sm:bg-background">
      <Outlet />
    </div>
  );
}

export default App;
