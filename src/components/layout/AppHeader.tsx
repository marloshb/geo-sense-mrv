import { Bell, Search, User, Building2, ChevronRight, Home, Command, Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

const routeNames: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/monitoring": "Monitoramento",
  "/territories": "Territórios",
  "/assets": "Ativos",
  "/analytics": "Analytics MRV",
  "/risks": "Riscos Climáticos",
  "/governance": "Governança",
  "/reports": "Relatórios",
  "/audit": "Auditoria",
  "/integrations": "Integrações",
  "/settings": "Configurações",
};

const notifications = [
  { id: 1, title: "Risco crítico detectado", description: "Terminal SP - Elevação do nível do mar", time: "5 min", type: "critical" },
  { id: 2, title: "Relatório pronto", description: "Inventário GEE Q3 2024 finalizado", time: "1h", type: "success" },
  { id: 3, title: "Nova atualização", description: "Dashboard IFRS S2 disponível", time: "3h", type: "info" },
];

const quickActions = [
  { label: "Novo Território", icon: Plus, path: "/territories", shortcut: "⌘T" },
  { label: "Calcular Emissões", icon: Zap, path: "/analytics", shortcut: "⌘E" },
  { label: "Gerar Relatório", icon: Plus, path: "/reports", shortcut: "⌘R" },
];

export const AppHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [commandOpen, setCommandOpen] = useState(false);
  
  const currentRoute = routeNames[location.pathname] || "Página";

  const getBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter(Boolean);
    return paths.map((path, index) => ({
      label: routeNames[`/${paths.slice(0, index + 1).join("/")}`] || path,
      path: `/${paths.slice(0, index + 1).join("/")}`,
    }));
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Breadcrumbs & Search */}
      <div className="flex items-center gap-6 flex-1">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 text-sm">
          <NavLink to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            <Home className="w-4 h-4" />
          </NavLink>
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.path} className="flex items-center gap-1">
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
              {index === breadcrumbs.length - 1 ? (
                <span className="font-medium text-foreground">{crumb.label}</span>
              ) : (
                <NavLink to={crumb.path} className="text-muted-foreground hover:text-foreground transition-colors">
                  {crumb.label}
                </NavLink>
              )}
            </div>
          ))}
        </nav>

        {/* Search / Command */}
        <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-72 justify-start text-muted-foreground gap-2 bg-secondary/50 border-0 hover:bg-secondary"
            >
              <Search className="w-4 h-4" />
              <span className="flex-1 text-left text-sm">Buscar...</span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] p-0">
            <DialogHeader className="px-4 pt-4 pb-2">
              <DialogTitle className="text-lg">Busca Rápida</DialogTitle>
              <DialogDescription>
                Navegue rapidamente pelo sistema
              </DialogDescription>
            </DialogHeader>
            <div className="px-4 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar territórios, ativos, relatórios..."
                  className="pl-10"
                  autoFocus
                />
              </div>
            </div>
            <div className="border-t px-2 py-2">
              <p className="px-2 py-1 text-xs font-medium text-muted-foreground">Ações Rápidas</p>
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => {
                    navigate(action.path);
                    setCommandOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-secondary transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                    <action.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="flex-1 text-sm">{action.label}</span>
                  <kbd className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {action.shortcut}
                  </kbd>
                </button>
              ))}
            </div>
            <div className="border-t px-2 py-2">
              <p className="px-2 py-1 text-xs font-medium text-muted-foreground">Navegação</p>
              {Object.entries(routeNames).slice(0, 5).map(([path, name]) => (
                <button
                  key={path}
                  onClick={() => {
                    navigate(path);
                    setCommandOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-secondary transition-colors text-left"
                >
                  <span className="text-sm">{name}</span>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Organization Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 h-9">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Building2 className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="hidden sm:inline font-medium">Vale S.A.</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Organização</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-2">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <Building2 className="w-3 h-3 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Vale S.A.</p>
                  <p className="text-xs text-muted-foreground">5 territórios</p>
                </div>
                <Badge variant="secondary" className="text-[10px]">Ativo</Badge>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <div className="w-6 h-6 rounded bg-secondary flex items-center justify-center">
                  <Building2 className="w-3 h-3" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Petrobras</p>
                  <p className="text-xs text-muted-foreground">3 territórios</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notificações</span>
              <Button variant="ghost" size="sm" className="text-xs h-auto p-0 text-primary">
                Marcar todas como lidas
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="flex-col items-start gap-1 p-3 cursor-pointer">
                <div className="flex items-center gap-2 w-full">
                  <span className={`w-2 h-2 rounded-full ${
                    notification.type === "critical" ? "bg-destructive" : 
                    notification.type === "success" ? "bg-success" : "bg-info"
                  }`} />
                  <span className="font-medium text-sm flex-1">{notification.title}</span>
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </div>
                <p className="text-xs text-muted-foreground pl-4">{notification.description}</p>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary text-sm">
              Ver todas as notificações
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 h-9 pl-1 pr-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-info flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">MS</span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-medium leading-none">Maria Silva</p>
                <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Analista ESG</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-info flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">MS</span>
                </div>
                <div>
                  <p className="font-medium">Maria Silva</p>
                  <p className="text-xs text-muted-foreground">maria@vale.com</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Meu Perfil</DropdownMenuItem>
              <DropdownMenuItem>Preferências</DropdownMenuItem>
              <DropdownMenuItem>Atalhos de Teclado</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
