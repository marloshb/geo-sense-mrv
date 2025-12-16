import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Lock,
  Unlock,
  History,
  GitBranch,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

interface Period {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "open" | "frozen" | "audited";
  frozenAt?: string;
  frozenBy?: string;
  metrics: number;
  reports: number;
}

interface Version {
  id: string;
  version: string;
  date: string;
  user: string;
  changes: string;
  type: "data" | "metric" | "report";
}

const periods: Period[] = [
  {
    id: "1",
    name: "Q4 2024",
    startDate: "01/10/2024",
    endDate: "31/12/2024",
    status: "open",
    metrics: 45,
    reports: 3,
  },
  {
    id: "2",
    name: "Q3 2024",
    startDate: "01/07/2024",
    endDate: "30/09/2024",
    status: "frozen",
    frozenAt: "15/10/2024",
    frozenBy: "Maria Silva",
    metrics: 42,
    reports: 2,
  },
  {
    id: "3",
    name: "Q2 2024",
    startDate: "01/04/2024",
    endDate: "30/06/2024",
    status: "audited",
    frozenAt: "12/07/2024",
    frozenBy: "João Santos",
    metrics: 38,
    reports: 2,
  },
  {
    id: "4",
    name: "Q1 2024",
    startDate: "01/01/2024",
    endDate: "31/03/2024",
    status: "audited",
    frozenAt: "10/04/2024",
    frozenBy: "João Santos",
    metrics: 35,
    reports: 1,
  },
];

const versions: Version[] = [
  {
    id: "1",
    version: "v3.2",
    date: "16/12/2024 14:32",
    user: "Maria Silva",
    changes: "Atualização do fator de emissão para diesel",
    type: "metric",
  },
  {
    id: "2",
    version: "v3.1",
    date: "15/12/2024 10:15",
    user: "Ana Oliveira",
    changes: "Correção de dados de consumo energético",
    type: "data",
  },
  {
    id: "3",
    version: "v3.0",
    date: "14/12/2024 16:45",
    user: "Sistema",
    changes: "Fechamento automático do período Q3",
    type: "report",
  },
  {
    id: "4",
    version: "v2.9",
    date: "13/12/2024 09:20",
    user: "Carlos Ferreira",
    changes: "Inclusão de novo território",
    type: "data",
  },
];

export const VersioningPanel = () => {
  const [freezeJustification, setFreezeJustification] = useState("");
  const [reopenJustification, setReopenJustification] = useState("");

  const getStatusConfig = (status: Period["status"]) => {
    switch (status) {
      case "open":
        return {
          label: "Aberto",
          icon: Unlock,
          className: "bg-success/10 text-success",
        };
      case "frozen":
        return {
          label: "Congelado",
          icon: Lock,
          className: "bg-info/10 text-info",
        };
      case "audited":
        return {
          label: "Auditado",
          icon: CheckCircle2,
          className: "bg-primary/10 text-primary",
        };
    }
  };

  const handleFreeze = (periodId: string) => {
    toast.success("Período congelado com sucesso", {
      description: "Os dados deste período não podem mais ser alterados.",
    });
    setFreezeJustification("");
  };

  const handleReopen = (periodId: string) => {
    toast.success("Solicitação de reabertura registrada", {
      description: "A solicitação será analisada pelo administrador.",
    });
    setReopenJustification("");
  };

  return (
    <div className="space-y-6">
      {/* Periods */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Períodos e Congelamento
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {periods.map((period) => {
              const statusConfig = getStatusConfig(period.status);
              const StatusIcon = statusConfig.icon;
              return (
                <div
                  key={period.id}
                  className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <StatusIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{period.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {period.startDate} - {period.endDate}
                      </div>
                      {period.frozenAt && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Congelado em {period.frozenAt} por {period.frozenBy}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right text-sm">
                      <div>{period.metrics} métricas</div>
                      <div className="text-muted-foreground">
                        {period.reports} relatórios
                      </div>
                    </div>

                    <Badge className={statusConfig.className}>
                      {statusConfig.label}
                    </Badge>

                    {period.status === "open" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Lock className="w-3 h-3" />
                            Congelar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Congelar Período</DialogTitle>
                            <DialogDescription>
                              Ao congelar o período {period.name}, os dados não
                              poderão mais ser alterados. Esta ação requer
                              justificativa.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                              <div className="text-sm">
                                <strong>{period.metrics} métricas</strong> e{" "}
                                <strong>{period.reports} relatórios</strong> serão
                                bloqueados para edição.
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Justificativa</Label>
                              <Textarea
                                placeholder="Descreva o motivo do congelamento..."
                                value={freezeJustification}
                                onChange={(e) =>
                                  setFreezeJustification(e.target.value)
                                }
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Cancelar</Button>
                            <Button
                              onClick={() => handleFreeze(period.id)}
                              disabled={!freezeJustification.trim()}
                            >
                              Confirmar Congelamento
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}

                    {period.status === "frozen" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Unlock className="w-3 h-3" />
                            Solicitar Reabertura
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Solicitar Reabertura</DialogTitle>
                            <DialogDescription>
                              Esta solicitação será registrada e analisada pelo
                              administrador do sistema.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Justificativa para Reabertura</Label>
                              <Textarea
                                placeholder="Descreva o motivo da solicitação..."
                                value={reopenJustification}
                                onChange={(e) =>
                                  setReopenJustification(e.target.value)
                                }
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Cancelar</Button>
                            <Button
                              onClick={() => handleReopen(period.id)}
                              disabled={!reopenJustification.trim()}
                            >
                              Enviar Solicitação
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Version History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            Histórico de Versões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-4">
              {versions.map((version, idx) => (
                <div key={version.id} className="relative pl-10">
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-2.5 w-3 h-3 rounded-full border-2 bg-background ${
                      idx === 0 ? "border-primary" : "border-muted-foreground"
                    }`}
                  />

                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-mono">
                          {version.version}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            version.type === "data"
                              ? "bg-info/10 text-info"
                              : version.type === "metric"
                              ? "bg-warning/10 text-warning"
                              : "bg-success/10 text-success"
                          }`}
                        >
                          {version.type === "data"
                            ? "Dados"
                            : version.type === "metric"
                            ? "Métrica"
                            : "Relatório"}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {version.date}
                      </span>
                    </div>
                    <div className="text-sm">{version.changes}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      por {version.user}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button variant="outline" className="w-full mt-4 gap-2">
            <History className="w-4 h-4" />
            Ver Histórico Completo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
