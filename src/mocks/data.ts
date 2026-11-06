import type {
  AppNotification,
  Bookmark,
  Group,
  GroupMember,
  Invitation,
  JoinRequest,
  Notice,
  Performance,
  RecruitPost,
  Rehearsal,
  Song,
  Team,
  User,
} from "@/lib/domain/types";

// 백엔드가 붙기 전까지 모든 화면이 함께 쓰는 가짜 데이터. 모양은 서버 DTO(`docs/specs/dto-spec.md`)를
// 따른다 — 화면이 저마다 상수를 들고 있던 때는 /team/2로 들어가도 1번 팀이 보이는 식으로 라우트와
// 내용이 어긋났다. 상세 화면은 반드시 라우트 파라미터로 여기서 찾아 그린다.
//
// 데모 흐름이 끊기지 않게 "나"(ME_ID)는 모임장·팀장·일반 멤버·비회원 입장이 골고루 나오도록 배치했다.
// - 프로젝트 모임(1): 모임장 → 모임 관리·공지·공연 만들기·셋리스트 확정
// - 주말 잼 세션(2): 멤버 / 어쿠스틱 나이트(3): 비회원 → 가입 신청
// - 블루 웨이브(1): 공연 팀 팀장 → 선택곡·셋리스트로 넘기기·팀원 찾기
// - 나이트 드라이브(2): 독립 팀 멤버

export const ME_ID = 1;

