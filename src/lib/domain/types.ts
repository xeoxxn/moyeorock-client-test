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
/** 연습 녹음 분석 상태(서버 §13 practice) — 전송 완료 · 분석 중 · 분석 완료 · 분석 실패 */
export type PracticeStatus = "SUBMITTED" | "ANALYZING" | "DONE" | "FAILED";
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

/**
 * TeamSongRecommendationResponse.songs[] — 팀 곡 추천(AI, 서버 §12). 점수 높은 순 최대 10곡.
 * reasons는 백엔드가 만든 문장 그대로 보여 준다("팀 장르 일치: 팝" · "보컬 실력 충족" · "드럼 난이도 초과").
 * selectedByOtherTeam은 같은 공연의 다른 팀이 이미 고른 곡인지 — 독립 팀이면 항상 false.
 */
export interface TeamSongRecommendation {
  song: Song;
  score: number;
  reasons: string[];
  selectedByOtherTeam: boolean;
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
  memo: string;
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

/** PracticeFeedbackResponse — AI가 찾은 "원곡과 다르게 연주한 구간" 하나. 초 단위. */
export interface PracticeFeedback {
  startSec: number;
  endSec: number;
  part: Instrument;
  content: string;
}

/**
 * PracticeRecordingDetailResponse(목록 항목 PracticeRecordingSummaryResponse는 이 중 일부).
 * 녹음은 올린 본인만 본다.
 *
 * `song`·`durationSec`은 서버 응답에 아직 없다 — 곡은 분석 요청 때 고른 값(`songId`)을 클라이언트가
 * 들고 있고, 길이는 재생할 때 <audio>에서 읽는다. 화면이 곡 이름·아티스트를 보여 주려면 서버 응답에
 * 곡 요약이 필요하다(서버 쪽 요청 사항).
 */
export interface PracticeRecording {
  id: number;
  title: string;
  part: Instrument;
  status: PracticeStatus;
  failureReason: string | null;
  createdAt: string;
  analyzedAt: string | null;
  feedbacks: PracticeFeedback[];
  song: SongSummary;
  durationSec: number;
}
