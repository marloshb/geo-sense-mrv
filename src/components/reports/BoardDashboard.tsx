import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Target,
  MapPin,
  ArrowUpRight,
  Zap,
  Shield,
} from "lucide-react";
import { ExecutiveSummary } from "./ExecutiveSummary";

const emissionsData = [
  { month: "Jan", atual: 850, anterior: 950, meta: 800 },
  { month: "Fev", atual: 820, anterior: 920, meta: 800 },
  { month: "Mar", atual: 780, anterior: 890, meta: 800 },
  { month: "Abr", atual: 810, anterior: 870, meta: 800 },
  { month: "Mai", atual: 760, anterior: 840, meta: 800 },
  { month: "Jun", atual: 740, anterior: 810, meta: 800 },
  { month: "Jul", atual: 720, anterior: 780, meta: 800 },
  { month: "Ago", atual: 700, anterior: 760, meta: 800 },
  { month: "Set", atual: 680, anterior: 740, meta: 800 },
  { month: "Out", atual: 660, anterior: 720, meta: 800 },
  { month: "Nov", atual: 640, anterior: 700, meta: 800 },
  { month: "Dez", atual: 620, anterior: 680, meta: 800 },
];

const territoryConcentration = [
  { name: "Carajás", value: 43, emissions: 4200 },
  { name: "Planta MG", value: 22, emissions: 2100 },
  { name: "Terminal SP", value: 18, emissions: 1800 },
  { name: "Porto RJ", value: 14, emissions: 1400 },
  { name: "Outros", value: 3, emissions: 250 },
];

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const criticalAssets = [
  {
    name: "Mina Principal",
    territory: "Carajás",
    risk: "Crítico",
    emissions: 2800,
    trend: 5.2,
  },
  {
    name: "Usina Termelétrica",
    territory: "Planta MG",
    risk: "Alto",
    emissions: 1500,
    trend: -8.1,
  },
  {
    name: "Terminal Portuário",
    territory: "Terminal SP",
    risk: "Alto",
    emissions: 1200,
    trend: -3.4,
  },
];

export const BoardDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <ExecutiveSummary />

      {/* Strategic KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">
                  Emissões Acumuladas YTD
                </p>
                <p className="text-2xl font-bold">9,750</p>
                <p className="text-xs text-muted-foreground">tCO₂e</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-success">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-sm font-medium">-12.5%</span>
                </div>
                <span className="text-xs text-muted-foreground">vs. 2023</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">
                  Riscos Climáticos Críticos
                </p>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">requerem ação</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Meta 2024</p>
                <p className="text-2xl font-bold">68%</p>
                <p className="text-xs text-muted-foreground">atingido</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-info">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">
                  Intensidade Carbônica
                </p>
                <p className="text-2xl font-bold">0.42</p>
                <p className="text-xs text-muted-foreground">tCO₂e/ton prod</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-success">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-sm font-medium">-8.7%</span>
                </div>
                <span className="text-xs text-muted-foreground">vs. 2023</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Emissions Trend */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Evolução de Emissões (tCO₂e/mês)
              </CardTitle>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-primary" />
                  <span>2024</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-muted-foreground/30" />
                  <span>2023</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-destructive" />
                  <span>Meta</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={emissionsData}>
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
                <Area
                  type="monotone"
                  dataKey="anterior"
                  stroke="hsl(var(--muted-foreground))"
                  fill="hsl(var(--muted))"
                  fillOpacity={0.3}
                  strokeWidth={1}
                  strokeDasharray="5 5"
                />
                <Area
                  type="monotone"
                  dataKey="atual"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="meta"
                  stroke="hsl(var(--destructive))"
                  fill="transparent"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Concentration */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Concentração por Território
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={territoryConcentration}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {territoryConcentration.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string, props: any) => [
                    `${value}% (${props.payload.emissions.toLocaleString()} tCO₂e)`,
                    props.payload.name,
                  ]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1 mt-2">
              {territoryConcentration.slice(0, 3).map((t, i) => (
                <div
                  key={t.name}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: COLORS[i] }}
                    />
                    <span>{t.name}</span>
                  </div>
                  <span className="font-medium">{t.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Assets & Risk Hotspots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="w-4 h-4 text-warning" />
                Ativos Críticos
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                Ver todos
                <ArrowUpRight className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalAssets.map((asset) => (
                <div
                  key={asset.name}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-sm">{asset.name}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {asset.territory}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {asset.emissions.toLocaleString()} tCO₂e
                    </div>
                    <div
                      className={`flex items-center gap-1 text-xs ${
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
                  <Badge
                    className={
                      asset.risk === "Crítico"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-warning/10 text-warning"
                    }
                  >
                    {asset.risk}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-4 h-4 text-info" />
                Semáforo de Riscos
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-destructive/10 rounded-lg">
                <div className="text-3xl font-bold text-destructive">3</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Críticos
                </div>
                <div className="text-xs text-destructive mt-2">
                  Ação imediata
                </div>
              </div>
              <div className="text-center p-4 bg-warning/10 rounded-lg">
                <div className="text-3xl font-bold text-warning">5</div>
                <div className="text-xs text-muted-foreground mt-1">Altos</div>
                <div className="text-xs text-warning mt-2">Monitorar</div>
              </div>
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <div className="text-3xl font-bold text-success">12</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Controlados
                </div>
                <div className="text-xs text-success mt-2">Adequado</div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium">
                  Principais Riscos Ativos
                </span>
              </div>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                  Inundação Costeira - Terminal SP
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                  Seca Severa - Carajás
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                  Incêndio Florestal - Reserva AM
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
