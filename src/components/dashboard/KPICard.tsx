import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  unit?: string;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  variant?: "default" | "success" | "warning" | "destructive" | "info";
}

export const KPICard = ({
  title,
  value,
  unit,
  change,
  changeLabel,
  icon,
  variant = "default",
}: KPICardProps) => {
  const getTrendIcon = () => {
    if (change === undefined || change === 0) return <Minus className="w-3 h-3" />;
    return change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />;
  };

  const getTrendColor = () => {
    if (change === undefined || change === 0) return "text-muted-foreground";
    return change > 0 ? "text-success" : "text-destructive";
  };

  const variantStyles = {
    default: "border-l-primary",
    success: "border-l-success",
    warning: "border-l-warning",
    destructive: "border-l-destructive",
    info: "border-l-info",
  };

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-lg p-5 border-l-4 transition-shadow hover:shadow-md",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium mb-1">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          {change !== undefined && (
            <div className={cn("flex items-center gap-1 mt-2 text-xs", getTrendColor())}>
              {getTrendIcon()}
              <span>{Math.abs(change)}%</span>
              {changeLabel && <span className="text-muted-foreground ml-1">{changeLabel}</span>}
            </div>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
