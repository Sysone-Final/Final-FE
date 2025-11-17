import "../css/chartCard.css";
import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  icon?: string;
  size?: "small" | "medium" | "large";
  children: ReactNode;
}

function ChartCard({ title, icon, size = "medium", children }: ChartCardProps) {
  return (
    <div className={`chart-card chart-card-${size}`}>
      <div className={icon ? "chart-header-with-icon" : "chart-header"}>
        {icon && <img src={icon} alt={title} className="chart-icon" />}
        <span className="chart-title">{title}</span>
      </div>
      <div className="chart-content">{children}</div>
    </div>
  );
}

export default ChartCard;
