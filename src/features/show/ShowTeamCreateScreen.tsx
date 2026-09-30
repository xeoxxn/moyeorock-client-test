import { Button, Option, Select, TextField, Typography } from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

// Figma: 공연/05 공연 팀 만들기 (nodeId 142:19452)
function ShowTeamCreateScreen() {
  const navigate = useNavigate();
  const [session, setSession] = useState("vocal");

  useScreenHeader(
    <ScreenHeader
      leading={
        <button onClick={() => navigate(-1)} type="button">
          <IconChevronLeft className="size-6 text-label-normal" />
        </button>
      }
      title="공연 팀 만들기"
      variant="normal"
    />,
  );

  return (
    <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto">
      <div className="flex flex-1 flex-col gap-5 px-5 pt-2 pb-5">
        <Typography
          as="p"
          color="semantic.label.normal"
          variant="headline1"
          weight="bold"
        >
          2026 가을 정기공연에 참가할
          <br />
          팀을 만들어요
        </Typography>

        <label className="flex flex-col gap-2">
          <Typography
            color="semantic.label.normal"
            variant="label1"
            weight="bold"
          >
            팀 이름
          </Typography>
          <TextField placeholder="팀 이름 입력" width="100%" />
        </label>

        <label className="flex flex-col gap-2">
          <Typography
            color="semantic.label.normal"
            variant="label1"
            weight="bold"
          >
            팀 소개
          </Typography>
          <TextField placeholder="어떤 음악을 연주하나요?" width="100%" />
        </label>

        <label className="flex flex-col gap-2">
          <Typography
            color="semantic.label.normal"
            variant="label1"
            weight="bold"
          >
            내 연주 세션
          </Typography>
          <Select onChange={setSession} value={session} width="100%">
            <Option value="vocal">보컬</Option>
            <Option value="guitar">기타</Option>
            <Option value="bass">베이스</Option>
            <Option value="drum">드럼</Option>
            <Option value="keyboard">키보드</Option>
          </Select>
        </label>

        <label className="flex flex-col gap-2">
          <Typography
            color="semantic.label.normal"
            variant="label1"
            weight="bold"
          >
            함께할 세션 모집 (선택)
          </Typography>
          <TextField placeholder="예: 드럼 1명, 베이스 1명" width="100%" />
        </label>

        <div className="rounded-xl bg-surface p-3.5">
          <Typography
            color="semantic.label.normal"
            variant="label2"
            weight="medium"
          >
            팀을 만들면 공연 참가 팀으로 바로 등록돼요.
          </Typography>
        </div>
      </div>
      <div className="flex shrink-0 flex-col bg-surface-elevated px-5 pt-3 pb-[34px]">
        <Button
          className="shadow-neon-sm"
          color="primary"
          fullWidth
          size="large"
          variant="solid"
        >
          팀 만들고 참가하기
        </Button>
      </div>
    </div>
  );
}

export default ShowTeamCreateScreen;
