import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ClipboardList, Plus, CheckCircle, Clock, AlertTriangle, User, MapPin, Calendar, FileCheck, Play } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ActionPlan {
  id: string;
  title: string;
  description: string;
  risk: string;
  territory: string;
  responsible: string;
  status: "planned" | "in_progress" | "completed" | "delayed";
  priority: "high" | "medium" | "low";
  startDate: string;
  dueDate: string;
  progress: number;
  tasks: { name: string; completed: boolean }[];
  evidence: string[];
  budget: number;
  spent: number;
}

const mockActionPlans: ActionPlan[] = [
  {
    id: "1",
    title: "Reforço de Infraestrutura de Drenagem",
    description: "Ampliação do sistema de drenagem na área operacional para mitigar riscos de inundação",
    risk: "Inundações em Áreas Operacionais",
    territory: "Mina Norte",
    responsible: "João Silva",
    status: "in_progress",
    priority: "high",
    startDate: "2024-06-01",
    dueDate: "2025-03-31",
    progress: 45,
    tasks: [
      { name: "Estudo hidrológico", completed: true },
      { name: "Projeto executivo", completed: true },
      { name: "Licenciamento", completed: false },
      { name: "Contratação", completed: false },
      { name: "Execução de obras", completed: false }
    ],
    evidence: ["Estudo técnico", "Projeto aprovado"],
    budget: 5000000,
    spent: 1200000
  },
  {
    id: "2",
    title: "Programa de Eficiência Energética",
    description: "Implementação de medidas de eficiência energética para redução de emissões e custos",
    risk: "Regulação de Carbono",
    territory: "Todas",
    responsible: "Maria Santos",
    status: "in_progress",
    priority: "high",
    startDate: "2024-01-01",
    dueDate: "2025-12-31",
    progress: 60,
    tasks: [
      { name: "Diagnóstico energético", completed: true },
      { name: "Plano de ação", completed: true },
      { name: "Substituição de equipamentos", completed: true },
      { name: "Otimização de processos", completed: false },
      { name: "Monitoramento", completed: false }
    ],
    evidence: ["Relatório de diagnóstico", "Contratos de fornecimento"],
    budget: 8000000,
    spent: 4500000
  },
  {
    id: "3",
    title: "Sistema de Reuso de Água",
    description: "Implantação de sistema de tratamento e reuso de água industrial",
    risk: "Estresse Hídrico",
    territory: "Planta Industrial Sul",
    responsible: "Carlos Oliveira",
    status: "planned",
    priority: "medium",
    startDate: "2025-01-01",
    dueDate: "2025-12-31",
    progress: 10,
    tasks: [
      { name: "Estudo de viabilidade", completed: true },
      { name: "Projeto básico", completed: false },
      { name: "Licenciamento", completed: false },
      { name: "Implantação", completed: false }
    ],
    evidence: ["Estudo de viabilidade"],
    budget: 3000000,
    spent: 150000
  },
  {
    id: "4",
    title: "Formalização do Comitê de Sustentabilidade",
    description: "Estruturação do comitê de sustentabilidade com agenda regular de reuniões",
    risk: "Governança Climática",
    territory: "Corporativo",
    responsible: "Ana Costa",
    status: "completed",
    priority: "medium",
    startDate: "2024-09-01",
    dueDate: "2024-11-30",
    progress: 100,
    tasks: [
      { name: "Definição de membros", completed: true },
      { name: "Regimento interno", completed: true },
      { name: "Primeira reunião", completed: true },
      { name: "Agenda anual", completed: true }
    ],
    evidence: ["Regimento aprovado", "Atas de reunião"],
    budget: 50000,
    spent: 35000
  },
  {
    id: "5",
    title: "Atualização do Plano de Contingência",
    description: "Revisão e teste do plano de contingência para eventos climáticos extremos",
    risk: "Riscos Climáticos Físicos",
    territory: "Todas",
    responsible: "Roberto Lima",
    status: "delayed",
    priority: "high",
    startDate: "2024-07-01",
    dueDate: "2024-10-31",
    progress: 70,
    tasks: [
      { name: "Revisão do plano", completed: true },
      { name: "Treinamento de equipes", completed: true },
      { name: "Simulado", completed: true },
      { name: "Documentação final", completed: false }
    ],
    evidence: ["Plano revisado", "Lista de presença treinamentos"],
    budget: 200000,
    spent: 180000
  }
];

