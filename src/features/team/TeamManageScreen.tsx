import {
  ActionArea,
  ActionAreaButton,
  Button,
  IconButton,
  Typography,
  useToast,
} from "@wanteddev/wds";
import { IconMoreVertical } from "@wanteddev/wds-icon";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import PersonRow from "@/components/list/PersonRow";
import ActionSheet, { type ActionSheetItem } from "@/components/ui/ActionSheet";
import BottomActionArea from "@/components/ui/BottomActionArea";
import BottomSheet from "@/components/ui/BottomSheet";
import ChipGrid from "@/components/ui/ChipGrid";
import ConfirmSheet from "@/components/ui/ConfirmSheet";
import { innerClick } from "@/components/ui/listCellEvents";
import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SectionHeader from "@/components/ui/SectionHeader";
import SelectField from "@/components/ui/SelectField";
import TextInputField from "@/components/ui/TextInputField";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import TeamFallback from "@/features/team/components/TeamFallback";
import {
  isTeamLeader,
  useTeamParam,
} from "@/features/team/components/teamHelpers";
import {
  GENRE_LABEL,
  GENRE_OPTIONS,
  INSTRUMENT_LABEL,
  INSTRUMENT_OPTIONS,
  REGION_LABEL,
  REGION_OPTIONS,
  TEAM_ROLE_LABEL,
} from "@/lib/domain/labels";
import type {
  Genre,
  Instrument,
  Region,
  Team,
  TeamMember,
} from "@/lib/domain/types";
import { getMe } from "@/mocks/selectors";

// 서버 TeamUpdateRequest 제한
const NAME_MAX_LENGTH = 50;
const DESCRIPTION_MAX_LENGTH = 500;
const GENRE_MAX_COUNT = 5;

const REGION_SELECT_OPTIONS = REGION_OPTIONS.map((region) => ({
  label: REGION_LABEL[region],
  value: region,
}));

interface ConfirmRequest {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
}

// 팀 관리 `/team/:teamId/manage`(팀장만, 팀 화면 더보기에서 온다) — Figma 21·24 폼과 같은 모양.
// - 팀 정보 수정: PUT /teams/{id}(전체 교체) — 하단 "저장"
// - 팀원 ⋮: 팀장 넘기기 · 세션 변경(PATCH /teams/{teamId}/members/{userId} {role, instrument}) ·
//   내보내기(PATCH …/status {REMOVED})
// - 팀 해체: PATCH /teams/{id}/status — 선택곡과 공연에 넘긴 곡도 함께 지워진다(서버).
// 되돌리기 어려운 결정(넘기기 · 내보내기 · 해체)은 확정 시트(Figma 17)로 한 번 더 묻는다.
function TeamManageScreen() {
  const team = useTeamParam();
  if (!team) return <TeamFallback kind="notFound" />;
  if (!isTeamLeader(team))
    return <TeamFallback kind="leaderOnly" teamId={team.id} />;
  return <TeamManageContent team={team} />;
}

