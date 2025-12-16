import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingDown, TrendingUp, AlertTriangle, Building, Fuel, Zap, FileText, Calculator } from "lucide-react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface FinancialImpact {
  id: string;
  riskName: string;
  riskType: "physical" | "transition";
  impactCategory: "capex" | "opex" | "revenue" | "provision";
  impactRange: { min: number; max: number };
  probability: number;
  expectedValue: number;
  horizon: string;
  assumptions: string;
  confidence: "low" | "medium" | "high";
}

const mockImpacts: FinancialImpact[] = [
  {
    id: "1",
    riskName: "Inundações em Áreas Operacionais",
    riskType: "physical",
    impactCategory: "capex",
    impactRange: { min: 5000000, max: 15000000 },
    probability: 0.35,
    expectedValue: 3500000,
    horizon: "2025-2030",
    assumptions: "Baseado em histórico de eventos e projeções climáticas regionais",
    confidence: "medium"
  },
  {
    id: "2",
    riskName: "Estresse Hídrico",
    riskType: "physical",
    impactCategory: "opex",
    impactRange: { min: 2000000, max: 8000000 },
    probability: 0.45,
    expectedValue: 2250000,
    horizon: "2025-2035",
    assumptions: "Considerando custos de captação alternativa e eficiência",
    confidence: "medium"
  },
  {
    id: "3",
    riskName: "Regulação de Carbono",
    riskType: "transition",
    impactCategory: "opex",
    impactRange: { min: 10000000, max: 25000000 },
    probability: 0.85,
    expectedValue: 14875000,
    horizon: "2025-2030",
    assumptions: "Precificação de R$100-250/tCO2e conforme cenários regulatórios",
    confidence: "high"
  },
  {
    id: "4",
    riskName: "Mudança de Preferências de Mercado",
    riskType: "transition",
    impactCategory: "revenue",
    impactRange: { min: 3000000, max: 12000000 },
    probability: 0.55,
    expectedValue: 4125000,
    horizon: "2025-2035",
    assumptions: "Redução de demanda por produtos intensivos em carbono",
    confidence: "low"
  },
  {
    id: "5",
    riskName: "Danos a Ativos por Eventos Extremos",
    riskType: "physical",
    impactCategory: "provision",
    impactRange: { min: 8000000, max: 20000000 },
    probability: 0.25,
    expectedValue: 3500000,
    horizon: "2025-2040",
    assumptions: "Provisão para reparos e substituição de equipamentos",
    confidence: "medium"
  }
];

const impactByCategory = [
  { name: "CAPEX", value: 3500000, color: "#3b82f6" },
  { name: "OPEX", value: 17125000, color: "#f59e0b" },
  { name: "Receita", value: 4125000, color: "#ef4444" },
  { name: "Provisões", value: 3500000, color: "#8b5cf6" },
];

const impactByYear = [
  { year: "2025", physical: 2500000, transition: 8000000 },
  { year: "2026", physical: 3200000, transition: 10500000 },
  { year: "2027", physical: 4100000, transition: 12000000 },
  { year: "2028", physical: 5000000, transition: 14000000 },
  { year: "2029", physical: 5800000, transition: 15500000 },
  { year: "2030", physical: 6500000, transition: 17000000 },
];

