import { NavLink, useLocation } from "react-router-dom";
import { Globe, Building2, BarChart3, AlertTriangle, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkflowStep {
  id: number;
  label: string;
  path: string;
  icon: React.ReactNode;
  description: string;
}

const workflowSteps: WorkflowStep[] = [
  { id: 1, label: "Territórios", path: "/territories", icon: <Globe className="w-4 h-4" />, description: "Defina áreas" },
  { id: 2, label: "Ativos", path: "/assets", icon: <Building2 className="w-4 h-4" />, description: "Cadastre ativos" },
  { id: 3, label: "Analytics", path: "/analytics", icon: <BarChart3 className="w-4 h-4" />, description: "Calcule emissões" },
  { id: 4, label: "Riscos", path: "/risks", icon: <AlertTriangle className="w-4 h-4" />, description: "Avalie riscos" },
  { id: 5, label: "Relatórios", path: "/reports", icon: <FileText className="w-4 h-4" />, description: "Gere relatórios" },
];

export function WorkflowIndicator() {
  const location = useLocation();
  
  const getCurrentStepIndex = () => {
    const index = workflowSteps.findIndex(step => step.path === location.pathname);
    return index >= 0 ? index : -1;
  };
  
  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="bg-card rounded-xl border p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Fluxo Operacional MRV</h3>
        <span className="text-xs text-muted-foreground">
          {currentStepIndex >= 0 ? `Etapa ${currentStepIndex + 1} de ${workflowSteps.length}` : "Navegue pelo fluxo"}
        </span>
      </div>
      
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {workflowSteps.map((step, index) => {
          const isActive = step.path === location.pathname;
          const isCompleted = currentStepIndex > index;
          const isPending = currentStepIndex < index;
          
          return (
            <div key={step.id} className="flex items-center">
              <NavLink
                to={step.path}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg transition-all min-w-max",
                  isActive && "bg-primary text-primary-foreground shadow-md",
                  isCompleted && "bg-success/10 text-success",
                  isPending && "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                  isActive && "bg-primary-foreground/20",
                  isCompleted && "bg-success/20",
                  isPending && "bg-secondary"
                )}>
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-medium leading-none">{step.label}</p>
                  <p className={cn(
                    "text-[10px] leading-none mt-0.5",
                    isActive ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    {step.description}
                  </p>
                </div>
                <span className="sm:hidden">{step.icon}</span>
              </NavLink>
              
              {index < workflowSteps.length - 1 && (
                <ArrowRight className={cn(
                  "w-4 h-4 mx-1 flex-shrink-0",
                  currentStepIndex > index ? "text-success" : "text-muted-foreground/30"
                )} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
