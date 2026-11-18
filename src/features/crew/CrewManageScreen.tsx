import {
  ActionArea,
  ActionAreaButton,
  List,
  Typography,
  useToast,
} from "@wanteddev/wds";
import { IconChevronRight } from "@wanteddev/wds-icon";
import { type ReactNode, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MediaRow from "@/components/list/MediaRow";
import BottomSheet from "@/components/ui/BottomSheet";
import ConfirmSheet from "@/components/ui/ConfirmSheet";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SectionHeader from "@/components/ui/SectionHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import CrewFallback, {
  CrewNotFound,
} from "@/features/crew/components/CrewFallback";
import CrewInfoFields, {
  type CrewInfo,
  isCrewInfoValid,
} from "@/features/crew/components/CrewInfoFields";
import type { Group } from "@/lib/domain/types";
import { getGroup, getReceivedJoinRequests, toId } from "@/mocks/selectors";

// 모임 설정(/crew/:id/manage) — 모임 홈 헤더의 ⋮ 에서 들어온다(Figma에는 없는 화면). 서버 권한대로
// 모임장은 받은 신청 · 공지 쓰기 · 모임 정보 수정(PUT /groups/{id}) · 해체(PATCH status, soft delete)를,
// 그 밖의 모임원은 나가기(PATCH members/{me}/status)만 한다. 모임장은 나갈 수 없다(OWNER_CANNOT_LEAVE).
// 되돌리기 어려운 해체·나가기는 Figma 17 확정 시트(ConfirmSheet)로 한 번 더 묻는다.
const chevron = (
  <IconChevronRight className="size-5 shrink-0 text-label-assistive" />
);

function MenuRow({
  danger = false,
  meta,
  onClick,
  title,
  trailing = chevron,
}: {
  title: string;
  meta?: string;
  onClick: () => void;
  trailing?: ReactNode;
  danger?: boolean;
}) {
  return (
    <MediaRow
      meta={meta}
      onClick={onClick}
      title={danger ? <span className="text-accent-text">{title}</span> : title}
      trailing={trailing}
    />
  );
}

function CrewManage({ group }: { group: Group }) {
  const navigate = useNavigate();
  const toast = useToast();
  const isOwner = group.myRole === "OWNER";
  const pendingCount = isOwner
    ? getReceivedJoinRequests("GROUP", group.id).length
    : 0;

  const [info, setInfo] = useState<CrewInfo>(() => ({
    description: group.description,
    name: group.name,
    region: group.region,
    type: group.type,
  }));
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const title = isOwner ? "모임 관리" : "모임 설정";
  useScreenHeader(useMemo(() => <ScreenHeader title={title} />, [title]));

  const saveInfo = () => {
    setEditOpen(false);
    toast({ content: "모임 정보를 저장했어요", variant: "positive" });
  };

  const finish = () => {
    toast({
      content: isOwner ? "모임을 해체했어요" : `${group.name}에서 나왔어요`,
    });
    navigate("/crew", { replace: true });
  };

  return (
    <>
      <ScreenBody>
        {isOwner && (
          <>
            <SectionHeader flush title="운영" />
            <List>
              <MenuRow
                meta="가입 신청을 승인하거나 거절해요"
                onClick={() => navigate(`/crew/${group.id}/applications`)}
                title="받은 신청"
                trailing={
                  <span className="flex shrink-0 items-center gap-1">
                    {pendingCount > 0 && (
                      <span className="text-accent-text">
                        <Typography as="span" variant="label1" weight="medium">
                          {pendingCount}명
                        </Typography>
                      </span>
                    )}
                    {chevron}
                  </span>
                }
              />
              <MenuRow
                meta="모임원 모두에게 알림이 가요"
                onClick={() => navigate(`/crew/${group.id}/notice/new`)}
                title="공지 쓰기"
              />
              <MenuRow
                meta="이름 · 유형 · 지역 · 소개"
                onClick={() => setEditOpen(true)}
                title="모임 정보 수정"
              />
            </List>
          </>
        )}

        <SectionHeader flush={!isOwner} title={group.name} />
        <List>
          <MenuRow
            danger
            meta={
              isOwner
                ? "모든 멤버가 빠지고 되돌릴 수 없어요"
                : "나가면 이 모임의 공지와 공연을 볼 수 없어요"
            }
            onClick={() => setConfirmOpen(true)}
            title={isOwner ? "모임 해체" : "모임 나가기"}
            trailing={null}
          />
        </List>
      </ScreenBody>

      <BottomSheet
        footer={
          <ActionArea variant="strong">
            <ActionAreaButton
              disabled={!isCrewInfoValid(info)}
              onClick={saveInfo}
            >
              저장
            </ActionAreaButton>
          </ActionArea>
        }
        onOpenChange={setEditOpen}
        open={editOpen}
        title="모임 정보 수정"
      >
        <div className="flex flex-col gap-6 pb-2">
          <CrewInfoFields onChange={setInfo} value={info} />
        </div>
      </BottomSheet>

      <ConfirmSheet
        confirmLabel={isOwner ? "해체" : "나가기"}
        description={
          isOwner
            ? "모든 멤버가 모임에서 빠지고, 모집 중인 공고도 마감돼요.\n해체한 모임은 되돌릴 수 없어요."
            : "나가면 이 모임의 공지와 공연을 더 볼 수 없어요.\n다시 들어오려면 가입 신청을 해야 해요."
        }
        onConfirm={finish}
        onOpenChange={setConfirmOpen}
        open={confirmOpen}
        title={isOwner ? "모임을 해체할까요?" : "모임에서 나갈까요?"}
      />
    </>
  );
}

function CrewManageScreen() {
  const navigate = useNavigate();
  const { crewId } = useParams();
  const group = getGroup(toId(crewId));
  if (!group) return <CrewNotFound />;
  // 비회원은 설정할 것이 없다(⋮ 도 모임원에게만 보인다). 주소로 직접 들어온 경우만 막는다.
  if (group.myRole === null) {
    return (
      <CrewFallback
        action={{
          label: "모임 홈",
          onClick: () => navigate(`/crew/${group.id}`, { replace: true }),
        }}
        description="가입 신청이 승인되면 모임 설정을 볼 수 있어요"
        title="모임원만 볼 수 있어요"
      />
    );
  }
  return <CrewManage group={group} />;
}

export default CrewManageScreen;