function TeamManageContent({ team }: { team: Team }) {
  const navigate = useNavigate();
  const toast = useToast();
  const meId = getMe().id;

  useScreenHeader(useMemo(() => <ScreenHeader title="팀 관리" />, []));

  const [saved, setSaved] = useState({
    description: team.description,
    genres: team.genres,
    name: team.name,
    region: team.region,
  });
  const [name, setName] = useState(team.name);
  const [description, setDescription] = useState(team.description);
  const [region, setRegion] = useState<Region>(team.region);
  const [genres, setGenres] = useState<Genre[]>(team.genres);

  const [members, setMembers] = useState(team.members);
  const [target, setTarget] = useState<TeamMember | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sessionOpen, setSessionOpen] = useState(false);
  const [nextInstrument, setNextInstrument] = useState<Instrument | null>(null);
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const dirty =
    name !== saved.name ||
    description !== saved.description ||
    region !== saved.region ||
    genres.join() !== saved.genres.join();
  const canSave = dirty && name.trim() !== "";

  const ask = (request: ConfirmRequest) => {
    setConfirm(request);
    setConfirmOpen(true);
  };

  const toggleGenre = (genre: Genre) => {
    if (genres.includes(genre)) {
      setGenres((prev) => prev.filter((item) => item !== genre));
      return;
    }
    if (genres.length >= GENRE_MAX_COUNT) {
      toast({
        content: `장르는 ${GENRE_MAX_COUNT}개까지 고를 수 있어요`,
        variant: "cautionary",
      });
      return;
    }
    setGenres((prev) => [...prev, genre]);
  };

  const save = () => {
    setSaved({ description, genres, name, region });
    toast({ content: "팀 정보를 저장했어요", variant: "positive" });
  };

  const openMember = (member: TeamMember) => {
    setTarget(member);
    setMenuOpen(true);
  };

  const memberItems = (member: TeamMember): ActionSheetItem[] => {
    const nickname = member.user.nickname;
    const isSelf = member.user.id === meId;
    const changeSession: ActionSheetItem = {
      caption: `지금 ${INSTRUMENT_LABEL[member.instrument]}`,
      label: "세션 변경",
      onSelect: () => {
        setNextInstrument(member.instrument);
        setSessionOpen(true);
      },
    };
    if (isSelf) return [changeSession];
    return [
      {
        caption: "넘기면 나는 멤버가 돼요",
        label: "팀장 넘기기",
        onSelect: () =>
          ask({
            confirmLabel: "넘기기",
            description:
              "넘기면 나는 멤버가 되고,\n팀 관리·곡 추가·팀원 초대를 더 할 수 없어요.",
            onConfirm: () => {
              toast({ content: "팀장을 넘겼어요", variant: "positive" });
              // 이제 팀장이 아니라 이 화면을 볼 수 없다 — 팀 홈으로 돌려보낸다.
              navigate(`/team/${team.id}`, { replace: true });
            },
            title: `${nickname}님에게 팀장을 넘길까요?`,
          }),
      },
      changeSession,
      {
        destructive: true,
        label: "내보내기",
        onSelect: () =>
          ask({
            confirmLabel: "내보내기",
            description:
              "내보낸 팀원에게 알림이 가요.\n다시 들어오려면 초대가 필요해요.",
            onConfirm: () => {
              setMembers((prev) =>
                prev.filter((item) => item.user.id !== member.user.id),
              );
              toast({ content: "팀에서 내보냈어요", variant: "positive" });
            },
            title: `${nickname}님을 내보낼까요?`,
          }),
      },
    ];
  };

  const changeInstrument = () => {
    if (!target || !nextInstrument) return;
    setMembers((prev) =>
      prev.map((item) =>
        item.user.id === target.user.id
          ? { ...item, instrument: nextInstrument }
          : item,
      ),
    );
    setSessionOpen(false);
    toast({ content: "세션을 바꿨어요", variant: "positive" });
  };

  const askDisband = () =>
    ask({
      confirmLabel: "해체",
      description: `팀원 ${members.length}명이 모두 나가고 선택곡${
        team.performanceId !== null ? "과 공연에 넘긴 곡" : ""
      }도 지워져요.\n되돌릴 수 없어요.`,
      onConfirm: () => {
        toast({ content: "팀을 해체했어요", variant: "positive" });
        navigate("/crew?tab=team", { replace: true });
      },
      title: "팀을 해체할까요?",
    });

  return (
    <>
      <ScreenBody>
        <SectionHeader first title="팀 정보" />
        <div className="flex flex-col gap-6 px-5">
          <TextInputField
            error={name.trim() === "" ? "팀 이름을 입력해 주세요" : undefined}
            label="팀 이름"
            maxLength={NAME_MAX_LENGTH}
            onChange={setName}
            value={name}
          />
          <TextInputField
            label="소개"
            maxLength={DESCRIPTION_MAX_LENGTH}
            multiline
            onChange={setDescription}
            placeholder="어떤 음악을 하는 팀인지 적어 주세요"
            value={description}
          />
          <SelectField
            label="활동 지역"
            onChange={setRegion}
            options={REGION_SELECT_OPTIONS}
            value={region}
          />
          <ChipGrid
            isSelected={(genre) => genres.includes(genre)}
            label="장르"
            message={`최대 ${GENRE_MAX_COUNT}개`}
            onToggle={toggleGenre}
            options={GENRE_OPTIONS.map((value) => ({
              label: GENRE_LABEL[value],
              value,
            }))}
          />
        </div>

        <SectionHeader title={`팀원 ${members.length}명`} />
        {members.map((member) => (
          <PersonRow
            key={member.user.id}
            meta={
              member.role === "LEADER"
                ? `${INSTRUMENT_LABEL[member.instrument]} · ${TEAM_ROLE_LABEL.LEADER}`
                : INSTRUMENT_LABEL[member.instrument]
            }
            name={member.user.nickname}
            onClick={() => openMember(member)}
            profileImage={member.user.profileImage}
            trailing={
              <IconButton
                aria-label={`${member.user.nickname} 관리`}
                color="semantic.label.alternative"
                onClick={innerClick(() => openMember(member))}
                size={20}
                variant="normal"
              >
                <IconMoreVertical />
              </IconButton>
            }
          />
        ))}

        <SectionHeader title="팀 해체" />
        <div className="flex flex-col gap-3 px-5">
          <Typography color="semantic.label.alternative" variant="label2">
            해체하면 팀원이 모두 나가고 선택곡이 지워져요. 되돌릴 수 없어요.
          </Typography>
          <Button
            color="assistive"
            fullWidth
            onClick={askDisband}
            size="large"
            variant="outlined"
          >
            팀 해체
          </Button>
        </div>
      </ScreenBody>

      <BottomActionArea disabled={!canSave} label="저장" onClick={save} />

      <ActionSheet
        items={target ? memberItems(target) : []}
        onOpenChange={setMenuOpen}
        open={menuOpen}
        title={target?.user.nickname}
      />
      <BottomSheet
        footer={
          <ActionArea variant="strong">
            <ActionAreaButton
              disabled={nextInstrument === target?.instrument}
              onClick={changeInstrument}
            >
              변경
            </ActionAreaButton>
          </ActionArea>
        }
        onOpenChange={setSessionOpen}
        open={sessionOpen}
        title={target ? `${target.user.nickname}님 세션` : undefined}
      >
        <ChipGrid
          isSelected={(instrument) => nextInstrument === instrument}
          label="세션"
          onToggle={setNextInstrument}
          options={INSTRUMENT_OPTIONS.map((value) => ({
            label: INSTRUMENT_LABEL[value],
            value,
          }))}
        />
      </BottomSheet>
      {confirm && (
        <ConfirmSheet
          confirmLabel={confirm.confirmLabel}
          description={confirm.description}
          onConfirm={confirm.onConfirm}
          onOpenChange={setConfirmOpen}
          open={confirmOpen}
          title={confirm.title}
        />
      )}
    </>
  );
}

export default TeamManageScreen;
