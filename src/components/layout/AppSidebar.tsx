import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  BarChart3,
  FileText,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  Globe,
  Building2,
  Layers,
  AlertTriangle,
  Plug,
  ClipboardCheck,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Target,
  HelpCircle,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  badge?: string | number;
  badgeVariant?: "default" | "destructive" | "warning" | "success";
}

const NavItem = ({ to, icon, label, collapsed, badge, badgeVariant = "default" }: NavItemProps) => {
  const badgeColors = {
    default: "bg-primary/20 text-primary",
    destructive: "bg-destructive/20 text-destructive",
    warning: "bg-warning/20 text-warning",
    success: "bg-success/20 text-success",
  };

  const content = (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full group relative",
          "hover:bg-sidebar-accent hover:shadow-sm",
          isActive
            ? "bg-gradient-to-r from-sidebar-primary to-sidebar-primary/80 text-sidebar-primary-foreground shadow-md"
            : "text-sidebar-foreground/70 hover:text-sidebar-foreground"
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sidebar-primary-foreground rounded-r-full" />
          )}
          <span className={cn("flex-shrink-0 transition-transform group-hover:scale-110", isActive && "ml-1")}>
            {icon}
          </span>
          {!collapsed && (
            <>
              <span className="font-medium text-sm truncate flex-1">{label}</span>
              {badge && (
                <Badge className={cn("text-[10px] px-1.5 py-0 h-5", badgeColors[badgeVariant])}>
                  {badge}
                </Badge>
              )}
            </>
          )}
          {collapsed && badge && (
            <span className={cn("absolute -top-1 -right-1 w-2 h-2 rounded-full", badgeVariant === "destructive" ? "bg-destructive" : "bg-primary")} />
          )}
        </>
      )}
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          {label}
          {badge && <Badge className={cn("text-[10px]", badgeColors[badgeVariant])}>{badge}</Badge>}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
};

interface NavGroupProps {
  title: string;
  icon: React.ReactNode;
  items: Array<{
    to: string;
    icon: React.ReactNode;
    label: string;
    badge?: string | number;
    badgeVariant?: "default" | "destructive" | "warning" | "success";
  }>;
  collapsed: boolean;
  defaultOpen?: boolean;
}

const NavGroup = ({ title, icon, items, collapsed, defaultOpen = true }: NavGroupProps) => {
  const location = useLocation();
  const isGroupActive = items.some(item => location.pathname === item.to);
  const [isOpen, setIsOpen] = useState(defaultOpen || isGroupActive);

  if (collapsed) {
    return (
      <div className="space-y-1">
        {items.map((item) => (
          <NavItem key={item.to} {...item} collapsed={collapsed} />
        ))}
      </div>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider hover:text-sidebar-foreground/70 transition-colors">
        <span className="flex-shrink-0">{icon}</span>
        <span className="flex-1 text-left">{title}</span>
        <ChevronDown className={cn("w-3 h-3 transition-transform", isOpen && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 mt-1">
        {items.map((item) => (
          <NavItem key={item.to} {...item} collapsed={collapsed} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const operationalItems = [
    { to: "/dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
    { to: "/monitoring", icon: <Map size={18} />, label: "Monitoramento" },
    { to: "/territories", icon: <Globe size={18} />, label: "Territórios" },
    { to: "/assets", icon: <Building2 size={18} />, label: "Ativos" },
  ];

  const analyticsItems = [
    { to: "/analytics", icon: <BarChart3 size={18} />, label: "Analytics MRV" },
    { to: "/risks", icon: <AlertTriangle size={18} />, label: "Riscos Climáticos", badge: 8, badgeVariant: "destructive" as const },
  ];

  const governanceItems = [
    { to: "/governance", icon: <Shield size={18} />, label: "GRC" },
    { to: "/reports", icon: <FileText size={18} />, label: "Relatórios", badge: "Novo", badgeVariant: "success" as const },
    { to: "/audit", icon: <ClipboardCheck size={18} />, label: "Auditoria" },
  ];

  const systemItems = [
    { to: "/integrations", icon: <Plug size={18} />, label: "Integrações" },
    { to: "/settings", icon: <Settings size={18} />, label: "Configurações" },
  ];

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "h-screen bg-sidebar flex flex-col border-r border-sidebar-border transition-all duration-300 relative",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          {!collapsed ? (
            <NavLink to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg group-hover:shadow-primary/25 transition-shadow">
                <Layers className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-sidebar-foreground text-lg tracking-tight">MRV</h1>
                <p className="text-[10px] text-sidebar-foreground/60 -mt-0.5 font-medium">
                  Territorial Platform
                </p>
              </div>
            </NavLink>
          ) : (
            <NavLink to="/dashboard" className="mx-auto">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg hover:shadow-primary/25 transition-shadow">
                <Layers className="w-5 h-5 text-primary-foreground" />
              </div>
            </NavLink>
          )}
        </div>

        {/* Quick Actions */}
        {!collapsed && (
          <div className="px-3 py-3 border-b border-sidebar-border">
            <div className="bg-gradient-to-r from-primary/10 to-info/10 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-sidebar-foreground">Ações Rápidas</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <NavLink to="/territories" className="flex flex-col items-center gap-1 p-2 rounded-md bg-background/50 hover:bg-background transition-colors text-center">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">Novo Território</span>
                </NavLink>
                <NavLink to="/analytics" className="flex flex-col items-center gap-1 p-2 rounded-md bg-background/50 hover:bg-background transition-colors text-center">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">Calcular GEE</span>
                </NavLink>
              </div>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto scrollbar-thin">
          <NavGroup
            title="Operacional"
            icon={<Target size={12} />}
            items={operationalItems}
            collapsed={collapsed}
          />
          
          <NavGroup
            title="Análise & Risco"
            icon={<TrendingUp size={12} />}
            items={analyticsItems}
            collapsed={collapsed}
          />
          
          <NavGroup
            title="Governança"
            icon={<Shield size={12} />}
            items={governanceItems}
            collapsed={collapsed}
          />
          
          <NavGroup
            title="Sistema"
            icon={<Zap size={12} />}
            items={systemItems}
            collapsed={collapsed}
            defaultOpen={false}
          />
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-sidebar-border space-y-2">
          {/* Help */}
          {!collapsed && (
            <div className="bg-sidebar-accent/50 rounded-lg p-3 mb-2">
              <div className="flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-sidebar-foreground">Precisa de ajuda?</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Acesse a documentação ou suporte
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Collapse Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "w-full text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
              collapsed ? "justify-center px-2" : "justify-start"
            )}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && <span className="ml-2 text-sm">Recolher menu</span>}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
};
