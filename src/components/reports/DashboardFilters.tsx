import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Filter, X, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

export interface FilterState {
  territory: string;
  asset: string;
  period: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  compareYear: string;
}

interface DashboardFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  territories?: { id: string; name: string }[];
  assets?: { id: string; name: string }[];
  compact?: boolean;
}

export const DashboardFilters = ({
  filters,
  onFiltersChange,
  territories = [
    { id: "all", name: "Todos os Territórios" },
    { id: "carajas", name: "Carajás" },
    { id: "terminal-sp", name: "Terminal SP" },
    { id: "planta-mg", name: "Planta MG" },
    { id: "reserva-am", name: "Reserva AM" },
  ],
  assets = [
    { id: "all", name: "Todos os Ativos" },
    { id: "mina-1", name: "Mina Principal" },
    { id: "planta-1", name: "Planta Industrial" },
    { id: "terminal-1", name: "Terminal Portuário" },
  ],
  compact = false,
}: DashboardFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(!compact);

  const activeFiltersCount = [
    filters.territory !== "all",
    filters.asset !== "all",
    filters.period !== "ytd",
    filters.compareYear !== "none",
  ].filter(Boolean).length;

  const resetFilters = () => {
    onFiltersChange({
      territory: "all",
      asset: "all",
      period: "ytd",
      startDate: undefined,
      endDate: undefined,
      compareYear: "none",
    });
  };

  if (compact && !isExpanded) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(true)}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-sm">Filtros e Cenários</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount} ativos</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="gap-1 text-xs"
            >
              <RotateCcw className="w-3 h-3" />
              Limpar
            </Button>
            {compact && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Territory Filter */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Território</label>
            <Select
              value={filters.territory}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, territory: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
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

          {/* Asset Filter */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Ativo</label>
            <Select
              value={filters.asset}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, asset: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {assets.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Period Filter */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Período</label>
            <Select
              value={filters.period}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, period: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ytd">Ano atual (YTD)</SelectItem>
                <SelectItem value="q1">Q1 2024</SelectItem>
                <SelectItem value="q2">Q2 2024</SelectItem>
                <SelectItem value="q3">Q3 2024</SelectItem>
                <SelectItem value="q4">Q4 2024</SelectItem>
                <SelectItem value="last-year">Ano anterior</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range (when custom period) */}
          {filters.period === "custom" && (
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Intervalo</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.startDate ? (
                      format(filters.startDate, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      <span>Data início</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.startDate}
                    onSelect={(date) =>
                      onFiltersChange({ ...filters, startDate: date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Compare Year */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Comparar com</label>
            <Select
              value={filters.compareYear}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, compareYear: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem comparação</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
