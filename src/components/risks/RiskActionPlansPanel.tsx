import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Clock, 
  User,
  CheckCircle2,
  Circle,
  AlertCircle,
  ArrowRight,
  Plus,
  Calendar,
  DollarSign,
  TrendingDown
} from "lucide-react";

interface ActionPlan {
  id: string;
  title: string;
  riskType: "physical" | "transition";
  category: "operational" | "technological" | "financial" | "institutional";
  relatedRisks: string[];
  status: "not_started" | "in_progress" | "completed" | "delayed";
  progress: number;
  priority: "high" | "medium" | "low";
  responsible: string;
  deadline: string;
  budget: { allocated: number; spent: number };
  expectedReduction: number;
  tasks: { name: string; completed: boolean }[];
  description: string;
}

const actionPlans: ActionPlan[] = [
  {
    id: "1",
    title: "Programa de Eficiência Energética",
    riskType: "transition",
    category: "technological",
    relatedRisks: ["Precificação de Carbono", "OPEX Energia"],
    status: "in_progress",
    progress: 65,
    priority: "high",
    responsible: "João Silva",
    deadline: "2024-12-31",
    budget: { allocated: 5000000, spent: 3250000 },
    expectedReduction: 25,
    tasks: [
      { name: "Auditoria energética completa", completed: true },
      { name: "Substituição de iluminação LED", completed: true },
      { name: "Upgrade de compressores", completed: true },
      { name: "Sistema de gestão de energia", completed: false },
      { name: "Treinamento de operadores", completed: false }
    ],
    description: "Implementação de medidas de eficiência energética para redução de emissões Escopo 2"
  },
  {
    id: "2",
    title: "Adaptação de Infraestrutura Costeira",
    riskType: "physical",
    category: "operational",
    relatedRisks: ["Elevação do Nível do Mar", "Tempestades Costeiras"],
    status: "in_progress",
    progress: 35,
    priority: "high",
    responsible: "Maria Santos",
    deadline: "2025-06-30",
    budget: { allocated: 15000000, spent: 5250000 },
    expectedReduction: 40,
    tasks: [
      { name: "Estudo de vulnerabilidade costeira", completed: true },
      { name: "Projeto de engenharia", completed: true },
      { name: "Elevação de estruturas críticas", completed: false },
      { name: "Sistema de drenagem resiliente", completed: false },
      { name: "Barreiras de proteção", completed: false }
    ],
    description: "Adaptação da infraestrutura portuária para resistir a eventos climáticos extremos"
  },
  {
    id: "3",
    title: "Transição da Frota para Elétrica",
    riskType: "transition",
    category: "technological",
    relatedRisks: ["Obsolescência de Ativos Fósseis", "Regulação de Emissões"],
    status: "not_started",
    progress: 0,
    priority: "medium",
    responsible: "Carlos Oliveira",
    deadline: "2026-12-31",
    budget: { allocated: 8000000, spent: 0 },
    expectedReduction: 30,
    tasks: [
      { name: "Estudo de viabilidade técnica", completed: false },
      { name: "Piloto com 5 veículos elétricos", completed: false },
      { name: "Infraestrutura de carregamento", completed: false },
      { name: "Substituição gradual da frota", completed: false },
      { name: "Treinamento de motoristas", completed: false }
    ],
    description: "Substituição progressiva da frota diesel por veículos elétricos"
  },
  {
    id: "4",
    title: "Sistema de Gestão Hídrica",
    riskType: "physical",
    category: "operational",
    relatedRisks: ["Escassez Hídrica", "Estresse Hídrico Operacional"],
    status: "in_progress",
    progress: 80,
    priority: "high",
    responsible: "Ana Costa",
    deadline: "2024-09-30",
    budget: { allocated: 3000000, spent: 2400000 },
    expectedReduction: 35,
    tasks: [
      { name: "Auditoria de uso de água", completed: true },
      { name: "Sistema de recirculação", completed: true },
      { name: "Captação de água de chuva", completed: true },
      { name: "Tratamento e reuso", completed: true },
      { name: "Monitoramento em tempo real", completed: false }
    ],
    description: "Implementação de sistema integrado de gestão e reuso de água"
  },
  {
    id: "5",
    title: "Programa de Disclosure Climático",
    riskType: "transition",
    category: "institutional",
    relatedRisks: ["Requisitos IFRS S2", "Pressão de Investidores ESG"],
    status: "completed",
    progress: 100,
    priority: "high",
    responsible: "Roberto Lima",
    deadline: "2024-03-31",
    budget: { allocated: 500000, spent: 450000 },
    expectedReduction: 0,
    tasks: [
      { name: "Gap analysis IFRS S2", completed: true },
      { name: "Inventário de emissões GHG", completed: true },
      { name: "Análise de cenários climáticos", completed: true },
      { name: "Relatório integrado", completed: true },
      { name: "Verificação externa", completed: true }
    ],
    description: "Estruturação do reporte climático conforme IFRS S2 e padrões internacionais"
  },
  {
    id: "6",
    title: "Seguro Paramétrico Climático",
    riskType: "physical",
    category: "financial",
    relatedRisks: ["Eventos Extremos", "Interrupção Operacional"],
    status: "delayed",
    progress: 45,
    priority: "medium",
    responsible: "Patricia Nunes",
    deadline: "2024-06-30",
    budget: { allocated: 200000, spent: 90000 },
    expectedReduction: 50,
    tasks: [
      { name: "Mapeamento de exposição", completed: true },
      { name: "Cotação com seguradoras", completed: true },
      { name: "Definição de triggers", completed: false },
      { name: "Contratação de apólice", completed: false },
      { name: "Integração com gestão de riscos", completed: false }
    ],
    description: "Contratação de seguro paramétrico para proteção contra eventos climáticos"
  }
];

