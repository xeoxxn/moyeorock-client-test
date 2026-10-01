import { Button, Typography } from "@wanteddev/wds";
import { IconChevronDown, IconChevronLeft } from "@wanteddev/wds-icon";
import { useNavigate } from "react-router-dom";

import { useScreenHeader } from "@/components/ui/useScreenHeader";

// Figma: 모임/09 모임 만들기 - 2단계 (nodeId 101:21112). 3단계 중 마지막 — 활동 지역만 받는다.
function CrewNewStep2Screen() {
  const navigate = useNavigate();

  useScreenHeader(
    <div className="flex h-14 w-full items-center gap-3 px-5">
      <button onClick={() => navigate(-1)} type="button">
        <IconChevronLeft className="size-6 text-label-normal" />
      </button>
      <Typography
        color="semantic.label.normal"
        variant="headline2"
        weight="bold"
      >
        모임 만들기
      </Typography>
    </div>,
  );

  return (
    <div className="flex h-full flex-col">
      <div className="scrollbar-hidden flex flex-1 flex-col gap-6 overflow-y-auto px-5 pt-2 pb-5">
        <div className="flex gap-1">
          <div className="h-1 flex-1 rounded-full bg-accent-strong shadow-neon-sm" />
          <div className="h-1 flex-1 rounded-full bg-accent-strong shadow-neon-sm" />
          <div className="h-1 flex-1 rounded-full bg-accent-strong shadow-neon-sm" />
        </div>
        <div className="flex flex-col gap-2">
          <Typography
            color="semantic.label.normal"
            variant="title3"
            weight="bold"
          >
            마지막으로
            <br />
            활동 정보를 알려주세요
          </Typography>
          <Typography
            color="semantic.label.alternative"
            variant="body2"
            weight="regular"
          >
            모임 소개와 함께 보여져요
          </Typography>
        </div>
        <div className="flex flex-col gap-2">
          <Typography
            color="semantic.label.normal"
            variant="label1"
            weight="bold"
          >
            활동 지역
          </Typography>
          <button
            className="flex w-full items-center gap-2 rounded-xl bg-surface p-3"
            type="button"
          >
            <Typography
              className="flex-1 text-left"
              color="semantic.label.normal"
              variant="body1"
              weight="regular"
            >
              서울
            </Typography>
            <IconChevronDown className="size-4 text-label-normal" />
          </button>
        </div>
      </div>
      <div className="shrink-0 px-5 pt-3 pb-[34px]">
        <Button
          color="primary"
          fullWidth
          onClick={() => navigate("/crew/create/complete")}
          size="large"
          sx={{ backgroundColor: "var(--color-accent-strong)" }}
          variant="solid"
        >
          모임 만들기
        </Button>
      </div>
    </div>
  );
}

export default CrewNewStep2Screen;
