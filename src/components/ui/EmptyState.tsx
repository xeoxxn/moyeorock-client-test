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

// WDS 모바일 FallbackView는 폭이 335px로 고정이고 스스로 가운데로 오지 않아서, 감싼 화면이 가운데
// 정렬을 하지 않으면 왼쪽에 붙는다 — 여기서 화면 폭을 다 차지하는 줄로 감싸 늘 가운데에 둔다.
// 그림 자리(FallbackViewImage)는 128×128로 고정이고 안의 svg를 100%로 늘려서, 얇은 파형이 큰 덩어리가
// 된다 — 그림 자리를 파형 한 줄 크기(192×8, Figma 15)로 덮는다.
const WAVEFORM_IMAGE_SX = { height: 8, width: 192 };

function EmptyState({ action, description, title }: EmptyStateProps) {
  return (
    <div className="flex w-full justify-center">
      <FallbackView padding="compact" platform="mobile">
        <FallbackViewImage sx={WAVEFORM_IMAGE_SX}>
          <Waveform className="text-label-assistive" />
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
    </div>
  );
}

export default EmptyState;
