import { ListCell, ListCellContent, Switch } from "@wanteddev/wds";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ConfirmSheet from "@/components/ui/ConfirmSheet";
import { rowClick } from "@/components/ui/listCellEvents";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SectionHeader from "@/components/ui/SectionHeader";
import { useAppAlert } from "@/components/ui/useAppAlert";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import { clearSession } from "@/lib/auth/session";
import { getMe, getMyGroups, getMyTeams } from "@/mocks/selectors";

// 계정(/mine/account) — Figma 07 마이의 "계정" 메뉴·설정 아이콘에서 들어온다. Figma 화면은 없어서 예전
// 마이 화면에 있던 공개 설정(PUT /users/me의 isActivityPublic·isRecommendable)과 로그아웃·회원 탈퇴를
// 여기로 모았다. 되돌리기 어려운 결정은 아래 시트(ConfirmSheet)로 한 번 더 묻는다.

/**
 * 서버는 팀장·모임장이면 탈퇴를 409 WITHDRAW_BLOCKED_BY_ROLE로 막고 어느 팀·모임인지 message에 담는다
 * (UserWithdrawService.blockedMessage와 같은 문장). 직책이 없으면 null.
 */
function getWithdrawBlockedMessage(): string | null {
  const quoted = (names: string[]) =>
    names.map((name) => `'${name}'`).join(", ");
  const ledTeams = getMyTeams()
    .filter((team) => team.myRole === "LEADER")
    .map((team) => team.name);
  const ownedGroups = getMyGroups()
    .filter((group) => group.myRole === "OWNER")
    .map((group) => group.name);

  const parts: string[] = [];
  if (ledTeams.length > 0) parts.push(`팀 ${quoted(ledTeams)}의 팀장을 위임`);
  if (ownedGroups.length > 0) {
    parts.push(`모임 ${quoted(ownedGroups)}의 모임장을 위임하거나 모임을 해체`);
  }
  return parts.length > 0
    ? `${parts.join("하고, ")}한 뒤 탈퇴할 수 있어요.`
    : null;
}

type PendingConfirm = "logout" | "withdraw" | null;

function MineAccountScreen() {
  const navigate = useNavigate();
  const alert = useAppAlert();
  const me = getMe();
  // 목업 User에는 isRecommendable이 없어 켜 둔 채로 시작한다. 바꾸면 PUT /users/me로 바로 저장하는 자리.
  const [activityPublic, setActivityPublic] = useState(me.isActivityPublic);
  const [recommendable, setRecommendable] = useState(true);
  const [confirm, setConfirm] = useState<PendingConfirm>(null);

  useScreenHeader(useMemo(() => <ScreenHeader title="계정" />, []));

  const closeConfirm = (open: boolean) => {
    if (!open) setConfirm(null);
  };

  // 서버에 로그아웃 API가 없다 — 앱이 들고 있는 토큰만 지우고 로그인 화면으로 보낸다.
  const logout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  const withdraw = async () => {
    const blockedMessage = getWithdrawBlockedMessage();
    if (blockedMessage) {
      // 안내만 하는 확인이라 버튼 하나짜리 대화상자로 띄운다(시트는 닫기·확인 두 버튼이 고정이다).
      await alert({
        confirm: "확인",
        content: blockedMessage,
        title: "아직 탈퇴할 수 없어요",
      });
      return;
    }
    setConfirm("withdraw");
  };

  return (
    <>
      <ScreenBody>
        <SectionHeader first title="공개 설정" />
        {/* 스위치 행은 스위치만 누른다 — WDS ListCell은 role="switch"를 대신 눌러 주지 않는다. */}
        <ListCell
          alignItems="center"
          disableInteraction
          fillWidth
          textProps={{
            caption: "다른 사용자가 내 모임·팀·공연 기록을 볼 수 있어요",
          }}
          trailingContent={
            <ListCellContent variant="switch">
              <Switch
                aria-label="활동 기록 공개"
                checked={activityPublic}
                onCheckedChange={setActivityPublic}
              />
            </ListCellContent>
          }
        >
          활동 기록 공개
        </ListCell>
        <ListCell
          alignItems="center"
          disableInteraction
          fillWidth
          textProps={{ caption: "팀장이 AI 팀원 추천에서 나를 찾을 수 있어요" }}
          trailingContent={
            <ListCellContent variant="switch">
              <Switch
                aria-label="팀원 추천 받기"
                checked={recommendable}
                onCheckedChange={setRecommendable}
              />
            </ListCellContent>
          }
        >
          팀원 추천 받기
        </ListCell>

        <SectionHeader title="계정" />
        <ListCell
          fillWidth
          onClick={rowClick(() => setConfirm("logout"))}
          trailingContent={<ListCellContent variant="chevron" />}
        >
          로그아웃
        </ListCell>
        <ListCell
          fillWidth
          onClick={rowClick(withdraw)}
          textProps={{ caption: "계정과 활동 기록이 모두 삭제돼요" }}
          trailingContent={<ListCellContent variant="chevron" />}
        >
          회원 탈퇴
        </ListCell>
      </ScreenBody>

      <ConfirmSheet
        confirmLabel="로그아웃"
        description="다시 로그인하면 이어서 쓸 수 있어요."
        onConfirm={logout}
        onOpenChange={closeConfirm}
        open={confirm === "logout"}
        title="로그아웃할까요?"
      />
      <ConfirmSheet
        confirmLabel="탈퇴"
        description="소속 모임·팀과 활동 기록이 모두 삭제되고 되돌릴 수 없어요."
        onConfirm={() => {
          clearSession();
          navigate("/login", { replace: true });
        }}
        onOpenChange={closeConfirm}
        open={confirm === "withdraw"}
        title="정말 탈퇴할까요?"
      />
    </>
  );
}

export default MineAccountScreen;
