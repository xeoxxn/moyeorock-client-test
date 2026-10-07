import { Button, TextArea, TextField, Typography } from "@wanteddev/wds";
import { IconClose } from "@wanteddev/wds-icon";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

// Figma: 공연/03 공연 만들기 (nodeId 101:23994)
// 백엔드가 붙기 전까지 "방금 만든 공연"을 가리킬 고정 id. 완료 화면이 이 값으로 상세를 연다.
const NEW_SHOW_ID = "fall-2026";

function ShowCreateScreen() {
  const navigate = useNavigate();

  useScreenHeader(
    <ScreenHeader
      leading={
        <button onClick={() => navigate(-1)} type="button">
          <IconClose className="size-6 text-label-normal" />
        </button>
      }
      title="공연 만들기"
      variant="normal"
    />,
  );

  return (
    <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto">
      <div className="flex flex-1 flex-col gap-4.5 px-5 pt-2 pb-6">
        <div className="rounded-xl bg-surface p-3.5">
          <Typography
            color="semantic.label.normal"
            variant="label1"
            weight="medium"
          >
            프로젝트 모임에서 운영할 공연이에요.
          </Typography>
        </div>

        <label className="flex flex-col gap-2" htmlFor="show-name">
          <Typography
            color="semantic.label.normal"
            variant="label1"
            weight="bold"
          >
            공연 이름
          </Typography>
          <TextField
            defaultValue="2026 가을 정기공연"
            id="show-name"
            width="100%"
          />
        </label>

        <div className="flex gap-2">
          <label className="flex flex-1 flex-col gap-2" htmlFor="show-date">
            <Typography
              color="semantic.label.normal"
              variant="label1"
              weight="bold"
            >
              공연 날짜
            </Typography>
            <TextField defaultValue="2026-10-17" id="show-date" width="100%" />
          </label>
          <label className="flex flex-1 flex-col gap-2" htmlFor="show-time">
            <Typography
              color="semantic.label.normal"
              variant="label1"
              weight="bold"
            >
              시작 시간
            </Typography>
            <TextField defaultValue="18:00" id="show-time" width="100%" />
          </label>
        </div>

        <label className="flex flex-col gap-2" htmlFor="show-place">
          <Typography
            color="semantic.label.normal"
            variant="label1"
            weight="bold"
          >
            장소
          </Typography>
          <TextField defaultValue="홍대 롤링홀" id="show-place" width="100%" />
        </label>

        <label className="flex flex-col gap-2" htmlFor="show-description">
          <Typography
            color="semantic.label.normal"
            variant="label1"
            weight="bold"
          >
            공연 설명
          </Typography>
          <TextArea
            id="show-description"
            minRows={2}
            placeholder="공연을 소개해 주세요"
            width="100%"
          />
        </label>
      </div>
      <div className="flex shrink-0 flex-col gap-2 bg-surface-elevated px-5 pt-3 pb-[34px]">
        <Button
          color="primary"
          fullWidth
          size="large"
          variant="solid"
          onClick={() => navigate(`/show/${NEW_SHOW_ID}/complete`)}
        >
          공연 만들기
        </Button>
      </div>
    </div>
  );
}

export default ShowCreateScreen;
