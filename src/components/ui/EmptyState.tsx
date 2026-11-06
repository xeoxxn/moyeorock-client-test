import {
  FallbackView,
  FallbackViewButton,
  FallbackViewContent,
  FallbackViewText,
} from "@wanteddev/wds";

// 목록이 비었을 때(일정 없음 · 저장한 항목 없음 · 없는 화면) — WDS `FallbackView`.
interface EmptyStateProps {
  title?: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

function EmptyState({ action, description, title }: EmptyStateProps) {
  return (
    <FallbackView padding="compact" platform="mobile">
      <FallbackViewContent>
        <FallbackViewText description={description} title={title} />
      </FallbackViewContent>
      {action && (
        <FallbackViewButton
          color="assistive"
          onClick={action.onClick}
          size="medium"
          variant="outlined"
        >
          {action.label}
        </FallbackViewButton>
      )}
    </FallbackView>
  );
}

export default EmptyState;
