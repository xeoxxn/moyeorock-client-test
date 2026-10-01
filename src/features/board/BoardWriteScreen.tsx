import {
  Option,
  Select,
  TextArea,
  TextField,
  Typography,
} from "@wanteddev/wds";
import { IconClose } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

// Figma: 게시판/03 모집글 쓰기 (nodeId 101:24851)

const SESSIONS = [
  "보컬",
  "일렉 기타",
  "어쿠스틱 기타",
  "베이스",
  "드럼",
  "키보드",
];

function BoardWriteScreen() {
  const navigate = useNavigate();
  const [postType, setPostType] = useState("crew");
  const [title, setTitle] = useState("");
  const [selectedSessions, setSelectedSessions] = useState<string[]>(["보컬"]);
  const [memberCount, setMemberCount] = useState("5");
  const [place, setPlace] = useState("");

  const toggleSession = (session: string) => {
    setSelectedSessions((prev) =>
      prev.includes(session)
        ? prev.filter((s) => s !== session)
        : [...prev, session],
    );
  };

  useScreenHeader(
    <ScreenHeader
      leading={
        <button onClick={() => navigate(-1)} type="button">
          <IconClose className="size-6 text-label-normal" />
        </button>
      }
      title="모집글 쓰기"
      trailing={
        <button onClick={() => navigate(-1)} type="button">
          <Typography
            className="text-glow-sm"
            color="semantic.primary.normal"
            variant="body1"
            weight="bold"
          >
            등록
          </Typography>
        </button>
      }
      variant="normal"
    />,
  );

  return (
    <div className="scrollbar-hidden flex flex-1 flex-col gap-4 overflow-y-auto px-5 pt-2 pb-6">
      <label className="flex flex-col gap-2" htmlFor="post-type">
        <Typography
          color="semantic.label.normal"
          variant="label1"
          weight="bold"
        >
          모집 유형
        </Typography>
        <Select
          id="post-type"
          onChange={setPostType}
          value={postType}
          width="100%"
        >
          <Option value="crew">모임 모집</Option>
          <Option value="show">공연 참가팀 모집</Option>
          <Option value="team">팀 멤버 모집</Option>
        </Select>
      </label>

      <label className="flex flex-col gap-2" htmlFor="post-title">
        <Typography
          color="semantic.label.normal"
          variant="label1"
          weight="bold"
        >
          제목
        </Typography>
        <TextField
          id="post-title"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="홍대 주말 합주 보컬을 찾고 있어요"
          value={title}
          width="100%"
        />
      </label>

      <div className="flex flex-col gap-2">
        <Typography
          color="semantic.label.normal"
          variant="label1"
          weight="bold"
        >
          모집 세션
        </Typography>
        <div className="flex flex-wrap gap-2">
          {SESSIONS.map((session) => {
            const active = selectedSessions.includes(session);
            return (
              <button
                className={
                  active
                    ? "rounded-xl border border-accent px-3.5 py-2"
                    : "rounded-xl border border-line-solid px-3.5 py-2"
                }
                key={session}
                onClick={() => toggleSession(session)}
                type="button"
              >
                <Typography
                  color={
                    active
                      ? "semantic.primary.normal"
                      : "semantic.label.alternative"
                  }
                  variant="label1"
                  weight="medium"
                >
                  {session}
                </Typography>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-2" htmlFor="post-region">
          <Typography
            color="semantic.label.normal"
            variant="label1"
            weight="bold"
          >
            활동 지역
          </Typography>
          <Select id="post-region" placeholder="선택" width="100%">
            <Option value="hongdae">홍대</Option>
            <Option value="hapjeong">합정</Option>
            <Option value="sinchon">신촌</Option>
            <Option value="mangwon">망원</Option>
          </Select>
        </label>
        <label
          className="flex flex-1 flex-col gap-2"
          htmlFor="post-member-count"
        >
          <Typography
            color="semantic.label.normal"
            variant="label1"
            weight="bold"
          >
            모집 인원
          </Typography>
          <Select
            id="post-member-count"
            onChange={setMemberCount}
            value={memberCount}
            width="100%"
          >
            {["1", "2", "3", "4", "5"].map((n) => (
              <Option key={n} value={n}>
                {n}명
              </Option>
            ))}
          </Select>
        </label>
      </div>

      <label className="flex flex-col gap-2" htmlFor="post-place">
        <Typography
          color="semantic.label.normal"
          variant="label1"
          weight="bold"
        >
          합주 장소
        </Typography>
        <TextField
          id="post-place"
          onChange={(e) => setPlace(e.target.value)}
          placeholder="홍대 모여락 스튜디오"
          value={place}
          width="100%"
        />
      </label>

      <label className="flex flex-col gap-2" htmlFor="post-description">
        <Typography
          color="semantic.label.normal"
          variant="label1"
          weight="bold"
        >
          소개
        </Typography>
        <TextArea
          id="post-description"
          minRows={2}
          placeholder="어떤 사람과 함께하고 싶은지 알려주세요"
          width="100%"
        />
      </label>
    </div>
  );
}

export default BoardWriteScreen;
