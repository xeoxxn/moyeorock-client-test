# Figma "UI 최종 디자인" — WDS(원티드 디자인 시스템) 사용 컨벤션

> 종류: 살아있는 참고 문서. 새 화면을 구현할 때마다 이 문서부터 확인하고, 새로 확정되는 내용을 추가한다.
> 대상 파일: [🎨 컨퍼런스 디자인](https://www.figma.com/design/NrVoqKgMPnr2rQ4sOYFV46) (`fileKey: NrVoqKgMPnr2rQ4sOYFV46`), 페이지 "UI 최종 디자인" (`nodeId: 404:10893`)
> - Foundation(색·글자): 프레임 `410:11069`, 로컬 변수 컬렉션 "모여락 UI", 텍스트 스타일 `모여락/*`
> - 공통 컴포넌트 보드: `534:21678` — 코드의 공통 컴포넌트와 1:1
> - 화면: 00 스플래시 ~ 30 연습 분석 실패(14-B는 14의 대안 시안). 대응표는 각 `src/features/<섹션>/routes.tsx` 머리 주석
> - 글자 위계·구역 규칙 패널: `571:24140`(보드 맨 위)
> WDS 라이브러리 키: `lk-01f447137a741b37c25896e9a4e109dcb719fa4e54177be9a39d24b8da507c109279c2d1d0533b9943595d7d6a5ea398977f43b5d84e163797965d810ba79b69`

## 배경

2026-11 음악 앱(Spotify·YouTube Music·멜론) 스타일 다크 리디자인. 중립 검정 바탕(#101012)에 포인트는 발표 표지 주홍(#C64537) 하나, 테두리·그림자 없이 톤 차이와 여백으로 구분한다. 녹음 파형(Waveform)이 모티프이고, 사진 대신 커버색 + 파형 + 파트 영문 글자(Archivo Black)로 만든 앨범 아트(Cover)를 쓴다. 이전 "모여락 다크(네온)" 캔버스(`101:11294`)의 네온 글로우·마스코트는 모두 걷어냈다.

Figma는 Pretendard 대신 Noto Sans KR로 그려져 있다 — 코드는 WDS 기본 글꼴(Pretendard)을 그대로 쓴다.

## 화면 구현 시 반드시 지킬 것

1. **Figma의 "화면" ≠ 라우트 1개.** 시트(16·17·18·25·26~28)·빈 상태(15)·대안 시안(14-B)·분석 상태(29 비교 중·30 실패는 `/practice/:id`가 상태로 그린다)·스플래시(00)는 같은 화면 안의 상태다. 새 라우트를 만들지 않는다.
2. **상태 표시줄(9:41)·홈 막대는 구현하지 않는다.** 실기기 흉내 장식이다. 상단 안전영역은 `ScreenLayout`의 `pt-safe-top`이 맡는다.
3. **색·크기를 화면 파일에 하드코딩하지 않는다.** `src/index.css`의 토큰(아래 표)이나 WDS `Typography`/색 토큰 문자열만 쓴다. 새 값이 필요하면 `@theme`에 토큰을 추가한다.
4. **WDS를 무조건 쓴다.** 버튼·입력·목록·탭·배지·아바타·시트는 WDS 컴포넌트에 `sx`로 색·여백만 맞춘다. 맨 `<input>/<select>/<textarea>`는 쓰지 않는다(녹음 파일 고르기의 숨긴 `<input type="file">`만 예외).
5. **고정 픽셀 임의값 금지.** `h-[52px]` 대신 Tailwind 스케일(`h-13`·`size-30`·`h-90`)이나 분수(`h-1/3`). 커버 글자처럼 크기에 비례해야 하면 컨테이너 쿼리 단위(`cover-label`). WDS `sx`의 길이는 rem.
6. **에셋은 `src/assets/`에 받아 둔다.** Figma 임시 URL은 7일 뒤 만료된다. 로고 `brand/`, 알림 아이콘 `notify/`, 시작 화면 사진 `photo/`, 플레이어 아이콘 `player/`, 목업 프로필 `avatar/`.
7. **화면 데이터는 `@/mocks/selectors`에서 라우트 파라미터로 찾는다.** 모양은 서버 DTO(`src/lib/domain/types.ts`), enum 라벨은 `src/lib/domain/labels.ts`, 날짜 표기는 `src/lib/domain/format.ts`만 쓴다.
8. **Figma와 서버(`D-X-W-Service-2/moyeorock-server`)가 엇갈리면 서버가 정답이다.** 이번 리디자인에서 정한 것: 팀 쪽 "셋리스트" 탭 → "선택곡"(넘긴 곡 = 후보, 모임장 확정 = 확정), 독립 팀은 공연에 곡을 넘기지 못함, 공연 팀은 모집글을 못 올림, 모집글엔 일정·장르·조회수 없음, 공지 목록엔 작성자 없음, 연습 녹음은 3~60초·1.95MB 이하, 지역은 시·도 단위, 합주엔 참석 인원 없음(멤버 수), 알림 설정·공유 API 없음, 전체 모임 검색 없음(모임 찾기 → 게시판 모임 모집). 이후 추가: AI 곡 추천 행의 근거는 백엔드 문장 그대로("팀 장르 일치: 팝" · "… 난이도 초과"는 주황), "다른 팀도 골랐어요"는 공연 팀에서만(독립 팀은 selectedByOtherTeam이 항상 false), 연습 구간 피드백은 서버 고정 문장이 구간을 되풀이해서 시간은 라벨로 빼고 "원곡과 다르게 연주했어요"만 보인다, 구간 피드백의 "팀에 공유" 없음.
9. **글자 위계**: 화면·대표 이름 22 Bold > 구역 제목 20 Bold > 목록·카드 항목 이름 16 Bold(큰 카드도 16) > 선반 타일 이름·필드 라벨 14 Medium > 본문 15 > 보조 13 > 작은 라벨 12. 시간·날짜·통계 숫자만 예외로 `font-number`(Archivo Black)로 크게. 구역은 선 대신 여백으로 나누고 구역 제목은 모두 `SectionHeader`.
10. **문구는 짧게**("다시 고르기" → "변경", "~하기" 남발 금지). 같은 의미의 상태는 `Status` 하나로. 카드 오른쪽 액션은 제목 줄 높이에.

## WDS 함정 (실제로 앱이 깨졌던 것)

- **`useAlert`에 문자열 라벨을 넘기면 앱 전체가 내려간다.** WDS AlertArea가 `confirm`/`cancel`을 `Slot`으로 감싸 onClick을 꽂기 때문에 React 엘리먼트여야 한다("Slot failed to slot onto its Slottable"). 화면에서는 `useAlert` 대신 `@/components/ui/useAppAlert`를 쓴다 — 라벨 문자열만 넘기면 `AlertActionAreaButton`으로 감싸 준다.
- **`ListCell`은 행을 누르면 안쪽 첫 버튼을 대신 한 번 더 누른다.** chevron(`ListCellContent variant="chevron"`도 role=button)이 있는 행에 onClick을 걸면 이동이 두 번 되고, 행 안의 보조 버튼(거절·초대·저장 토글)은 행만 눌러도 같이 눌린다. 행 onClick은 `rowClick(handler)`, 행 안의 버튼은 `innerClick(handler)`로 감싼다(`@/components/ui/listCellEvents`). WDS가 `composeEventHandlers`로 우리 핸들러를 먼저 부르고 `defaultPrevented`면 대신 누르기를 건너뛰는 점을 이용한다.
- **손잡이(handle) 바텀 시트는 바깥 누르기·Esc·아래로 끌기를 "닫기"가 아니라 "아래로 접기"(100px만 남기고 열린 채)로 처리한다.** 접힌 시트는 화면을 옮겨도 남아 다음 화면 데이터로 다시 그려진다. `BottomSheet`·`ConfirmSheet`는 `onVisibilityChange`로 접히는 순간 닫는다(`closeWhenHidden`) — 시트를 새로 만들 때도 이 둘을 쓴다.
- **WDS `List`의 margin은 Tailwind 클래스를 이긴다.** `<List className="-mx-5">`는 먹지 않는다 — 시트 여백만큼 당기려면 `<div className="-mx-5"><List>…</List></div>`로 감싼다.
- **`ModalContent`는 좌우 여백을 주지 않는다.** 여백은 `ModalContentItem`이 준다 — 시트는 `BottomSheet`를 쓰면 이미 처리돼 있다.
- **Tailwind 클래스로 WDS 컴포넌트 모양(radius 등)을 덮을 수 없다.** WDS 스타일(emotion)이 우선한다. 꼭 바꿔야 하면 `sx`로.

## 색 — Foundation 토큰 ↔ 코드

`src/index.css`가 `html[data-theme='dark']`의 WDS 시맨틱 변수를 이 팔레트로 덮어써서 WDS 컴포넌트도 같은 색을 쓴다. 화면에서는 Tailwind 별칭만 쓴다.

| Figma 변수 | 값 | Tailwind | WDS 시맨틱 |
|---|---|---|---|
| bg/base | `#101012` | `bg-background` | `background.normal.alternative` |
| bg/elevated | `#1C1C1F` | `bg-surface` | `background.normal.normal` · `background.elevated.normal` |
| bg/press | `#28282C` | `bg-press` | — |
| text/primary · secondary · tertiary | `#F4F4F5` · `#A1A1AA` · `#7A7A83` | `text-label-strong` · `text-label-alternative` · `text-label-assistive` | `label.strong`(=normal) · `label.alternative` · `label.assistive` |
| line/divider | 흰 8% | `border-line-neutral` | `line.normal.neutral` |
| accent/red · stage/surface | `#C64537` | `bg-accent` | `primary.normal` |
| accent/text | `#E35A44` | `text-accent-text` | — ('내 팀'·'D-8'·'1명' 같은 주홍 글자) |
| status/positive · progress · negative | `#5B9BFF` · `#FF9F3D` · `#E35A44` | `*-status-*` | — |
| cover/red · blue · green · violet · teal | `#3F1A1C` · `#18253D` · `#16301F` · `#2A1F3D` · `#12333A` | `bg-cover-*` | — |

그라데이션은 유틸리티로 뺐다: `stage-glow`(탭 화면 위 주홍 17%), `cover-glow-{tone}`(상세 화면 위 커버색 34%, teal만 `#2B7480`), `cover-sheen`(커버 대각 광택), `today-card`, `bottom-fade`, `mini-player-dim`, `onboarding-scrim`. 위쪽 글로우는 화면이 아니라 `ScreenLayout`이 헤더 뒤까지 깔고, 화면은 `useScreenBackdrop("stage" | "cover-blue" …)`로 고르기만 한다.

## Typography — Figma 텍스트 스타일 ↔ WDS `variant`

| Figma `모여락/*` | 크기 | WDS | 비고 |
|---|---|---|---|
| Display | 28 Bold | `title2` bold | |
| Title | 22 Bold | `heading1` bold | 화면·대표 이름, 피드백 문장 |
| Heading | 20 Bold | `heading2` bold | 구역 제목(`SectionHeader` size medium) |
| Body Strong | 16 Bold | `body1` bold | 목록·카드 항목 이름 |
| Body | 15 Regular | `body2` regular | 본문·알림 문장 |
| Label | 14 Medium | `label1` medium | 필드 라벨·선반 타일 이름·"수정"·"전체 보기" |
| Meta | 13 Regular | `label2` regular | 보조 줄 |
| Caption | 12 Medium | `caption1` medium | 요일·시간·작은 라벨 |
| Number | Archivo Black 22 / 52 | `font-number text-number` / `text-number-lg` | 날짜·통계·오늘 합주 시간 |

WDS non-title `bold`는 600이다(Figma Bold 700과 차이는 그대로 둔다). 색은 `color="semantic.label.strong"`처럼 dot-path로 넘긴다.

## 공통 컴포넌트 — Figma 보드 `534:21678` ↔ 코드

| Figma | 코드 | WDS 바탕 |
|---|---|---|
| Status | `components/ui/Status` (`tone`: positive 완료·확정 / progress 분석 중·모집 중 / negative 실패 / neutral 후보 / accent 공연 예정·고정) | ContentBadge |
| Section Header | `components/ui/SectionHeader` | SectionHeader + TextButton |
| Header/Page · Header/Icon Button | `components/ui/ScreenHeader`(variant home·title·tabs·normal) · `components/ui/HeaderIconButton` | TopNavigation · Tab |
| Header/Cover Hero | `components/ui/CoverHero` (+ 히어로 아래 탭 `components/ui/HeroTabs`) | Typography · Tab |
| List/Cover Row (· 상태) · Person · Event · Track · Post · Song Result · Notification · Notice · Action Row | `components/list/*Row` — 뼈대는 `MediaRow` | ListCell · Avatar · Button · IconButton |
| Avatar/Labeled · Stat · Calendar/Day · Session Tile · Feedback/Line | `components/ui/LabeledAvatar` · `Stat` · `CalendarDay` · `SessionTile`(`level`을 넘기면 실력 줄, `onToggle`을 넘기면 고르기 타일 — 22는 실력 줄 숨김) · `FeedbackLine` | Avatar · WithInteraction |
| Loader/Logo · Loader/Wave | `components/ui/LoaderLogo`(기다리는 화면의 주인공 — 26 · 29) · `LoaderWave`(버튼·목록·단계 표시, currentColor) | — (CSS `loader-logo-bars` · `loader-wave`) |
| Card/Practice Tile · Card/Song Pick · Card/Recording | `components/card/PracticeTile` · `PickCard`(SongPickCard·RecordingCard) | WithInteraction · TextButton |
| Bottom CTA | `components/ui/BottomActionArea` | ActionArea |
| Sheet/Handle · 17 확정 시트 | `components/ui/BottomSheet`(WDS handle) · `components/ui/ConfirmSheet` | Modal bottom · ActionArea |
| 15 빈 상태 | `components/ui/EmptyState` | FallbackView |
| Cover · Waveform · Music/Now Playing · Music/Mini Player · Brand/* | `components/music/Cover`(`PART_COVER_TONE`, `coverToneOf`) · `Waveform` · `NowPlaying` · `MiniPlayer` · `Brand`(BrandLogo·BrandLogoStacked·BrandSymbol, 도형은 `brandPaths.ts`) | — |

화면 뼈대는 `useScreenHeader(<ScreenHeader/>)` + `useScreenBackdrop(...)` + `<ScreenBody>`(스크롤, 미니 플레이어 아래 여백 자동) + (있으면) `<BottomActionArea>`다. 헤더 JSX는 `useMemo`로 감싼다.

커버 색: 파트(녹음·세션)는 `PART_COVER_TONE`(보컬 blue · 일렉 기타 red · 어쿠스틱 기타 teal · 베이스 green · 드럼 blue · 키보드 violet), 사진 없는 팀·모임·공연·곡은 `coverToneOf(kind, id)`. 커버 글자는 파트 영문(Vocal · Electric Guitar · Acoustic Guitar · Bass · Drums · Keys, `INSTRUMENT_COVER_LABEL`) — 기타는 일렉·어쿠스틱을 꼭 구분한다.

## 하단 탭 · 미니 플레이어

하단 탭은 WDS `BottomNavigation`(**홈 · 일정 · 모임 · 게시판 · 마이**). 바탕 bg/base 88% + 위 흰 8% 선, 고른 탭은 채운 아이콘(`Icon*Fill`) + 흰색. `data-scroll-end` 투명 처리와 선택색(주홍)은 sx로 덮는다. 활성 탭은 경로 접두사(`ScreenLayout`의 `TAB_PREFIXES`)로 정한다 — 모임 탭은 `/crew`·`/team`·`/show`·`/users`, 연습 분석(`/practice`)은 홈.

하단 탭·미니 플레이어 유무는 라우트 `handle`(`hasBottomNav`·`hasMiniPlayer`)로 정한다. Figma대로 팀·모임·공연 상세와 멤버 프로필은 하단 탭을 유지하고(모임 탭), 폼·온보딩·연습 분석 결과·알림·모집글 상세는 숨긴다. 미니 플레이어(지금 듣는 연습 녹음)는 탭 루트 5개와 연습 분석 목록에만 떠 있고, 뒤에 `bottom-fade`가 깔린다.

## 로딩 애니메이션

보드 `589:24247`(Loader/Logo) · `589:24272`(Loader/Wave). 애니메이션은 `src/index.css` 맨 아래에 있고, 동작 줄이기(`prefers-reduced-motion`)에서는 멈춘다.

- **LoaderLogo**: 주홍 피크 + 진한 막대 3개. 막대가 왼쪽부터 0.2초 간격으로 `scaleY 1 → 1.5 / 1.2 / 1.4 → 1`(ease-out-back `cubic-bezier(0.45, 1.45, 0.8, 1)`), 2.4초 반복, 가운데 기준. **목표 배율은 막대가 피크 밖으로 나가지 않게 맞춘 값이라 바꾸지 않는다.** 피크와 막대를 따로 그려야 해서 `BrandSymbol`(막대 구멍을 뚫은 한 덩어리)이 아니라 `brandPaths.ts`의 외곽선 + 막대 `<rect>`로 그린다.
- **LoaderWave**: 막대 5개가 차례로 늘었다 줄었다 한다(2.4초). 막대 폭·간격이 전체 폭의 1/9이라 `className`으로 크기만 바꾼다(기본 `w-9 h-6`, 단계 표시 `w-4.5 h-3`).

## 앱 첫 진입 — 스플래시(00) → 로그인(08)

`src/app/AppSplash.tsx`가 `ScreenLayout`의 `overlay`로 앱 컬럼 전체를 덮는다. 진행 단계는 `src/app/intro.ts`(`useIntroPhase`)에 있고 로그인 화면이 같이 본다.

1. 인증 확인(`src/lib/auth/session.ts`의 `hasSession` — 백엔드 연동 전이라 localStorage 표시)을 하는 동안 주홍 바탕 + 검은 세로 로고(로그인 로고의 1.5배)를 가운데 띄우고 막대 웨이브를 **한 번** 돌린다(0.3초부터 0.18초 간격, LoaderLogo와 같은 배율·곡선). 갈 화면은 처음부터 스플래시 뒤에 깔아 둔다.
2. 로그인 전이면 0.8초 ease-in-out으로 주홍 바탕이 사라지고, 로고가 작아지며 로그인 화면 로고 자리로 옮겨 가고(공유 요소), 색이 검정에서 원래 색(피크 주홍 · 막대 진한색 · 워드마크 흰색)으로 돌아온다. 로그인 화면은 그동안 자기 로고를 숨기고 사진·부제·버튼을 페이드인한다.
3. 이미 로그인했으면 로고째 페이드아웃하고 열려던 화면(기본 홈)을 보여 준다.

로그인 표시는 이메일 로그인·가입 완료(09)에서 남기고 로그아웃·탈퇴에서 지운다. 안드로이드 홈 화면 실행 스플래시가 이 화면과 이어지도록 `public/manifest.webmanifest`의 `background_color`는 `#C64537`이다(`theme_color`는 `#101012` 그대로).

## 아이콘

전부 `@wanteddev/wds-icon`(IconBell · IconPlus · IconSearch · IconSetting · IconMoreVertical · IconChevronRight · IconChevronLeft · IconClose · IconCheck · IconMinus · IconPlay · IconPause · IconShare · IconLogoKakao …). WDS에 없는 것만 Figma에서 받는다: 알림 아이콘 `src/assets/notify/*`(로고 피크 실루엣에 글리프를 오려 낸 주홍 아이콘, 보드 `509:21535`), 플레이어 이전·다음·볼륨 `src/assets/player/*`.

## 화면 전환 — Shared Axis (View Transitions API)

Bottom Nav로 탭을 바꿀 때 이전 화면은 페이드아웃하며 진행 방향으로 30px 밀려 나가고 새 화면이 반대쪽에서 밀려 들어온다 — Material Motion의 **shared axis** 패턴이다(탭에는 좌우 순서라는 공간적 관계가 있으므로 `fade through`가 아니라 이쪽이 맞다). 애니메이션 정의는 `src/index.css` 맨 아래, 전환을 시작하는 쪽은 `ScreenLayout`의 `handleBottomNavChange`다.

- 전환은 React Router의 `navigate(path, { viewTransition: true })`가 `document.startViewTransition`으로 감싸 준다. 데이터 모드(`createBrowserRouter`)에서만 동작하는 옵션인데 이 앱이 그 모드다.
- 미끄러지는 **방향**은 CSS가 알 수 없다(라우터는 "어느 탭에서 어느 탭으로"를 모른다). `handleBottomNavChange`가 `BottomNav`의 `BOTTOM_NAV_ORDER`로 탭 순서를 비교해 `html[data-nav-direction]`에 `forward`/`back`을 심고, CSS가 그걸 보고 keyframe을 고른다. 탭 순서는 `BottomNav`의 `TABS`에서 파생되므로 탭을 추가/재배치해도 따로 고칠 데가 없다.
- 프레임 전체(헤더·배경 글로우·본문)가 함께 움직이고 Bottom Nav만 제자리에 남는다. `view-transition-name`이 붙은 자손은 조상의 스냅샷에서 빠지기 때문에, Bottom Nav에 `view-transition-bottom-nav` 유틸리티를 준 것만으로 분리된다.
- **`view-transition-name`은 한 시점에 문서 전체에서 유일해야 한다.** 같은 이름이 둘이면 전환이 통째로 취소된다(애니메이션 없이 즉시 전환되고 콘솔 경고만 남는다). 새 전환 대상을 추가할 때는 새 이름을 쓸 것.
- 직접 keyframe을 줄 때는 `mix-blend-mode: normal`과 `isolation: auto`로 되돌려야 한다. 기본값(`plus-lighter`)은 제자리 크로스페이드용이라, 서로 지나가는 두 화면이 겹치는 동안 색이 더해져 떠 보인다.
- `document.startViewTransition`이 없는 브라우저(iOS 18 미만 WKWebView 등)에서는 React Router가 그냥 즉시 전환한다 — 동작 차이는 없고 애니메이션만 빠진다. `prefers-reduced-motion: reduce`에서도 애니메이션을 끈다.
- 하위 화면 push/pop에는 아직 걸지 않았다 — 거는 경우 뒤로가기 방향 판별이 따로 필요하다.

## 라우팅 컨벤션

`src/app/router.tsx`가 섹션별 `src/features/<섹션>/routes.tsx`를 합친다. 각 routes 파일 머리 주석에 그 섹션의 화면 흐름(서버 기준)을 적어 둔다 — 새 화면을 추가할 때 그 주석도 함께 고친다.

1. 화면 파일은 `src/features/<섹션>/<화면이름>Screen.tsx`. 섹션 = 서버 도메인(온보딩 auth·user / 홈 dashboard·notification / 연습 practice / 일정 rehearsal / 모임 group·notice / 팀 team·선택곡 / 공연 performance·셋리스트 / 게시판 recruit·join / 마이 user·bookmark). 여러 섹션이 같이 쓰는 가입 신청·초대 시트는 `src/features/join/`.
2. 하단 탭이 없는 화면(폼·온보딩·연습 분석 결과·알림·모집글 상세)은 `handle: { hasBottomNav: false } satisfies ScreenRouteHandle`, 미니 플레이어가 뜨는 탭 루트는 `{ hasMiniPlayer: true }`.
3. 헤더는 화면 안에서 `useScreenHeader(<ScreenHeader … />)`.
4. 경로는 짧은 영문 단어: 모임 `/crew`, 팀 `/team`, 공연 `/show`, 게시판 `/board`, 마이 `/mine`, 일정 `/schedule`, 다른 사용자 `/users/:userId`. 탭 루트 경로는 `ScreenLayout`의 `BOTTOM_NAV_PATHS`와 맞춘다.
5. 같은 화면 안의 탭·필터는 라우트가 아니라 쿼리로 남긴다(`/crew?tab=team`, `/board?type=team`, `/mine/invitations?tab=applied`) — `setSearchParams(…, { replace: true })`로 바꿔서 탭을 오가도 히스토리가 쌓이지 않게 한다.
6. 히어로 + 탭 구조(모임 홈 · 공연 · 멤버, 팀 홈 · 합주 · 선택곡 · 멤버 — `HeroTabs`)의 탭 전환과, 만든 직후 상세로 가는 이동은 `navigate(path, { replace: true })` — 뒤로가기 한 번이면 들어오기 전 화면으로 돌아간다.
7. 권한이 없는 동작은 버튼을 숨긴다(모임장만 관리·공연 만들기·공지·셋리스트 확정, 팀장만 관리·곡 추가·넘기기·초대).
8. 만들기 흐름 끝에 완료 화면을 두지 않는다(가입 완료 09만 예외) — 만든 대상의 상세로 replace 이동하고 토스트로 알린다.
