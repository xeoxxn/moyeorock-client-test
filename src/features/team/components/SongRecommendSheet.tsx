import { Button, List, TextButton, Typography } from "@wanteddev/wds";
import { useCallback, useEffect, useRef, useState } from "react";

import SongResultRow from "@/components/list/SongResultRow";
import { coverToneOf } from "@/components/music/Cover";
import BottomSheet from "@/components/ui/BottomSheet";
import LoaderLogo from "@/components/ui/LoaderLogo";
import { fetchTeamSongRecommendations } from "@/features/team/songRecommendationApi";
import { cn } from "@/lib/cn";
import { GENRE_LABEL } from "@/lib/domain/labels";
import type { Team, TeamSongRecommendation } from "@/lib/domain/types";

// Figma 26 고르는 중 · 27 결과 · 28 실패(591:24245 · 591:24900 · 591:26149) — AI 곡 추천 시트.
// 곡 추가 시트(16)의 "AI 추천"에서 열고, 열 때마다 GET /teams/{teamId}/songs/recommendations를 부른다.
// 백엔드가 AI를 동기로 불러 길면 30초쯤 걸리니 그동안 고르는 중(26)을 보이고, 점수 순 최대 10곡(27) ·
// 실패 503(28) · 빈 결과(AI가 고른 곡 없음, 200)를 같은 자리에서 바꿔 그린다.
// - 상태가 바뀌어도 시트 높이가 튀지 않게 본문 높이를 고정하고(h-88 = Figma 본문 352), 결과 목록은 그
//   안에서 스크롤한다.
// - 행 둘째 줄은 "아티스트 · 근거 한 줄": 다른 팀이 고른 곡이면 "다른 팀도 골랐어요"(tertiary), 아니면
//   "… 난이도 초과" 근거(주황), 없으면 첫 근거. 근거는 백엔드 문장 그대로 쓰고, 비었으면 아티스트만.
//   선택곡에 담은 곡은 곡 추가 시트처럼 "아티스트 · 추가됨"으로 바꾼다.
// - +/✓는 곡 추가 시트와 같은 선택곡 state를 바꾼다(곡 추가 시트가 팀장 전용이라 이 시트도 팀장만 연다).
// - 시트를 닫거나 다시 부르면 앞 요청을 취소해서 늦게 온 응답이 새 화면을 덮지 않는다.
interface SongRecommendSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: Team;
  selectedIds: number[];
  onToggle: (songId: number) => void;
}

type RecommendState =
  | { status: "loading" }
  | { status: "done"; songs: TeamSongRecommendation[] }
  | { status: "failed" };

/** 행 둘째 줄에 아티스트와 함께 보일 근거 한 줄. 보일 게 없으면 null. */
function noteOf(
  item: TeamSongRecommendation,
): { text: string; className?: string } | null {
  if (item.selectedByOtherTeam) {
    return { className: "text-label-assistive", text: "다른 팀도 골랐어요" };
  }
  const exceeded = item.reasons.find((reason) =>
    reason.endsWith("난이도 초과"),
  );
  if (exceeded) return { className: "text-status-progress", text: exceeded };
  const [first] = item.reasons;
  return first ? { text: first } : null;
}

