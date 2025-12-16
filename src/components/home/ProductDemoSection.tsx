import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { AlertTriangle, TrendingUp, Brain, MapPin } from "lucide-react";

const emissionsData = [
  { month: "Jan", scope1: 180, scope2: 120 },
  { month: "Fev", scope1: 175, scope2: 115 },
  { month: "Mar", scope1: 190, scope2: 125 },
  { month: "Abr", scope1: 168, scope2: 110 },
  { month: "Mai", scope1: 160, scope2: 105 },
  { month: "Jun", scope1: 155, scope2: 100 },
];

const riskData = [
  { name: "Físico", value: 35, color: "#3b82f6" },
  { name: "Transição", value: 45, color: "#8b5cf6" },
  { name: "Regulatório", value: 20, color: "#f59e0b" },
];

const territoryData = [
  { territory: "Mina Norte", emissions: 850, trend: -12 },
  { territory: "Planta Sul", emissions: 620, trend: -8 },
  { territory: "Hub Logístico", emissions: 340, trend: +5 },
  { territory: "Reserva Florestal", emissions: -180, trend: -2 },
];

export function ProductDemoSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="px-4 py-2 mb-4">
            Demonstração
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Veja a Plataforma em Ação
          </h2>
          <p className="text-lg text-muted-foreground">
            Dashboards reais, insights automáticos e visualização territorial 
            que transformam dados em decisões.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Emissions Trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Tendência de Emissões
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Scope 1 & 2 - Últimos 6 meses</p>
                </div>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                  -12% YoY
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={emissionsData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="scope1" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Scope 1" />
                    <Area type="monotone" dataKey="scope2" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} name="Scope 2" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Risk Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Distribuição de Riscos
              </CardTitle>
              <p className="text-sm text-muted-foreground">Por categoria climática</p>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Territory Performance */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Performance por Território
              </CardTitle>
              <p className="text-sm text-muted-foreground">Emissões líquidas (ktCO₂e)</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {territoryData.map((territory, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-32 font-medium text-sm">{territory.territory}</div>
                    <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden relative">
                      <div 
                        className={`h-full ${territory.emissions >= 0 ? 'bg-primary/60' : 'bg-green-500/60'} rounded-lg transition-all`}
                        style={{ width: `${Math.abs(territory.emissions) / 10}%` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                        {territory.emissions >= 0 ? '+' : ''}{territory.emissions} ktCO₂e
                      </span>
                    </div>
                    <Badge variant={territory.trend <= 0 ? "default" : "destructive"} className="w-16 justify-center">
                      {territory.trend > 0 ? '+' : ''}{territory.trend}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="bg-gradient-to-br from-primary/5 to-blue-500/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Insights IA
              </CardTitle>
              <p className="text-sm text-muted-foreground">Gerados automaticamente</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-xs font-semibold text-destructive mb-1">⚠️ Alerta Crítico</p>
                <p className="text-xs text-muted-foreground">
                  Hub Logístico apresenta tendência de aumento. Revisar eficiência de frota.
                </p>
              </div>
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-xs font-semibold text-green-600 mb-1">✓ Oportunidade</p>
                <p className="text-xs text-muted-foreground">
                  Mina Norte pode atingir meta antecipadamente com otimização energética.
                </p>
              </div>
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-xs font-semibold text-blue-600 mb-1">📊 Previsão</p>
                <p className="text-xs text-muted-foreground">
                  Projeção indica redução de 18% até final do ano com ações planejadas.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
