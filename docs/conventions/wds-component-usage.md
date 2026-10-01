# Figma "모여락 다크(네온)" — WDS(원티드 디자인 시스템) 사용 컨벤션

> 종류: 살아있는 참고 문서. 새 화면을 구현할 때마다 이 문서부터 확인하고, 새로 확정되는 내용을 추가한다.
> 대상 파일: [🎨 컨퍼런스 디자인](https://www.figma.com/design/NrVoqKgMPnr2rQ4sOYFV46) (`fileKey: NrVoqKgMPnr2rQ4sOYFV46`), 캔버스 "모여락 다크 (네온)" (`nodeId: 101:11294`)
> WDS 라이브러리 키: `lk-01f447137a741b37c25896e9a4e109dcb719fa4e54177be9a39d24b8da507c109279c2d1d0533b9943595d7d6a5ea398977f43b5d84e163797965d810ba79b69`

## 배경

이 Figma 페이지는 컨퍼런스(해커톤)용으로 새로 그려진 컨셉 디자인이라 **Figma Variables가 전혀 연결돼 있지 않다** (`get_variable_defs`가 빈 객체를 반환한다). 색은 전부 실측 hex로 칠해져 있고, WDS 컴포넌트 인스턴스도 아이콘류 정도만 쓰였다 — 대부분의 텍스트·카드·배지는 Figma가 Noto Sans KR로 대체 렌더링한 로컬 마크업이다. 그래서 "이 노드가 WDS 컴포넌트다/아니다"를 이름만으로 판단할 수 없고, 화면마다 `get_design_context`로 실측해서 정한다.

## 화면 구현 시 반드시 지킬 것

1. **Figma의 "화면" ≠ 라우트 1개.** "버튼 눌림", "일정 없는 날" 같은 상태 변형(state variant)은 같은 화면 컴포넌트의 조건부 렌더링/인터랙션 상태로 흡수한다. 새 라우트를 만들지 않는다. (예: "온보딩/01-1 로그인 (버튼 눌림)"은 "01 로그인"의 버튼 active 스타일일 뿐 별도 화면이 아니다.)
2. **"Status Bar" 프레임(9:41, 신호/배터리 아이콘)은 구현하지 않는다.** Figma가 폰 프레임을 흉내 내려고 넣은 목업 장식이다. 실제 상단 안전영역은 `ScreenLayout`의 `pt-safe-top`이 담당한다.
3. **색·폰트 크기를 화면 컴포넌트 안에 하드코딩하지 않는다.** 항상 `src/index.css`의 Tailwind 토큰(`bg-background`, `text-label-strong`, `border-line-neutral`, `shadow-neon-md` 등) 또는 WDS `Typography`/색 토큰 문자열(`"semantic.primary.normal"` 등)을 통해서만 쓴다. Figma 실측 hex가 기존 토큰과 정확히 안 맞으면(예: 카카오 옐로 `#fee500`) `src/index.css`의 `@theme` 블록에 새 토큰을 추가하고 그걸 참조한다 — 화면 파일에 `#`으로 시작하는 색을 직접 쓰지 않는다.
4. **WDS 컴포넌트가 있으면 무조건 WDS를 쓴다.** `search_design_system`으로 먼저 확인하고, 이름이 같아도 스타일이 명확히 다르면(패딩·배경 처리 방식 등) `get_design_context`로 실제 노드를 열어 재확인한다 — 이름만 보고 단정하지 않는다.
5. **에셋은 실제로 다운로드해서 `src/assets/`에 저장한다.** Figma의 임시 자산 URL(`https://www.figma.com/api/mcp/asset/...`)은 7일 뒤 만료되므로 코드에 직접 남기지 않는다. 마스코트는 `src/assets/mascot/`, 장식용 네온 글로우는 `src/assets/decorative/`에 모은다. 아이콘은 거의 전부 `@wanteddev/wds-icon`에 대응 컴포넌트가 있으니(아래 표) raw SVG를 받지 말고 그 컴포넌트를 쓴다.

## 다크(네온) 브랜드 컬러 — WDS 시맨틱 변수 오버라이드

`src/index.css`가 `html[data-theme='dark']`의 WDS 시맨틱 변수 값을 모여락 브랜드 값으로 덮어쓴다. 그래서 `Button`/`Checkbox`/`TopNavigation`처럼 WDS 컴포넌트가 내부적으로 쓰는 `semantic.primary.*` 등도 별도 색 prop 없이 자동으로 레드 네온이 된다.

| 시맨틱 변수 | 모여락 값 | 비고 |
|---|---|---|
| `--semantic-primary-normal` | `#ff3b33` | 메인 액센트 레드 |
| `--semantic-primary-strong` | `#df2b24` | "오늘" 카드 등 solid 배경용 진한 레드 |
| `--semantic-background-normal-alternative` | `#0b0b0d` | 화면 캔버스(가장 어두움) |
| `--semantic-background-normal-normal` | `#17171a` | 카드/표면 |
| `--semantic-background-elevated-normal` | `#121214` | Bottom Nav 등 떠 있는 표면 |
| `--semantic-label-strong` / `-normal` / `-alternative` / `-assistive` | `#fff` / `#f2f2f5` / `#b8b8c2` / `#7a7a85` | 텍스트 4단계 |
| `--semantic-line-normal-neutral` / `-solid-neutral` | `rgba(255,255,255,.08)` / `.12` | 보더 2단계 |

Tailwind 쪽 별칭: `bg-background`(캔버스) / `bg-surface`(카드) / `bg-surface-elevated`(Bottom Nav) / `text-label-{strong,normal,alternative,assistive}` / `border-line-{neutral,solid}` / `bg-accent` / `bg-accent-strong` / `bg-accent-subtle`(모임 모집 배지 등 20% 틴트) / `bg-kakao` + `text-kakao-label`.

네온 글로우 장식은 `shadow-neon-{sm,md,lg}`(box-shadow) / `drop-shadow-neon-{sm,md,lg}`(filter: drop-shadow) / `text-glow`·`text-glow-sm`(text-shadow) 유틸리티로 뺐다 — 화면마다 `shadow-[0_0_34px_...]` 같은 임의값을 새로 재지 않는다.

**중요: 마스코트 PNG(투명 배경 누끼) 같은 알파 채널 이미지에는 반드시 `drop-shadow-neon-*`를 쓴다, `shadow-neon-*`가 아니라.** `box-shadow`는 엘리먼트의 사각형 레이아웃 박스 기준으로 그려져서, 이미지 캔버스 안의 투명한 여백(마스코트가 포즈 때문에 정사각형을 꽉 안 채우는 부분)까지 포함한 네모난 박스가 그대로 비쳐 보인다 — "캐릭터 뒤에 각진 배경이 생겼다"처럼 보이는 버그의 원인이었다. `filter: drop-shadow()`는 알파 채널의 실제 실루엣을 따라가므로 이미지에는 이쪽을 쓴다. 카드·배지·바처럼 투명 영역 없이 박스 자체가 곧 보이는 모양인 엘리먼트는 `shadow-neon-*`(box-shadow)가 맞다.

**앱은 다크 전용이다(라이트 모드 없음).** `index.html`의 인라인 스크립트가 마운트 전에 `localStorage.theme = "dark"`를 고정하고, `main.tsx`는 `<ThemeProvider enableDarkMode>`를 쓴다 — `enableDarkMode` 없이는 WDS가 강제로 라이트 모드로 되돌린다(`forcedTheme: "light"`).

## Typography — Figma 실측 px ↔ WDS `variant` 매핑

WDS `Typography`의 스케일(`node_modules/@wanteddev/wds/dist/components/typography/style.js`)이 이 디자인의 실측 폰트 크기와 거의 정확히 맞아떨어진다. 새 화면에서도 아래 표를 우선 적용하고, 표에 없는 크기가 나오면(예: 10px 초소형 텍스트) 가장 가까운 변형을 쓰되 이 표에 새 줄로 추가한다.

| Figma 실측 | WDS `variant` | `weight` | 비고 |
|---|---|---|---|
| 24px bold | `title3` | `bold` | 26px 히어로 텍스트도 이걸로 근사(2px 차이는 무시) |
| 22px bold | `heading1` | `bold` | |
| 20px bold | `heading2` | `bold` | |
| 18px bold | `headline1` | `bold` | 섹션 타이틀, 로고 워드마크 |
| 17px bold | `headline2` | `bold` | |
| 16px + `Pretendard_JP:SemiBold` | `body1` | `bold` | WDS non-title bold = font-weight 600 = Figma "SemiBold"와 정확히 일치 |
| 15px bold | `body2` | `bold` | |
| 15px regular | `body2` | `regular` | |
| 14px | `label1` | 대응하는 굵기 | |
| 13px | `label2` | 대응하는 굵기 | |
| 12px | `caption1` | 대응하는 굵기 | |
| 11px | `caption2` | 대응하는 굵기 | |

색은 항상 dot-path 문자열로 넘긴다 — 예: `color="semantic.label.strong"`, `color="semantic.primary.normal"`, `color="semantic.static.white"`(주의: `"static.white"`가 아니라 반드시 `semantic.` 접두사가 붙는다).

## 아이콘 — Figma "Icon/Normal/\*" ↔ `@wanteddev/wds-icon` export

지금까지 확인된 것들. 새 아이콘이 나오면 `@wanteddev/wds-icon/dist/index.d.ts`에서 이름으로 먼저 찾아보고(대부분 있다), 진짜 없을 때만 Figma SVG를 받는다.

| Figma | 코드 export |
|---|---|
| Icon/Normal/Home | `IconHome` (선택 시에도 Fill 아님 — 색만 바뀜, 아래 Bottom Nav 참고) |
| Icon/Normal/Calendar | `IconCalendar` |
| Icon/Normal/Persons | `IconPersons` |
| Icon/Normal/Document | `IconDocument` |
| Icon/Normal/Person | `IconPerson` |
| Icon/Normal/Bell | `IconBell` |
| Icon/Normal/Chevron Right | `IconChevronRight` |
| Icon/Normal/Location | `IconLocation` |
| Icon/Normal/Music Microphone | `IconMusicMicrophone` |

카카오 로그인 아이콘이 필요하면 `IconLogoKakao`/`IconLogoKakaoColor`가 있다.

## Bottom Nav — 5개 탭, Stream과 같은 이유로 로컬 컴포넌트

Figma 홈 화면(`nodeId 101:11659`)의 Bottom Nav는 **홈 · 일정 · 모임 · 게시판 · 마이** 5탭이다(팀/공연은 모임 하위 플로우로 들어간다 — "모임/03 모임 공연", "팀/03 팀 공연" 등 nodeId 목록 참고). WDS `BottomNavigation`은 iOS 반투명 배경 + body 스크롤 기준 투명 전환 로직이 내장돼 있어(우리 레이아웃은 헤더/본문 내부 스크롤 구조라 항상 오판) 쓰지 않고, `src/components/ui/BottomNav.tsx`에 로컬로 새로 만들었다(stream-client-web과 동일한 판단).

선택 상태는 별도 Fill 아이콘이 아니라 **같은 아이콘의 색만** `text-label-strong`(선택) ↔ `text-label-assistive`(비선택)로 바뀐다 — 라벨 타이포도 `bold`/`regular`로만 갈린다. accent(레드)를 쓰지 않는다.

## `ScreenHeader` — 두 variant

- `variant="logo"`: 최상위 탭 화면(홈 등)의 로고 헤더. WDS 인스턴스가 아니라 Figma "Top Bar"(nodeId 101:11537)를 그대로 옮긴 로컬 마크업 — 마스코트 flag 아이콘 + "모여락" 워드마크(`text-glow-sm`) + `trailing`.
- `variant="normal"`(기본값): 하위 화면의 뒤로가기 헤더. WDS `TopNavigation`을 그대로 쓴다(`background={false}`, `leadingContent`, `trailingContent`, `variant="normal"`). 아직 실제 뒤로가기 헤더가 있는 화면을 구현하기 전이라 세부 스펙(패딩 등)은 다음 화면 구현 시 `get_design_context`로 대조해서 확정한다.

## 이미 구현된 화면 (참고용 실제 코드)

| Figma nodeId | 화면 | 코드 |
|---|---|---|
| `101:11297` | 온보딩/01 로그인 | `src/features/onboarding/OnboardingLoginScreen.tsx` (`/login`) |
| `101:11527` | 홈/01 홈 대시보드 | `src/features/home/HomeScreen.tsx` (`/`) |

## 라우팅 컨벤션

`src/app/router.tsx` 한 곳에서 전부 정의한다(레퍼런스와 동일). 새 화면을 추가할 때:
1. `src/features/<섹션>/<화면이름>Screen.tsx` 파일을 만든다.
2. Bottom Nav가 없는 화면(하단 고정 버튼이 있는 폼/상세 등)은 `handle: { hasBottomNav: false } satisfies ScreenRouteHandle`를 준다.
3. 헤더가 필요하면 화면 컴포넌트 안에서 `useScreenHeader(<ScreenHeader ... />)`를 호출한다 — `ScreenLayout`을 직접 감쌀 필요 없다.
4. 경로 세그먼트는 한글 대신 의미가 통하는 영문(kebab/camel 아님, 짧은 단어)으로 짓는다 — 예: 모임은 `/crew`, 게시판은 `/board`, 마이는 `/mine`, 일정은 `/schedule`. Bottom Nav 탭과 매핑되는 경로는 `src/components/ui/ScreenLayout.tsx`의 `BOTTOM_NAV_PATHS`와 반드시 맞춘다.
