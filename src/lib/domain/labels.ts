import type {
  Genre,
  GroupRole,
  GroupType,
  Instrument,
  JoinStatus,
  Level,
  NotificationType,
  PerformanceStatus,
  PracticeStatus,
  RecruitStatus,
  Region,
  TargetType,
  TeamRole,
} from "@/lib/domain/types";

// 서버 enum → 화면 라벨. 화면마다 "베이스"·"Bass"·"베이스 기타"처럼 다르게 쓰지 않도록 여기서만 정한다.
// 순서가 의미 있는 목록(선택 칩 등)은 *_OPTIONS 배열을 쓴다 — Object.keys 순서에 기대지 않는다.

export const INSTRUMENT_OPTIONS: Instrument[] = [
  "VOCAL",
  "EL_GT",
  "AC_GT",
  "BASS",
  "DRUM",
  "KEY",
];

export const INSTRUMENT_LABEL: Record<Instrument, string> = {
  AC_GT: "어쿠스틱 기타",
  BASS: "베이스",
  DRUM: "드럼",
  EL_GT: "일렉 기타",
  KEY: "키보드",
  VOCAL: "보컬",
};

/** 커버(앨범 아트) 안에 크게 쓰는 파트 영문 이름 — Archivo Black. 기타는 일렉·어쿠스틱을 꼭 구분한다. */
export const INSTRUMENT_COVER_LABEL: Record<Instrument, string> = {
  AC_GT: "Acoustic Guitar",
  BASS: "Bass",
  DRUM: "Drums",
  EL_GT: "Electric Guitar",
  KEY: "Keys",
  VOCAL: "Vocal",
};

export const LEVEL_OPTIONS: Level[] = [
  "BEGINNER",
  "NOVICE",
  "INTERMEDIATE",
  "ADVANCED",
];

export const LEVEL_LABEL: Record<Level, string> = {
  ADVANCED: "고급",
  BEGINNER: "입문",
  INTERMEDIATE: "중급",
  NOVICE: "초급",
};

export const GENRE_OPTIONS: Genre[] = [
  "ROCK",
  "INDIE",
  "PUNK",
  "METAL",
  "POP",
  "BALLAD",
  "JAZZ",
  "HIPHOP",
  "RNB",
  "ACOUSTIC",
  "ETC",
];

export const GENRE_LABEL: Record<Genre, string> = {
  ACOUSTIC: "어쿠스틱",
  BALLAD: "발라드",
  ETC: "기타 장르",
  HIPHOP: "힙합",
  INDIE: "인디",
  JAZZ: "재즈",
  METAL: "메탈",
  POP: "팝",
  PUNK: "펑크",
  RNB: "R&B",
  ROCK: "록",
};

export const REGION_OPTIONS: Region[] = [
  "SEOUL",
  "GYEONGGI",
  "INCHEON",
  "GANGWON",
  "DAEJEON",
  "SEJONG",
  "CHUNGBUK",
  "CHUNGNAM",
  "GWANGJU",
  "JEONBUK",
  "JEONNAM",
  "DAEGU",
  "GYEONGBUK",
  "GYEONGNAM",
  "BUSAN",
  "ULSAN",
  "JEJU",
];

export const REGION_LABEL: Record<Region, string> = {
  BUSAN: "부산",
  CHUNGBUK: "충북",
  CHUNGNAM: "충남",
  DAEGU: "대구",
  DAEJEON: "대전",
  GANGWON: "강원",
  GWANGJU: "광주",
  GYEONGBUK: "경북",
  GYEONGGI: "경기",
  GYEONGNAM: "경남",
  INCHEON: "인천",
  JEJU: "제주",
  JEONBUK: "전북",
  JEONNAM: "전남",
  SEJONG: "세종",
  SEOUL: "서울",
  ULSAN: "울산",
};

export const GROUP_TYPE_OPTIONS: GroupType[] = ["REGULAR", "PROJECT"];

export const GROUP_TYPE_LABEL: Record<GroupType, string> = {
  PROJECT: "프로젝트 모임",
  REGULAR: "정기 모임",
};

export const GROUP_ROLE_LABEL: Record<GroupRole, string> = {
  MANAGER: "운영진",
  MEMBER: "멤버",
  OWNER: "모임장",
};

export const TEAM_ROLE_LABEL: Record<TeamRole, string> = {
  LEADER: "팀장",
  MEMBER: "멤버",
};

/** 팀 종류 — 서버는 TeamDetail.performance 유무로 가른다(공연 팀 / 독립 팀). */
export const TEAM_KIND_LABEL = {
  independent: "독립 팀",
  performance: "공연 팀",
} as const;

export const PERFORMANCE_STATUS_LABEL: Record<PerformanceStatus, string> = {
  CANCELED: "취소",
  DONE: "종료",
  PLANNED: "공연 예정",
  RECRUITING: "팀 모집 중",
};

export const TARGET_TYPE_LABEL: Record<TargetType, string> = {
  GROUP: "모임",
  TEAM: "팀",
};

export const RECRUIT_STATUS_LABEL: Record<RecruitStatus, string> = {
  CLOSED: "모집 완료",
  OPEN: "모집 중",
};

export const JOIN_STATUS_LABEL: Record<JoinStatus, string> = {
  APPROVED: "승인됨",
  CANCELED: "취소됨",
  PENDING: "대기 중",
  REJECTED: "거절됨",
};

/** 분석 요청 직후(SUBMITTED)와 분석 중(ANALYZING)은 사용자에게 같은 "분석 중"이다. */
export const PRACTICE_STATUS_LABEL: Record<PracticeStatus, string> = {
  ANALYZING: "분석 중",
  DONE: "분석 완료",
  FAILED: "분석 실패",
  SUBMITTED: "분석 중",
};

/** 알림 종류 이름(알림 행 위의 작은 라벨) */
export const NOTIFICATION_TYPE_LABEL: Record<NotificationType, string> = {
  GROUP_INVITE: "모임 초대",
  GROUP_MEMBER_REMOVED: "모임",
  INVITATION_ACCEPTED: "초대 수락",
  INVITATION_DECLINED: "초대 거절",
  JOIN_REQUEST_APPROVED: "지원 승인",
  JOIN_REQUEST_REJECTED: "지원 결과",
  NOTICE_CREATED: "공지",
  PERFORMANCE_CREATED: "새 공연",
  RECRUIT_POST_APPLIED: "모집 지원",
  TEAM_APPLY: "모집 지원",
  TEAM_INVITE: "팀 초대",
  TEAM_MEMBER_REMOVED: "팀",
};

export function formatInstruments(
  items: { instrument: Instrument; level?: Level }[],
  withLevel = false,
): string {
  return items
    .map((item) =>
      withLevel && item.level
        ? `${INSTRUMENT_LABEL[item.instrument]} ${LEVEL_LABEL[item.level]}`
        : INSTRUMENT_LABEL[item.instrument],
    )
    .join(" · ");
}
