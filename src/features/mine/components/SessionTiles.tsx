import SessionTile from "@/components/ui/SessionTile";
import type { UserInstrument } from "@/lib/domain/types";

// Figma 07 마이 "내 세션"(587:23892) · 23 멤버 프로필 "세션"(587:24143) — 보여 주기 세션 타일(커버 + 이름 +
// 실력)을 3열 같은 폭 격자로 둔다. 사이는 Figma대로 가로 19 · 세로 20(타일 108 셋이 362에 맞는 값).
// 세션은 여섯 가지라 많아야 두 줄이다. 순서는 서버가 준 instruments 순서 그대로.
const MAX_TILES = 6;

function SessionTiles({ instruments }: { instruments: UserInstrument[] }) {
  return (
    <div className="grid grid-cols-3 gap-x-4.75 gap-y-5 px-5">
      {instruments.slice(0, MAX_TILES).map(({ instrument, level }) => (
        <SessionTile instrument={instrument} key={instrument} level={level} />
      ))}
    </div>
  );
}

export default SessionTiles;
