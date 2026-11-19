import { innerClick } from "@/components/ui/listCellEvents";
import { cn } from "@/lib/cn";

// Apple Music 배지 — 곡 이름 옆에서 그 곡의 Apple Music 페이지로 보낸다.
// Apple Music 마케팅 도구(toolbox.marketingtools.apple.com)의 "배지 및 락업 → 콤팩트" 임베드 코드를 그대로
// 옮겼다: Apple 서버의 배지 이미지를 불러오고(받아 두지 않는다 — 배지가 바뀌면 Apple이 바꾼다), 링크엔
// 도구와 같은 파라미터를 붙인다. 도구는 앨범 주소(`/album/…?i=곡ID`)를 주지만 곡 ID만으로 되는
// `/song/{id}` 주소도 같은 곡 페이지로 간다. Apple 그림 그대로여야 해서 WDS 컴포넌트가 아니다.
//
// Apple Music Identity Guidelines:
// - 목록의 곡 이름 옆에는 작은 배지(콤팩트)를 쓴다. 높이 12px 이상, 둘레 여백은 배지 높이의 1/10 이상.
// - 배지 그림·색·회색 테두리를 바꾸거나 그림자를 넣지 않는다. 화면에서 가장 눈에 띄는 요소가 되면 안 된다.
// - 배지를 쓰는 곳엔 꼭 Apple Music 링크를 건다.
// 콤팩트 배지는 영어판만 있다("Apple Music"은 어느 언어에서도 번역하지 않는 상표다).
const BADGE_SRC =
  "https://toolbox.marketingtools.apple.com/api/v2/badges/listen-on-apple-music/compact/en-us";

/** 곡 ID → 마케팅 도구가 배지에 거는 Apple Music 한국 스토어 곡 링크 */
export function appleMusicSongUrl(appleMusicId: string) {
  const params = new URLSearchParams({
    app: "music",
    itscg: "30200",
    itsct: "music_box_badge",
    ls: "1",
    mttnsubad: appleMusicId,
  });
  return `https://music.apple.com/kr/song/${appleMusicId}?${params}`;
}

interface AppleMusicBadgeProps {
  appleMusicId: string;
  className?: string;
}

function AppleMusicBadge({ appleMusicId, className }: AppleMusicBadgeProps) {
  return (
    <a
      className={cn("inline-flex h-4 shrink-0", className)}
      href={appleMusicSongUrl(appleMusicId)}
      // 목록 행 안에 있어서 눌러도 행(선택곡 추가 등)이 같이 눌리지 않게 한다.
      onClick={innerClick()}
      rel="noopener noreferrer"
      target="_blank"
    >
      <img
        alt="Apple Music에서 감상하세요"
        className="h-full w-auto"
        src={BADGE_SRC}
      />
    </a>
  );
}

export default AppleMusicBadge;
