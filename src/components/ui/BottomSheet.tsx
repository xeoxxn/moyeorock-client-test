import {
  Modal,
  ModalClose,
  ModalContainer,
  ModalContent,
  ModalContentItem,
  ModalNavigation,
} from "@wanteddev/wds";
import type { ReactNode } from "react";

// 아래에서 올라오는 시트(곡 추가 · 파트 선택 · 구간 피드백 · 지원하기 …) — WDS Modal bottom.
// 위쪽 손잡이(Figma "Sheet/Handle" 538:22436)는 WDS handle로 그리고, 제목은 왼쪽 큰 글자(display)다.
// 닫기 버튼은 Figma에서 구간 피드백처럼 내용이 긴 시트에만 있어 closable로 켠다.
// 하단 버튼이 필요하면 footer에 WDS ActionArea(BottomActionArea의 inSheet)를 넘긴다.
interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  closable?: boolean;
  children: ReactNode;
  footer?: ReactNode;
}

function BottomSheet({
  children,
  closable = false,
  footer,
  onOpenChange,
  open,
  title,
}: BottomSheetProps) {
  return (
    <Modal onOpenChange={onOpenChange} open={open}>
      <ModalContainer handle variant="bottom">
        {title !== undefined && (
          <ModalNavigation
            sx={{
              "& [data-role='navigation-title'] h2": {
                fontSize: "1.25rem",
                lineHeight: "1.75rem",
              },
            }}
            trailingContent={closable ? <ModalClose /> : undefined}
            variant="display"
          >
            {title}
          </ModalNavigation>
        )}
        {/* 좌우 여백은 ModalContent가 아니라 ModalContentItem이 준다(WDS 구조). */}
        <ModalContent>
          <ModalContentItem flexDirection="column">{children}</ModalContentItem>
        </ModalContent>
        {footer}
      </ModalContainer>
    </Modal>
  );
}

export default BottomSheet;
