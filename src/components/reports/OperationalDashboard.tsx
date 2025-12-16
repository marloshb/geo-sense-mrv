import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Factory,
  Zap,
  Droplets,
  Flame,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { DashboardFilters, FilterState } from "./DashboardFilters";

const dailyEmissions = [
  { day: "Seg", scope1: 45, scope2: 32 },
  { day: "Ter", scope1: 52, scope2: 28 },
  { day: "Qua", scope1: 48, scope2: 35 },
  { day: "Qui", scope1: 42, scope2: 30 },
  { day: "Sex", scope1: 55, scope2: 38 },
  { day: "Sáb", scope1: 28, scope2: 18 },
  { day: "Dom", scope1: 22, scope2: 12 },
];

const energyConsumption = [
  { month: "Jan", eletricidade: 12500, diesel: 3200, gas: 1800 },
  { month: "Fev", eletricidade: 11800, diesel: 2900, gas: 1650 },
  { month: "Mar", eletricidade: 12200, diesel: 3100, gas: 1720 },
  { month: "Abr", eletricidade: 11500, diesel: 2800, gas: 1580 },
  { month: "Mai", eletricidade: 10900, diesel: 2600, gas: 1420 },
  { month: "Jun", eletricidade: 10200, diesel: 2400, gas: 1350 },
];

const assetMetrics = [
  {
    name: "Mina Principal",
    territory: "Carajás",
    emissions: 280,
    trend: -5.2,
    energy: 4500,
    alerts: 2,
  },
  {
    name: "Usina Termelétrica",
    territory: "Planta MG",
    emissions: 185,
    trend: 2.1,
    energy: 8200,
    alerts: 1,
  },
  {
    name: "Terminal Portuário",
    territory: "Terminal SP",
    emissions: 95,
    trend: -8.4,
    energy: 2100,
    alerts: 0,
  },
  {
    name: "Centro Logístico",
    territory: "Porto RJ",
    emissions: 62,
    trend: -3.1,
    energy: 1450,
    alerts: 0,
  },
];

const activeAlerts = [
  {
    id: 1,
    type: "warning",
    message: "Consumo de diesel 15% acima da média",
    asset: "Mina Principal",
    time: "2h atrás",
  },
  {
    id: 2,
    type: "info",
    message: "Novo fator de emissão disponível",
    asset: "Sistema",
    time: "4h atrás",
  },
  {
    id: 3,
    type: "warning",
    message: "Pico de consumo elétrico detectado",
    asset: "Usina Termelétrica",
    time: "6h atrás",
  },
];

export const OperationalDashboard = () => {
  const [filters, setFilters] = useState<FilterState>({
    territory: "all",
    asset: "all",
    period: "ytd",
    startDate: undefined,
    endDate: undefined,
    compareYear: "none",
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <DashboardFilters filters={filters} onFiltersChange={setFilters} />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Factory className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Emissões Hoje</p>
                <p className="text-xl font-bold">142</p>
                <p className="text-xs text-muted-foreground">tCO₂e</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Energia (MWh)</p>
                <p className="text-xl font-bold">10,200</p>
                <div className="flex items-center gap-1 text-xs text-success">
                  <TrendingDown className="w-3 h-3" />
                  -6.5%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Flame className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Combustível (L)</p>
                <p className="text-xl font-bold">2,400</p>
                <div className="flex items-center gap-1 text-xs text-success">
                  <TrendingDown className="w-3 h-3" />
                  -7.7%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Alertas Ativos</p>
                <p className="text-xl font-bold">3</p>
                <p className="text-xs text-warning">2 atenção</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Emissions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Emissões Diárias (tCO₂e)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyEmissions}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="scope1"
                  name="Escopo 1"
                  fill="hsl(var(--chart-1))"
                  radius={[4, 4, 0, 0]}
                  stackId="stack"
                />
                <Bar
                  dataKey="scope2"
                  name="Escopo 2"
                  fill="hsl(var(--chart-2))"
                  radius={[4, 4, 0, 0]}
                  stackId="stack"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Energy Consumption Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Tendência de Consumo Energético
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={energyConsumption}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="eletricidade"
                  name="Eletricidade"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="diesel"
                  name="Diesel"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="gas"
                  name="Gás Natural"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Assets & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Performance */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Performance por Ativo</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs">
                Ver todos
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assetMetrics.map((asset) => (
                <div
                  key={asset.name}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Factory className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{asset.name}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {asset.territory}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {asset.emissions} tCO₂e
                      </div>
                      <div
                        className={`flex items-center justify-end gap-1 text-xs ${
                          asset.trend < 0 ? "text-success" : "text-destructive"
                        }`}
                      >
                        {asset.trend < 0 ? (
                          <TrendingDown className="w-3 h-3" />
                        ) : (
                          <TrendingUp className="w-3 h-3" />
                        )}
                        {Math.abs(asset.trend)}%
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {asset.energy.toLocaleString()} MWh
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Energia
                      </div>
                    </div>

                    {asset.alerts > 0 ? (
                      <Badge variant="destructive" className="text-xs">
                        {asset.alerts} alertas
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-xs text-success border-success"
                      >
                        OK
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-warning" />
              Alertas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    alert.type === "warning"
                      ? "bg-warning/5 border-l-warning"
                      : "bg-info/5 border-l-info"
                  }`}
                >
                  <div className="text-sm">{alert.message}</div>
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>{alert.asset}</span>
                    <span>{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