export function ActionPlansPanel() {
  const [plans, setPlans] = useState<ActionPlan[]>(mockActionPlans);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  const getStatusIcon = (status: ActionPlan["status"]) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in_progress": return <Play className="h-4 w-4 text-blue-500" />;
      case "planned": return <Clock className="h-4 w-4 text-muted-foreground" />;
      case "delayed": return <AlertTriangle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusLabel = (status: ActionPlan["status"]) => {
    switch (status) {
      case "completed": return "Concluído";
      case "in_progress": return "Em Andamento";
      case "planned": return "Planejado";
      case "delayed": return "Atrasado";
    }
  };

  const getStatusBadge = (status: ActionPlan["status"]) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "default",
      in_progress: "secondary",
      planned: "outline",
      delayed: "destructive"
    };
    return (
      <Badge variant={variants[status]} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {getStatusLabel(status)}
      </Badge>
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value);
  };

  const filteredPlans = plans.filter(plan => {
    if (filterStatus !== "all" && plan.status !== filterStatus) return false;
    if (filterPriority !== "all" && plan.priority !== filterPriority) return false;
    return true;
  });

  const completedCount = plans.filter(p => p.status === "completed").length;
  const inProgressCount = plans.filter(p => p.status === "in_progress").length;
  const delayedCount = plans.filter(p => p.status === "delayed").length;
  const totalBudget = plans.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = plans.reduce((acc, p) => acc + p.spent, 0);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Planos</p>
                <p className="text-2xl font-bold">{plans.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Play className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Em Andamento</p>
                <p className="text-2xl font-bold">{inProgressCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Concluídos</p>
                <p className="text-2xl font-bold">{completedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Atrasados</p>
                <p className="text-2xl font-bold">{delayedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <FileCheck className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Execução Orçam.</p>
                <p className="text-2xl font-bold">{((totalSpent / totalBudget) * 100).toFixed(0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex gap-4">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="planned">Planejado</SelectItem>
              <SelectItem value="in_progress">Em Andamento</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="delayed">Atrasado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Plano de Ação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Cadastrar Plano de Ação</DialogTitle>
              <DialogDescription>
                Registre um novo plano de ação para mitigação de riscos
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2 space-y-2">
                <Label>Título do Plano</Label>
                <Input placeholder="Ex: Reforço de Infraestrutura de Drenagem" />
              </div>
              <div className="space-y-2">
                <Label>Risco Associado</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flood">Inundações</SelectItem>
                    <SelectItem value="water">Estresse Hídrico</SelectItem>
                    <SelectItem value="carbon">Regulação de Carbono</SelectItem>
                    <SelectItem value="governance">Governança Climática</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Território</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mina-norte">Mina Norte</SelectItem>
                    <SelectItem value="planta-sul">Planta Industrial Sul</SelectItem>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="corporativo">Corporativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Responsável</Label>
                <Input placeholder="Nome do responsável" />
              </div>
              <div className="space-y-2">
                <Label>Prioridade</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="low">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Data de Início</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Data de Conclusão</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Orçamento (R$)</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Descrição</Label>
                <Textarea placeholder="Descreva o plano de ação e seus objetivos..." />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => {
                toast.success("Plano de ação cadastrado com sucesso!");
                setIsDialogOpen(false);
              }}>
                Cadastrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Action Plans Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Planos de Ação
          </CardTitle>
          <CardDescription>
            Acompanhamento de ações de mitigação de riscos climáticos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plano</TableHead>
                <TableHead>Risco</TableHead>
                <TableHead>Território</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Progresso</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Orçamento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlans.map((plan) => (
                <TableRow key={plan.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <p className="font-medium">{plan.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {plan.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {plan.risk}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{plan.territory}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{plan.responsible}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{plan.dueDate}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={plan.progress} className="w-16 h-2" />
                      <span className="text-sm">{plan.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(plan.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{formatCurrency(plan.spent)}</p>
                      <p className="text-xs text-muted-foreground">
                        de {formatCurrency(plan.budget)}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Execução Orçamentária</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Orçado</span>
                <span className="font-medium">{formatCurrency(totalBudget)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Executado</span>
                <span className="font-medium">{formatCurrency(totalSpent)}</span>
              </div>
              <Progress value={(totalSpent / totalBudget) * 100} className="h-3" />
              <p className="text-xs text-muted-foreground text-center">
                {((totalSpent / totalBudget) * 100).toFixed(1)}% executado
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribuição por Prioridade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {["high", "medium", "low"].map((priority) => {
              const count = plans.filter(p => p.priority === priority).length;
              const percentage = (count / plans.length) * 100;
              return (
                <div key={priority} className="flex items-center gap-3">
                  <Badge 
                    variant={priority === "high" ? "destructive" : priority === "medium" ? "secondary" : "outline"}
                    className="w-16 justify-center"
                  >
                    {priority === "high" ? "Alta" : priority === "medium" ? "Média" : "Baixa"}
                  </Badge>
                  <Progress value={percentage} className="flex-1 h-2" />
                  <span className="text-sm w-8">{count}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
