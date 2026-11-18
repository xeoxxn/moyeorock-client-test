import {
  ActionArea,
  ActionAreaButton,
  Modal,
  ModalContainer,
  ModalContent,
  ModalContentItem,
  Typography,
} from "@wanteddev/wds";
import type { ReactNode } from "react";

import { closeWhenHidden } from "@/components/ui/BottomSheet";

// Figma "17 확정 시트"(429:16270) — 되돌리기 어려운 결정을 아래 시트로 한 번 더 묻는다: 큰 질문 +
// 한두 줄 설명 + 닫기 · 확인(가로 두 버튼). 공연에 넘기기·셋리스트 확정·나가기·삭제처럼 화면 맥락을
// 가리지 않아야 하는 확인은 가운데 대화상자(useAppAlert) 대신 이걸 쓴다.
interface ConfirmSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
}

function ConfirmSheet({
  cancelLabel = "닫기",
  confirmLabel,
  description,
  onConfirm,
  onOpenChange,
  open,
  title,
}: ConfirmSheetProps) {
  return (
    <Modal
      onOpenChange={onOpenChange}
      onVisibilityChange={closeWhenHidden(onOpenChange)}
      open={open}
    >
      <ModalContainer handle variant="bottom">
        <ModalContent>
          <ModalContentItem flexDirection="column" gap="0.5rem">
            <Typography
              as="h2"
              color="semantic.label.strong"
              variant="heading2"
              weight="bold"
            >
              {title}
            </Typography>
            {description && (
              <Typography
                className="whitespace-pre-line"
                color="semantic.label.alternative"
                variant="body2"
              >
                {description}
              </Typography>
            )}
          </ModalContentItem>
        </ModalContent>
        <ActionArea variant="neutral">
          <ActionAreaButton
            onClick={() => onOpenChange(false)}
            variant="alternative"
          >
            {cancelLabel}
          </ActionAreaButton>
          <ActionAreaButton
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            variant="main"
          >
            {confirmLabel}
          </ActionAreaButton>
        </ActionArea>
      </ModalContainer>
    </Modal>
  );
}

export default ConfirmSheet;