function SongRecommendSheet({
  onOpenChange,
  onToggle,
  open,
  selectedIds,
  team,
}: SongRecommendSheetProps) {
  const [state, setState] = useState<RecommendState>({ status: "loading" });
  const requestRef = useRef<AbortController | null>(null);

  // 새로 부르기 — 앞 요청은 취소한다(다시 추천 · 다시 시도).
  const load = useCallback(() => {
    requestRef.current?.abort();
    const request = new AbortController();
    requestRef.current = request;
    setState({ status: "loading" });
    fetchTeamSongRecommendations(team.id, request.signal).then(
      (songs) => {
        if (!request.signal.aborted) setState({ songs, status: "done" });
      },
      () => {
        if (!request.signal.aborted) setState({ status: "failed" });
      },
    );
  }, [team.id]);

  // 열 때마다 새로 받고, 닫히면(또는 화면을 떠나면) 받던 요청을 버린다.
  useEffect(() => {
    if (!open) return;
    load();
    return () => requestRef.current?.abort();
  }, [open, load]);

  const genres = team.genres.map((genre) => GENRE_LABEL[genre]).join(", ");
  const subtitle = [
    team.name,
    genres,
    state.status === "done" && state.songs.length > 0
      ? `${state.songs.length}곡`
      : "",
  ]
    .filter((part) => part !== "")
    .join(" · ");

  return (
    <BottomSheet
      onOpenChange={onOpenChange}
      open={open}
      // 공통 시트 머리에 부제 자리가 없어 제목 안에 두 줄로 넣는다(제목 20 Bold + 부제 13 secondary).
      title={
        <span className="flex flex-col gap-0.5">
          AI 곡 추천
          <Typography
            as="span"
            color="semantic.label.alternative"
            variant="label2"
            weight="regular"
          >
            {subtitle}
          </Typography>
        </span>
      }
    >
      <div className="flex h-88 flex-col">
        {state.status === "loading" && (
          <div
            className="flex flex-1 flex-col items-center justify-center gap-3 pb-6 text-center"
            role="status"
          >
            {/* LoaderLogo의 기본 크기(size-30)를 Figma 26의 96으로 줄인다. cn이 클래스를 합치지 않아서
                같은 size 유틸리티끼리는 CSS 순서로 갈리므로 !로 이긴다. */}
            <LoaderLogo className="mb-5" size="medium" />
            <Typography
              color="semantic.label.strong"
              variant="body1"
              weight="bold"
            >
              팀에 맞는 곡을 고르고 있어요
            </Typography>
            <Typography
              className="whitespace-pre-line"
              color="semantic.label.alternative"
              variant="label2"
            >
              {
                "팀 장르와 멤버들의 세션 실력을 보고 골라요.\n길면 30초쯤 걸려요."
              }
            </Typography>
          </div>
        )}

        {state.status === "failed" && (
          <SheetMessage
            actionLabel="다시 시도"
            description="잠시 후 다시 시도해 주세요. 곡은 검색해서 바로 추가할 수 있어요."
            onAction={load}
            title="지금은 추천을 받을 수 없어요"
          />
        )}

        {state.status === "done" && state.songs.length === 0 && (
          <SheetMessage
            actionLabel="다시 추천"
            description="곡은 검색해서 바로 추가할 수 있어요."
            onAction={load}
            title="추천할 곡을 찾지 못했어요"
          />
        )}

        {state.status === "done" && state.songs.length > 0 && (
          <>
            {/* 행(ListCell fillWidth)이 좌우 여백을 직접 가져서 시트 여백만큼 당긴다. */}
            <div className="-mx-5 min-h-0 flex-1 overflow-y-auto">
              <List>
                {state.songs.map((item) => {
                  const added = selectedIds.includes(item.song.id);
                  const note = added ? null : noteOf(item);
                  return (
                    <SongResultRow
                      added={added}
                      artist={
                        note ? (
                          <>
                            {`${item.song.artist} ·`}
                            <span
                              className={cn("min-w-0 truncate", note.className)}
                            >
                              {note.text}
                            </span>
                          </>
                        ) : (
                          item.song.artist
                        )
                      }
                      key={item.song.id}
                      onToggle={() => onToggle(item.song.id)}
                      title={item.song.title}
                      tone={coverToneOf("song", item.song.id)}
                    />
                  );
                })}
              </List>
            </div>
            <div className="flex items-center justify-between gap-3 pt-3">
              <Typography
                color="semantic.label.assistive"
                variant="caption1"
                weight="medium"
              >
                팀 장르와 멤버 세션 실력 기준이에요
              </Typography>
              <TextButton
                color="assistive"
                onClick={load}
                size="small"
                // Figma는 14 Medium이라 WDS TextButton의 bold만 덮는다.
                sx={{ "& > span": { fontWeight: 500 } }}
              >
                다시 추천
              </TextButton>
            </div>
          </>
        )}
      </div>
    </BottomSheet>
  );
}

/** 실패(28)·빈 결과 — 가운데 제목 + 설명 + 다시 부르기 버튼 */
function SheetMessage({
  actionLabel,
  description,
  onAction,
  title,
}: {
  actionLabel: string;
  description: string;
  onAction: () => void;
  title: string;
}) {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center gap-2 break-keep pb-6 text-center"
      role="status"
    >
      <Typography color="semantic.label.strong" variant="body1" weight="bold">
        {title}
      </Typography>
      <Typography color="semantic.label.alternative" variant="label2">
        {description}
      </Typography>
      <div className="pt-3">
        <Button
          color="assistive"
          onClick={onAction}
          size="medium"
          variant="outlined"
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}

export default SongRecommendSheet;
