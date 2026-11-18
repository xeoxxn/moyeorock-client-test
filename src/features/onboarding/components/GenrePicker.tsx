import { Chip, FormField, FormLabel } from "@wanteddev/wds";

import { fieldLabelSx } from "@/components/ui/FieldLabel";
import { GENRE_LABEL, GENRE_OPTIONS } from "@/lib/domain/labels";
import type { Genre } from "@/lib/domain/types";

// 좋아하는 장르 고르기(여러 개) — 온보딩 3단계와 마이의 프로필 편집이 같이 쓴다. 폭이 제각각인 칩이
// 줄마다 다르게 꺾이지 않게 3열 같은 폭으로 둔다(세션 타일과 같은 규칙).
interface GenrePickerProps {
  label: string;
  value: Genre[];
  onChange: (next: Genre[]) => void;
}

const fillChipSx = { justifyContent: "center", width: "100%" };

function GenrePicker({ label, onChange, value }: GenrePickerProps) {
  const toggle = (genre: Genre) =>
    onChange(
      value.includes(genre)
        ? value.filter((item) => item !== genre)
        : [...value, genre],
    );

  return (
    <FormField>
      <FormLabel sx={fieldLabelSx}>{label}</FormLabel>
      <div className="grid grid-cols-3 gap-2">
        {GENRE_OPTIONS.map((genre) => (
          <Chip
            active={value.includes(genre)}
            key={genre}
            onClick={() => toggle(genre)}
            size="large"
            sx={fillChipSx}
            variant="outlined"
          >
            {GENRE_LABEL[genre]}
          </Chip>
        ))}
      </div>
    </FormField>
  );
}

export default GenrePicker;
