import { Typography } from "@wanteddev/wds";

// 구역 안이 비었을 때의 한 줄 안내(“잡힌 합주가 없어요”) — 화면 전체가 빈 게 아니라 큰 EmptyState
// 대신 구역 제목 아래에 짧게 둔다. 구역 내용 블록이라 아래 여백 없이 끝난다(다음 구역 위 28이 띄운다).
function EmptyNote({ children }: { children: string }) {
  return (
    <Typography
      as="p"
      className="px-5"
      color="semantic.label.alternative"
      variant="body2"
    >
      {children}
    </Typography>
  );
}

export default EmptyNote;