// 합주 일정은 "오늘" 기준으로 만든다 — 날짜를 박아 두면 며칠만 지나도 홈의 오늘 일정이 비어 버린다.
function atDaysFromToday(days: number, hour: number, minute = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export const USERS: User[] = [
  {
    bio: "잘 부탁드립니다.",
    genres: ["ACOUSTIC", "PUNK"],
    id: 1,
    instruments: [
      { instrument: "KEY", level: "BEGINNER" },
      { instrument: "AC_GT", level: "NOVICE" },
    ],
    isActivityPublic: true,
    nickname: "김광철",
    profileImage: null,
    region: "SEOUL",
  },
  {
    bio: "보컬 5년차, 인디 록 좋아해요.",
    genres: ["INDIE", "ROCK"],
    id: 2,
    instruments: [{ instrument: "VOCAL", level: "INTERMEDIATE" }],
    isActivityPublic: true,
    nickname: "이보컬",
    profileImage: null,
    region: "SEOUL",
  },
  {
    bio: "메탈부터 재즈까지 다 쳐요.",
    genres: ["METAL", "JAZZ"],
    id: 3,
    instruments: [{ instrument: "DRUM", level: "ADVANCED" }],
    isActivityPublic: true,
    nickname: "박드럼",
    profileImage: null,
    region: "SEOUL",
  },
  {
    bio: "그루브 담당입니다.",
    genres: ["ROCK", "POP"],
    id: 4,
    instruments: [{ instrument: "BASS", level: "INTERMEDIATE" }],
    isActivityPublic: true,
    nickname: "박베이스",
    profileImage: null,
    region: "GYEONGGI",
  },
  {
    bio: "",
    genres: ["BALLAD"],
    id: 5,
    instruments: [{ instrument: "VOCAL", level: "NOVICE" }],
    isActivityPublic: false,
    nickname: "강보컬",
    profileImage: null,
    region: "SEOUL",
  },
  {
    bio: "퇴근 후 시티팝 합주해요.",
    genres: ["POP", "ROCK"],
    id: 6,
    instruments: [{ instrument: "EL_GT", level: "ADVANCED" }],
    isActivityPublic: true,
    nickname: "정일렉",
    profileImage: null,
    region: "SEOUL",
  },
  {
    bio: "어쿠스틱 기타 치고 노래해요.",
    genres: ["ACOUSTIC"],
    id: 7,
    instruments: [
      { instrument: "AC_GT", level: "NOVICE" },
      { instrument: "VOCAL", level: "BEGINNER" },
    ],
    isActivityPublic: true,
    nickname: "오어쿠",
    profileImage: null,
    region: "SEOUL",
  },
  {
    bio: "주말마다 잼 세션 엽니다.",
    genres: ["ROCK"],
    id: 8,
    instruments: [{ instrument: "EL_GT", level: "INTERMEDIATE" }],
    isActivityPublic: true,
    nickname: "김모임",
    profileImage: null,
    region: "SEOUL",
  },
  {
    bio: "",
    genres: ["ACOUSTIC", "INDIE"],
    id: 9,
    instruments: [{ instrument: "KEY", level: "ADVANCED" }],
    isActivityPublic: true,
    nickname: "한건반",
    profileImage: null,
    region: "GYEONGGI",
  },
];

export const GROUPS: Group[] = [
  {
    coverImage: null,
    createdAt: "2026-07-10T12:00:00",
    description: "좋아하는 음악으로 함께 무대를 만드는 모임",
    id: 1,
    memberCount: 7,
    myRole: "OWNER",
    name: "프로젝트 모임",
    ownerId: 1,
    region: "SEOUL",
    type: "PROJECT",
  },
  {
    coverImage: null,
    createdAt: "2026-05-02T12:00:00",
    description: "매주 새로운 합주를 즐기는 자유 세션",
    id: 2,
    memberCount: 3,
    myRole: "MEMBER",
    name: "주말 잼 세션",
    ownerId: 8,
    region: "SEOUL",
    type: "REGULAR",
  },
  {
    coverImage: null,
    createdAt: "2026-08-21T12:00:00",
    description: "작은 공연을 준비하는 어쿠스틱 모임",
    id: 3,
    memberCount: 3,
    myRole: null,
    name: "어쿠스틱 나이트",
    ownerId: 9,
    region: "GYEONGGI",
    type: "REGULAR",
  },
  {
    // 아직 신청하지 않은 비회원 모임 — 모임 홈의 "가입 신청하기" 흐름을 시연한다.
    coverImage: null,
    createdAt: "2026-09-15T12:00:00",
    description: "블루스와 록을 좋아하는 신촌 대학생 연합 동아리",
    id: 4,
    memberCount: 2,
    myRole: null,
    name: "신촌 블루스 클럽",
    ownerId: 3,
    region: "SEOUL",
    type: "REGULAR",
  },
];

export const GROUP_MEMBERS: Record<number, GroupMember[]> = {
  1: [1, 2, 3, 4, 5, 6, 7].map((userId) => {
    const user = USERS.find((u) => u.id === userId) as User;
    return {
      instruments: user.instruments,
      joinedAt: "2026-07-10T12:00:00",
      nickname: user.nickname,
      profileImage: null,
      role: userId === 1 ? "OWNER" : "MEMBER",
      userId,
    };
  }),
  2: [8, 1, 6].map((userId) => {
    const user = USERS.find((u) => u.id === userId) as User;
    return {
      instruments: user.instruments,
      joinedAt: "2026-05-02T12:00:00",
      nickname: user.nickname,
      profileImage: null,
      role: userId === 8 ? "OWNER" : "MEMBER",
      userId,
    };
  }),
  3: [9, 7, 2].map((userId) => {
    const user = USERS.find((u) => u.id === userId) as User;
    return {
      instruments: user.instruments,
      joinedAt: "2026-08-21T12:00:00",
      nickname: user.nickname,
      profileImage: null,
      role: userId === 9 ? "OWNER" : "MEMBER",
      userId,
    };
  }),
  4: [3, 4].map((userId) => {
    const user = USERS.find((u) => u.id === userId) as User;
    return {
      instruments: user.instruments,
      joinedAt: "2026-09-15T12:00:00",
      nickname: user.nickname,
      profileImage: null,
      role: userId === 3 ? "OWNER" : "MEMBER",
      userId,
    };
  }),
};

export const NOTICES: Notice[] = [
  {
    body: "12월 12일 홍대 롤링홀에서 가을 정기공연을 진행합니다. 공연 정보에서 공연 팀을 만들어 참가해 주세요. 팀별 선택곡은 11월 30일까지 셋리스트로 넘겨 주세요.",
    createdAt: "2026-11-02T09:00:00",
    groupId: 1,
    id: 1,
    isPinned: true,
    title: "가을 정기공연 참가 신청 안내",
  },
  {
    body: "11월부터 합주실 이용 시간이 저녁 7시~11시로 바뀝니다.",
    createdAt: "2026-10-28T09:00:00",
    groupId: 1,
    id: 2,
    isPinned: false,
    title: "11월 합주실 이용 시간 변경",
  },
  {
    body: "이번 주 잼 세션은 토요일 오후 2시에 합정에서 열려요.",
    createdAt: "2026-11-01T09:00:00",
    groupId: 2,
    id: 3,
    isPinned: true,
    title: "이번 주 잼 세션 안내",
  },
];

export const SONGS: Song[] = [
  {
    artist: "Radiohead",
    bpm: 87,
    difficulty: [
      { level: "INTERMEDIATE", part: "VOCAL" },
      { level: "NOVICE", part: "AC_GT" },
    ],
    genre: "ROCK",
    id: 101,
    songKey: "A",
    title: "High and Dry",
  },
  {
    artist: "검정치마",
    bpm: 120,
    difficulty: [
      { level: "NOVICE", part: "VOCAL" },
      { level: "INTERMEDIATE", part: "EL_GT" },
    ],
    genre: "INDIE",
    id: 102,
    songKey: "E",
    title: "Antifreeze",
  },
  {
    artist: "CORTIS",
    bpm: 112,
    difficulty: [{ level: "INTERMEDIATE", part: "VOCAL" }],
    genre: "POP",
    id: 103,
    songKey: "C#m",
    title: "BIRDS",
  },
  {
    artist: "DAY6",
    bpm: 131,
    difficulty: [
      { level: "INTERMEDIATE", part: "DRUM" },
      { level: "NOVICE", part: "BASS" },
    ],
    genre: "ROCK",
    id: 104,
    songKey: "D",
    title: "한 페이지가 될 수 있게",
  },
  {
    artist: "Oasis",
    bpm: 82,
    difficulty: [{ level: "NOVICE", part: "AC_GT" }],
    genre: "ROCK",
    id: 105,
    songKey: "C",
    title: "Don't Look Back in Anger",
  },
  {
    artist: "무한궤도",
    bpm: 138,
    difficulty: [{ level: "INTERMEDIATE", part: "KEY" }],
    genre: "ROCK",
    id: 106,
    songKey: "F",
    title: "그대에게",
  },
  {
    artist: "Nirvana",
    bpm: 117,
    difficulty: [{ level: "ADVANCED", part: "DRUM" }],
    genre: "ROCK",
    id: 107,
    songKey: "Fm",
    title: "Smells Like Teen Spirit",
  },
  {
    artist: "윤하",
    bpm: 128,
    difficulty: [{ level: "ADVANCED", part: "VOCAL" }],
    genre: "POP",
    id: 108,
    songKey: "E",
    title: "사건의 지평선",
  },
];

export const TEAMS: Team[] = [
  {
    description: "인디 록 사운드를 함께 만드는 밴드",
    genres: ["INDIE", "ROCK"],
    id: 1,
    leaderId: 1,
    members: [
      {
        instrument: "KEY",
        role: "LEADER",
        user: { id: 1, nickname: "김광철", profileImage: null },
      },
      {
        instrument: "VOCAL",
        role: "MEMBER",
        user: { id: 2, nickname: "이보컬", profileImage: null },
      },
      {
        instrument: "BASS",
        role: "MEMBER",
        user: { id: 4, nickname: "박베이스", profileImage: null },
      },
      {
        instrument: "EL_GT",
        role: "MEMBER",
        user: { id: 6, nickname: "정일렉", profileImage: null },
      },
    ],
    myRole: "LEADER",
    name: "블루 웨이브",
    performanceId: 1,
    region: "SEOUL",
    songIds: [101, 102, 105],
  },
  {
    description: "퇴근 후 시티팝을 연주하는 직장인 밴드",
    genres: ["POP"],
    id: 2,
    leaderId: 6,
    members: [
      {
        instrument: "EL_GT",
        role: "LEADER",
        user: { id: 6, nickname: "정일렉", profileImage: null },
      },
      {
        instrument: "KEY",
        role: "MEMBER",
        user: { id: 1, nickname: "김광철", profileImage: null },
      },
      {
        instrument: "DRUM",
        role: "MEMBER",
        user: { id: 3, nickname: "박드럼", profileImage: null },
      },
    ],
    myRole: "MEMBER",
    name: "나이트 드라이브",
    performanceId: null,
    region: "SEOUL",
    songIds: [103],
  },
  {
    description: "공연을 준비하는 하드 록 밴드",
    genres: ["ROCK", "METAL"],
    id: 3,
    leaderId: 4,
    members: [
      {
        instrument: "BASS",
        role: "LEADER",
        user: { id: 4, nickname: "박베이스", profileImage: null },
      },
      {
        instrument: "VOCAL",
        role: "MEMBER",
        user: { id: 5, nickname: "강보컬", profileImage: null },
      },
      {
        instrument: "DRUM",
        role: "MEMBER",
        user: { id: 3, nickname: "박드럼", profileImage: null },
      },
    ],
    myRole: null,
    name: "라우드 룸",
    performanceId: 1,
    region: "SEOUL",
    songIds: [104, 107],
  },
];

export const PERFORMANCES: Performance[] = [
  {
    description:
      "1년에 한 번 하는 정기공연입니다. 공연 팀을 만들어 참가하고, 팀별로 고른 곡을 셋리스트로 넘겨 주세요.",
    groupId: 1,
    id: 1,
    performedAt: "2026-12-12T18:00:00",
    posterImage: null,
    setlist: [
      { songId: 101, sortOrder: null, teamId: 1 },
      { songId: 102, sortOrder: null, teamId: 1 },
      { songId: 104, sortOrder: null, teamId: 3 },
      { songId: 107, sortOrder: null, teamId: 3 },
    ],
    setlistConfirmed: false,
    status: "RECRUITING",
    teamIds: [1, 3],
    title: "2026 가을 정기공연",
    venue: "홍대 롤링홀",
  },
  {
    description: "봄맞이 야외 록 페스티벌 무대입니다.",
    groupId: 1,
    id: 2,
    performedAt: "2027-03-21T17:00:00",
    posterImage: null,
    setlist: [],
    setlistConfirmed: false,
    status: "PLANNED",
    teamIds: [],
    title: "봄날 록 페스티벌",
    venue: "난지 한강공원",
  },
  {
    description: "여름 클럽 공연을 마쳤어요.",
    groupId: 1,
    id: 3,
    performedAt: "2026-08-15T19:00:00",
    posterImage: null,
    setlist: [
      { songId: 105, sortOrder: 1, teamId: 1 },
      { songId: 106, sortOrder: 2, teamId: 1 },
    ],
    setlistConfirmed: true,
    status: "DONE",
    teamIds: [],
    title: "2026 여름 클럽 공연",
    venue: "홍대 클럽 FF",
  },
];

export const RECRUIT_POSTS: RecruitPost[] = [
  {
    authorId: 9,
    body: "홍대에서 활동해요. 인디 록과 얼터너티브를 좋아하는 분이면 좋아요. 실력보다 꾸준히 함께할 수 있는 분을 찾고 있어요!",
    createdAt: "2026-11-04T10:00:00",
    id: 1,
    region: "SEOUL",
    status: "OPEN",
    targetId: 3,
    targetType: "GROUP",
    title: "홍대 주말 합주 보컬을 찾고 있어요",
    wantedSlots: [{ appliedCount: 2, count: 1, instrument: "VOCAL" }],
  },
  {
    authorId: 6,
    body: "합정에서 활동해요. 수요일 저녁, 부담 없이 오래 함께할 베이스를 찾아요.",
    createdAt: "2026-11-03T21:00:00",
    id: 2,
    region: "SEOUL",
    status: "OPEN",
    targetId: 2,
    targetType: "TEAM",
    title: "합정 퇴근 후 베이스 세션 구해요",
    wantedSlots: [{ appliedCount: 1, count: 1, instrument: "BASS" }],
  },
  {
    authorId: 4,
    body: "신촌에서 서로의 데모를 듣고 편곡하는 자작곡 스터디예요.",
    createdAt: "2026-11-01T15:00:00",
    id: 3,
    region: "SEOUL",
    status: "OPEN",
    targetId: 3,
    targetType: "TEAM",
    title: "신촌 자작곡 스터디 멤버 구해요",
    wantedSlots: [
      { appliedCount: 0, count: 1, instrument: "KEY" },
      { appliedCount: 3, count: 1, instrument: "EL_GT" },
    ],
  },
  {
    authorId: 1,
    body: "가을 정기공연에 함께 설 드러머를 찾아요. 주 1회 홍대에서 합주합니다.",
    createdAt: "2026-10-30T09:00:00",
    id: 4,
    region: "SEOUL",
    status: "OPEN",
    targetId: 1,
    targetType: "TEAM",
    title: "가을 정기공연 드럼 구해요",
    wantedSlots: [{ appliedCount: 1, count: 1, instrument: "DRUM" }],
  },
  {
    authorId: 3,
    body: "신촌에서 매주 금요일 블루스 잼을 해요. 모임에 들어오면 정기공연 무대에도 설 수 있어요.",
    createdAt: "2026-11-05T18:00:00",
    id: 6,
    region: "SEOUL",
    status: "OPEN",
    targetId: 4,
    targetType: "GROUP",
    title: "신촌 블루스 클럽 신입 모집",
    wantedSlots: [
      { appliedCount: 1, count: 2, instrument: "EL_GT" },
      { appliedCount: 0, count: 1, instrument: "KEY" },
    ],
  },
  {
    authorId: 8,
    body: "망원에서 매주 모이는 잼 세션 모임이에요.",
    createdAt: "2026-10-20T09:00:00",
    id: 5,
    region: "SEOUL",
    status: "CLOSED",
    targetId: 2,
    targetType: "GROUP",
    title: "망원 주말 잼 세션 멤버 모집",
    wantedSlots: [{ appliedCount: 0, count: 2, instrument: "VOCAL" }],
  },
];

export const REHEARSALS: Rehearsal[] = [
  {
    endsAt: atDaysFromToday(0, 21),
    id: 1,
    place: "합주실 A",
    startsAt: atDaysFromToday(0, 19),
    teamId: 1,
    title: "밴드 합주",
  },
  {
    endsAt: atDaysFromToday(3, 22),
    id: 2,
    place: "홍대 연습실 A",
    startsAt: atDaysFromToday(3, 20),
    teamId: 1,
    title: "정기공연 리허설",
  },
  {
    endsAt: atDaysFromToday(8, 17),
    id: 3,
    place: "합정 모여락 스튜디오",
    startsAt: atDaysFromToday(8, 14),
    teamId: 2,
    title: "주말 합주",
  },
];

/** 내가 낸 가입 신청 + 내가 관리하는 대상(모임 1·팀 1)으로 들어온 신청 */
export const JOIN_REQUESTS: JoinRequest[] = [
  {
    applicantId: 1,
    createdAt: "2026-11-05T10:00:00",
    id: 1,
    instrument: null,
    message: "보컬은 아니지만 키보드로 함께하고 싶어요.",
    recruitPostId: 1,
    status: "PENDING",
    targetId: 3,
    targetType: "GROUP",
  },
  {
    applicantId: 1,
    createdAt: "2026-10-25T10:00:00",
    id: 2,
    instrument: "KEY",
    message: "",
    recruitPostId: 3,
    status: "REJECTED",
    targetId: 3,
    targetType: "TEAM",
  },
  {
    applicantId: 9,
    createdAt: "2026-11-06T09:00:00",
    id: 3,
    instrument: null,
    message: "어쿠스틱 나이트에서 활동 중인데 함께 공연하고 싶어요.",
    recruitPostId: null,
    status: "PENDING",
    targetId: 1,
    targetType: "GROUP",
  },
  {
    applicantId: 3,
    createdAt: "2026-11-06T08:00:00",
    id: 4,
    instrument: "DRUM",
    message: "드럼 5년 쳤습니다.",
    recruitPostId: 4,
    status: "PENDING",
    targetId: 1,
    targetType: "TEAM",
  },
];

export const INVITATIONS: Invitation[] = [
  {
    createdAt: "2026-11-06T07:50:00",
    id: 1,
    instrument: "KEY",
    inviteeId: 1,
    inviterId: 4,
    message: "키보드 자리가 비어 있어요, 같이 하실래요?",
    status: "PENDING",
    targetId: 3,
    targetType: "TEAM",
  },
  {
    createdAt: "2026-11-04T07:50:00",
    id: 2,
    instrument: "AC_GT",
    inviteeId: 7,
    inviterId: 1,
    message: "어쿠스틱 편곡에 함께해 주세요!",
    status: "PENDING",
    targetId: 1,
    targetType: "TEAM",
  },
];

export const NOTIFICATIONS: AppNotification[] = [
  {
    createdAt: "2026-11-06T09:00:00",
    id: 1,
    isRead: false,
    message: "프로젝트 모임에 가입 신청이 왔어요",
    targetId: 3,
    targetType: "JOIN_REQUEST",
    type: "RECRUIT_POST_APPLIED",
  },
  {
    createdAt: "2026-11-06T08:00:00",
    id: 2,
    isRead: false,
    message: "블루 웨이브에 드럼 지원이 왔어요",
    targetId: 4,
    targetType: "JOIN_REQUEST",
    type: "TEAM_APPLY",
  },
  {
    createdAt: "2026-11-06T07:50:00",
    id: 3,
    isRead: false,
    message: "라우드 룸에서 키보드 세션으로 초대했어요",
    targetId: 1,
    targetType: "INVITATION",
    type: "TEAM_INVITE",
  },
  {
    createdAt: "2026-11-05T12:00:00",
    id: 4,
    isRead: true,
    message: "프로젝트 모임에 새 공연이 등록됐어요",
    targetId: 2,
    targetType: "PERFORMANCE",
    type: "PERFORMANCE_CREATED",
  },
  {
    createdAt: "2026-11-02T09:00:00",
    id: 5,
    isRead: true,
    message: "프로젝트 모임에 새 공지가 올라왔어요",
    targetId: 1,
    targetType: "NOTICE",
    type: "NOTICE_CREATED",
  },
  {
    createdAt: "2026-10-26T09:00:00",
    id: 6,
    isRead: true,
    message: "주말 잼 세션 가입이 승인됐어요",
    targetId: 2,
    targetType: "GROUP",
    type: "JOIN_REQUEST_APPROVED",
  },
];

export const BOOKMARKS: Bookmark[] = [
  { id: 1, targetId: 2, targetType: "USER" },
  { id: 2, targetId: 3, targetType: "USER" },
  { id: 3, targetId: 7, targetType: "USER" },
  { id: 4, targetId: 2, targetType: "TEAM" },
  { id: 5, targetId: 3, targetType: "TEAM" },
  { id: 6, targetId: 103, targetType: "SONG" },
];
