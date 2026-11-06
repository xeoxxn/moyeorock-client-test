// 서버(moyeorock-server) enum·DTO와 같은 이름·값을 쓴다 — 백엔드를 붙일 때 응답을 그대로 받을 수
// 있게 하려는 것이다. 값이 바뀌면 서버 `global/common/enums`·`domain/*/enums`와
// `docs/specs/dto-spec.md`를 기준으로 맞춘다. 화면에 보이는 한국어는 labels.ts가 맡는다.

export type Instrument = "VOCAL" | "EL_GT" | "AC_GT" | "BASS" | "DRUM" | "KEY";
export type Level = "BEGINNER" | "NOVICE" | "INTERMEDIATE" | "ADVANCED";
export type Genre =
  | "ROCK"
  | "INDIE"
  | "PUNK"
  | "METAL"
  | "POP"
  | "BALLAD"
  | "JAZZ"
  | "HIPHOP"
  | "RNB"
  | "ACOUSTIC"
  | "ETC";
export type Region =
  | "SEOUL"
  | "INCHEON"
  | "GYEONGGI"
  | "GANGWON"
  | "DAEJEON"
  | "SEJONG"
  | "CHUNGBUK"
  | "CHUNGNAM"
  | "GWANGJU"
  | "JEONBUK"
  | "JEONNAM"
  | "DAEGU"
  | "GYEONGBUK"
  | "GYEONGNAM"
  | "BUSAN"
  | "ULSAN"
  | "JEJU";

export type GroupType = "REGULAR" | "PROJECT";
export type GroupRole = "OWNER" | "MANAGER" | "MEMBER";
export type TeamRole = "LEADER" | "MEMBER";
export type PerformanceStatus = "PLANNED" | "RECRUITING" | "DONE" | "CANCELED";
/** 가입 신청·초대 공통 대상. 공고(recruit-post)도 같은 값을 쓴다. */
export type TargetType = "TEAM" | "GROUP";
export type RecruitStatus = "OPEN" | "CLOSED";
export type JoinStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELED";
export type BookmarkTargetType = "USER" | "TEAM" | "SONG";
export type NotificationType =
  | "TEAM_APPLY"
  | "TEAM_INVITE"
  | "GROUP_INVITE"
  | "JOIN_REQUEST_APPROVED"
  | "JOIN_REQUEST_REJECTED"
  | "INVITATION_ACCEPTED"
  | "INVITATION_DECLINED"
  | "TEAM_MEMBER_REMOVED"
  | "GROUP_MEMBER_REMOVED"
  | "NOTICE_CREATED"
  | "PERFORMANCE_CREATED"
  /** 모임 가입 신청 → 모임장. 모임용 전용 타입이 없어 서버가 이걸로 보낸다. */
  | "RECRUIT_POST_APPLIED";
export type NotificationTargetType =
  | "TEAM"
  | "GROUP"
  | "PERFORMANCE"
  | "NOTICE"
  | "JOIN_REQUEST"
  | "INVITATION";

export interface UserInstrument {
  instrument: Instrument;
  level: Level;
}

/** UserSummaryResponse */
export interface UserSummary {
  id: number;
  nickname: string;
  profileImage: string | null;
}

/** UserProfileResponse(타인 프로필) + 화면용 최소 필드 */
export interface User extends UserSummary {
  region: Region;
  genres: Genre[];
  bio: string;
  instruments: UserInstrument[];
  isActivityPublic: boolean;
}

/** GroupDetailResponse에서 화면이 쓰는 필드 */
export interface Group {
  id: number;
  name: string;
  description: string;
  type: GroupType;
  region: Region;
  coverImage: string | null;
  ownerId: number;
  memberCount: number;
  /** 요청자의 역할. 모임원이 아니면 null — 가입 신청 버튼이 이걸로 갈린다. */
  myRole: GroupRole | null;
  createdAt: string;
}

/** GroupMemberResponse */
export interface GroupMember {
  userId: number;
  nickname: string;
  profileImage: string | null;
  instruments: UserInstrument[];
  role: GroupRole;
  joinedAt: string;
}

/** NoticeDetailResponse */
export interface Notice {
  id: number;
  groupId: number;
  title: string;
  body: string;
  isPinned: boolean;
  createdAt: string;
}

/** TeamMemberResponse(평탄화) */
export interface TeamMember {
  user: UserSummary;
  role: TeamRole;
  instrument: Instrument;
}

export interface SongSummary {
  id: number;
  title: string;
  artist: string;
}

/** SongResponse(곡 검색) */
export interface Song extends SongSummary {
  genre: Genre;
  songKey: string;
  bpm: number;
  difficulty: { part: Instrument; level: Level }[];
}

/** TeamDetailResponse. performanceId가 있으면 공연 팀, null이면 독립 팀이다. */
export interface Team {
  id: number;
  name: string;
  description: string;
  region: Region;
  genres: Genre[];
  performanceId: number | null;
  leaderId: number;
  members: TeamMember[];
  /** 팀 선택곡(team_songs). 팀 쪽에서는 "셋리스트"라는 말을 쓰지 않는다. */
  songIds: number[];
  myRole: TeamRole | null;
}

/** SetlistItemResponse */
export interface SetlistItem {
  teamId: number;
  songId: number;
  sortOrder: number | null;
}

/** PerformanceDetailResponse */
export interface Performance {
  id: number;
  groupId: number;
  title: string;
  description: string;
  performedAt: string;
  venue: string;
  posterImage: string | null;
  status: PerformanceStatus;
  teamIds: number[];
  /** 팀들이 넘긴 곡(확정 전) 또는 확정곡(확정 후) */
  setlist: SetlistItem[];
  setlistConfirmed: boolean;
}

export interface WantedSlot {
  instrument: Instrument;
  count: number;
  /** 그 세션의 대기(PENDING) 신청 수 */
  appliedCount: number;
}

/** RecruitPostDetailResponse */
export interface RecruitPost {
  id: number;
  targetType: TargetType;
  targetId: number;
  authorId: number;
  title: string;
  body: string;
  wantedSlots: WantedSlot[];
  region: Region;
  status: RecruitStatus;
  createdAt: string;
}

/** RehearsalSummaryResponse */
export interface Rehearsal {
  id: number;
  teamId: number;
  title: string;
  startsAt: string;
  endsAt: string;
  place: string;
}

/** JoinRequestResponse — 가입 신청(APPLY) */
export interface JoinRequest {
  id: number;
  targetType: TargetType;
  targetId: number;
  applicantId: number;
  recruitPostId: number | null;
  instrument: Instrument | null;
  message: string;
  status: JoinStatus;
  createdAt: string;
}

/** InvitationResponse — 초대(INVITE). 상태값은 신청과 같은 JoinStatus로 내려온다. */
export interface Invitation {
  id: number;
  targetType: TargetType;
  targetId: number;
  inviterId: number;
  inviteeId: number;
  instrument: Instrument | null;
  message: string;
  status: JoinStatus;
  createdAt: string;
}

/** NotificationResponse */
export interface AppNotification {
  id: number;
  type: NotificationType;
  message: string;
  targetType: NotificationTargetType;
  targetId: number;
  isRead: boolean;
  createdAt: string;
}

/** BookmarkResponse */
export interface Bookmark {
  id: number;
  targetType: BookmarkTargetType;
  targetId: number;
}
