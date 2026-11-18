import cityVocalAvatar from "@/assets/avatar/city-vocal.jpg";
import type {
  AppNotification,
  Bookmark,
  Group,
  GroupMember,
  GroupRole,
  Instrument,
  Invitation,
  JoinRequest,
  Level,
  Notice,
  Performance,
  PracticeRecording,
  RecruitPost,
  Rehearsal,
  Song,
  Team,
  User,
} from "@/lib/domain/types";

// 백엔드가 붙기 전까지 모든 화면이 함께 쓰는 가짜 데이터. 모양은 서버 DTO(`docs/specs/dto-spec.md`)를
// 따르고, 이름·곡은 Figma "UI 최종 디자인"(404:10893) 화면에 나오는 것을 그대로 쓴다.
// 상세 화면은 반드시 라우트 파라미터로 여기서 찾아 그린다.
//
// "나"(ME_ID = 시티보컬)의 입장:
// - 프로젝트 모임(1): 모임장 → 모임 관리·공지·공연 만들기·셋리스트 확정
// - 주말 잼 세션(2): 멤버 — 2026 가을 정기공연(공연 1)을 연다
// - 록 하우스 서울(3): 운영진 / 어쿠스틱 나이트(4): 비회원 → 가입 신청
// - 블루 웨이브(1): 공연 1의 공연 팀, 팀장 → 선택곡을 공연에 넘기기
// - 나이트 드라이브(2): 독립 팀, 팀장 → 팀원 초대·AI 추천

export const ME_ID = 1;

/** "오늘" 기준 날짜 — 날짜를 박아 두면 며칠만 지나도 홈의 오늘 합주·D-day가 어긋난다. */
function atDaysFromToday(days: number, hour: number, minute = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  return toLocalIso(date);
}

function minutesAgo(minutes: number): string {
  return toLocalIso(new Date(Date.now() - minutes * 60_000));
}

/** 서버가 주는 형식(오프셋 없는 로컬 시각 "2026-11-12T19:00:00")으로 만든다. */
function toLocalIso(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
}

function user(
  id: number,
  nickname: string,
  instruments: [Instrument, Level][],
  extra: Partial<User> = {},
): User {
  return {
    bio: "",
    genres: ["ROCK"],
    id,
    instruments: instruments.map(([instrument, level]) => ({
      instrument,
      level,
    })),
    isActivityPublic: true,
    nickname,
    profileImage: null,
    region: "SEOUL",
    ...extra,
  };
}

export const USERS: User[] = [
  user(
    1,
    "시티보컬",
    [
      ["VOCAL", "INTERMEDIATE"],
      ["EL_GT", "NOVICE"],
    ],
    {
      bio: "퇴근하고 시티팝 부르는 보컬이에요.",
      genres: ["POP", "RNB"],
      profileImage: cityVocalAvatar,
    },
  ),
  user(
    2,
    "새벽기타",
    [
      ["EL_GT", "INTERMEDIATE"],
      ["AC_GT", "NOVICE"],
    ],
    { bio: "주말엔 합주실에 살아요. 펑크랑 이모 좋아해요.", genres: ["PUNK"] },
  ),
  user(
    3,
    "록스타",
    [
      ["EL_GT", "ADVANCED"],
      ["VOCAL", "INTERMEDIATE"],
    ],
    { bio: "주말 잼 세션을 운영해요. 펑크·록 위주로 합주해요." },
  ),
  user(4, "낮은음자리", [["BASS", "INTERMEDIATE"]], {
    bio: "펑크랑 이모 좋아하는 베이스예요.",
    genres: ["PUNK", "ROCK"],
  }),
  user(5, "드럼치는곰", [["DRUM", "INTERMEDIATE"]], {
    bio: "주말 합주 가능해요.",
  }),
  user(6, "키보드윤", [["KEY", "INTERMEDIATE"]], {
    bio: "R&B를 즐겨 들어요.",
    genres: ["RNB", "POP"],
    region: "GYEONGGI",
  }),
  user(7, "그루브정", [["BASS", "ADVANCED"]], { genres: ["POP"] }),
  user(8, "하이햇", [["DRUM", "NOVICE"]], { genres: ["INDIE"] }),
  user(9, "어쿠스틱오", [["AC_GT", "INTERMEDIATE"]], {
    genres: ["ACOUSTIC"],
  }),
  user(10, "블루노트", [["VOCAL", "ADVANCED"]], { genres: ["JAZZ"] }),
  user(11, "펑크소년", [["EL_GT", "NOVICE"]], { genres: ["PUNK"] }),
  user(12, "건반요정", [["KEY", "NOVICE"]], { genres: ["BALLAD"] }),
  user(13, "리듬박", [["DRUM", "ADVANCED"]], { isActivityPublic: false }),
  user(14, "어반보이스", [["VOCAL", "NOVICE"]], { genres: ["HIPHOP"] }),
];

