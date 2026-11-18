import {
  List,
  ListCell,
  ListCellContent,
  RadioGroup,
  RadioGroupItem,
} from "@wanteddev/wds";
import type { ReactNode } from "react";

import { rowClick } from "@/components/ui/listCellEvents";

// 하나만 고르는 목록(팀 종류 · 참가할 공연) — WDS RadioGroup + ListCell. 왼쪽 커버 + 이름 + 설명
// (여러 줄 그대로) + 오른쪽 라디오. 행 어디를 눌러도 고른다.
export interface RadioOption {
  value: string;
  title: ReactNode;
  caption?: ReactNode;
  leading?: ReactNode;
}

interface RadioOptionListProps {
  options: RadioOption[];
  value: string;
  onValueChange: (value: string) => void;
}

function RadioOptionList({
  onValueChange,
  options,
  value,
}: RadioOptionListProps) {
  return (
    <RadioGroup onValueChange={onValueChange} value={value}>
      <List>
        {options.map((option) => (
          <ListCell
            alignItems="center"
            fillWidth
            key={option.value}
            leadingContent={
              option.leading && (
                <ListCellContent variant="custom">
                  {option.leading}
                </ListCellContent>
              )
            }
            onClick={rowClick(() => onValueChange(option.value))}
            sx={{ gap: "0.875rem" }}
            textProps={{
              caption: option.caption,
              captionProps: {
                color: "semantic.label.alternative",
                variant: "label2",
              },
              color: "semantic.label.strong",
              variant: "body1",
              weight: "bold",
            }}
            trailingContent={
              <ListCellContent variant="radio">
                <RadioGroupItem value={option.value} />
              </ListCellContent>
            }
            verticalPadding="medium"
          >
            {option.title}
          </ListCell>
        ))}
      </List>
    </RadioGroup>
  );
}

export default RadioOptionList;
