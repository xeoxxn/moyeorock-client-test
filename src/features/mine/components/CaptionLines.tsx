// WDS ListCell의 caption은 한 줄짜리 Typography라, "세션 · 실력 / 지역 · 장르"처럼 정보가 여러 겹인
// 행(저장 목록·초대·신청)은 줄마다 나눠 넣는다. 마지막 줄(지역·시간 같은 보조 정보)은 한 단계 흐리게.
function CaptionLines({ lines }: { lines: (string | undefined)[] }) {
  const visible = lines.filter((line): line is string => Boolean(line));
  return (
    <>
      {visible.map((line, index) => (
        <span
          className={
            index > 0 && index === visible.length - 1
              ? "block text-label-assistive"
              : "block"
          }
          key={line}
        >
          {line}
        </span>
      ))}
    </>
  );
}

export default CaptionLines;
