import {
  Button,
  TextArea,
  TextButton,
  TextField,
  Typography,
} from "@wanteddev/wds";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import TeamDisbandConfirmModal from "@/features/team/components/TeamDisbandConfirmModal";
import TeamHeroTabs from "@/features/team/components/TeamHeroTabs";

// Figma: 팀/07 팀 관리 (nodeId 101:23217) + 팀/12 팀 해체 확인(142:20222, 모달)

function TeamManageScreen() {
  const navigate = useNavigate();
  const { teamId = "" } = useParams();
  const [isDisbandOpen, setIsDisbandOpen] = useState(false);

  return (
    <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto">
      <TeamHeroTabs active="manage" teamId={teamId} />

      <div className="flex flex-col gap-5 px-5 pt-6 pb-8">
        <div className="flex flex-col gap-1">
          <Typography
            color="semantic.label.normal"
            variant="headline1"
            weight="bold"
          >
            팀 관리
          </Typography>
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="medium"
          >
            정보와 멤버를 관리해요.
          </Typography>
        </div>

        <label className="flex flex-col gap-2" htmlFor="team-manage-name">
          <Typography
            color="semantic.label.normal"
            variant="label1"
            weight="bold"
          >
            팀 이름
          </Typography>
          <TextField
            defaultValue="블루 웨이브"
            id="team-manage-name"
            width="100%"
          />
        </label>

        <label className="flex flex-col gap-2" htmlFor="team-manage-intro">
          <Typography
            color="semantic.label.normal"
            variant="label1"
            weight="bold"
          >
            소개
          </Typography>
          <TextArea
            defaultValue="인디 록 사운드를 함께 만드는 밴드"
            id="team-manage-intro"
            minRows={2}
            width="100%"
          />
        </label>

        <Button
          color="primary"
          fullWidth
          // 저장 완료 화면이 따로 없다 — 저장하면 팀 홈으로 돌아간다.
          onClick={() => navigate(`/team/${teamId}`)}
          size="large"
          variant="solid"
        >
          변경 내용 저장
        </Button>

        <div>
          <TextButton
            color="primary"
            onClick={() => setIsDisbandOpen(true)}
            size="small"
          >
            팀 해체하기
          </TextButton>
        </div>
      </div>

      <TeamDisbandConfirmModal
        memberCount={9}
        onConfirm={() => {
          setIsDisbandOpen(false);
          navigate("/team");
        }}
        onOpenChange={setIsDisbandOpen}
        open={isDisbandOpen}
        teamName="블루 웨이브"
      />
    </div>
  );
}

export default TeamManageScreen;
