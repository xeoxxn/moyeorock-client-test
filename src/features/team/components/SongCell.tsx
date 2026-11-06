import { ListCell, ListCellContent, Typography } from "@wanteddev/wds";
import type { ReactNode } from "react";

import type { SongSummary } from "@/lib/domain/types";

// 순번 + 곡 제목 + 아티스트 한 줄 — 팀 홈 미리보기·선택곡·팀 공연 셋리스트가 같은 모양을 쓴다.
// 곡 상세 화면이 없어서 행 자체는 누를 곳이 없다(disableInteraction).
interface SongCellProps {
  order: number;
  song: SongSummary;
  /** 아티스트 대신(또는 덧붙여) 보여줄 보조 문구 */
  caption?: ReactNode;
  /** 오른쪽 배지·버튼. ListCellContent로 감싸서 넘긴다. */
  trailing?: ReactNode;
}

function SongCell({ caption, order, song, trailing }: SongCellProps) {
  return (
    <ListCell
      alignItems="center"
      disableInteraction
      leadingContent={
        <ListCellContent>
          <Typography
            className="w-7 tabular-nums"
            color="semantic.label.disable"
            variant="headline2"
            weight="bold"
          >
            {String(order).padStart(2, "0")}
          </Typography>
        </ListCellContent>
      }
      // ListCell은 행 어디를 눌러도 안쪽 첫 버튼을 대신 눌러 준다. 오른쪽에 삭제 버튼이 있을 때
      // 행을 스치기만 해도 곡이 빠지지 않게 행 누름을 막는다(버튼 자체 클릭은 그대로 동작).
      onClick={(event) => event.preventDefault()}
      textProps={{
        caption: caption ?? song.artist,
        captionProps: {
          color: "semantic.label.assistive",
          variant: "label2",
          weight: "medium",
        },
        weight: "bold",
      }}
      trailingContent={trailing}
      verticalPadding="small"
    >
      {song.title}
    </ListCell>
  );
}

export default SongCell;
