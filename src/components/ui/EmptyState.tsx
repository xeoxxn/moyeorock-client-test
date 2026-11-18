import {
  FallbackView,
  FallbackViewButton,
  FallbackViewContent,
  FallbackViewImage,
  FallbackViewText,
} from "@wanteddev/wds";

import Waveform from "@/components/music/Waveform";

// 목록이 비었을 때(Figma 15 빈 상태) — WDS FallbackView. 그림 대신 얇은 녹음 파형 한 줄을 두고,
// 다음 행동이 있으면 작은 주홍 버튼("녹음 올리기")을 둔다. 없는 화면·권한 없음 안내에도 쓴다.
interface EmptyStateProps {
  title?: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

function EmptyState({ action, description, title }: EmptyStateProps) {
  return (
    <FallbackView padding="compact" platform="mobile">
      <FallbackViewImage>
        <Waveform className="h-2 w-48 text-label-assistive" />
      </FallbackViewImage>
      <FallbackViewContent>
        <FallbackViewText
          description={description}
          sx={{ whiteSpace: "pre-line" }}
          title={title}
        />
      </FallbackViewContent>
      {action && (
        <FallbackViewButton
          color="primary"
          onClick={action.onClick}
          size="medium"
          variant="solid"
        >
          {action.label}
        </FallbackViewButton>
      )}
    </FallbackView>
  );
}

export default EmptyState;
