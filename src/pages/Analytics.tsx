import { AppLayout } from "@/components/layout/AppLayout";
import { WorkflowIndicator } from "@/components/layout/WorkflowIndicator";
import { EmissionsCalculator } from "@/components/analytics/EmissionsCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3 } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const scopeData = [
  { name: "Escopo 1", value: 4200, color: "hsl(var(--chart-1))" },
  { name: "Escopo 2", value: 2100, color: "hsl(var(--chart-2))" },
  { name: "Escopo 3", value: 3450, color: "hsl(var(--chart-3))" },
];

const categoryData = [
  { category: "Energia", value: 2100 },
  { category: "Transporte", value: 1800 },
  { category: "Processos", value: 1400 },
  { category: "Resíduos", value: 600 },
  { category: "Outros", value: 350 },
];

const Analytics = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Workflow Indicator */}
        <WorkflowIndicator />

        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-info" />
            Analytics MRV
          </h1>
          <p className="text-muted-foreground">
            Análise de métricas, cálculos e insights automatizados — <span className="text-primary font-medium">Etapa 3</span> do fluxo MRV
          </p>
        </div>

        <Tabs defaultValue="calculator" className="space-y-4">
          <TabsList>
            <TabsTrigger value="calculator">Calculadora</TabsTrigger>
            <TabsTrigger value="breakdown">Detalhamento</TabsTrigger>
            <TabsTrigger value="trends">Tendências</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EmissionsCalculator />
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">
                    Distribuição por Escopo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={scopeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {scopeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [`${value.toLocaleString()} tCO₂e`, ""]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {scopeData.map((scope) => (
                      <div key={scope.name} className="text-center">
                        <p className="text-xs text-muted-foreground">{scope.name}</p>
                        <p className="font-semibold">{scope.value.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">
                    Emissões por Categoria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis
                        dataKey="category"
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">
                    Metodologia de Cálculo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Escopo 1 - Emissões Diretas</h4>
                    <p className="text-xs text-muted-foreground">
                      Emissões provenientes de fontes controladas pela organização, 
                      incluindo combustão estacionária, móvel e processos industriais.
                    </p>
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Escopo 2 - Emissões Indiretas</h4>
                    <p className="text-xs text-muted-foreground">
                      Emissões associadas à aquisição de energia elétrica, vapor, 
                      aquecimento ou resfriamento consumidos pela organização.
                    </p>
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Fatores de Emissão</h4>
                    <p className="text-xs text-muted-foreground">
                      Baseados em fontes oficiais e atualizados automaticamente 
                      conforme metodologias reconhecidas internacionalmente.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <h3 className="font-semibold mb-2">Análise de Tendências</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Continue adicionando dados para visualizar tendências históricas 
                    e projeções baseadas em IA.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Analytics;
