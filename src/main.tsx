import { ThemeProvider } from "@wanteddev/wds";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { router } from "@/app/router";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* index.html이 마운트 전에 theme을 "dark"로 고정해 둔다 — 모여락은 다크(네온) 전용이라
        라이트 모드가 없다. enableDarkMode 없이는 WDS가 강제로 라이트로 되돌린다. */}
    <ThemeProvider enableDarkMode>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
