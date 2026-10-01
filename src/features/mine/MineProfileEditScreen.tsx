import { Chip, TextField, Typography } from "@wanteddev/wds";
import { IconChevronLeft, IconChevronRight } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import mascotPeace from "@/assets/mascot/peace.png";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

// Figma: 마이/02 프로필 수정 (nodeId 101:25470)
const MUSIC_TASTES = ["인디", "펑크", "록", "어쿠스틱", "발라드", "메탈"];

function MineProfileEditScreen() {
  const navigate = useNavigate();
  const [selectedTastes, setSelectedTastes] = useState<string[]>(["펑크"]);

  const toggleTaste = (taste: string) => {
    setSelectedTastes((prev) =>
      prev.includes(taste) ? prev.filter((t) => t !== taste) : [...prev, taste],
    );
  };

  useScreenHeader(
    <ScreenHeader
      leading={
        <button onClick={() => navigate(-1)} type="button">
          <IconChevronLeft className="size-6 text-label-normal" />
        </button>
      }
      title="프로필 수정"
      trailing={
        <button onClick={() => navigate(-1)} type="button">
          <Typography
            className="text-glow-sm"
            color="semantic.primary.normal"
            variant="body1"
            weight="bold"
          >
            저장
          </Typography>
        </button>
      }
      variant="normal"
    />,
  );

  return (
    <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto">
      <div className="flex flex-col items-center gap-5 px-5 pt-4 pb-8">
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-24 items-center justify-center rounded-full bg-surface">
            <img alt="" className="size-[84px]" src={mascotPeace} />
          </div>
          <button type="button">
            <Typography
              className="text-glow-sm"
              color="semantic.primary.normal"
              variant="label1"
              weight="bold"
            >
              캐릭터 변경
            </Typography>
          </button>
        </div>

        <label className="flex w-full flex-col gap-2" htmlFor="mine-nickname">
          <Typography
            color="semantic.label.normal"
            variant="label1"
            weight="bold"
          >
            닉네임
          </Typography>
          <TextField defaultValue="김광철" id="mine-nickname" width="100%" />
        </label>

        <label className="flex w-full flex-col gap-2" htmlFor="mine-bio">
          <Typography
            color="semantic.label.normal"
            variant="label1"
            weight="bold"
          >
            한 줄 소개
          </Typography>
          <TextField
            defaultValue="잘 부탁드립니다."
            id="mine-bio"
            width="100%"
          />
        </label>

        <label className="flex w-full flex-col gap-2" htmlFor="mine-region">
          <Typography
            color="semantic.label.normal"
            variant="label1"
            weight="bold"
          >
            활동 지역
          </Typography>
          <TextField defaultValue="서울" id="mine-region" width="100%" />
        </label>

        <div className="flex w-full flex-col gap-2.5">
          <Typography
            color="semantic.label.normal"
            variant="label1"
            weight="bold"
          >
            음악 취향
          </Typography>
          <div className="flex flex-wrap gap-2">
            {MUSIC_TASTES.map((taste) => (
              <Chip
                active={selectedTastes.includes(taste)}
                key={taste}
                onClick={() => toggleTaste(taste)}
                size="medium"
                variant="outlined"
              >
                {taste}
              </Chip>
            ))}
          </div>
        </div>

        <button
          className="flex w-full items-center gap-2 py-3"
          onClick={() => navigate("/mine/session")}
          type="button"
        >
          <div className="flex min-w-0 flex-1 flex-col">
            <Typography
              color="semantic.label.normal"
              variant="body1"
              weight="regular"
            >
              세션 · 실력 수정
            </Typography>
            <Typography
              color="semantic.label.assistive"
              variant="label2"
              weight="regular"
            >
              어쿠스틱 · 입문 · 키보드
            </Typography>
          </div>
          <IconChevronRight className="size-4 shrink-0 text-label-assistive" />
        </button>
      </div>
    </div>
  );
}

export default MineProfileEditScreen;
