import { type LucideIcon } from "lucide-react";

type KPIColor = "blue" | "green" | "amber" | "red" | "purple" | "teal";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: KPIColor;
}

const colorMap: Record<KPIColor, { bg: string; icon: string; card: string }> = {
  blue: { bg: "bg-kpi-blue", icon: "text-kpi-blue-icon", card: "bg-kpi-blue/50 border-kpi-blue-icon/15" },
  green: { bg: "bg-kpi-green", icon: "text-kpi-green-icon", card: "bg-kpi-green/50 border-kpi-green-icon/15" },
  amber: { bg: "bg-kpi-amber", icon: "text-kpi-amber-icon", card: "bg-kpi-amber/50 border-kpi-amber-icon/15" },
  red: { bg: "bg-kpi-red", icon: "text-kpi-red-icon", card: "bg-kpi-red/50 border-kpi-red-icon/15" },
  purple: { bg: "bg-kpi-purple", icon: "text-kpi-purple-icon", card: "bg-kpi-purple/50 border-kpi-purple-icon/15" },
  teal: { bg: "bg-kpi-teal", icon: "text-kpi-teal-icon", card: "bg-kpi-teal/50 border-kpi-teal-icon/15" },
};

export default function KPICard({ title, value, icon: Icon, color }: KPICardProps) {
  const c = colorMap[color];
  return (
    <div className={`rounded-xl border shadow-sm p-5 transition-shadow duration-200 hover:shadow-md flex items-center gap-4 ${c.card}`}>
      <div className={`${c.bg} p-3 rounded-xl`}>
        <Icon className={`h-6 w-6 ${c.icon}`} />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  );
}