function findUser(id: number): User {
  return USERS.find((u) => u.id === id) as User;
}

export const GROUPS: Group[] = [
  {
    coverImage: null,
    createdAt: "2025-03-02T12:00:00",
    description: "좋아하는 음악으로 함께 무대를 만드는 모임이에요.",
    id: 1,
    memberCount: 12,
    myRole: "OWNER",
    name: "프로젝트 모임",
    ownerId: 1,
    region: "SEOUL",
    type: "REGULAR",
  },
  {
    coverImage: null,
    createdAt: "2024-04-06T12:00:00",
    description: "매주 토요일 오후 2시, 마포 합주실 A에서 합주해요.",
    id: 2,
    memberCount: 8,
    myRole: "MEMBER",
    name: "주말 잼 세션",
    ownerId: 3,
    region: "SEOUL",
    type: "REGULAR",
  },
  {
    coverImage: null,
    createdAt: "2025-09-15T12:00:00",
    description: "서울에서 록 공연을 함께 준비하는 프로젝트 모임이에요.",
    id: 3,
    memberCount: 23,
    myRole: "MANAGER",
    name: "록 하우스 서울",
    ownerId: 10,
    region: "SEOUL",
    type: "PROJECT",
  },
  {
    // 아직 신청하지 않은 비회원 모임 — 가입 신청 흐름을 시연한다.
    coverImage: null,
    createdAt: "2026-08-21T12:00:00",
    description: "작은 공연을 준비하는 어쿠스틱 모임이에요.",
    id: 4,
    memberCount: 6,
    myRole: null,
    name: "어쿠스틱 나이트",
    ownerId: 9,
    region: "GYEONGGI",
    type: "REGULAR",
  },
];

function members(
  ownerId: number,
  userIds: number[],
  joinedAt: string,
  roles: Record<number, GroupRole> = {},
): GroupMember[] {
  return userIds.map((userId) => {
    const u = findUser(userId);
    return {
      instruments: u.instruments,
      joinedAt,
      nickname: u.nickname,
      profileImage: u.profileImage,
      role: userId === ownerId ? "OWNER" : (roles[userId] ?? "MEMBER"),
      userId,
    };
  });
}

export const GROUP_MEMBERS: Record<number, GroupMember[]> = {
  1: members(
    1,
    [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14],
    "2025-03-02T12:00:00",
  ),
  2: members(3, [3, 1, 2, 4, 5, 6, 7, 8], "2024-04-06T12:00:00"),
  3: members(10, [10, 1, 3, 11, 13, 14], "2025-09-15T12:00:00", {
    1: "MANAGER",
  }),
  4: members(9, [9, 2, 6, 7, 12, 13], "2026-08-21T12:00:00"),
};

/** 공지 목록(NoticeSummaryResponse)에는 작성자가 없다 — 화면은 날짜만 보여 준다. */
export const NOTICES: Notice[] = [
  {
    body: "가을 정기공연 순서가 나왔어요. 블루 웨이브 → 새벽 세션 → 펑크 클럽 순이고, 팀마다 20분이에요.",
    createdAt: "2026-11-12T09:00:00",
    groupId: 2,
    id: 1,
    isPinned: true,
    title: "11월 정기 공연 순서 나왔어요",
  },
  {
    body: "11월부터 합주실 이용 시간이 저녁 7시~11시로 바뀌어요.",
    createdAt: "2026-11-03T09:00:00",
    groupId: 2,
    id: 2,
    isPinned: false,
    title: "합주실 이용 시간이 바뀌었어요",
  },
  {
    body: "봄날 록 페스티벌 참가 팀을 모아요. 공연 정보에서 공연 팀을 만들어 주세요.",
    createdAt: "2026-11-05T09:00:00",
    groupId: 1,
    id: 3,
    isPinned: true,
    title: "봄 페스티벌 참가 팀 모집",
  },
];

