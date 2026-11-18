import type {
  Group,
  Instrument,
  Performance,
  PracticeRecording,
  RecruitPost,
  Song,
  Team,
  User,
} from "@/lib/domain/types";
import {
  BOOKMARKS,
  GROUP_MEMBERS,
  GROUPS,
  INVITATIONS,
  JOIN_REQUESTS,
  ME_ID,
  NOTICES,
  NOTIFICATIONS,
  PERFORMANCES,
  PRACTICE_RECORDINGS,
  RECRUIT_POSTS,
  REHEARSALS,
  SONGS,
  TEAMS,
  USERS,
} from "@/mocks/data";

// 화면은 data.ts의 배열을 직접 뒤지지 않고 여기 함수로 꺼낸다 — 나중에 API 호출로 바꿀 자리다.
// 라우트 파라미터는 문자열이라 toId로 숫자로 바꿔 찾고, 못 찾으면 undefined를 돌려준다(화면이
// "없는 ○○예요" 빈 상태를 그린다).

export function toId(param: string | undefined): number {
  return Number(param);
}

export function getUser(id: number): User | undefined {
  return USERS.find((user) => user.id === id);
}

export function getMe(): User {
  return getUser(ME_ID) as User;
}

export function getGroup(id: number): Group | undefined {
  return GROUPS.find((group) => group.id === id);
}

/** GET /groups/my — 내가 모임원인 모임만. 전체 모임 검색은 서버에 없다(공고·초대로만 들어간다). */
export function getMyGroups(): Group[] {
  return GROUPS.filter((group) => group.myRole !== null);
}

export function getGroupMembers(groupId: number) {
  return GROUP_MEMBERS[groupId] ?? [];
}

export function getNotices(groupId: number) {
  return NOTICES.filter((notice) => notice.groupId === groupId).sort(
    (a, b) =>
      Number(b.isPinned) - Number(a.isPinned) ||
      b.createdAt.localeCompare(a.createdAt),
  );
}

export function getNotice(id: number) {
  return NOTICES.find((notice) => notice.id === id);
}

export function getTeam(id: number): Team | undefined {
  return TEAMS.find((team) => team.id === id);
}

/** GET /users/me/teams — 공연 팀·독립 팀 모두 */
export function getMyTeams(): Team[] {
  return TEAMS.filter((team) => team.myRole !== null);
}

export function isPerformanceTeam(team: Team): boolean {
  return team.performanceId !== null;
}

export function getPerformance(id: number): Performance | undefined {
  return PERFORMANCES.find((performance) => performance.id === id);
}

export function getGroupPerformances(groupId: number): Performance[] {
  return PERFORMANCES.filter((p) => p.groupId === groupId);
}

export function isUpcoming(performance: Performance): boolean {
  return (
    performance.status === "PLANNED" || performance.status === "RECRUITING"
  );
}

/** 공연 팀을 만들 수 있는 공연 — 내가 모임원인 모임의 진행 중(PLANNED·RECRUITING) 공연 */
export function getJoinablePerformances(): Performance[] {
  const myGroupIds = new Set(getMyGroups().map((group) => group.id));
  return PERFORMANCES.filter(
    (p) => myGroupIds.has(p.groupId) && isUpcoming(p),
  ).sort((a, b) => a.performedAt.localeCompare(b.performedAt));
}

/** 내 팀이 참가하는 진행 중 공연(내 활동 · 홈 "다음 공연") — 공연일 가까운 순 */
export function getMyUpcomingPerformances(): Performance[] {
  const myTeamIds = new Set(getMyTeams().map((team) => team.id));
  return PERFORMANCES.filter(
    (p) => isUpcoming(p) && p.teamIds.some((id) => myTeamIds.has(id)),
  ).sort((a, b) => a.performedAt.localeCompare(b.performedAt));
}

export function getSong(id: number): Song | undefined {
  return SONGS.find((song) => song.id === id);
}

export function getAllSongs(): Song[] {
  return SONGS;
}

export function getPost(id: number): RecruitPost | undefined {
  return RECRUIT_POSTS.find((post) => post.id === id);
}

export function getPosts(): RecruitPost[] {
  return [...RECRUIT_POSTS].sort(
    (a, b) =>
      Number(a.status === "CLOSED") - Number(b.status === "CLOSED") ||
      b.createdAt.localeCompare(a.createdAt),
  );
}

/** 공고 대상(팀·모임) 이름 */
export function getTargetName(targetType: "TEAM" | "GROUP", targetId: number) {
  return targetType === "TEAM"
    ? getTeam(targetId)?.name
    : getGroup(targetId)?.name;
}

/** 공고 수정·마감 권한 — 대상 팀의 현재 팀장 / 모임의 현재 모임장 */
export function canEditPost(post: RecruitPost): boolean {
  if (post.targetType === "TEAM") {
    return getTeam(post.targetId)?.myRole === "LEADER";
  }
  return getGroup(post.targetId)?.myRole === "OWNER";
}

/** 공고를 쓸 수 있는 대상 — 내가 팀장인 팀, 모임장인 모임 */
export function getPostableTargets() {
  return [
    ...getMyGroups()
      .filter((group) => group.myRole === "OWNER")
      .map((group) => ({
        id: group.id,
        name: group.name,
        targetType: "GROUP" as const,
      })),
    ...getMyTeams()
      .filter((team) => team.myRole === "LEADER")
      .map((team) => ({
        id: team.id,
        name: team.name,
        targetType: "TEAM" as const,
      })),
  ];
}

