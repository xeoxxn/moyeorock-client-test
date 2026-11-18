import { Avatar, Typography, WithInteraction } from "@wanteddev/wds";

// Figma "Avatar/Labeled"(552:24059) — 모임 홈 멤버 줄: WDS Avatar(56) + 이름(12).
interface LabeledAvatarProps {
  name: string;
  profileImage: string | null;
  onClick?: () => void;
}

function LabeledAvatar({ name, onClick, profileImage }: LabeledAvatarProps) {
  return (
    <WithInteraction variant="light">
      <button
        className="flex w-14 shrink-0 flex-col items-center gap-1.5"
        onClick={onClick}
        type="button"
      >
        <Avatar
          alt=""
          size="xlarge"
          src={profileImage ?? undefined}
          variant="person"
        />
        <Typography
          as="span"
          className="w-16 truncate text-center"
          color="semantic.label.strong"
          variant="caption1"
          weight="medium"
        >
          {name}
        </Typography>
      </button>
    </WithInteraction>
  );
}

export default LabeledAvatar;
