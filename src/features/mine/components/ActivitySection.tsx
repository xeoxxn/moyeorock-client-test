import { List, ListCell, ListCellContent, Typography } from "@wanteddev/wds";
import { useNavigate } from "react-router-dom";
import { rowClick } from "@/components/ui/listCellEvents";
import SectionHeader from "@/components/ui/SectionHeader";

// 마이 "내 활동"과 다른 사용자 프로필 "활동"이 같이 쓰는 섹션 — 소속 모임·팀·참여 중인 공연 수와
// 각 항목으로 가는 행(서버 GET /users/me/activities·/users/{id}의 activities 모양).

export interface ActivityLink {
  key: string;
  title: string;
  caption: string;
  to: string;
}

interface ActivitySectionProps {
  title: string;
  stats: { label: string; count: number }[];
  links: ActivityLink[];
  emptyText: string;
}

function ActivitySection({
  emptyText,
  links,
  stats,
  title,
}: ActivitySectionProps) {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col gap-3 px-5 py-6">
      <SectionHeader title={title} />
      <div className="flex gap-2">
        {stats.map((stat) => (
          <div
            className="flex flex-1 flex-col items-center gap-0.5 rounded-2xl border border-line-solid bg-surface px-2 py-4"
            key={stat.label}
          >
            <Typography
              className="text-glow"
              color="semantic.primary.normal"
              variant="title3"
              weight="bold"
            >
              {stat.count}
            </Typography>
            <Typography
              align="center"
              color="semantic.label.assistive"
              variant="label2"
              weight="medium"
            >
              {stat.label}
            </Typography>
          </div>
        ))}
      </div>
      {links.length === 0 ? (
        <Typography
          color="semantic.label.assistive"
          variant="label1"
          weight="regular"
        >
          {emptyText}
        </Typography>
      ) : (
        <List>
          {links.map((link) => (
            <ListCell
              key={link.key}
              onClick={rowClick(() => navigate(link.to))}
              textProps={{ caption: link.caption }}
              trailingContent={<ListCellContent variant="chevron" />}
            >
              {link.title}
            </ListCell>
          ))}
        </List>
      )}
    </section>
  );
}

export default ActivitySection;
