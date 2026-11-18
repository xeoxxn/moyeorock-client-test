import { List, ListCell } from "@wanteddev/wds";
import type { ReactNode } from "react";

import BottomSheet from "@/components/ui/BottomSheet";
import { rowClick } from "@/components/ui/listCellEvents";

// 더보기(⋮)를 누르면 올라오는 짧은 동작 목록 — 선택곡 한 곡(공연에 넘기기·빼기), 팀원 한 명(팀장
// 넘기기·세션 변경·내보내기), 팀 나가기. 항목을 고르면 시트를 닫고 그 동작을 부른다.
// 되돌리기 어려운 동작은 부른 쪽에서 ConfirmSheet로 한 번 더 묻는다.
export interface ActionSheetItem {
  label: string;
  caption?: string;
  /** 나가기·내보내기처럼 빼는 동작 */
  destructive?: boolean;
  onSelect: () => void;
}

interface ActionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  items: ActionSheetItem[];
}

function ActionSheet({ items, onOpenChange, open, title }: ActionSheetProps) {
  return (
    <BottomSheet onOpenChange={onOpenChange} open={open} title={title}>
      <List>
        {items.map((item) => (
          <ListCell
            key={item.label}
            onClick={rowClick(() => {
              onOpenChange(false);
              item.onSelect();
            })}
            textProps={{
              caption: item.caption,
              captionProps: { color: "semantic.label.alternative" },
              color: item.destructive
                ? "semantic.status.negative"
                : "semantic.label.strong",
              weight: "medium",
            }}
            verticalPadding="medium"
          >
            {item.label}
          </ListCell>
        ))}
      </List>
    </BottomSheet>
  );
}

export default ActionSheet;
