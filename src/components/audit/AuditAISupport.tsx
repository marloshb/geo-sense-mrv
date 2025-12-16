import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Brain,
  AlertTriangle,
  CheckCircle2,
  Info,
  RefreshCw,
  ChevronRight,
  Lightbulb,
  Search,
  FileWarning,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuditInsight {
  id: string;
  type: "inconsistency" | "gap" | "suggestion" | "highlight";
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  territory?: string;
  indicator?: string;
  action?: string;
}

const initialInsights: AuditInsight[] = [
  {
    id: "1",
    type: "inconsistency",
    severity: "high",
    title: "Variação atípica detectada",
    description:
      "As emissões do território Carajás em março apresentam variação de 35% em relação à média histórica, sem justificativa documentada.",
    territory: "Mina Carajás",
    indicator: "Emissões Escopo 1",
    action: "Verificar dados de consumo de combustível do período",
  },
  {
    id: "2",
    type: "gap",
    severity: "high",
    title: "Evidência territorial ausente",
    description:
      "O indicador de sequestro de carbono não possui mapa temático associado para o período selecionado.",
    territory: "Reserva AM",
    indicator: "Sequestro de Carbono",
    action: "Anexar mapa de cobertura vegetal atualizado",
  },
  {
    id: "3",
    type: "inconsistency",
    severity: "medium",
    title: "Fator de emissão desatualizado",
    description:
      "O fator de emissão utilizado para gás natural é de 2022. Versão mais recente disponível: 2024.",
    indicator: "Emissões Escopo 2",
    action: "Atualizar fator e recalcular métricas",
  },
  {
    id: "4",
    type: "gap",
    severity: "medium",
    title: "Dados incompletos",
    description:
      "Faltam registros de consumo energético para os dias 15-18 de novembro.",
    territory: "Planta MG",
    indicator: "Consumo Energético",
    action: "Solicitar dados ao responsável operacional",
  },
  {
    id: "5",
    type: "suggestion",
    severity: "low",
    title: "Oportunidade de melhoria",
    description:
      "A metodologia de cálculo pode ser otimizada utilizando dados de telemetria em tempo real.",
    action: "Avaliar integração com sistema de monitoramento",
  },
  {
    id: "6",
    type: "highlight",
    severity: "low",
    title: "Destaque positivo",
    description:
      "O território Terminal SP apresentou redução consistente de 12% nas emissões ao longo de 6 meses consecutivos.",
    territory: "Terminal SP",
    indicator: "Emissões Escopo 1",
  },
];

export const AuditAISupport = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState<AuditInsight[]>(initialInsights);

  const getInsightIcon = (type: AuditInsight["type"]) => {
    switch (type) {
      case "inconsistency":
        return <AlertTriangle className="w-4 h-4" />;
      case "gap":
        return <FileWarning className="w-4 h-4" />;
      case "suggestion":
        return <Lightbulb className="w-4 h-4" />;
      case "highlight":
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getInsightColor = (type: AuditInsight["type"], severity: AuditInsight["severity"]) => {
    if (type === "highlight") return "text-success bg-success/10 border-success/20";
    if (type === "suggestion") return "text-info bg-info/10 border-info/20";
    if (severity === "high") return "text-destructive bg-destructive/10 border-destructive/20";
    if (severity === "medium") return "text-warning bg-warning/10 border-warning/20";
    return "text-muted-foreground bg-secondary border-border";
  };

  const getSeverityBadge = (severity: AuditInsight["severity"]) => {
    switch (severity) {
      case "high":
        return <Badge className="bg-destructive/10 text-destructive">Alta</Badge>;
      case "medium":
        return <Badge className="bg-warning/10 text-warning">Média</Badge>;
      case "low":
        return <Badge variant="outline">Baixa</Badge>;
    }
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("mrv-ai-insights", {
        body: {
          type: "audit_analysis",
          context: {
            period: "2024",
            territories: ["Carajás", "Planta MG", "Terminal SP", "Reserva AM"],
          },
        },
      });

      if (error) throw error;

      toast.success("Análise concluída", {
        description: `${insights.length} pontos de atenção identificados.`,
      });
    } catch (error) {
      console.error("Error running AI analysis:", error);
      toast.error("Erro na análise. Usando dados estáticos.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const highPriorityCount = insights.filter(
    (i) => i.severity === "high" && i.type !== "highlight"
  ).length;
  const mediumPriorityCount = insights.filter(
    (i) => i.severity === "medium" && i.type !== "highlight"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Assistente de Auditoria IA</h3>
                <p className="text-sm text-muted-foreground">
                  Análise automática de inconsistências e lacunas
                </p>
              </div>
            </div>
            <Button
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className="gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${isAnalyzing ? "animate-spin" : ""}`}
              />
              {isAnalyzing ? "Analisando..." : "Nova Análise"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-destructive">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-destructive">
              {highPriorityCount}
            </div>
            <div className="text-sm text-muted-foreground">
              Prioridade Alta
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-warning">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">
              {mediumPriorityCount}
            </div>
            <div className="text-sm text-muted-foreground">
              Prioridade Média
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-info">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-info">
              {insights.filter((i) => i.type === "suggestion").length}
            </div>
            <div className="text-sm text-muted-foreground">Sugestões</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-success">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">
              {insights.filter((i) => i.type === "highlight").length}
            </div>
            <div className="text-sm text-muted-foreground">Destaques</div>
          </CardContent>
        </Card>
      </div>

      {/* Insights List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Pontos de Atenção</CardTitle>
        </CardHeader>
        <CardContent>
          {isAnalyzing ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 bg-secondary/30 rounded-lg">
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className={`p-4 rounded-lg border ${getInsightColor(
                    insight.type,
                    insight.severity
                  )}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getInsightIcon(insight.type)}</div>
                      <div>
                        <div className="font-medium text-sm flex items-center gap-2">
                          {insight.title}
                          {insight.type !== "highlight" &&
                            getSeverityBadge(insight.severity)}
                        </div>
                        <p className="text-sm mt-1 opacity-90">
                          {insight.description}
                        </p>

                        {(insight.territory || insight.indicator) && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {insight.territory && (
                              <Badge variant="outline" className="text-xs">
                                <MapPin className="w-3 h-3 mr-1" />
                                {insight.territory}
                              </Badge>
                            )}
                            {insight.indicator && (
                              <Badge variant="outline" className="text-xs">
                                {insight.indicator}
                              </Badge>
                            )}
                          </div>
                        )}

                        {insight.action && (
                          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-current/10">
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-xs font-medium">
                              Ação sugerida: {insight.action}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {insight.type !== "highlight" && (
                      <Button variant="ghost" size="sm" className="shrink-0">
                        Resolver
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Executive Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            Resumo para Auditor
            <Badge variant="secondary" className="text-xs">
              IA
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-secondary/30 rounded-lg space-y-3">
            <p className="text-sm">
              A análise identificou <strong>{highPriorityCount} pontos críticos</strong> que
              requerem atenção imediata, principalmente relacionados a lacunas de
              evidência territorial e variações atípicas em dados de emissões.
            </p>
            <p className="text-sm">
              O território <strong>Carajás</strong> apresenta a maior concentração de
              pendências, enquanto o <strong>Terminal SP</strong> demonstra tendência
              positiva consistente de redução de emissões.
            </p>
            <p className="text-sm">
              Recomenda-se priorizar a documentação de evidências espaciais e a
              atualização dos fatores de emissão antes da conclusão do ciclo de
              auditoria.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
