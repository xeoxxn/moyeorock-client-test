import {
  Button,
  Modal,
  ModalContainer,
  ModalContent,
  ModalDescription,
  ModalHeading,
} from "@wanteddev/wds";

// Figma: 팀/12 팀 해체 확인 (nodeId 142:20222) — 전체 화면이 아니라 팀 관리 화면 위에 뜨는
// 확인 모달이라 별도 라우트로 만들지 않고 TeamManageScreen에서 여는 컴포넌트로 뺐다.
interface TeamDisbandConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamName: string;
  memberCount: number;
  onConfirm: () => void;
}

function TeamDisbandConfirmModal({
  open,
  onOpenChange,
  teamName,
  memberCount,
  onConfirm,
}: TeamDisbandConfirmModalProps) {
  return (
    <Modal onOpenChange={onOpenChange} open={open}>
      <ModalContainer size="small" variant="popup">
        <ModalHeading>{teamName}를 해체할까요?</ModalHeading>
        <ModalDescription>
          팀원 {memberCount}명 모두 팀에서 나가게 되고,
          <br />
          합주 일정과 셋리스트도 함께 사라져요.
        </ModalDescription>
        <ModalContent className="flex-row gap-2 pt-3">
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
            color="primary"
            fullWidth
            onClick={onConfirm}
            size="medium"
            variant="solid"
          >
            해체하기
          </Button>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
}

export default TeamDisbandConfirmModal;
