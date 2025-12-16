import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  PenTool,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  User,
  Calendar,
  Shield,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

interface ValidationStep {
  id: string;
  name: string;
  status: "pending" | "approved" | "rejected" | "review";
  approver?: string;
  date?: string;
  comments?: string;
}

interface Report {
  id: string;
  name: string;
  type: string;
  period: string;
  currentStatus: string;
  validationSteps: ValidationStep[];
}

const reports: Report[] = [
  {
    id: "1",
    name: "Relatório IFRS S2 - 2024",
    type: "Regulatório",
    period: "Ano 2024",
    currentStatus: "Validação Interna",
    validationSteps: [
      {
        id: "s1",
        name: "Rascunho",
        status: "approved",
        approver: "Ana Oliveira",
        date: "10/12/2024",
      },
      {
        id: "s2",
        name: "Revisão Técnica",
        status: "approved",
        approver: "Carlos Ferreira",
        date: "12/12/2024",
        comments: "Dados verificados e consistentes",
      },
      {
        id: "s3",
        name: "Validação Interna",
        status: "review",
      },
      {
        id: "s4",
        name: "Auditoria Externa",
        status: "pending",
      },
      {
        id: "s5",
        name: "Aprovação Final",
        status: "pending",
      },
    ],
  },
  {
    id: "2",
    name: "Inventário GEE Q3 2024",
    type: "Trimestral",
    period: "Q3 2024",
    currentStatus: "Auditado",
    validationSteps: [
      {
        id: "s1",
        name: "Rascunho",
        status: "approved",
        approver: "Maria Silva",
        date: "01/10/2024",
      },
      {
        id: "s2",
        name: "Revisão Técnica",
        status: "approved",
        approver: "João Santos",
        date: "05/10/2024",
      },
      {
        id: "s3",
        name: "Validação Interna",
        status: "approved",
        approver: "Ana Oliveira",
        date: "08/10/2024",
      },
      {
        id: "s4",
        name: "Auditoria Externa",
        status: "approved",
        approver: "Deloitte",
        date: "15/10/2024",
        comments: "Relatório em conformidade com metodologia GHG Protocol",
      },
      {
        id: "s5",
        name: "Aprovação Final",
        status: "approved",
        approver: "Diretor Financeiro",
        date: "18/10/2024",
      },
    ],
  },
];

export const ValidationSignatures = () => {
  const [approvalComments, setApprovalComments] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const getStepIcon = (status: ValidationStep["status"]) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case "rejected":
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      case "review":
        return <Clock className="w-5 h-5 text-warning animate-pulse" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStepBadge = (status: ValidationStep["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-success/10 text-success">Aprovado</Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-destructive/10 text-destructive">Rejeitado</Badge>
        );
      case "review":
        return (
          <Badge className="bg-warning/10 text-warning">Em Análise</Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Pendente
          </Badge>
        );
    }
  };

  const handleApprove = (reportId: string) => {
    toast.success("Relatório aprovado com sucesso", {
      description: "A aprovação foi registrada no sistema.",
    });
    setApprovalComments("");
  };

  const handleReject = (reportId: string) => {
    toast.error("Relatório devolvido para revisão", {
      description: "O responsável será notificado.",
    });
    setApprovalComments("");
  };

  return (
    <div className="space-y-6">
      {/* Reports List */}
      {reports.map((report) => (
        <Card key={report.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{report.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {report.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {report.period}
                    </span>
                  </div>
                </div>
              </div>
              <Badge
                className={
                  report.currentStatus === "Auditado"
                    ? "bg-success/10 text-success"
                    : "bg-warning/10 text-warning"
                }
              >
                {report.currentStatus}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Validation Steps */}
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                {report.validationSteps.map((step, idx) => (
                  <div
                    key={step.id}
                    className="flex flex-col items-center flex-1"
                  >
                    <div className="relative flex items-center w-full">
                      {idx > 0 && (
                        <div
                          className={`flex-1 h-0.5 ${
                            report.validationSteps[idx - 1].status === "approved"
                              ? "bg-success"
                              : "bg-border"
                          }`}
                        />
                      )}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                          step.status === "approved"
                            ? "bg-success/10"
                            : step.status === "review"
                            ? "bg-warning/10"
                            : "bg-secondary"
                        }`}
                      >
                        {getStepIcon(step.status)}
                      </div>
                      {idx < report.validationSteps.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 ${
                            step.status === "approved" ? "bg-success" : "bg-border"
                          }`}
                        />
                      )}
                    </div>
                    <div className="text-center mt-2">
                      <div className="text-xs font-medium">{step.name}</div>
                      {step.approver && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {step.approver}
                        </div>
                      )}
                      {step.date && (
                        <div className="text-xs text-muted-foreground">
                          {step.date}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Step Actions */}
            {report.validationSteps.some((s) => s.status === "review") && (
              <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-warning" />
                  <span className="font-medium text-sm">
                    Aguardando sua validação
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Observações</Label>
                    <Textarea
                      placeholder="Adicione comentários sobre a validação..."
                      className="mt-1"
                      rows={2}
                      value={approvalComments}
                      onChange={(e) => setApprovalComments(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(report.id)}
                      className="gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Aprovar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleReject(report.id)}
                      className="gap-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Devolver para Revisão
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Validation History */}
            {report.validationSteps.some((s) => s.comments) && (
              <div className="mt-4 p-3 bg-secondary/30 rounded-lg">
                <div className="text-xs text-muted-foreground mb-2">
                  Histórico de Comentários
                </div>
                <div className="space-y-2">
                  {report.validationSteps
                    .filter((s) => s.comments)
                    .map((step) => (
                      <div key={step.id} className="text-sm">
                        <strong>{step.name}:</strong> {step.comments}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">3</div>
            <div className="text-sm text-muted-foreground">
              Aguardando Validação
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">8</div>
            <div className="text-sm text-muted-foreground">Aprovados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-info">2</div>
            <div className="text-sm text-muted-foreground">Em Auditoria</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-muted-foreground">
              Total de Relatórios
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
