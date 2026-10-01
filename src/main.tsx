import { ThemeProvider } from "@wanteddev/wds";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { router } from "@/app/router";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* index.html이 마운트 전에 theme을 "dark"로 고정해 둔다 — 모여락은 다크(네온) 전용이라
        라이트 모드가 없다. enableDarkMode 없이는 WDS가 강제로 라이트로 되돌린다.
        disableDefaultGlobalStyle: WDS 기본 동작은 body 배경을 카드 색으로 칠하는데, 세이프에어리어
        틈으로 비쳐 보이는 body는 캔버스 색이어야 해서 index.css에서 직접 칠한다. */}
    <ThemeProvider disableDefaultGlobalStyle enableDarkMode>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
