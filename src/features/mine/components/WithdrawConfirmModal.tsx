import {
  Button,
  Modal,
  ModalContainer,
  ModalContent,
  ModalDescription,
  ModalHeading,
} from "@wanteddev/wds";

interface WithdrawConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

// Figma: 마이/07 회원 탈퇴 확인 (nodeId 142:20559) — 별도 화면이 아니라 마이 화면 위에 뜨는
// 팝업 모달이다(Dim + 중앙 카드). 그래서 라우트를 만들지 않고 컴포넌트로 뺐다.
function WithdrawConfirmModal({
  open,
  onOpenChange,
  onConfirm,
}: WithdrawConfirmModalProps) {
  return (
    <Modal onOpenChange={onOpenChange} open={open}>
      <ModalContainer size="small" variant="popup">
        <ModalContent>
          <ModalHeading
            color="semantic.label.normal"
            variant="headline1"
            weight="bold"
          >
            정말 탈퇴할까요?
          </ModalHeading>
          <ModalDescription
            color="semantic.label.alternative"
            variant="body2"
            weight="regular"
          >
            소속 모임·팀과 활동 기록이 모두 삭제되고
            <br />
            되돌릴 수 없어요.
          </ModalDescription>
          <div className="flex gap-2 pt-3">
            <Button
              color="assistive"
              fullWidth
              onClick={() => onOpenChange(false)}
              size="medium"
              sx={{ backgroundColor: "var(--color-surface)" }}
              variant="outlined"
            >
              취소
            </Button>
            <Button
              className="shadow-neon-sm"
              color="primary"
              fullWidth
              onClick={onConfirm}
              size="medium"
              variant="solid"
            >
              탈퇴하기
            </Button>
          </div>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
}

export default WithdrawConfirmModal;
