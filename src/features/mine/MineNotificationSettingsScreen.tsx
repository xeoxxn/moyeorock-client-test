import { ListCell, ListCellContent, Switch } from "@wanteddev/wds";
import { useMemo, useState } from "react";

import ScreenBody from "@/components/ui/ScreenBody";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

// 알림 설정(/mine/notifications) — Figma 07 마이의 "알림 설정" 메뉴에서 들어온다. Figma 화면은 없다.
// 서버에 알림 설정 API가 없어 켜고 끈 값은 이 화면 상태로만 들고 있다(저장되지 않는다).

type NotificationKind =
  | "apply"
  | "invite"
  | "notice"
  | "performance"
  | "rehearsal";

const ITEMS: { kind: NotificationKind; label: string; caption: string }[] = [
  {
    caption: "내 모집글에 지원하거나 내 지원 결과가 나오면",
    kind: "apply",
    label: "모집 지원",
  },
  {
    caption: "팀·모임 초대를 받거나 보낸 초대에 답이 오면",
    kind: "invite",
    label: "초대",
  },
  { caption: "모임에 새 공지가 올라오면", kind: "notice", label: "공지" },
  {
    caption: "모임에 새 공연이 열리면",
    kind: "performance",
    label: "공연",
  },
  { caption: "팀 합주 일정이 잡히면", kind: "rehearsal", label: "합주" },
];

function MineNotificationSettingsScreen() {
  const [enabled, setEnabled] = useState<Record<NotificationKind, boolean>>({
    apply: true,
    invite: true,
    notice: true,
    performance: true,
    rehearsal: true,
  });

  useScreenHeader(useMemo(() => <ScreenHeader title="알림 설정" />, []));

  return (
    <ScreenBody className="pt-2">
      {ITEMS.map((item) => (
        // 스위치 행은 스위치만 누른다 — WDS ListCell은 role="switch"를 대신 눌러 주지 않는다.
        <ListCell
          alignItems="center"
          disableInteraction
          fillWidth
          key={item.kind}
          textProps={{ caption: item.caption }}
          trailingContent={
            <ListCellContent variant="switch">
              <Switch
                aria-label={`${item.label} 알림`}
                checked={enabled[item.kind]}
                onCheckedChange={(checked) =>
                  setEnabled((prev) => ({ ...prev, [item.kind]: checked }))
                }
              />
            </ListCellContent>
          }
        >
          {item.label}
        </ListCell>
      ))}
    </ScreenBody>
  );
}

export default MineNotificationSettingsScreen;
