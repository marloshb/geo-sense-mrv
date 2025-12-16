import { useState } from "react";
import { NavLink } from "react-router-dom";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

const NavItem = ({ to, icon, label, collapsed }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full",
          "hover:bg-sidebar-accent",
          isActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground/70"
        )
      }
    >
      <span className="flex-shrink-0">{icon}</span>
      {!collapsed && (
        <span className="font-medium text-sm truncate">{label}</span>
      )}
    </NavLink>
  );
};

export const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const mainNavItems = [
    { to: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/monitoring", icon: <Map size={20} />, label: "Monitoramento" },
    { to: "/territories", icon: <Globe size={20} />, label: "Territórios" },
    { to: "/assets", icon: <Building2 size={20} />, label: "Ativos" },
    { to: "/analytics", icon: <BarChart3 size={20} />, label: "Analytics" },
    { to: "/risks", icon: <AlertTriangle size={20} />, label: "Riscos" },
    { to: "/governance", icon: <Shield size={20} />, label: "Governança" },
    { to: "/reports", icon: <FileText size={20} />, label: "Relatórios" },
    { to: "/audit", icon: <Layers size={20} />, label: "Auditoria" },
    { to: "/integrations", icon: <Globe size={20} />, label: "Integrações" },
  ];

  const bottomNavItems = [
    { to: "/settings", icon: <Settings size={20} />, label: "Configurações" },
  ];

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar flex flex-col border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <Layers className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-sidebar-foreground">MRV</h1>
              <p className="text-[10px] text-sidebar-foreground/60 -mt-0.5">
                Territorial
              </p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center mx-auto">
            <Layers className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {mainNavItems.map((item) => (
          <NavItem key={item.to} {...item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        {bottomNavItems.map((item) => (
          <NavItem key={item.to} {...item} collapsed={collapsed} />
        ))}

        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
            collapsed && "justify-center"
          )}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!collapsed && <span className="ml-3 text-sm">Recolher</span>}
        </Button>
      </div>
    </aside>
  );
};
