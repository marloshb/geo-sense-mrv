import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  Calendar,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Eye,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeSeriesData {
  period: string;
  year: number;
  month?: number;
  areaHectares: number;
  emissions: number;
  status: "increase" | "decrease" | "stable";
  changePercent: number;
  events: number;
}

const mockTimeSeriesData: TimeSeriesData[] = [
  { period: "2024-Q4", year: 2024, areaHectares: 8500, emissions: 4200, status: "decrease", changePercent: -5.2, events: 2 },
  { period: "2024-Q3", year: 2024, areaHectares: 8500, emissions: 4430, status: "stable", changePercent: 0.5, events: 1 },
  { period: "2024-Q2", year: 2024, areaHectares: 8450, emissions: 4410, status: "decrease", changePercent: -3.1, events: 0 },
  { period: "2024-Q1", year: 2024, areaHectares: 8400, emissions: 4550, status: "increase", changePercent: 2.3, events: 3 },
  { period: "2023-Q4", year: 2023, areaHectares: 8350, emissions: 4450, status: "stable", changePercent: 0.1, events: 1 },
  { period: "2023-Q3", year: 2023, areaHectares: 8350, emissions: 4445, status: "decrease", changePercent: -4.5, events: 2 },
  { period: "2023-Q2", year: 2023, areaHectares: 8300, emissions: 4655, status: "increase", changePercent: 3.8, events: 0 },
  { period: "2023-Q1", year: 2023, areaHectares: 8250, emissions: 4485, status: "stable", changePercent: 0.2, events: 1 },
];

const territories = [
  { id: "1", name: "Mina Carajás" },
  { id: "2", name: "Terminal Portuário SP" },
  { id: "3", name: "Planta Industrial MG" },
  { id: "4", name: "Reserva Florestal AM" },
];

interface TimeSeriesPanelProps {
  selectedTerritoryId?: string;
  onPeriodSelect?: (period: string) => void;
}

export const TimeSeriesPanel = ({ selectedTerritoryId, onPeriodSelect }: TimeSeriesPanelProps) => {
  const [territoryId, setTerritoryId] = useState(selectedTerritoryId || "1");
  const [viewMode, setViewMode] = useState<"list" | "chart">("list");
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);

  const handlePeriodToggle = (period: string) => {
    setSelectedPeriods(prev => {
      if (prev.includes(period)) {
        return prev.filter(p => p !== period);
      }
      if (prev.length >= 2) {
        return [prev[1], period];
      }
      return [...prev, period];
    });
  };

  const getStatusIcon = (status: TimeSeriesData["status"]) => {
    switch (status) {
      case "increase":
        return <TrendingUp className="w-4 h-4 text-destructive" />;
      case "decrease":
        return <TrendingDown className="w-4 h-4 text-success" />;
      default:
        return <ArrowRight className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: TimeSeriesData["status"]) => {
    switch (status) {
      case "increase":
        return "text-destructive";
      case "decrease":
        return "text-success";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Séries Temporais
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
            >
              <Calendar className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "chart" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("chart")}
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Territory Selector */}
        <div className="space-y-2">
          <Select value={territoryId} onValueChange={setTerritoryId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o território" />
            </SelectTrigger>
            <SelectContent>
              {territories.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Comparison Mode */}
        {selectedPeriods.length > 0 && (
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium">Comparação</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={() => setSelectedPeriods([])}
              >
                Limpar
              </Button>
            </div>
            <div className="flex items-center gap-2">
              {selectedPeriods.map((period, index) => (
                <Badge key={period} variant="secondary">
                  {period}
                  {index < selectedPeriods.length - 1 && (
                    <ArrowRight className="w-3 h-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
            {selectedPeriods.length === 2 && (
              <Button variant="outline" size="sm" className="w-full mt-2">
                <Eye className="w-4 h-4 mr-1" />
                Ver Comparação
              </Button>
            )}
          </div>
        )}

        {/* Time Series List */}
        {viewMode === "list" ? (
          <div className="space-y-2 max-h-[350px] overflow-y-auto">
            {mockTimeSeriesData.map((data) => (
              <div
                key={data.period}
                onClick={() => handlePeriodToggle(data.period)}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-colors",
                  selectedPeriods.includes(data.period)
                    ? "border-primary bg-primary/5"
                    : "border-border bg-secondary/30 hover:bg-secondary/50"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{data.period}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(data.status)}
                    <span className={cn("text-sm font-medium", getStatusColor(data.status))}>
                      {data.changePercent > 0 ? "+" : ""}{data.changePercent}%
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Área</p>
                    <p className="font-medium">{data.areaHectares.toLocaleString()} ha</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Emissões</p>
                    <p className="font-medium">{data.emissions.toLocaleString()} tCO₂e</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Eventos</p>
                    <p className="font-medium">{data.events}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[350px] flex items-center justify-center bg-secondary/30 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Gráfico de evolução temporal
              </p>
              <p className="text-xs text-muted-foreground">
                Visualização em desenvolvimento
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Button variant="ghost" size="sm" disabled>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Anteriores
          </Button>
          <span className="text-xs text-muted-foreground">
            Exibindo {mockTimeSeriesData.length} períodos
          </span>
          <Button variant="ghost" size="sm" disabled>
            Próximos
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
