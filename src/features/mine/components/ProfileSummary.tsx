import { Avatar, Typography } from "@wanteddev/wds";
import type { ReactNode } from "react";

import mascotPeace from "@/assets/mascot/peace.png";
import PressableCard from "@/components/ui/PressableCard";
import Tag from "@/components/ui/Tag";
import {
  GENRE_LABEL,
  INSTRUMENT_LABEL,
  LEVEL_LABEL,
  REGION_LABEL,
} from "@/lib/domain/labels";
import type { User } from "@/lib/domain/types";

// 마이(마이/01)와 다른 사용자 프로필(마이/08)이 같은 모양으로 쓰는 프로필 머리(아바타·닉네임·소개)와
// 세션·음악 취향·활동 지역 카드.

export function ProfileHeader({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-4">
      {/* 프로필 사진이 없으면 모여락 기본 캐릭터를 보여 준다(Figma 마이/01·08). */}
      <Avatar
        alt=""
        size="xlarge"
        src={user.profileImage ?? mascotPeace}
        variant="person"
      />
      <div className="flex min-w-0 flex-col gap-0.5">
        <Typography
          as="h1"
          color="semantic.label.strong"
          variant="title3"
          weight="bold"
        >
          {user.nickname}
        </Typography>
        <Typography
          color={
            user.bio ? "semantic.label.normal" : "semantic.label.assistive"
          }
          variant="body2"
          weight="medium"
        >
          {user.bio || "아직 소개가 없어요"}
        </Typography>
      </div>
    </div>
  );
}

function InfoRow({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <Typography
        className="shrink-0 pt-0.5"
        color="semantic.label.assistive"
        variant="label1"
        weight="bold"
      >
        {label}
      </Typography>
      <div className="flex min-w-0 flex-col items-end gap-1.5">{children}</div>
    </div>
  );
}

function TagList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return (
      <Typography
        color="semantic.label.assistive"
        variant="label2"
        weight="medium"
      >
        아직 없어요
      </Typography>
    );
  }
  return (
    <div className="flex flex-wrap justify-end gap-1.5">
      {items.map((item) => (
        <Tag key={item}>{item}</Tag>
      ))}
    </div>
  );
}

interface ProfileInfoCardProps {
  user: User;
  /** "내 세션"(마이) / "세션"(다른 사용자) */
  sessionLabel: string;
  /** 세션 행 아래에 붙는 동작(마이의 "세션 수정") */
  sessionAction?: ReactNode;
}

export function ProfileInfoCard({
  sessionAction,
  sessionLabel,
  user,
}: ProfileInfoCardProps) {
  return (
    <PressableCard>
      <div className="flex flex-col gap-3">
        <InfoRow label={sessionLabel}>
          <TagList
            items={user.instruments.map(
              (item) =>
                `${INSTRUMENT_LABEL[item.instrument]} ${LEVEL_LABEL[item.level]}`,
            )}
          />
          {sessionAction}
        </InfoRow>
        <InfoRow label="음악 취향">
          <TagList items={user.genres.map((genre) => GENRE_LABEL[genre])} />
        </InfoRow>
        <InfoRow label="활동 지역">
          <TagList items={[REGION_LABEL[user.region]]} />
        </InfoRow>
      </div>
    </PressableCard>
  );
}
