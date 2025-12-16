import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Lightbulb,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ExecutiveSummaryProps {
  territoryId?: string;
  period?: string;
}

interface SummaryData {
  totalEmissions: number;
  emissionsTrend: number;
  criticalRisks: number;
  riskTrend: number;
  topTerritoryEmissions: string;
  topTerritoryPercentage: number;
  goalProgress: number;
  insights: string[];
  recommendations: string[];
}

export const ExecutiveSummary = ({
  territoryId,
  period = "ytd",
}: ExecutiveSummaryProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryData>({
    totalEmissions: 9750,
    emissionsTrend: -12.5,
    criticalRisks: 3,
    riskTrend: -2,
    topTerritoryEmissions: "Carajás",
    topTerritoryPercentage: 43,
    goalProgress: 68,
    insights: [
      "As emissões totais reduziram 12,5% em comparação ao ano anterior, superando a meta trimestral.",
      "O território Carajás concentra 43% das emissões totais e apresenta maior potencial de mitigação.",
      "3 riscos climáticos críticos requerem atenção imediata: inundação costeira, seca severa e incêndios.",
    ],
    recommendations: [
      "Priorizar investimentos em eficiência energética no território Carajás para maior impacto.",
      "Implementar plano de contingência para riscos de inundação no Terminal SP.",
      "Expandir programa de reflorestamento na Reserva AM para aumentar sequestro de carbono.",
    ],
  });

  const generateAISummary = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("mrv-ai-insights", {
        body: {
          type: "executive_summary",
          context: {
            period,
            territoryId,
            metrics: {
              totalEmissions: summary.totalEmissions,
              emissionsTrend: summary.emissionsTrend,
              criticalRisks: summary.criticalRisks,
            },
          },
        },
      });

      if (error) throw error;

      if (data?.summary) {
        setSummary((prev) => ({
          ...prev,
          insights: data.summary.insights || prev.insights,
          recommendations: data.summary.recommendations || prev.recommendations,
        }));
        toast.success("Sumário executivo atualizado com IA");
      }
    } catch (error) {
      console.error("Error generating AI summary:", error);
      toast.error("Erro ao gerar sumário. Usando dados estáticos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Sumário Executivo</CardTitle>
            <Badge variant="secondary" className="text-xs">
              IA
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={generateAISummary}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-secondary/50 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">
              Emissões Totais
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold">
                {summary.totalEmissions.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">tCO₂e</span>
            </div>
            <div
              className={`flex items-center gap-1 text-xs mt-1 ${
                summary.emissionsTrend < 0 ? "text-success" : "text-destructive"
              }`}
            >
              {summary.emissionsTrend < 0 ? (
                <TrendingDown className="w-3 h-3" />
              ) : (
                <TrendingUp className="w-3 h-3" />
              )}
              {Math.abs(summary.emissionsTrend)}% vs. ano anterior
            </div>
          </div>

          <div className="p-3 bg-secondary/50 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">
              Riscos Críticos
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold">{summary.criticalRisks}</span>
              <AlertTriangle className="w-4 h-4 text-warning" />
            </div>
            <div
              className={`flex items-center gap-1 text-xs mt-1 ${
                summary.riskTrend < 0 ? "text-success" : "text-destructive"
              }`}
            >
              {summary.riskTrend < 0 ? (
                <TrendingDown className="w-3 h-3" />
              ) : (
                <TrendingUp className="w-3 h-3" />
              )}
              {Math.abs(summary.riskTrend)} vs. mês anterior
            </div>
          </div>

          <div className="p-3 bg-secondary/50 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">
              Maior Emissor
            </div>
            <div className="text-lg font-bold truncate">
              {summary.topTerritoryEmissions}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {summary.topTerritoryPercentage}% do total
            </div>
          </div>

          <div className="p-3 bg-secondary/50 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">
              Progresso Meta
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold">{summary.goalProgress}%</span>
              <Target className="w-4 h-4 text-primary" />
            </div>
            <div className="w-full bg-secondary rounded-full h-1.5 mt-2">
              <div
                className="bg-primary h-1.5 rounded-full transition-all"
                style={{ width: `${summary.goalProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-warning" />
            <span className="font-medium text-sm">Insights Principais</span>
          </div>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ) : (
            <ul className="space-y-2">
              {summary.insights.map((insight, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  {insight}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Recomendações Estratégicas</span>
          </div>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ) : (
            <ul className="space-y-2">
              {summary.recommendations.map((rec, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <Badge variant="outline" className="shrink-0 text-xs">
                    {idx + 1}
                  </Badge>
                  {rec}
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
