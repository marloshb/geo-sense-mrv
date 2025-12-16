import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  ChevronRight,
  FileText,
  Calculator,
  Database,
  MapPin,
  User,
  Calendar,
  ArrowRight,
  Info,
} from "lucide-react";

interface TraceabilityPath {
  id: string;
  report: {
    name: string;
    type: string;
    date: string;
  };
  metric: {
    name: string;
    value: number;
    unit: string;
    methodology: string;
  };
  calculations: {
    formula: string;
    factors: string[];
  };
  sourceData: {
    records: number;
    period: string;
    sources: string[];
  };
  territory: {
    name: string;
    type: string;
  };
  responsible: {
    name: string;
    date: string;
  };
}

const sampleTraceability: TraceabilityPath = {
  id: "1",
  report: {
    name: "Relatório IFRS S2 - 2024",
    type: "Regulatório",
    date: "15/12/2024",
  },
  metric: {
    name: "Emissões Escopo 1",
    value: 4200,
    unit: "tCO₂e",
    methodology: "GHG Protocol v2.1",
  },
  calculations: {
    formula: "Σ (Consumo × Fator de Emissão)",
    factors: ["Diesel: 2.68 kgCO₂/L", "Gás Natural: 2.04 kgCO₂/m³"],
  },
  sourceData: {
    records: 127,
    period: "Jan-Dez 2024",
    sources: ["Sistema de Medição", "Notas Fiscais", "Inventário"],
  },
  territory: {
    name: "Mina Carajás",
    type: "Ativo Operacional",
  },
  responsible: {
    name: "Maria Silva",
    date: "14/12/2024",
  },
};

export const TraceabilityPanel = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMetric, setSelectedMetric] = useState("emissions-scope1");
  const [traceability] = useState<TraceabilityPath>(sampleTraceability);

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por indicador, relatório ou território..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Selecione métrica" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="emissions-scope1">Emissões Escopo 1</SelectItem>
                <SelectItem value="emissions-scope2">Emissões Escopo 2</SelectItem>
                <SelectItem value="energy">Consumo Energético</SelectItem>
                <SelectItem value="sequestration">Sequestro de Carbono</SelectItem>
              </SelectContent>
            </Select>
            <Button>Rastrear</Button>
          </div>
        </CardContent>
      </Card>

      {/* Traceability Flow */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            Cadeia de Rastreabilidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 items-stretch">
            {/* Report */}
            <div className="flex-1 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium text-sm">Relatório</span>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-sm">{traceability.report.name}</div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {traceability.report.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {traceability.report.date}
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center">
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>

            {/* Metric */}
            <div className="flex-1 p-4 bg-info/5 border border-info/20 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded bg-info/10 flex items-center justify-center">
                  <Calculator className="w-4 h-4 text-info" />
                </div>
                <span className="font-medium text-sm">Métrica</span>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-sm">{traceability.metric.name}</div>
                <div className="text-lg font-bold">
                  {traceability.metric.value.toLocaleString()}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    {traceability.metric.unit}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {traceability.metric.methodology}
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center">
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>

            {/* Source Data */}
            <div className="flex-1 p-4 bg-warning/5 border border-warning/20 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded bg-warning/10 flex items-center justify-center">
                  <Database className="w-4 h-4 text-warning" />
                </div>
                <span className="font-medium text-sm">Dados Fonte</span>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-sm">
                  {traceability.sourceData.records} registros
                </div>
                <div className="text-xs text-muted-foreground">
                  {traceability.sourceData.period}
                </div>
                <div className="flex flex-wrap gap-1">
                  {traceability.sourceData.sources.map((source, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {source}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center">
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>

            {/* Territory */}
            <div className="flex-1 p-4 bg-success/5 border border-success/20 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded bg-success/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-success" />
                </div>
                <span className="font-medium text-sm">Território</span>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-sm">{traceability.territory.name}</div>
                <Badge variant="secondary" className="text-xs">
                  {traceability.territory.type}
                </Badge>
              </div>
            </div>
          </div>

          {/* Calculation Details */}
          <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-sm">Detalhes do Cálculo</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Fórmula</div>
                <code className="text-sm bg-background px-2 py-1 rounded">
                  {traceability.calculations.formula}
                </code>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  Fatores de Emissão
                </div>
                <div className="space-y-1">
                  {traceability.calculations.factors.map((factor, idx) => (
                    <div key={idx} className="text-sm">
                      {factor}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Responsible */}
          <div className="mt-4 flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                Responsável: <strong>{traceability.responsible.name}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {traceability.responsible.date}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          Ver Dados Originais
        </Button>
        <Button variant="outline" size="sm">
          Exportar Trilha
        </Button>
        <Button variant="outline" size="sm">
          Gerar Certificado
        </Button>
      </div>
    </div>
  );
};
