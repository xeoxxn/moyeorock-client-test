import { Button, Option, Select, TextField, Typography } from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

// Figma: 팀/09 독립 팀 만들기 (nodeId 101:23564)
function TeamNewIndependentScreen() {
  const navigate = useNavigate();
  const [session, setSession] = useState("vocal");

  useScreenHeader(
    <ScreenHeader
      leading={
        <button onClick={() => navigate(-1)} type="button">
          <IconChevronLeft className="size-6 text-label-normal" />
        </button>
      }
      title="독립 팀 만들기"
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
          모임 가입 없이 팀을 만들고
          <br />
          합주를 시작할 수 있어요
        </Typography>

        <label className="flex flex-col gap-2" htmlFor="independent-team-name">
          <Typography
            color="semantic.label.normal"
            variant="label1"
            weight="bold"
          >
            팀 이름
          </Typography>
          <TextField
            id="independent-team-name"
            placeholder="팀 이름 입력"
            width="100%"
          />
        </label>

        <label className="flex flex-col gap-2" htmlFor="independent-team-intro">
          <Typography
            color="semantic.label.normal"
            variant="label1"
            weight="bold"
          >
            팀 소개
          </Typography>
          <TextField
            id="independent-team-intro"
            placeholder="어떤 음악을 연주하나요?"
            width="100%"
          />
        </label>

        <label
          className="flex flex-col gap-2"
          htmlFor="independent-team-session"
        >
          <Typography
            color="semantic.label.normal"
            variant="label1"
            weight="bold"
          >
            내 연주 세션
          </Typography>
          <Select
            id="independent-team-session"
            onChange={setSession}
            value={session}
            width="100%"
          >
            <Option value="vocal">보컬</Option>
            <Option value="guitar">기타</Option>
            <Option value="bass">베이스</Option>
            <Option value="drum">드럼</Option>
            <Option value="keyboard">키보드</Option>
          </Select>
        </label>

        <label
          className="flex flex-col gap-2"
          htmlFor="independent-team-recruit"
        >
          <Typography
            color="semantic.label.normal"
            variant="label1"
            weight="bold"
          >
            함께할 세션 모집 (선택)
          </Typography>
          <TextField
            id="independent-team-recruit"
            placeholder="예: 드럼 1명, 베이스 1명"
            width="100%"
          />
        </label>

        <div className="rounded-xl bg-surface p-3.5">
          <Typography
            color="semantic.label.normal"
            variant="label2"
            weight="medium"
          >
            내가 팀장이 되어 시작해요.
          </Typography>
        </div>
      </div>
      <div className="flex shrink-0 flex-col bg-surface-elevated px-5 pt-3 pb-[34px]">
        <Button
          color="primary"
          fullWidth
          onClick={() => navigate("/team")}
          size="large"
          variant="solid"
        >
          팀 만들고 시작하기
        </Button>
      </div>
    </div>
  );
}

export default TeamNewIndependentScreen;
