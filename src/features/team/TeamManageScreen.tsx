import {
  ActionArea,
  ActionAreaButton,
  Button,
  Chip,
  List,
  ListCell,
  ListCellContent,
  TextButton,
  Typography,
  useToast,
} from "@wanteddev/wds";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Badge from "@/components/ui/Badge";
import BottomSheet from "@/components/ui/BottomSheet";
import { rowClick } from "@/components/ui/listCellEvents";
import SectionHeader from "@/components/ui/SectionHeader";
import SelectField from "@/components/ui/SelectField";
import TextInputField from "@/components/ui/TextInputField";
import { useAppAlert } from "@/components/ui/useAppAlert";
import MemberCell from "@/features/team/components/MemberCell";
import TeamFallback from "@/features/team/components/TeamFallback";
import TeamHeroTabs from "@/features/team/components/TeamHeroTabs";
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
const GENRE_MAX_COUNT = 5;

const REGION_SELECT_OPTIONS = REGION_OPTIONS.map((region) => ({
  label: REGION_LABEL[region],
  value: region,
}));

// Figma: 팀/07 팀 관리 (nodeId 101:23217) + 팀/12 팀 해체 확인(142:20222) — 팀장만.
// 팀 정보 수정(PUT /teams/{id}), 팀원 관리(팀장 위임 · 세션 변경 · 내보내기), 팀 해체.
// 팀 해체 확인은 예전 손수 만든 모달 대신 WDS 확인창(useAppAlert)으로 띄운다.
function TeamManageScreen() {
  const team = useTeamParam();
  if (!team) return <TeamFallback kind="notFound" />;
  if (!isTeamLeader(team))
    return <TeamFallback kind="leaderOnly" team={team} />;
  return <TeamManageContent team={team} />;
}

