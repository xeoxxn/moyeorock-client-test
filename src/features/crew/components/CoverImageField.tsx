import { FormField, FormLabel, Typography, useToast } from "@wanteddev/wds";
import { IconPlus } from "@wanteddev/wds-icon";

import PressableCard from "@/components/ui/PressableCard";

// 모임 대표 이미지(coverImage) 자리 — 모임 만들기 2단계와 모임 관리가 함께 쓴다. 서버는 이미지 URL만
// 받고 업로드 API는 아직 없어서, 누르면 준비 중이라고만 알린다(눌러도 아무 반응 없는 버튼이 되지 않게).
function CoverImageField() {
  const toast = useToast();

  return (
    <FormField>
      <FormLabel>대표 이미지 (선택)</FormLabel>
      <PressableCard
        aria-label="대표 이미지 올리기"
        onClick={() =>
          toast({
            content: "이미지 업로드는 준비 중이에요",
            variant: "cautionary",
          })
        }
      >
        <div className="flex flex-col items-center gap-1.5 py-3 text-label-alternative [&>svg]:size-6">
          <IconPlus />
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="medium"
          >
            이미지 업로드
          </Typography>
        </div>
      </PressableCard>
    </FormField>
  );
}

export default CoverImageField;
