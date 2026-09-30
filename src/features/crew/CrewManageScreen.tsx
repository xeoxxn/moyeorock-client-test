import { Button, TextArea, TextField, Typography } from "@wanteddev/wds";
import { IconPlus } from "@wanteddev/wds-icon";
import { useNavigate, useParams } from "react-router-dom";

// Figma: 모임 관리 탭 본문(nodeId 101:20366) — 모임 정보 수정 폼 + 바로가기 링크(가입 신청
// 관리·공지 작성). "이미지 업로드"는 아직 실제 업로드를 연결하지 않은 자리표시자 버튼이다.
function CrewManageScreen() {
  const navigate = useNavigate();
  const { crewId } = useParams<{ crewId: string }>();

  return (
    <div className="flex flex-col gap-5 px-5 py-6">
      <div className="flex flex-col gap-1">
        <Typography
          color="semantic.label.normal"
          variant="headline1"
          weight="bold"
        >
          모임 관리
        </Typography>
        <Typography
          color="semantic.label.alternative"
          variant="label2"
          weight="medium"
        >
          정보와 멤버를 관리해요.
        </Typography>
      </div>

      <div className="flex flex-col gap-2">
        <Typography
          color="semantic.label.normal"
          variant="label1"
          weight="bold"
        >
          모임 이름
        </Typography>
        <TextField width="100%">
          <input defaultValue="프로젝트 모임" />
        </TextField>
      </div>

      <div className="flex flex-col gap-2">
        <Typography
          color="semantic.label.normal"
          variant="label1"
          weight="bold"
        >
          소개
        </Typography>
        <TextArea
          defaultValue="좋아하는 음악으로 함께 무대를 만드는 모임"
          minRows={2}
          width="100%"
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <Typography
          color="semantic.label.normal"
          variant="label1"
          weight="bold"
        >
          대표 이미지 (선택)
        </Typography>
        <button
          className="flex w-full flex-col items-center gap-1.5 rounded-xl bg-surface py-5"
          type="button"
        >
          <IconPlus className="size-6 text-label-normal" />
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="medium"
          >
            이미지 업로드
          </Typography>
        </button>
      </div>

      <Button color="primary" fullWidth size="large" variant="solid">
        변경 내용 저장
      </Button>

      <button
        className="self-start"
        onClick={() => navigate(`/crew/${crewId}/applications`)}
        type="button"
      >
        <Typography
          className="text-glow-sm"
          color="semantic.primary.strong"
          variant="label1"
          weight="bold"
        >
          가입 신청 2건 관리하기
        </Typography>
      </button>
      <button
        className="self-start"
        onClick={() => navigate(`/crew/${crewId}/notice/new`)}
        type="button"
      >
        <Typography
          className="text-glow-sm"
          color="semantic.primary.strong"
          variant="label1"
          weight="bold"
        >
          공지 작성하기
        </Typography>
      </button>
    </div>
  );
}

export default CrewManageScreen;