function song(
  id: number,
  title: string,
  artist: string,
  genre: Song["genre"],
  bpm: number,
  songKey = "C",
): Song {
  return {
    artist,
    bpm,
    difficulty: [
      { level: "NOVICE", part: "VOCAL" },
      { level: "INTERMEDIATE", part: "EL_GT" },
      { level: "NOVICE", part: "BASS" },
      { level: "INTERMEDIATE", part: "DRUM" },
    ],
    genre,
    id,
    songKey,
    title,
  };
}

export const SONGS: Song[] = [
  song(101, "Plastic Love", "Mariya Takeuchi", "POP", 104, "Am"),
  song(102, "Hype Boy", "NewJeans", "POP", 100, "E"),
  song(103, "Antifreeze", "검정치마", "INDIE", 120, "D"),
  song(104, "Basket Case", "Green Day", "PUNK", 172, "Eb"),
  song(105, "Plastic Hearts", "Miley Cyrus", "POP", 122, "G"),
  song(106, "Plastic Beach", "Gorillaz", "ROCK", 110, "C"),
  song(107, "Plastic", "Moses Sumney", "INDIE", 80, "F"),
  song(108, "사건의 지평선", "윤하", "BALLAD", 128, "E"),
  song(109, "Don't Look Back in Anger", "Oasis", "ROCK", 82, "C"),
  song(110, "Creep", "Radiohead", "ROCK", 92, "G"),
  song(111, "American Idiot", "Green Day", "PUNK", 186, "Ab"),
  song(112, "그대에게", "무한궤도", "ROCK", 140, "D"),
  // 아래는 AI 곡 추천(Figma 27) 목업에 나오는 곡 — 추천 근거("… 실력 충족/난이도 초과")가 팀원 실력과
  // 맞도록 세션별 난이도를 따로 둔다(src/mocks/recommendations.ts).
  {
    ...song(113, "Get Lucky", "Daft Punk", "POP", 116, "F#m"),
    difficulty: [
      { level: "NOVICE", part: "VOCAL" },
      { level: "NOVICE", part: "AC_GT" },
      { level: "INTERMEDIATE", part: "EL_GT" },
      { level: "INTERMEDIATE", part: "BASS" },
      { level: "NOVICE", part: "DRUM" },
    ],
  },
  {
    ...song(114, "Love Galore", "SZA", "RNB", 135, "C#m"),
    difficulty: [
      { level: "INTERMEDIATE", part: "VOCAL" },
      { level: "NOVICE", part: "KEY" },
      { level: "NOVICE", part: "BASS" },
      { level: "NOVICE", part: "DRUM" },
    ],
  },
  {
    ...song(115, "Sunday Morning", "Maroon 5", "POP", 88, "C"),
    difficulty: [
      { level: "INTERMEDIATE", part: "VOCAL" },
      { level: "NOVICE", part: "AC_GT" },
      { level: "NOVICE", part: "EL_GT" },
      { level: "INTERMEDIATE", part: "KEY" },
      { level: "NOVICE", part: "BASS" },
      { level: "NOVICE", part: "DRUM" },
    ],
  },
  {
    ...song(116, "Superstition", "Stevie Wonder", "RNB", 100, "Ebm"),
    difficulty: [
      { level: "INTERMEDIATE", part: "VOCAL" },
      { level: "INTERMEDIATE", part: "AC_GT" },
      { level: "INTERMEDIATE", part: "EL_GT" },
      { level: "ADVANCED", part: "KEY" },
      { level: "INTERMEDIATE", part: "BASS" },
      { level: "ADVANCED", part: "DRUM" },
    ],
  },
  {
    ...song(117, "Electric Feel", "MGMT", "INDIE", 103, "A"),
    difficulty: [
      { level: "NOVICE", part: "VOCAL" },
      { level: "NOVICE", part: "EL_GT" },
      { level: "INTERMEDIATE", part: "KEY" },
      { level: "INTERMEDIATE", part: "BASS" },
      { level: "NOVICE", part: "DRUM" },
    ],
  },
  {
    ...song(118, "Leave The Door Open", "Silk Sonic", "RNB", 74, "C"),
    difficulty: [
      { level: "ADVANCED", part: "VOCAL" },
      { level: "NOVICE", part: "AC_GT" },
      { level: "INTERMEDIATE", part: "KEY" },
      { level: "INTERMEDIATE", part: "BASS" },
      { level: "NOVICE", part: "DRUM" },
    ],
  },
  // 세션 난이도 정보가 없는 곡 — 추천 근거(reasons)가 빈 배열인 경우를 보여 준다.
  {
    ...song(119, "Fly Me to the Moon", "Frank Sinatra", "JAZZ", 120, "C"),
    difficulty: [],
  },
];

