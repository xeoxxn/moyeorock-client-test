import {
  Category,
  CategoryList,
  CategoryListItem,
  List,
  SearchField,
  TextButton,
  useToast,
} from "@wanteddev/wds";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import EmptyState from "@/components/ui/EmptyState";
import SectionHeader from "@/components/ui/SectionHeader";
import { useAppAlert } from "@/components/ui/useAppAlert";
import { CrewNotFound } from "@/features/crew/components/CrewFallback";
import CrewHeroTabs from "@/features/crew/components/CrewHeroTabs";
import MemberActionSheet from "@/features/crew/components/MemberActionSheet";
import MemberRow from "@/features/crew/components/MemberRow";
import {
  GROUP_ROLE_LABEL,
  INSTRUMENT_LABEL,
  INSTRUMENT_OPTIONS,
} from "@/lib/domain/labels";
import type { Group, GroupMember, Instrument } from "@/lib/domain/types";
import { ME_ID } from "@/mocks/data";
import { getGroup, getGroupMembers, toId } from "@/mocks/selectors";

// Figma: 모임/05 모임 멤버 (nodeId 101:19915) — 검색 · 세션 필터 · 운영진/멤버 두 묶음.
// 누르면: 모임장은 다른 멤버의 관리 시트(모임/14), 그 밖에는 그 사람 프로필(마이/08), 나는 마이 탭.
type InstrumentFilter = Instrument | "ALL";

function CrewMembers({ group }: { group: Group }) {
  const navigate = useNavigate();
  const alert = useAppAlert();
  const toast = useToast();
  const [members, setMembers] = useState(() => getGroupMembers(group.id));
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState<InstrumentFilter>("ALL");
  const [selected, setSelected] = useState<GroupMember | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // 위임하면 내 역할이 바로 바뀌므로 group.myRole보다 목록 속 내 역할을 먼저 본다.
  const myRole =
    members.find((member) => member.userId === ME_ID)?.role ?? group.myRole;
  const isOwner = myRole === "OWNER";

  const filterOptions = INSTRUMENT_OPTIONS.map((instrument) => ({
    count: members.filter((member) =>
      member.instruments.some((item) => item.instrument === instrument),
    ).length,
    instrument,
  })).filter((option) => option.count > 0);

  const query = keyword.trim();
  const visible = members.filter(
    (member) =>
      (filter === "ALL" ||
        member.instruments.some((item) => item.instrument === filter)) &&
      (query === "" || member.nickname.includes(query)),
  );
  const staff = visible
    .filter((member) => member.role !== "MEMBER")
    .sort((a, b) => Number(b.role === "OWNER") - Number(a.role === "OWNER"));
  const regulars = visible.filter((member) => member.role === "MEMBER");

  const selectMember = (member: GroupMember) => {
    if (member.userId === ME_ID) {
      navigate("/mine");
      return;
    }
    if (isOwner) {
      setSelected(member);
      setSheetOpen(true);
      return;
    }
    navigate(`/users/${member.userId}`);
  };

  const delegate = async (member: GroupMember) => {
    setSheetOpen(false);
    const result = await alert({
      cancel: "취소",
      confirm: "넘기기",
      content: `${member.nickname}님이 모임장이 되고, 나는 멤버가 돼요. 모임 관리는 새 모임장이 맡아요.`,
      title: "모임장을 넘길까요?",
    });
    if (result !== "confirm") return;
    setMembers((prev) =>
      prev.map((item) => {
        if (item.userId === member.userId) return { ...item, role: "OWNER" };
        if (item.userId === ME_ID) return { ...item, role: "MEMBER" };
        return item;
      }),
    );
    toast({
      content: `${member.nickname}님에게 모임장을 넘겼어요`,
      variant: "positive",
    });
  };

  const kick = async (member: GroupMember) => {
    setSheetOpen(false);
    const result = await alert({
      cancel: "취소",
      confirm: "내보내기",
      content: "내보낸 멤버는 이 모임의 공지와 공연을 더 볼 수 없어요.",
      title: `${member.nickname}님을 내보낼까요?`,
    });
    if (result !== "confirm") return;
    setMembers((prev) => prev.filter((item) => item.userId !== member.userId));
    toast({
      content: `${member.nickname}님을 내보냈어요`,
      variant: "positive",
    });
  };

  const leave = async () => {
    const result = await alert({
      cancel: "취소",
      confirm: "나가기",
      content: "나가면 이 모임의 공지와 공연을 더 볼 수 없어요.",
      title: "모임에서 나갈까요?",
    });
    if (result !== "confirm") return;
    toast({ content: `${group.name}에서 나왔어요` });
    navigate("/crew", { replace: true });
  };

  const renderSection = (title: string, list: GroupMember[]) =>
    list.length > 0 && (
      <section className="flex flex-col gap-1">
        <SectionHeader count={list.length} title={title} />
        <List>
          {list.map((member) => (
            <MemberRow
              isMe={member.userId === ME_ID}
              key={member.userId}
              member={member}
              onSelect={selectMember}
            />
          ))}
        </List>
      </section>
    );

  return (
    <div className="scrollbar-hidden flex-1 overflow-y-auto">
      <CrewHeroTabs active="members" group={group} />

      <div className="flex flex-col gap-4 px-5 pt-5 pb-8">
        <SearchField
          onChange={(event) => setKeyword(event.target.value)}
          onReset={() => setKeyword("")}
          placeholder="멤버 검색"
          value={keyword}
          width="100%"
        />
        <div className="-mx-5">
          <Category
            onValueChange={(value) => setFilter(value as InstrumentFilter)}
            value={filter}
          >
            <CategoryList horizontalPadding size="small">
              <CategoryListItem value="ALL">
                전체 {members.length}
              </CategoryListItem>
              {filterOptions.map((option) => (
                <CategoryListItem
                  key={option.instrument}
                  value={option.instrument}
                >
                  {INSTRUMENT_LABEL[option.instrument]} {option.count}
                </CategoryListItem>
              ))}
            </CategoryList>
          </Category>
        </div>

        {visible.length === 0 ? (
          <EmptyState
            description="검색어나 세션 필터를 바꿔 보세요."
            title="찾는 멤버가 없어요"
          />
        ) : (
          <>
            {renderSection(GROUP_ROLE_LABEL.MANAGER, staff)}
            {renderSection(GROUP_ROLE_LABEL.MEMBER, regulars)}
          </>
        )}

        {/* 모임장은 나갈 수 없다(서버 OWNER_CANNOT_LEAVE) — 위임하거나 해체해야 해서 모임장에게는 숨긴다. */}
        {myRole !== null && !isOwner && (
          <div className="flex justify-center pt-4">
            <TextButton color="assistive" onClick={leave} size="small">
              모임 나가기
            </TextButton>
          </div>
        )}
      </div>

      <MemberActionSheet
        member={selected}
        onDelegate={delegate}
        onKick={kick}
        onOpenChange={setSheetOpen}
        onViewProfile={(member) => navigate(`/users/${member.userId}`)}
        open={sheetOpen}
      />
    </div>
  );
}

function CrewMembersScreen() {
  const { crewId } = useParams();
  const group = getGroup(toId(crewId));
  if (!group) return <CrewNotFound />;
  return <CrewMembers group={group} />;
}

export default CrewMembersScreen;
