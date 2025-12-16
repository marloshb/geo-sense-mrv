import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sparkles,
  Loader2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Target,
  RefreshCw,
  ChevronRight,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Insight {
  type: "anomaly" | "trend" | "recommendation" | "alert" | "optimization" | "risk";
  title: string;
  content: string;
  severity: "info" | "warning" | "critical";
  actionItems?: string[];
}

interface AIInsightsPanelProps {
  territoryId?: string;
  metricsData?: any;
  onInsightClick?: (insight: Insight) => void;
}

const insightIcons = {
  anomaly: AlertTriangle,
  trend: TrendingUp,
  recommendation: Lightbulb,
  alert: AlertTriangle,
  optimization: Target,
  risk: AlertTriangle,
};

const severityColors = {
  info: "bg-info/10 text-info border-info/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  critical: "bg-destructive/10 text-destructive border-destructive/20",
};

export const AIInsightsPanel = ({ territoryId, metricsData, onInsightClick }: AIInsightsPanelProps) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);

  const generateInsights = async () => {
    if (!metricsData && !territoryId) {
      toast.error("Dados insuficientes para gerar insights");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("mrv-ai-insights", {
        body: {
          type: "generate_insights",
          data: metricsData || {},
          context: {
            territory: { id: territoryId },
            period: "último trimestre",
            sector: "industrial",
          },
        },
      });

      if (error) throw error;

      if (data?.result?.insights) {
        setInsights(data.result.insights);
        toast.success("Insights gerados com sucesso!");
      }
    } catch (error: any) {
      console.error("Error generating insights:", error);
      if (error.message?.includes("Rate limit")) {
        toast.error("Limite de requisições excedido. Tente novamente em alguns minutos.");
      } else {
        toast.error("Erro ao gerar insights");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Demo insights for when no data is available
  const demoInsights: Insight[] = [
    {
      type: "trend",
      title: "Redução de 12% nas emissões",
      content: "As emissões de Escopo 2 reduziram 12% comparado ao trimestre anterior, principalmente devido à maior participação de energia renovável na matriz.",
      severity: "info",
      actionItems: ["Manter estratégia atual de energia", "Avaliar PPAs adicionais"],
    },
    {
      type: "anomaly",
      title: "Consumo atípico detectado",
      content: "O consumo de diesel no ativo 'Mina Norte' aumentou 45% sem aumento proporcional na produção. Verificar possíveis ineficiências.",
      severity: "warning",
      actionItems: ["Auditar frota de equipamentos", "Verificar manutenção preventiva"],
    },
    {
      type: "risk",
      title: "Exposição a risco hídrico",
      content: "Análise climática indica aumento de 30% na probabilidade de seca severa na região do território 'Vale Sul' nos próximos 5 anos.",
      severity: "critical",
      actionItems: ["Diversificar fontes hídricas", "Implementar sistema de reuso"],
    },
    {
      type: "recommendation",
      title: "Oportunidade de sequestro de carbono",
      content: "A área de conservação 'Reserva Leste' tem potencial para certificação de créditos de carbono, estimando 2.500 tCO2e/ano.",
      severity: "info",
      actionItems: ["Iniciar estudo de viabilidade", "Contatar certificadoras"],
    },
  ];

  const displayInsights = insights.length > 0 ? insights : demoInsights;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Insights de IA
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={generateInsights}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="p-4 pt-0 space-y-3">
            {displayInsights.map((insight, index) => {
              const Icon = insightIcons[insight.type] || Lightbulb;
              
              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    severityColors[insight.severity]
                  }`}
                  onClick={() => {
                    setSelectedInsight(insight);
                    onInsightClick?.(insight);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-medium text-sm truncate">
                          {insight.title}
                        </h4>
                        <Badge
                          variant="outline"
                          className="text-xs capitalize flex-shrink-0"
                        >
                          {insight.type}
                        </Badge>
                      </div>
                      <p className="text-xs mt-1 text-muted-foreground line-clamp-2">
                        {insight.content}
                      </p>
                      {insight.actionItems && insight.actionItems.length > 0 && (
                        <div className="flex items-center gap-1 mt-2 text-xs">
                          <span className="font-medium">{insight.actionItems.length} ações</span>
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Insight Detail Modal */}
        {selectedInsight && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = insightIcons[selectedInsight.type];
                    return <Icon className="w-5 h-5" />;
                  })()}
                  <h3 className="font-semibold">{selectedInsight.title}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedInsight(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <ScrollArea className="max-h-[60vh]">
                <div className="p-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Análise
                    </h4>
                    <p className="text-sm">{selectedInsight.content}</p>
                  </div>

                  {selectedInsight.actionItems && selectedInsight.actionItems.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Ações Recomendadas
                      </h4>
                      <ul className="space-y-2">
                        {selectedInsight.actionItems.map((action, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-sm"
                          >
                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                              {i + 1}
                            </div>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Badge variant="outline" className="capitalize">
                      {selectedInsight.type}
                    </Badge>
                    <Badge
                      variant={
                        selectedInsight.severity === "critical"
                          ? "destructive"
                          : selectedInsight.severity === "warning"
                          ? "secondary"
                          : "default"
                      }
                      className="capitalize"
                    >
                      {selectedInsight.severity}
                    </Badge>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
