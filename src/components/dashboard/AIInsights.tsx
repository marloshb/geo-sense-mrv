import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, AlertTriangle, TrendingUp, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface Insight {
  id: string;
  type: "alert" | "trend" | "recommendation";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

const insights: Insight[] = [
  {
    id: "1",
    type: "alert",
    title: "Anomalia detectada em Carajás",
    description: "Aumento de 23% nas emissões de metano nas últimas 72h. Verificar processos de ventilação.",
    priority: "high",
  },
  {
    id: "2",
    type: "trend",
    title: "Tendência positiva identificada",
    description: "Redução consistente de 8% nas emissões do Escopo 2 nos últimos 3 meses.",
    priority: "low",
  },
  {
    id: "3",
    type: "recommendation",
    title: "Oportunidade de otimização",
    description: "Substituição de frota em Terminal SP pode reduzir emissões em até 15%.",
    priority: "medium",
  },
];

const getInsightIcon = (type: string) => {
  switch (type) {
    case "alert":
      return <AlertTriangle className="w-4 h-4" />;
    case "trend":
      return <TrendingUp className="w-4 h-4" />;
    case "recommendation":
      return <Lightbulb className="w-4 h-4" />;
    default:
      return <Sparkles className="w-4 h-4" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "border-l-destructive bg-destructive/5";
    case "medium":
      return "border-l-warning bg-warning/5";
    default:
      return "border-l-success bg-success/5";
  }
};

export const AIInsights = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <CardTitle className="text-base font-semibold">
            Insights de IA
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={cn(
                "p-3 rounded-lg border-l-4",
                getPriorityColor(insight.priority)
              )}
            >
              <div className="flex items-start gap-2">
                <div className="mt-0.5 text-muted-foreground">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{insight.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
