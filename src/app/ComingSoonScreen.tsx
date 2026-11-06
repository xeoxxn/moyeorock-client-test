import { useNavigate } from "react-router-dom";

import EmptyState from "@/components/ui/EmptyState";

// 라우트가 없는 경로에 보여주는 화면 — router.tsx에서 레이아웃 라우트 안에 path "*"로 둬서, 하단
// 탭이 그대로 남아 다른 화면으로 돌아갈 수 있다.
function ComingSoonScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 items-center justify-center bg-background px-5">
      <EmptyState
        action={{
          label: "홈으로",
          onClick: () => navigate("/", { replace: true }),
        }}
        description="주소가 바뀌었거나 아직 준비 중인 화면이에요."
        title="찾을 수 없는 화면이에요"
      />
    </div>
  );
}

export default ComingSoonScreen;
