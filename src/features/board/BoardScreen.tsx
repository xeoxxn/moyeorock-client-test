import { Tab, TabList, TabListItem, Typography } from "@wanteddev/wds";
import {
  IconBell,
  IconLocation,
  IconPersons,
  IconPlus,
  IconSearch,
} from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

// Figma: 게시판/01 게시판 (nodeId 101:24187). 상단 "모임 | 공연 | 팀" Tab은 모집글의 카테고리
// 구분이라(화면 전환이 아니다) POSTS를 category로 필터링한다.

type Category = "crew" | "show" | "team";
type Status = "recruiting" | "closed";

interface Post {
  id: string;
  category: Category;
  status: Status;
  kind: string;
  title: string;
  description: string;
  place: string;
  members: string;
  genreTags: string[];
}

const POSTS: Post[] = [
  {
    category: "crew",
    description:
      "홍대에서 활동해요. 인디 록과 얼터너티브를 좋아하는 분이면 좋아요.",
    genreTags: ["모집중", "보컬"],
    id: "p1",
    kind: "모임 모집",
    members: "3/5명",
    place: "홍대 모여락 스튜디오",
    status: "recruiting",
    title: "홍대 주말 합주 보컬을 찾고 있어요",
  },
  {
    category: "crew",
    description:
      "합정에서 활동해요. 수요일 저녁, 부담 없이 오래 함께할 분을 찾아요.",
    genreTags: ["모집중", "베이스"],
    id: "p2",
    kind: "모임 모집",
    members: "4/5명",
    place: "합정 모여락 스튜디오",
    status: "recruiting",
    title: "합정 퇴근 후 베이스 세션 구해요",
  },
  {
    category: "crew",
    description:
      "신촌에서 활동해요. 서로의 데모를 듣고 편곡 아이디어를 나눠요.",
    genreTags: ["모집중", "기타"],
    id: "p3",
    kind: "모임 모집",
    members: "3/6명",
    place: "신촌 모여락 스튜디오",
    status: "recruiting",
    title: "신촌 자작곡 스터디 멤버 구해요",
  },
  {
    category: "crew",
    description:
      "망원에서 활동해요. 인디 록과 얼터너티브를 좋아하는 분이면 좋아요.",
    genreTags: ["모집 완료", "보컬"],
    id: "p4",
    kind: "모임 모집",
    members: "5/5명",
    place: "망원 모여락 스튜디오",
    status: "closed",
    title: "망원 주말 합주 보컬을 찾고 있어요",
  },
  {
    category: "show",
    description:
      "2026 가을 정기공연에 함께할 팀을 찾아요. 어쿠스틱 셋 환영해요.",
    genreTags: ["모집중", "팀"],
    id: "p5",
    kind: "공연 참가팀 모집",
    members: "3팀 확정",
    place: "홍대 롤링홀",
    status: "recruiting",
    title: "가을 정기공연 참가 팀을 구해요",
  },
  {
    category: "team",
    description: "블루 웨이브, 다음 합주 드러머가 급하게 필요해요.",
    genreTags: ["모집중", "드럼"],
    id: "p6",
    kind: "팀 멤버 모집",
    members: "1/1명",
    place: "합주실 A",
    status: "recruiting",
    title: "블루 웨이브 드러머 급구해요",
  },
];

function BoardScreen() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category>("crew");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");

  useScreenHeader(
    <ScreenHeader
      title="게시판"
      trailing={
        <>
          <IconSearch className="size-6 text-label-normal" />
          <IconBell className="size-6 text-label-normal" />
        </>
      }
      variant="title"
    />,
  );

  const posts = POSTS.filter(
    (post) =>
      post.category === category &&
      (statusFilter === "all" || post.status === statusFilter),
  );

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <Tab
        onValueChange={(value) => setCategory(value as Category)}
        value={category}
      >
        <TabList resize="fill" size="medium">
          <TabListItem value="crew">모임</TabListItem>
          <TabListItem value="show">공연</TabListItem>
          <TabListItem value="team">팀</TabListItem>
        </TabList>
      </Tab>

      <div className="scrollbar-hidden flex-1 overflow-y-auto">
        <div className="flex gap-1.5 px-5 pt-4 pb-2">
          <button
            className={
              statusFilter === "all"
                ? "rounded-lg bg-label-strong px-2 py-1.5"
                : "rounded-lg border border-line-neutral px-2 py-1.5"
            }
            onClick={() => setStatusFilter("all")}
            type="button"
          >
            <Typography
              color={
                statusFilter === "all"
                  ? "semantic.inverse.label"
                  : "semantic.label.alternative"
              }
              variant="label1"
              weight="medium"
            >
              전체
            </Typography>
          </button>
          <button
            className={
              statusFilter === "recruiting"
                ? "rounded-lg bg-label-strong px-2 py-1.5"
                : "rounded-lg border border-line-neutral px-2 py-1.5"
            }
            onClick={() => setStatusFilter("recruiting")}
            type="button"
          >
            <Typography
              color={
                statusFilter === "recruiting"
                  ? "semantic.inverse.label"
                  : "semantic.label.alternative"
              }
              variant="label1"
              weight="medium"
            >
              모집중
            </Typography>
          </button>
        </div>

        <div className="flex flex-col px-5 pb-24">
          {posts.map((post, index) => (
            <button
              className={
                index === 0
                  ? "flex flex-col items-start gap-1.5 py-4 text-left"
                  : "flex flex-col items-start gap-1.5 border-line-neutral border-t py-4 text-left"
              }
              key={post.id}
              onClick={() => navigate(`/board/${post.id}`)}
              type="button"
            >
              <div className="flex items-center gap-1.5">
                <div
                  className={
                    post.status === "recruiting"
                      ? "rounded-md bg-accent-subtle px-1.5 py-0.5"
                      : "rounded-md border border-line-neutral px-1.5 py-0.5"
                  }
                >
                  <Typography
                    color={
                      post.status === "recruiting"
                        ? "semantic.primary.normal"
                        : "semantic.label.assistive"
                    }
                    variant="caption2"
                    weight="medium"
                  >
                    {post.genreTags[0]}
                  </Typography>
                </div>
                <Typography
                  color="semantic.label.assistive"
                  variant="caption1"
                  weight="bold"
                >
                  {post.kind}
                </Typography>
              </div>
              <Typography
                color={
                  post.status === "closed"
                    ? "semantic.label.assistive"
                    : "semantic.label.normal"
                }
                variant="body1"
                weight="bold"
              >
                {post.title}
              </Typography>
              <Typography
                className="line-clamp-1"
                color="semantic.label.assistive"
                variant="label2"
                weight="medium"
              >
                {post.description}
              </Typography>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1">
                  <IconLocation className="size-3.5 text-label-assistive" />
                  <Typography
                    color="semantic.label.assistive"
                    variant="label2"
                    weight="medium"
                  >
                    {post.place}
                  </Typography>
                </div>
                <div className="flex items-center gap-1">
                  <IconPersons className="size-3.5 text-label-assistive" />
                  <Typography
                    color="semantic.label.assistive"
                    variant="label2"
                    weight="medium"
                  >
                    {post.members}
                  </Typography>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        className="absolute right-5 bottom-5 flex items-center gap-1.5 rounded-full bg-accent px-5 py-3.5 shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
        onClick={() => navigate("/board/write")}
        type="button"
      >
        <IconPlus className="size-5 text-static-white" />
        <Typography
          color="semantic.static.white"
          variant="label1"
          weight="bold"
        >
          글쓰기
        </Typography>
      </button>
    </div>
  );
}

export default BoardScreen;
