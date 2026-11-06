import {
  FormControl,
  FormErrorMessage,
  FormField,
  FormLabel,
  FormMessage,
  TextField,
  TextFieldButton,
  Typography,
} from "@wanteddev/wds";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import BottomActionArea from "@/components/ui/BottomActionArea";
import ScreenHeader from "@/components/ui/ScreenHeader";
import StepProgress from "@/components/ui/StepProgress";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import { ME_ID, USERS } from "@/mocks/data";

interface NicknameLocationState {
  /** 카카오 닉네임(약관 동의) 또는 이메일 가입 이름 — 서버가 임시 닉네임으로 쓰는 값 */
  nickname?: string;
}

type CheckResult = "available" | "taken";

// GET /users/nickname/check 자리. 다른 사용자가 이미 쓰는 닉네임이면 막는다(내 임시 닉네임은 그대로 써도 된다).
function isNicknameTaken(nickname: string): boolean {
  return USERS.some((user) => user.id !== ME_ID && user.nickname === nickname);
}

// Figma: 온보딩/03 프로필 설정 - 닉네임 (nodeId 101:11375). 프로필 설정 3단계 중 1단계.
// Figma 플로우에 "[GET /users/nickname/check, 확인필요]"가 붙어 있어 입력칸 안에 중복 확인 버튼을 두고,
// 확인을 통과한 닉네임일 때만 다음으로 넘어간다. 닉네임을 고치면 다시 확인해야 한다.
function OnboardingNicknameScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialNickname =
    (location.state as NicknameLocationState | null)?.nickname ?? "";
  const [nickname, setNickname] = useState(initialNickname);
  // 어떤 닉네임을 확인했는지까지 들고 있어야 입력이 바뀌면 결과를 무효로 볼 수 있다.
  const [checked, setChecked] = useState<{
    nickname: string;
    result: CheckResult;
  } | null>(null);

  useScreenHeader(<ScreenHeader />);

  const trimmed = nickname.trim();
  const result = checked?.nickname === trimmed ? checked.result : undefined;

  const checkNickname = () => {
    setChecked({
      nickname: trimmed,
      result: isNicknameTaken(trimmed) ? "taken" : "available",
    });
  };

  return (
    <div className="flex h-full w-full flex-col bg-background">
      <div className="scrollbar-hidden flex flex-1 flex-col gap-7 overflow-y-auto px-5 pt-2">
        <StepProgress current={1} total={3} />
        <div className="flex flex-col gap-2">
          <Typography
            color="semantic.label.strong"
            variant="title3"
            weight="bold"
          >
            어떻게 불러드릴까요?
          </Typography>
          <Typography
            color="semantic.label.assistive"
            variant="label1"
            weight="regular"
          >
            모임과 팀에서 보여질 이름이에요
          </Typography>
        </div>
        <FormField>
          <FormLabel>닉네임</FormLabel>
          <FormControl>
            <TextField
              autoComplete="nickname"
              invalid={result === "taken"}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="닉네임을 입력해 주세요"
              positive={result === "available"}
              trailingButton={
                <TextFieldButton
                  disabled={trimmed === "" || result !== undefined}
                  onClick={checkNickname}
                >
                  중복 확인
                </TextFieldButton>
              }
              value={nickname}
            />
          </FormControl>
          {result === "taken" ? (
            <FormErrorMessage>
              이미 다른 사람이 쓰고 있는 닉네임이에요
            </FormErrorMessage>
          ) : (
            <FormMessage
              color={
                result === "available"
                  ? "semantic.status.positive"
                  : "semantic.label.alternative"
              }
            >
              {result === "available"
                ? "사용할 수 있는 닉네임이에요"
                : "중복 확인을 해 주세요"}
            </FormMessage>
          )}
        </FormField>
      </div>
      <BottomActionArea
        disabled={result !== "available"}
        label="다음"
        onClick={() => navigate("/onboarding/session")}
      />
    </div>
  );
}

export default OnboardingNicknameScreen;
