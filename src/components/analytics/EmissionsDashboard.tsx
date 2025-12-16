import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Cloud,
  Factory,
  Zap,
  Truck,
  TreeDeciduous,
  Calculator,
  Loader2,
  TrendingDown,
  TrendingUp,
  Info,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EmissionsSummary {
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
}

interface EmissionsDashboardProps {
  territoryId?: string;
  periodStart?: string;
  periodEnd?: string;
}

export const EmissionsDashboard = ({
  territoryId,
  periodStart,
  periodEnd,
}: EmissionsDashboardProps) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [summary, setSummary] = useState<EmissionsSummary>({
    scope1: 4200,
    scope2: 3150,
    scope3: 2400,
    total: 9750,
  });
  const [previousPeriod] = useState<EmissionsSummary>({
    scope1: 4800,
    scope2: 3500,
    scope3: 2850,
    total: 11150,
  });

  const calculateEmissions = async () => {
    setIsCalculating(true);

    try {
      const { data, error } = await supabase.functions.invoke("calculate-emissions", {
        body: {
          territoryId,
          periodStart,
          periodEnd,
        },
      });

      if (error) throw error;

      if (data?.summary) {
        setSummary(data.summary);
        toast.success("Emissões calculadas com sucesso!");
      }
    } catch (error: any) {
      console.error("Error calculating emissions:", error);
      toast.error("Erro ao calcular emissões. Usando dados de demonstração.");
    } finally {
      setIsCalculating(false);
    }
  };

  const getChangePercentage = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const totalChange = getChangePercentage(summary.total, previousPeriod.total);

  const scopeData = [
    {
      name: "Escopo 1",
      description: "Emissões diretas (combustão, processos)",
      value: summary.scope1,
      previous: previousPeriod.scope1,
      icon: Factory,
      color: "bg-primary",
    },
    {
      name: "Escopo 2",
      description: "Emissões indiretas (energia elétrica)",
      value: summary.scope2,
      previous: previousPeriod.scope2,
      icon: Zap,
      color: "bg-info",
    },
    {
      name: "Escopo 3",
      description: "Outras indiretas (cadeia de valor)",
      value: summary.scope3,
      previous: previousPeriod.scope3,
      icon: Truck,
      color: "bg-warning",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header with Total */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Cloud className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Emissões Totais</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">
                    {summary.total.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">tCO₂e</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div
                  className={`flex items-center gap-1 ${
                    totalChange < 0 ? "text-success" : "text-destructive"
                  }`}
                >
                  {totalChange < 0 ? (
                    <TrendingDown className="w-4 h-4" />
                  ) : (
                    <TrendingUp className="w-4 h-4" />
                  )}
                  <span className="font-medium">
                    {Math.abs(totalChange).toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">vs. período anterior</p>
              </div>

              <Button onClick={calculateEmissions} disabled={isCalculating}>
                {isCalculating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Calculator className="w-4 h-4 mr-2" />
                )}
                Recalcular
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scope Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scopeData.map((scope) => {
          const change = getChangePercentage(scope.value, scope.previous);
          const percentage = summary.total > 0 ? (scope.value / summary.total) * 100 : 0;
          const Icon = scope.icon;

          return (
            <Card key={scope.name}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${scope.color}/10`}>
                      <Icon className={`w-4 h-4 ${scope.color.replace("bg-", "text-")}`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{scope.name}</p>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-3 h-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs text-xs">{scope.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  <Badge
                    variant={change < 0 ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {change < 0 ? "↓" : "↑"} {Math.abs(change).toFixed(1)}%
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold">
                      {scope.value.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">tCO₂e</span>
                  </div>

                  <Progress value={percentage} className="h-2" />

                  <p className="text-xs text-muted-foreground">
                    {percentage.toFixed(1)}% do total
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TreeDeciduous className="w-4 h-4 text-success" />
              Sequestro de Carbono
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-success">2,340</span>
              <span className="text-muted-foreground">tCO₂e</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Estimativa baseada em áreas de conservação monitoradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Intensidade de Emissões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Por área monitorada</span>
                <span className="font-medium">0.37 tCO₂e/ha</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Por produção</span>
                <span className="font-medium">0.12 tCO₂e/t</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Por receita</span>
                <span className="font-medium">8.5 tCO₂e/M BRL</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