function teamMember(
  userId: number,
  instrument: Instrument,
  role: "LEADER" | "MEMBER" = "MEMBER",
) {
  const u = findUser(userId);
  return {
    instrument,
    role,
    user: { id: u.id, nickname: u.nickname, profileImage: u.profileImage },
  };
}

export const TEAMS: Team[] = [
  {
    description: "가을 정기공연을 준비하는 팀이에요.",
    genres: ["POP", "ROCK"],
    id: 1,
    leaderId: 1,
    members: [
      teamMember(1, "VOCAL", "LEADER"),
      teamMember(2, "EL_GT"),
      teamMember(4, "BASS"),
      teamMember(5, "DRUM"),
    ],
    myRole: "LEADER",
    name: "블루 웨이브",
    performanceId: 1,
    region: "SEOUL",
    songIds: [101, 102, 103, 104],
  },
  {
    description: "밤에 듣기 좋은 팝·R&B를 합주해요.",
    genres: ["POP", "RNB"],
    id: 2,
    leaderId: 1,
    members: [teamMember(1, "VOCAL", "LEADER"), teamMember(2, "AC_GT")],
    myRole: "LEADER",
    name: "나이트 드라이브",
    performanceId: null,
    region: "SEOUL",
    songIds: [101, 102, 103, 104],
  },
  {
    description: "새벽 감성 록 밴드예요.",
    genres: ["ROCK"],
    id: 3,
    leaderId: 3,
    members: [
      teamMember(3, "EL_GT", "LEADER"),
      teamMember(6, "KEY"),
      teamMember(7, "BASS"),
      teamMember(8, "DRUM"),
      teamMember(10, "VOCAL"),
    ],
    myRole: null,
    name: "새벽 세션",
    performanceId: 1,
    region: "SEOUL",
    songIds: [109, 110, 112],
  },
  {
    description: "빠른 펑크만 해요.",
    genres: ["PUNK"],
    id: 4,
    leaderId: 11,
    members: [
      teamMember(11, "EL_GT", "LEADER"),
      teamMember(14, "VOCAL"),
      teamMember(4, "BASS"),
      teamMember(13, "DRUM"),
    ],
    myRole: null,
    name: "펑크 클럽",
    performanceId: 1,
    region: "SEOUL",
    songIds: [111, 104],
  },
];

export const PERFORMANCES: Performance[] = [
  {
    description:
      "한 해 동안 합주한 곡으로 무대에 올라요.\n팀마다 3곡, 20분씩이에요. 리허설은 당일 15시부터예요.",
    groupId: 2,
    id: 1,
    performedAt: atDaysFromToday(8, 18),
    posterImage: null,
    setlist: [
      { songId: 101, sortOrder: null, teamId: 1 },
      { songId: 102, sortOrder: null, teamId: 1 },
      { songId: 103, sortOrder: null, teamId: 1 },
      { songId: 109, sortOrder: null, teamId: 3 },
      { songId: 110, sortOrder: null, teamId: 3 },
      { songId: 112, sortOrder: null, teamId: 3 },
      { songId: 111, sortOrder: null, teamId: 4 },
      { songId: 104, sortOrder: null, teamId: 4 },
    ],
    setlistConfirmed: false,
    status: "PLANNED",
    teamIds: [1, 3, 4],
    title: "2026 가을 정기공연",
    venue: "홍대 롤링홀",
  },
  {
    description: "봄맞이 야외 록 페스티벌 무대예요.",
    groupId: 1,
    id: 2,
    performedAt: "2027-03-21T17:00:00",
    posterImage: null,
    setlist: [],
    setlistConfirmed: false,
    status: "RECRUITING",
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
    setlist: [{ songId: 108, sortOrder: 1, teamId: 1 }],
    setlistConfirmed: true,
    status: "DONE",
    teamIds: [],
    title: "2026 여름 클럽 공연",
    venue: "홍대 클럽 FF",
  },
];

