import {
  Modal,
  ModalClose,
  ModalContainer,
  ModalContent,
  ModalContentItem,
  ModalNavigation,
} from "@wanteddev/wds";
import type { ReactNode } from "react";

// 아래에서 올라오는 시트(멤버 관리 · 지원하기 · 팀 초대 …) — WDS `Modal`의 bottom 변형.
// 데스크톱 컬럼(480px)에서도 WDS가 시트 폭을 480px로 묶어 줘서 앱 프레임과 폭이 맞는다.
// 하단 버튼이 필요하면 footer에 WDS `ActionArea`를 넘긴다(Modal이 스크롤·그라데이션을 맞춰 준다).
interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

function BottomSheet({
  children,
  footer,
  onOpenChange,
  open,
  title,
}: BottomSheetProps) {
  return (
    <Modal onOpenChange={onOpenChange} open={open}>
      <ModalContainer variant="bottom">
        {title !== undefined && (
          <ModalNavigation trailingContent={<ModalClose />} variant="normal">
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