function TeamManageContent({ team }: { team: Team }) {
  const navigate = useNavigate();
  const toast = useToast();
  const alert = useAppAlert();
  const meId = getMe().id;

  const [name, setName] = useState(team.name);
  const [description, setDescription] = useState(team.description);
  const [region, setRegion] = useState<Region>(team.region);
  const [genres, setGenres] = useState<Genre[]>(team.genres);

  const [members, setMembers] = useState(team.members);
  // 멤버 시트: 누구를 열었는지 + 메뉴 / 세션 고르기 단계
  const [target, setTarget] = useState<TeamMember | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetStep, setSheetStep] = useState<"menu" | "session">("menu");
  const [nextInstrument, setNextInstrument] = useState<Instrument | null>(null);

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

  const saveInfo = () => {
    toast({ content: "팀 정보를 저장했어요", variant: "positive" });
  };

  const openMember = (member: TeamMember) => {
    setTarget(member);
    setSheetStep("menu");
    setNextInstrument(member.instrument);
    setSheetOpen(true);
  };

  const delegate = async (member: TeamMember) => {
    setSheetOpen(false);
    const result = await alert({
      cancel: "취소",
      confirm: "위임",
      content:
        "넘기면 나는 멤버가 되고, 팀 관리·곡 추가·팀원 초대를 더 할 수 없어요.",
      title: `${member.user.nickname}님에게 팀장을 넘길까요?`,
    });
    if (result !== "confirm") return;
    toast({ content: "팀장을 넘겼어요", variant: "positive" });
    // 이제 팀장이 아니라 관리 탭이 사라진다 — 팀 홈으로 돌려보낸다.
    navigate(`/team/${team.id}`, { replace: true });
  };

  const removeMember = async (member: TeamMember) => {
    setSheetOpen(false);
    const result = await alert({
      cancel: "취소",
      confirm: "내보내기",
      content:
        "내보낸 팀원에게 알림이 가요. 다시 들어오려면 초대나 지원이 필요해요.",
      title: `${member.user.nickname}님을 내보낼까요?`,
    });
    if (result !== "confirm") return;
    setMembers((prev) =>
      prev.filter((item) => item.user.id !== member.user.id),
    );
    toast({ content: "팀에서 내보냈어요", variant: "positive" });
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
    setSheetOpen(false);
    toast({ content: "세션을 바꿨어요", variant: "positive" });
  };

  const disband = async () => {
    const result = await alert({
      cancel: "취소",
      confirm: "해체",
      content: `${team.name}의 팀원 ${members.length}명이 모두 팀에서 나가고, 선택곡${
        team.performanceId !== null ? "과 공연 셋리스트로 넘긴 곡" : ""
      }도 함께 지워져요. 되돌릴 수 없어요.`,
      title: "팀을 해체할까요?",
    });
    if (result !== "confirm") return;
    toast({ content: "팀을 해체했어요", variant: "positive" });
    navigate("/crew?tab=team", { replace: true });
  };

  const isSelf = target?.user.id === meId;

  return (
    <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto">
      <TeamHeroTabs active="manage" team={team} />

      <section className="flex flex-col gap-5 px-5 pt-6 pb-8">
        <SectionHeader title="팀 정보" />
        <TextInputField
          error={name.trim() === "" ? "팀 이름을 입력해 주세요" : undefined}
          label="팀 이름"
          maxLength={NAME_MAX_LENGTH}
          onChange={setName}
          value={name}
        />
        <TextInputField
          label="소개"
          maxLength={500}
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
        <div className="flex flex-col gap-3">
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="medium"
          >
            장르 (최대 {GENRE_MAX_COUNT}개)
          </Typography>
          <div className="flex flex-wrap gap-2">
            {GENRE_OPTIONS.map((genre) => (
              <Chip
                active={genres.includes(genre)}
                key={genre}
                onClick={() => toggleGenre(genre)}
                size="large"
                variant="outlined"
              >
                {GENRE_LABEL[genre]}
              </Chip>
            ))}
          </div>
        </div>
        <Button
          color="primary"
          disabled={name.trim() === ""}
          fullWidth
          onClick={saveInfo}
          size="large"
          variant="solid"
        >
          변경 내용 저장
        </Button>
      </section>

      <div className="h-3 w-full shrink-0 bg-surface" />

      <section className="flex flex-col gap-1 px-5 pt-6 pb-8">
        <SectionHeader count={members.length} title="팀원 관리" />
        <Typography
          color="semantic.label.alternative"
          variant="label2"
          weight="medium"
        >
          팀원을 눌러 팀장 위임·세션 변경·내보내기를 할 수 있어요.
        </Typography>
        <List>
          {members.map((member) => (
            <MemberCell
              caption={INSTRUMENT_LABEL[member.instrument]}
              key={member.user.id}
              nickname={
                member.user.id === meId
                  ? `${member.user.nickname} (나)`
                  : member.user.nickname
              }
              onPress={() => openMember(member)}
              trailing={
                member.role === "LEADER" ? (
                  <ListCellContent variant="chevron">
                    <Badge glow>{TEAM_ROLE_LABEL.LEADER}</Badge>
                  </ListCellContent>
                ) : undefined
              }
            />
          ))}
        </List>
      </section>

      <div className="h-3 w-full shrink-0 bg-surface" />

      <section className="flex flex-col items-start gap-1 px-5 pt-6 pb-10">
        <TextButton color="primary" onClick={disband} size="medium">
          팀 해체하기
        </TextButton>
        <Typography
          color="semantic.label.assistive"
          variant="caption1"
          weight="medium"
        >
          해체하면 팀과 선택곡이 사라지고 되돌릴 수 없어요.
        </Typography>
      </section>

      <BottomSheet
        footer={
          sheetStep === "session" ? (
            <ActionArea variant="strong">
              <ActionAreaButton
                disabled={nextInstrument === target?.instrument}
                onClick={changeInstrument}
              >
                세션 변경
              </ActionAreaButton>
            </ActionArea>
          ) : undefined
        }
        onOpenChange={setSheetOpen}
        open={sheetOpen}
        title={target?.user.nickname}
      >
        {target && sheetStep === "menu" && (
          <List>
            {!isSelf && (
              <ListCell
                onClick={rowClick(() => delegate(target))}
                textProps={{ caption: "넘기면 나는 멤버가 돼요" }}
                trailingContent={<ListCellContent variant="chevron" />}
              >
                팀장 위임
              </ListCell>
            )}
            <ListCell
              onClick={rowClick(() => setSheetStep("session"))}
              textProps={{
                caption: `지금 ${INSTRUMENT_LABEL[target.instrument]}`,
              }}
              trailingContent={<ListCellContent variant="chevron" />}
            >
              세션 변경
            </ListCell>
            {!isSelf && (
              <ListCell
                onClick={rowClick(() => removeMember(target))}
                textProps={{ color: "semantic.primary.normal" }}
              >
                내보내기
              </ListCell>
            )}
          </List>
        )}
        {target && sheetStep === "session" && (
          <div className="flex flex-wrap gap-2 pb-2">
            {INSTRUMENT_OPTIONS.map((option) => (
              <Chip
                active={nextInstrument === option}
                key={option}
                onClick={() => setNextInstrument(option)}
                size="large"
                variant="outlined"
              >
                {INSTRUMENT_LABEL[option]}
              </Chip>
            ))}
          </div>
        )}
      </BottomSheet>
    </div>
  );
}

export default TeamManageScreen;
