import { NavLink } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Globe,
  Building2,
  BarChart3,
  AlertTriangle,
  FileText,
  ArrowRight,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  bgColor: string;
}

const quickActions: QuickAction[] = [
  {
    title: "Novo Território",
    description: "Cadastre uma área para monitoramento",
    icon: <Globe className="w-5 h-5" />,
    path: "/territories",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Calcular Emissões",
    description: "Análise MRV com IA integrada",
    icon: <BarChart3 className="w-5 h-5" />,
    path: "/analytics",
    color: "text-info",
    bgColor: "bg-info/10",
  },
  {
    title: "Avaliar Riscos",
    description: "Riscos físicos e de transição",
    icon: <AlertTriangle className="w-5 h-5" />,
    path: "/risks",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    title: "Gerar Relatório",
    description: "IFRS S2 e relatórios customizados",
    icon: <FileText className="w-5 h-5" />,
    path: "/reports",
    color: "text-success",
    bgColor: "bg-success/10",
  },
];

const pendingTasks = [
  { id: 1, title: "Completar inventário GEE Q4", deadline: "Vence em 5 dias", progress: 75 },
  { id: 2, title: "Revisão de riscos - Terminal SP", deadline: "Vence em 10 dias", progress: 40 },
  { id: 3, title: "Aprovar relatório IFRS S2", deadline: "Vence em 15 dias", progress: 90 },
];

export function WelcomeSection() {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Bom dia" : currentHour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div className="space-y-6 mb-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            {greeting}, Maria! <Sparkles className="w-5 h-5 text-warning" />
          </h1>
          <p className="text-muted-foreground mt-1">
            Aqui está o resumo das suas atividades e métricas ambientais.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Clock className="w-4 h-4" />
            Última atualização: há 5 min
          </Button>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <NavLink key={action.title} to={action.path}>
            <Card className="hover:shadow-md transition-all hover:border-primary/20 cursor-pointer group h-full">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-lg ${action.bgColor} ${action.color} group-hover:scale-110 transition-transform`}>
                    {action.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          </NavLink>
        ))}
      </div>

      {/* Pending Tasks */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Tarefas Pendentes
            </h3>
            <Button variant="ghost" size="sm" className="text-xs text-primary">
              Ver todas
            </Button>
          </div>
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  task.progress >= 75 ? "bg-success/10 text-success" : 
                  task.progress >= 50 ? "bg-warning/10 text-warning" : 
                  "bg-info/10 text-info"
                }`}>
                  {task.progress >= 90 ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <TrendingUp className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.deadline}</p>
                </div>
                <div className="w-24 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-medium">{task.progress}%</span>
                  </div>
                  <Progress value={task.progress} className="h-1.5" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
