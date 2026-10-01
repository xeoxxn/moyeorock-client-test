import { Chip, Typography } from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

// Figma: 마이/03 세션 수정 (nodeId 101:25694)
const LEVELS = ["입문", "초급", "중급", "고급"] as const;
type Level = (typeof LEVELS)[number];

interface SessionState {
  name: string;
  enabled: boolean;
  level: Level;
}

const INITIAL_SESSIONS: SessionState[] = [
  { enabled: false, level: "입문", name: "보컬" },
  { enabled: false, level: "입문", name: "일렉 기타" },
  { enabled: true, level: "입문", name: "어쿠스틱 기타" },
  { enabled: false, level: "입문", name: "베이스" },
  { enabled: false, level: "입문", name: "드럼" },
  { enabled: true, level: "초급", name: "키보드" },
];

function MineSessionEditScreen() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);

  const toggleEnabled = (name: string) =>
    setSessions((prev) =>
      prev.map((s) => (s.name === name ? { ...s, enabled: !s.enabled } : s)),
    );
  const setLevel = (name: string, level: Level) =>
    setSessions((prev) =>
      prev.map((s) => (s.name === name ? { ...s, level } : s)),
    );

  useScreenHeader(
    <ScreenHeader
      leading={
        <button onClick={() => navigate(-1)} type="button">
          <IconChevronLeft className="size-6 text-label-normal" />
        </button>
      }
      title="세션 수정"
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
      <div className="flex flex-col gap-6 px-5 pt-2 pb-8">
        <div className="flex flex-col gap-2">
          <Typography
            as="p"
            color="semantic.label.normal"
            variant="title3"
            weight="bold"
          >
            맡고 있는 세션과
            <br />
            실력을 알려주세요
          </Typography>
          <Typography
            color="semantic.label.alternative"
            variant="body2"
            weight="regular"
          >
            세션마다 실력을 따로 고를 수 있어요
          </Typography>
        </div>

        {sessions.map((session) => (
          <div
            className={
              session.enabled
                ? "flex flex-col gap-3 rounded-2xl border border-accent bg-accent-subtle p-4"
                : "flex flex-col gap-3 rounded-2xl border border-line-neutral p-4"
            }
            key={session.name}
          >
            <div className="flex items-center gap-2">
              <Typography
                className="flex-1"
                color={
                  session.enabled
                    ? "semantic.label.normal"
                    : "semantic.label.alternative"
                }
                variant="body1"
                weight="bold"
              >
                {session.name}
              </Typography>
              <button
                aria-checked={session.enabled}
                className={
                  session.enabled
                    ? "flex h-8 w-[52px] shrink-0 items-center justify-end rounded-full bg-accent-strong p-1 shadow-neon-sm"
                    : "flex h-8 w-[52px] shrink-0 items-center justify-start rounded-full bg-white/10 p-1"
                }
                onClick={() => toggleEnabled(session.name)}
                role="switch"
                type="button"
              >
                <span className="size-6 rounded-full bg-static-white" />
              </button>
            </div>
            {session.enabled && (
              <div className="flex gap-1.5">
                {LEVELS.map((level) => (
                  <Chip
                    active={session.level === level}
                    key={level}
                    onClick={() => setLevel(session.name, level)}
                    size="small"
                    variant="outlined"
                  >
                    {level}
                  </Chip>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MineSessionEditScreen;