const getStatusBadge = (status: ActionPlan["status"]) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-success/10 text-success">Concluído</Badge>;
    case "in_progress":
      return <Badge className="bg-info/10 text-info">Em Andamento</Badge>;
    case "delayed":
      return <Badge className="bg-destructive/10 text-destructive">Atrasado</Badge>;
    case "not_started":
      return <Badge className="bg-muted text-muted-foreground">Não Iniciado</Badge>;
    default:
      return null;
  }
};

const getPriorityBadge = (priority: ActionPlan["priority"]) => {
  switch (priority) {
    case "high":
      return <Badge variant="outline" className="border-destructive text-destructive">Alta</Badge>;
    case "medium":
      return <Badge variant="outline" className="border-warning text-warning">Média</Badge>;
    case "low":
      return <Badge variant="outline" className="border-success text-success">Baixa</Badge>;
    default:
      return null;
  }
};

const getCategoryLabel = (category: ActionPlan["category"]) => {
  switch (category) {
    case "operational": return "Operacional";
    case "technological": return "Tecnológica";
    case "financial": return "Financeira";
    case "institutional": return "Institucional";
    default: return category;
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const ActionPlanCard = ({ plan }: { plan: ActionPlan }) => {
  const completedTasks = plan.tasks.filter(t => t.completed).length;
  const budgetProgress = (plan.budget.spent / plan.budget.allocated) * 100;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{plan.title}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {plan.riskType === "physical" ? "Físico" : "Transição"}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {getCategoryLabel(plan.category)}
              </Badge>
            </div>
          </div>
          {getStatusBadge(plan.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{plan.description}</p>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progresso Geral</span>
            <span className="font-medium">{plan.progress}%</span>
          </div>
          <Progress value={plan.progress} className="h-2" />
        </div>

        {/* Tasks */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tarefas</span>
            <span className="font-medium">{completedTasks}/{plan.tasks.length}</span>
          </div>
          <div className="space-y-1">
            {plan.tasks.slice(0, 3).map((task, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                {task.completed ? (
                  <CheckCircle2 className="h-3 w-3 text-success" />
                ) : (
                  <Circle className="h-3 w-3 text-muted-foreground" />
                )}
                <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                  {task.name}
                </span>
              </div>
            ))}
            {plan.tasks.length > 3 && (
              <p className="text-xs text-muted-foreground pl-5">
                +{plan.tasks.length - 3} mais tarefas
              </p>
            )}
          </div>
        </div>

        {/* Budget */}
        <div className="p-3 bg-secondary/50 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Orçamento</span>
            <span>{formatCurrency(plan.budget.spent)} / {formatCurrency(plan.budget.allocated)}</span>
          </div>
          <Progress value={budgetProgress} className="h-1.5" />
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <User className="h-3 w-3" />
            <span>{plan.responsible}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{new Date(plan.deadline).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Target className="h-3 w-3" />
            {getPriorityBadge(plan.priority)}
          </div>
          <div className="flex items-center gap-1 text-success">
            <TrendingDown className="h-3 w-3" />
            <span>-{plan.expectedReduction}% risco</span>
          </div>
        </div>

        {/* Related Risks */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">Riscos Relacionados</p>
          <div className="flex flex-wrap gap-1">
            {plan.relatedRisks.map((risk, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {risk}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function RiskActionPlansPanel() {
  const completedPlans = actionPlans.filter(p => p.status === "completed").length;
  const inProgressPlans = actionPlans.filter(p => p.status === "in_progress").length;
  const delayedPlans = actionPlans.filter(p => p.status === "delayed").length;
  const totalBudget = actionPlans.reduce((acc, p) => acc + p.budget.allocated, 0);
  const totalSpent = actionPlans.reduce((acc, p) => acc + p.budget.spent, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-info/10 rounded-lg">
                <Clock className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Em Andamento</p>
                <p className="text-2xl font-bold">{inProgressPlans}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Concluídos</p>
                <p className="text-2xl font-bold">{completedPlans}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Atrasados</p>
                <p className="text-2xl font-bold">{delayedPlans}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Investimento Total</p>
                <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Overview */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Execução Orçamentária</CardTitle>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Novo Plano
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Executado / Alocado</span>
              <span className="font-medium">
                {formatCurrency(totalSpent)} / {formatCurrency(totalBudget)} 
                ({Math.round((totalSpent / totalBudget) * 100)}%)
              </span>
            </div>
            <Progress value={(totalSpent / totalBudget) * 100} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Action Plans Grid */}
      <div>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5" />
          Planos de Ação e Mitigação
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actionPlans.map(plan => (
            <ActionPlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </div>
  );
}
