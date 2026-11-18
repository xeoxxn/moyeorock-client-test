import {
  FormControl,
  FormErrorMessage,
  FormField,
  FormLabel,
  FormMessage,
  TextField,
  TextFieldButton,
} from "@wanteddev/wds";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BottomActionArea from "@/components/ui/BottomActionArea";
import { fieldLabelSx } from "@/components/ui/FieldLabel";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import StepProgress from "@/components/ui/StepProgress";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import StepHeading from "@/features/onboarding/components/StepHeading";
import { isNicknameTaken } from "@/mocks/selectors";

interface NicknameLocationState {
  /** 카카오 닉네임(약관 동의) 또는 이메일 가입 이름 — 서버가 임시 닉네임으로 쓰는 값 */
  nickname?: string;
}

type CheckResult = "available" | "taken";

// 프로필 설정 3단계 중 1단계(Figma 22와 같은 모양 — 진행 바 + 질문 + 입력). 입력칸 안 "중복 확인"을
// 통과한 닉네임일 때만 다음으로 넘어가고, 닉네임을 고치면 다시 확인해야 한다.
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

  useScreenHeader(useMemo(() => <ScreenHeader />, []));

  const trimmed = nickname.trim();
  const result = checked?.nickname === trimmed ? checked.result : undefined;

  const checkNickname = () => {
    setChecked({
      nickname: trimmed,
      result: isNicknameTaken(trimmed) ? "taken" : "available",
    });
  };

  return (
    <>
      <ScreenBody className="px-5 pt-5">
        <StepProgress current={1} total={3} />
        <div className="mt-8 mb-8">
          <StepHeading
            description="모임과 팀에서 보여질 이름이에요"
            title="어떻게 불러드릴까요?"
          />
        </div>
        <FormField>
          <FormLabel sx={fieldLabelSx}>닉네임</FormLabel>
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
              width="100%"
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
      </ScreenBody>
      <BottomActionArea
        disabled={result !== "available"}
        label="다음"
        onClick={() => navigate("/onboarding/session")}
      />
    </>
  );
}

export default OnboardingNicknameScreen;
