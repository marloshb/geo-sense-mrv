import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RiskMatrix } from "@/components/dashboard/RiskMatrix";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  ThermometerSun,
  Droplets,
  Wind,
  Flame,
  TrendingUp,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const riskTypes = [
  {
    icon: ThermometerSun,
    name: "Ondas de Calor",
    count: 2,
    trend: "up",
    severity: "medium",
  },
  {
    icon: Droplets,
    name: "Inundações",
    count: 3,
    trend: "stable",
    severity: "high",
  },
  {
    icon: Wind,
    name: "Ciclones",
    count: 1,
    trend: "down",
    severity: "low",
  },
  {
    icon: Flame,
    name: "Incêndios",
    count: 2,
    trend: "up",
    severity: "high",
  },
];

const Risks = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Riscos Climáticos</h1>
            <p className="text-muted-foreground">
              Avaliação e gestão de riscos físicos e de transição
            </p>
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Território" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os territórios</SelectItem>
              <SelectItem value="carajas">Mina Carajás</SelectItem>
              <SelectItem value="terminal">Terminal SP</SelectItem>
              <SelectItem value="planta">Planta MG</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Risk Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {riskTypes.map((risk) => {
            const Icon = risk.icon;
            return (
              <Card key={risk.name}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Icon className="w-5 h-5 text-foreground" />
                    </div>
                    <Badge
                      className={
                        risk.severity === "high"
                          ? "bg-destructive/10 text-destructive"
                          : risk.severity === "medium"
                          ? "bg-warning/10 text-warning"
                          : "bg-success/10 text-success"
                      }
                    >
                      {risk.severity === "high"
                        ? "Alto"
                        : risk.severity === "medium"
                        ? "Médio"
                        : "Baixo"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{risk.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-2xl font-bold">{risk.count}</p>
                    <div
                      className={`flex items-center text-xs ${
                        risk.trend === "up"
                          ? "text-destructive"
                          : risk.trend === "down"
                          ? "text-success"
                          : "text-muted-foreground"
                      }`}
                    >
                      {risk.trend === "up" ? "↑" : risk.trend === "down" ? "↓" : "→"}
                      <span className="ml-1">
                        {risk.trend === "up"
                          ? "Aumentando"
                          : risk.trend === "down"
                          ? "Diminuindo"
                          : "Estável"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="matrix" className="space-y-4">
          <TabsList>
            <TabsTrigger value="matrix">Matriz de Riscos</TabsTrigger>
            <TabsTrigger value="physical">Riscos Físicos</TabsTrigger>
            <TabsTrigger value="transition">Riscos de Transição</TabsTrigger>
          </TabsList>

          <TabsContent value="matrix" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RiskMatrix />
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">
                    Impacto Financeiro Estimado
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Cenário Pessimista</span>
                      <Badge className="bg-destructive/10 text-destructive">Alto Risco</Badge>
                    </div>
                    <p className="text-2xl font-bold">R$ 45M - 85M</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Perdas potenciais em 10 anos
                    </p>
                  </div>

                  <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Cenário Base</span>
                      <Badge className="bg-warning/10 text-warning">Médio Risco</Badge>
                    </div>
                    <p className="text-2xl font-bold">R$ 20M - 35M</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Perdas potenciais em 10 anos
                    </p>
                  </div>

                  <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Cenário Otimista</span>
                      <Badge className="bg-success/10 text-success">Baixo Risco</Badge>
                    </div>
                    <p className="text-2xl font-bold">R$ 8M - 15M</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Perdas potenciais em 10 anos
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="physical">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-center">
                  Análise detalhada de riscos físicos agudos e crônicos
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transition">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-center">
                  Análise de riscos de transição: regulatório, mercado, tecnológico e reputacional
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Risks;