/** 모임 공고는 모임장(모임 1은 나), 팀 공고는 팀장이 쓴다. 공연 팀은 공고를 올릴 수 없다. */
export const RECRUIT_POSTS: RecruitPost[] = [
  {
    authorId: 3,
    body: "매주 토요일 오후 2시, 마포 합주실 A에서 합주해요.\n그린데이, 블링크-182 같은 펑크 곡을 주로 하고요.\n밴드가 처음이어도 괜찮으니 편하게 지원해 주세요.",
    createdAt: atDaysFromToday(-2, 10),
    id: 1,
    region: "SEOUL",
    status: "OPEN",
    targetId: 2,
    targetType: "GROUP",
    title: "주말 잼 세션에서 드럼을 찾아요",
    wantedSlots: [{ appliedCount: 2, count: 1, instrument: "DRUM" }],
  },
  {
    authorId: 1,
    body: "봄 페스티벌을 같이 준비할 베이스를 찾아요. 주 1회 홍대에서 합주해요.",
    createdAt: atDaysFromToday(-3, 10),
    id: 2,
    region: "SEOUL",
    status: "OPEN",
    targetId: 1,
    targetType: "GROUP",
    title: "정기공연 같이 준비할 베이스 구해요",
    wantedSlots: [{ appliedCount: 1, count: 1, instrument: "BASS" }],
  },
  {
    authorId: 1,
    body: "홍대 근처에서 주말마다 합주해요. 시티팝·R&B를 주로 하고, 처음 맞춰 보는 분도 괜찮아요.",
    createdAt: atDaysFromToday(-4, 21),
    id: 4,
    region: "SEOUL",
    status: "OPEN",
    targetId: 2,
    targetType: "TEAM",
    title: "주말 합주할 베이스를 찾아요",
    wantedSlots: [{ appliedCount: 1, count: 1, instrument: "BASS" }],
  },
  {
    authorId: 10,
    body: "록 공연을 처음 해 보는 분도 괜찮아요. 매달 한 번 공연해요.",
    createdAt: atDaysFromToday(-7, 15),
    id: 3,
    region: "SEOUL",
    status: "OPEN",
    targetId: 3,
    targetType: "GROUP",
    title: "밴드 처음이어도 괜찮아요, 보컬 모집",
    wantedSlots: [
      { appliedCount: 0, count: 2, instrument: "VOCAL" },
      { appliedCount: 1, count: 1, instrument: "KEY" },
    ],
  },
  {
    // 내가 아직 들어가지 않은 모임의 공고 — 모집글 상세에서 지원하기 흐름을 시연한다.
    authorId: 9,
    body: "경기 남부에서 활동하는 어쿠스틱 모임이에요.\n한 달에 한 번 작은 카페 공연을 해요. 노래하는 분도 환영해요.",
    createdAt: atDaysFromToday(-10, 9),
    id: 5,
    region: "GYEONGGI",
    status: "OPEN",
    targetId: 4,
    targetType: "GROUP",
    title: "어쿠스틱 나이트 새 멤버 모집",
    wantedSlots: [
      { appliedCount: 0, count: 2, instrument: "AC_GT" },
      { appliedCount: 1, count: 1, instrument: "VOCAL" },
    ],
  },
  {
    authorId: 10,
    body: "지난 공연을 함께할 키보드를 찾았어요. 감사합니다!",
    createdAt: atDaysFromToday(-25, 9),
    id: 6,
    region: "SEOUL",
    status: "CLOSED",
    targetId: 3,
    targetType: "GROUP",
    title: "록 하우스 서울 키보드 모집",
    wantedSlots: [{ appliedCount: 0, count: 1, instrument: "KEY" }],
  },
];

