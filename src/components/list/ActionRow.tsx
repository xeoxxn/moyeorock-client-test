import { IconPlus, IconSearch } from "@wanteddev/wds-icon";

import MediaRow from "@/components/list/MediaRow";

// Figma "List/Action Row"(552:24346) — 목록 맨 위·아래의 "새로 만들기"·"찾아보기" 행. 커버 자리에
// bg/press 타일 + 아이콘을 두어 목록 행과 줄을 맞춘다.
interface ActionRowProps {
  icon?: "plus" | "search";
  title: string;
  meta?: string;
  onClick: () => void;
}

function ActionRow({ icon = "plus", meta, onClick, title }: ActionRowProps) {
  const Icon = icon === "plus" ? IconPlus : IconSearch;
  return (
    <MediaRow
      leading={
        <span className="flex size-14 shrink-0 items-center justify-center rounded-sm bg-press">
          <Icon className="size-6 text-label-strong" />
        </span>
      }
      meta={meta}
      onClick={onClick}
      title={title}
    />
  );
}

export default ActionRow;
