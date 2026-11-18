import { type ReactNode, useContext } from "react";

import { ScreenChromeContext } from "@/components/ui/screenHeaderContext";
import { cn } from "@/lib/cn";

// 화면 본문 스크롤 영역. 모든 화면은 본문을 이걸로 감싼다 — 미니 플레이어가 떠 있는 탭 화면에서
// 마지막 줄이 플레이어 밑에 가려지지 않게 아래 여백을 자동으로 더한다. 구역은 선 대신 여백으로
// 나누므로, 구역 사이 간격은 SectionHeader의 위 여백이 맡는다.
interface ScreenBodyProps {
  children: ReactNode;
  className?: string;
}

function ScreenBody({ children, className }: ScreenBodyProps) {
  const chrome = useContext(ScreenChromeContext);
  return (
    <div
      className={cn(
        "scrollbar-hidden min-h-0 flex-1 overflow-y-auto",
        chrome?.hasMiniPlayer ? "pb-24" : "pb-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default ScreenBody;
