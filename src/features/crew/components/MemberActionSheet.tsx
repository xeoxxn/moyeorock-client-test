import { Typography } from "@wanteddev/wds";
import { createPortal } from "react-dom";

import { useScreenSheetPortal } from "@/components/ui/useScreenSheetPortal";
import type { CrewMember } from "@/features/crew/components/MemberRow";

interface MemberActionSheetProps {
  member: CrewMember | null;
  onClose: () => void;
}

// Figma: 모임/14 멤버 관리 시트(nodeId 142:20947) — 멤버 탭에서 구성원을 탭하면 뜨는 바텀시트.
// ScreenLayout이 화면 프레임 최상단에 마련해 둔 시트 포털(useScreenSheetPortal)에 그려서,
// 브라우저 전체가 아니라 375~480 폭 프레임 안에서만 딤 처리된다.
function MemberActionSheet({ member, onClose }: MemberActionSheetProps) {
  const portalEl = useScreenSheetPortal();

  if (!member || !portalEl) {
    return null;
  }

  return createPortal(
    <div className="pointer-events-auto absolute inset-0">
      <button
        aria-label="닫기"
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
        type="button"
      />
      <div className="absolute right-0 bottom-0 left-0 flex flex-col gap-1 rounded-t-3xl bg-surface-elevated px-6 pt-3 pb-10">
        <div className="mx-auto h-1 w-10 rounded-full bg-white/10" />
        <div className="flex flex-col gap-0.5 pt-3 pb-2">
          <Typography
            color="semantic.label.normal"
            variant="heading2"
            weight="bold"
          >
            {member.name}
          </Typography>
          <Typography
            color="semantic.label.alternative"
            variant="label1"
            weight="regular"
          >
            {member.part}
            {member.isOwner ? " · 운영진" : ""}
          </Typography>
        </div>
        <button
          className="flex h-14 items-center text-left"
          onClick={onClose}
          type="button"
        >
          <Typography
            color="semantic.label.normal"
            variant="body1"
            weight="medium"
          >
            모임장 위임하기
          </Typography>
        </button>
        <button
          className="flex h-14 items-center text-left"
          onClick={onClose}
          type="button"
        >
          <Typography
            color="semantic.label.normal"
            variant="body1"
            weight="medium"
          >
            일반 구성원으로 변경
          </Typography>
        </button>
        <button
          className="flex h-14 items-center text-left"
          onClick={onClose}
          type="button"
        >
          <Typography
            className="text-glow-sm"
            color="semantic.primary.strong"
            variant="body1"
            weight="medium"
          >
            모임에서 내보내기
          </Typography>
        </button>
      </div>
    </div>,
    portalEl,
  );
}

export default MemberActionSheet;