export function FinancialImpactPanel() {
  const [selectedHorizon, setSelectedHorizon] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const totalExpectedValue = mockImpacts.reduce((acc, imp) => acc + imp.expectedValue, 0);
  const physicalImpact = mockImpacts.filter(i => i.riskType === "physical").reduce((acc, imp) => acc + imp.expectedValue, 0);
  const transitionImpact = mockImpacts.filter(i => i.riskType === "transition").reduce((acc, imp) => acc + imp.expectedValue, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getCategoryIcon = (category: FinancialImpact["impactCategory"]) => {
    switch (category) {
      case "capex": return <Building className="h-4 w-4" />;
      case "opex": return <Fuel className="h-4 w-4" />;
      case "revenue": return <TrendingDown className="h-4 w-4" />;
      case "provision": return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: FinancialImpact["impactCategory"]) => {
    switch (category) {
      case "capex": return "CAPEX";
      case "opex": return "OPEX";
      case "revenue": return "Receita";
      case "provision": return "Provisão";
    }
  };

  const getConfidenceBadge = (confidence: FinancialImpact["confidence"]) => {
    const config = {
      low: { label: "Baixa", className: "bg-yellow-500" },
      medium: { label: "Média", className: "bg-blue-500" },
      high: { label: "Alta", className: "bg-green-500" }
    };
    return <Badge className={config[confidence].className}>{config[confidence].label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Impacto Total Esperado</p>
                <p className="text-2xl font-bold">{formatCurrency(totalExpectedValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Zap className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Riscos Físicos</p>
                <p className="text-2xl font-bold">{formatCurrency(physicalImpact)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Riscos de Transição</p>
                <p className="text-2xl font-bold">{formatCurrency(transitionImpact)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Calculator className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avaliações</p>
                <p className="text-2xl font-bold">{mockImpacts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table">Detalhamento</TabsTrigger>
          <TabsTrigger value="charts">Visualização</TabsTrigger>
          <TabsTrigger value="methodology">Metodologia</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4 mt-4">
          {/* Filters */}
          <div className="flex gap-4">
            <Select value={selectedHorizon} onValueChange={setSelectedHorizon}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Horizonte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="short">Curto Prazo</SelectItem>
                <SelectItem value="medium">Médio Prazo</SelectItem>
                <SelectItem value="long">Longo Prazo</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="capex">CAPEX</SelectItem>
                <SelectItem value="opex">OPEX</SelectItem>
                <SelectItem value="revenue">Receita</SelectItem>
                <SelectItem value="provision">Provisões</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Avaliação de Impacto Financeiro
              </CardTitle>
              <CardDescription>
                Impactos financeiros estimados por risco climático (IFRS S2 aligned)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Risco</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Faixa de Impacto</TableHead>
                    <TableHead>Probabilidade</TableHead>
                    <TableHead>Valor Esperado</TableHead>
                    <TableHead>Confiança</TableHead>
                    <TableHead>Horizonte</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockImpacts.map((impact) => (
                    <TableRow key={impact.id}>
                      <TableCell className="font-medium">{impact.riskName}</TableCell>
                      <TableCell>
                        <Badge variant={impact.riskType === "physical" ? "default" : "secondary"}>
                          {impact.riskType === "physical" ? "Físico" : "Transição"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(impact.impactCategory)}
                          <span>{getCategoryLabel(impact.impactCategory)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatCurrency(impact.impactRange.min)} - {formatCurrency(impact.impactRange.max)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={impact.probability * 100} className="w-16 h-2" />
                          <span className="text-sm">{(impact.probability * 100).toFixed(0)}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(impact.expectedValue)}
                      </TableCell>
                      <TableCell>{getConfidenceBadge(impact.confidence)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {impact.horizon}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Impacto por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={impactByCategory}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                      >
                        {impactByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Projeção de Impacto por Ano</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={impactByYear}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Bar dataKey="physical" name="Físico" fill="#3b82f6" stackId="stack" />
                      <Bar dataKey="transition" name="Transição" fill="#8b5cf6" stackId="stack" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="methodology" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Metodologia de Avaliação
              </CardTitle>
              <CardDescription>
                Abordagem para quantificação de impactos financeiros climáticos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h4 className="font-semibold">Alinhamento com IFRS S2</h4>
                <p className="text-sm text-muted-foreground">
                  A avaliação de impacto financeiro segue as diretrizes do IFRS S2 para disclosure 
                  de riscos e oportunidades relacionados ao clima, incluindo categorização de impactos 
                  em CAPEX, OPEX, receita e provisões.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Cálculo de Valor Esperado</h4>
                <p className="text-sm text-muted-foreground">
                  O valor esperado é calculado como a média ponderada da faixa de impacto pela 
                  probabilidade de ocorrência: VE = (Min + Max) / 2 × Probabilidade
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Níveis de Confiança</h4>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="p-3 border rounded-lg">
                    <Badge className="bg-green-500 mb-2">Alta</Badge>
                    <p className="text-xs text-muted-foreground">
                      Dados históricos robustos, modelos validados, premissas bem documentadas
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <Badge className="bg-blue-500 mb-2">Média</Badge>
                    <p className="text-xs text-muted-foreground">
                      Dados parciais disponíveis, modelos com incerteza moderada
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <Badge className="bg-yellow-500 mb-2">Baixa</Badge>
                    <p className="text-xs text-muted-foreground">
                      Estimativas qualitativas, dados limitados, alta incerteza
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Premissas Gerais</h4>
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  <li>Cenários climáticos baseados em RCP 4.5 e RCP 8.5</li>
                  <li>Horizontes de curto (0-2 anos), médio (2-5 anos) e longo prazo (5+ anos)</li>
                  <li>Precificação de carbono baseada em cenários regulatórios nacionais</li>
                  <li>Taxas de desconto alinhadas ao custo de capital da organização</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