export const REHEARSALS: Rehearsal[] = [
  {
    endsAt: atDaysFromToday(0, 21),
    id: 1,
    memo: "공연 셋리스트 3곡 처음부터 끝까지",
    place: "합주실 A",
    startsAt: atDaysFromToday(0, 19),
    teamId: 1,
    title: "블루 웨이브 합주",
  },
  {
    endsAt: atDaysFromToday(2, 16),
    id: 2,
    memo: "",
    place: "연습실 B",
    startsAt: atDaysFromToday(2, 14),
    teamId: 2,
    title: "나이트 드라이브 합주",
  },
  {
    endsAt: atDaysFromToday(5, 21),
    id: 3,
    memo: "",
    place: "합주실 A",
    startsAt: atDaysFromToday(5, 19),
    teamId: 1,
    title: "블루 웨이브 합주",
  },
];

export const JOIN_REQUESTS: JoinRequest[] = [
  {
    // 내 신청 — 같은 모임(주말 잼 세션)의 다른 공연 팀에 일렉 기타로
    applicantId: 1,
    createdAt: atDaysFromToday(-1, 10),
    id: 1,
    instrument: "EL_GT",
    message: "일렉 기타로 함께하고 싶어요.",
    recruitPostId: null,
    status: "PENDING",
    targetId: 3,
    targetType: "TEAM",
  },
  {
    // 받은 신청 — 내 팀(나이트 드라이브) 베이스 모집에 지원
    applicantId: 2,
    createdAt: minutesAgo(10),
    id: 2,
    instrument: "BASS",
    message: "베이스도 칠 수 있어요!",
    recruitPostId: 4,
    status: "PENDING",
    targetId: 2,
    targetType: "TEAM",
  },
  {
    // 받은 신청 — 내 모임(프로젝트 모임)
    applicantId: 7,
    createdAt: atDaysFromToday(-2, 18),
    id: 3,
    instrument: null,
    message: "봄 페스티벌 같이 준비하고 싶어요.",
    recruitPostId: 2,
    status: "PENDING",
    targetId: 1,
    targetType: "GROUP",
  },
];

export const INVITATIONS: Invitation[] = [
  {
    // 받은 초대
    createdAt: minutesAgo(120),
    id: 1,
    instrument: "EL_GT",
    inviteeId: 1,
    inviterId: 11,
    message: "",
    status: "PENDING",
    targetId: 4,
    targetType: "TEAM",
  },
  {
    // 보낸 초대 — 나이트 드라이브 팀장으로
    createdAt: atDaysFromToday(-1, 20),
    id: 2,
    instrument: "BASS",
    inviteeId: 7,
    inviterId: 1,
    message: "",
    status: "PENDING",
    targetId: 2,
    targetType: "TEAM",
  },
];

/** NotificationResponse. message는 서버(발행하는 쪽)가 만든 문장 그대로다. */
export const NOTIFICATIONS: AppNotification[] = [
  {
    createdAt: minutesAgo(10),
    id: 1,
    isRead: false,
    message: "새벽기타님이 베이스 모집에 지원했어요",
    targetId: 2,
    targetType: "JOIN_REQUEST",
    type: "TEAM_APPLY",
  },
  {
    createdAt: minutesAgo(60),
    id: 2,
    isRead: false,
    message: "주말 잼 세션에 새 공지가 올라왔어요",
    targetId: 1,
    targetType: "NOTICE",
    type: "NOTICE_CREATED",
  },
  {
    createdAt: minutesAgo(120),
    id: 3,
    isRead: false,
    message: "펑크 클럽에서 일렉 기타로 초대했어요",
    targetId: 1,
    targetType: "INVITATION",
    type: "TEAM_INVITE",
  },
  {
    createdAt: minutesAgo(60 * 24 * 2),
    id: 4,
    isRead: true,
    message: "블루 웨이브 팀 지원이 승인됐어요",
    targetId: 1,
    targetType: "TEAM",
    type: "JOIN_REQUEST_APPROVED",
  },
  {
    createdAt: minutesAgo(60 * 24 * 4),
    id: 5,
    isRead: true,
    message: "주말 잼 세션에 새 공연이 열렸어요",
    targetId: 1,
    targetType: "PERFORMANCE",
    type: "PERFORMANCE_CREATED",
  },
];