export function getRehearsals() {
  return [...REHEARSALS].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

export function getTeamRehearsals(teamId: number) {
  return getRehearsals().filter((r) => r.teamId === teamId);
}

export function getMyJoinRequests() {
  return JOIN_REQUESTS.filter((request) => request.applicantId === ME_ID);
}

/** 받은 신청 — 대상 단위(targetType·targetId 필수)로만 조회한다 */
export function getReceivedJoinRequests(
  targetType: "TEAM" | "GROUP",
  targetId: number,
) {
  return JOIN_REQUESTS.filter(
    (request) =>
      request.targetType === targetType &&
      request.targetId === targetId &&
      request.status === "PENDING",
  );
}

export function getReceivedInvitations() {
  return INVITATIONS.filter((invitation) => invitation.inviteeId === ME_ID);
}

/** 보낸 초대 — 대상 단위로만 조회한다 */
export function getSentInvitations(
  targetType: "TEAM" | "GROUP",
  targetId: number,
) {
  return INVITATIONS.filter(
    (invitation) =>
      invitation.inviterId === ME_ID &&
      invitation.targetType === targetType &&
      invitation.targetId === targetId,
  );
}

export function getBookmarks() {
  return BOOKMARKS;
}

/** 내 북마크 중 대상 종류별 id */
export function getBookmarkedIds(targetType: "USER" | "TEAM" | "SONG") {
  return BOOKMARKS.filter((b) => b.targetType === targetType).map(
    (b) => b.targetId,
  );
}

export function isBookmarked(
  targetType: "USER" | "TEAM" | "SONG",
  targetId: number,
): boolean {
  return BOOKMARKS.some(
    (b) => b.targetType === targetType && b.targetId === targetId,
  );
}

/** GET /notifications — 최신순 */
export function getNotifications() {
  return [...NOTIFICATIONS].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export function hasUnreadNotifications(): boolean {
  return NOTIFICATIONS.some((n) => !n.isRead);
}

export function getInvitation(id: number) {
  return INVITATIONS.find((invitation) => invitation.id === id);
}

export function getJoinRequest(id: number) {
  return JOIN_REQUESTS.find((request) => request.id === id);
}

/** GET /users/me/practice-recordings — 요청한 시각 최근 순 */
export function getPracticeRecordings(): PracticeRecording[] {
  return [...PRACTICE_RECORDINGS].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export function getPracticeRecording(
  id: number,
): PracticeRecording | undefined {
  return PRACTICE_RECORDINGS.find((recording) => recording.id === id);
}

/** 미니 플레이어가 띄우는 "지금 듣는 연습 녹음" — 가장 최근에 분석이 끝난 녹음 */
export function getNowPlayingRecording(): PracticeRecording | undefined {
  return getPracticeRecordings().find(
    (recording) => recording.status === "DONE",
  );
}

/** 공연에서 이 팀이 넘긴 곡 수 */
export function getSubmittedSongCount(
  performance: Performance,
  teamId: number,
): number {
  return performance.setlist.filter((item) => item.teamId === teamId).length;
}

/** 내 팀에서 내가 맡은 세션 */
export function getMyInstrumentInTeam(team: Team): Instrument | undefined {
  return team.members.find((member) => member.user.id === ME_ID)?.instrument;
}

/** 이 팀의 다음 합주(지금 이후 가장 가까운 것) */
export function getNextTeamRehearsal(teamId: number, now = new Date()) {
  return getTeamRehearsals(teamId).find(
    (rehearsal) => new Date(rehearsal.endsAt) >= now,
  );
}

/** GET /teams/{id}/members/recommendations — AI 팀원 추천(팀장만). 팀원이 아닌 사용자 중 몇 명. */
export function getRecommendedMembers(team: Team) {
  const memberIds = new Set(team.members.map((member) => member.user.id));
  const reasons: Record<number, string> = {
    4: "서울 · 펑크 취향이 비슷해요",
    5: "서울 · 주말 합주 가능",
    6: "경기 · R&B를 즐겨 들어요",
    7: "서울 · 팝 취향이 비슷해요",
    10: "서울 · 재즈 보컬",
  };
  return USERS.filter((u) => !memberIds.has(u.id) && reasons[u.id])
    .slice(0, 3)
    .map((u) => ({ reason: reasons[u.id], user: u }));
}

/** 다른 사용자가 속한 팀과 그 팀에서 맡은 세션(타인 프로필 activities.teams) */
export function getUserTeams(userId: number) {
  return TEAMS.flatMap((team) => {
    const member = team.members.find((item) => item.user.id === userId);
    return member ? [{ instrument: member.instrument, team }] : [];
  });
}

/** 다른 사용자가 속한 모임(타인 프로필 activities.groups) */
export function getUserGroups(userId: number): Group[] {
  return GROUPS.filter((group) =>
    getGroupMembers(group.id).some((member) => member.userId === userId),
  );
}

/** GET /users/nickname/check — 다른 사용자가 이미 쓰는 닉네임인지 */
export function isNicknameTaken(nickname: string): boolean {
  return USERS.some((u) => u.id !== ME_ID && u.nickname === nickname);
}