export const BOOKMARKS: Bookmark[] = [
  { id: 1, targetId: 4, targetType: "USER" },
  { id: 2, targetId: 5, targetType: "USER" },
  { id: 3, targetId: 6, targetType: "USER" },
  { id: 4, targetId: 10, targetType: "USER" },
  { id: 5, targetId: 1, targetType: "TEAM" },
  { id: 6, targetId: 104, targetType: "SONG" },
  { id: 7, targetId: 101, targetType: "SONG" },
  { id: 8, targetId: 108, targetType: "SONG" },
];

function songSummary(id: number) {
  const s = SONGS.find((item) => item.id === id) as Song;
  return { artist: s.artist, id: s.id, title: s.title };
}

/**
 * 내 연습 녹음(서버 §13). 녹음은 3~60초·1.95MB 이하만 올릴 수 있어서 길이도 그 안이다.
 * 한 사람당 진행 중(SUBMITTED·ANALYZING) 분석은 하나뿐이다 — 분석 중인 2번은 앱을 연 뒤 30초쯤
 * 끝난다(features/practice/practiceStore가 서버 진행을 흉내 낸다).
 * 피드백 한 줄 = 원곡과 다르게 연주한 구간 하나. 내용은 서버 고정 문장, 구간은 정수 초(시작 내림·끝 올림).
 */
export const PRACTICE_RECORDINGS: PracticeRecording[] = [
  {
    analyzedAt: "2026-11-12T20:13:00",
    createdAt: "2026-11-12T20:10:00",
    durationSec: 48,
    failureReason: null,
    feedbacks: [
      {
        content: "원곡 0:11~0:14 구간과 다르게 연주했어요.",
        endSec: 14,
        part: "VOCAL",
        startSec: 11,
      },
      {
        content: "원곡 0:27~0:30 구간과 다르게 연주했어요.",
        endSec: 30,
        part: "VOCAL",
        startSec: 27,
      },
      {
        content: "원곡 0:39~0:41 구간과 다르게 연주했어요.",
        endSec: 41,
        part: "VOCAL",
        startSec: 39,
      },
    ],
    id: 1,
    part: "VOCAL",
    song: songSummary(104),
    status: "DONE",
    title: "Basket Case 보컬 연습",
  },
  {
    analyzedAt: null,
    createdAt: "2026-11-10T22:40:00",
    durationSec: 44,
    failureReason: null,
    feedbacks: [],
    id: 2,
    part: "EL_GT",
    song: songSummary(103),
    status: "ANALYZING",
    title: "Antifreeze 일렉 기타 연습",
  },
  {
    analyzedAt: "2026-11-08T21:05:00",
    createdAt: "2026-11-08T21:02:00",
    durationSec: 52,
    failureReason: null,
    feedbacks: [
      {
        content: "원곡 0:06~0:09 구간과 다르게 연주했어요.",
        endSec: 9,
        part: "KEY",
        startSec: 6,
      },
      {
        content: "원곡 0:33~0:36 구간과 다르게 연주했어요.",
        endSec: 36,
        part: "KEY",
        startSec: 33,
      },
    ],
    id: 3,
    part: "KEY",
    song: songSummary(101),
    status: "DONE",
    title: "Plastic Love 키보드 연습",
  },
  {
    analyzedAt: null,
    createdAt: "2026-11-03T19:30:00",
    durationSec: 37,
    failureReason:
      "원곡과 맞추지 못했어요. 원곡과 같은 키·빠르기로 녹음했는지 확인해 주세요.",
    feedbacks: [],
    id: 4,
    part: "VOCAL",
    song: songSummary(102),
    status: "FAILED",
    title: "Hype Boy 보컬 연습",
  },
  {
    analyzedAt: "2026-10-28T23:01:00",
    createdAt: "2026-10-28T22:58:00",
    durationSec: 60,
    failureReason: null,
    feedbacks: [
      {
        content: "원곡 0:12~0:15 구간과 다르게 연주했어요.",
        endSec: 15,
        part: "VOCAL",
        startSec: 12,
      },
      {
        content: "원곡 0:39~0:42 구간과 다르게 연주했어요.",
        endSec: 42,
        part: "VOCAL",
        startSec: 39,
      },
    ],
    id: 5,
    part: "VOCAL",
    song: songSummary(108),
    status: "DONE",
    title: "사건의 지평선 보컬 연습",
  },
];
