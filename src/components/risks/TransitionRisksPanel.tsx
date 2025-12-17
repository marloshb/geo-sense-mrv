import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Scale, 
  TrendingUp, 
  Cpu, 
  MessageSquare,
  AlertTriangle,
  DollarSign,
  Building,
  Target,
  Briefcase,
  FileText
} from "lucide-react";

interface TransitionRisk {
  id: string;
  name: string;
  category: "regulatory" | "market" | "technology" | "reputation";
  subcategory: string;
  exposure: number;
  sensitivity: number;
  financialImpact: number;
  riskScore: number;
  affectedAssets: string[];
  horizon: "short" | "medium" | "long";
  probability: "low" | "medium" | "high" | "certain";
  impactType: string[];
  financialRange: { min: number; max: number };
  description: string;
  mitigationStatus: "none" | "partial" | "advanced";
}

const regulatoryRisks: TransitionRisk[] = [
  {
    id: "r1",
    name: "Precificação de Carbono",
    category: "regulatory",
    subcategory: "Política Climática",
    exposure: 95,
    sensitivity: 85,
    financialImpact: 90,
    riskScore: 90,
    affectedAssets: ["Caldeiras", "Frota Diesel", "Processos Térmicos"],
    horizon: "short",
    probability: "certain",
    impactType: ["OPEX", "Competitividade"],
    financialRange: { min: 30, max: 80 },
    description: "Implementação de taxação ou mercado de carbono aumentando custos operacionais",
    mitigationStatus: "partial"
  },
  {
    id: "r2",
    name: "Obrigações de Disclosure IFRS S2",
    category: "regulatory",
    subcategory: "Requisitos de Reporte",
    exposure: 90,
    sensitivity: 70,
    financialImpact: 60,
    riskScore: 73,
    affectedAssets: ["Toda a organização"],
    horizon: "short",
    probability: "certain",
    impactType: ["Compliance", "Governança"],
    financialRange: { min: 5, max: 15 },
    description: "Novos requisitos de divulgação climática obrigatória para empresas de capital aberto",
    mitigationStatus: "advanced"
  },
  {
    id: "r3",
    name: "Licenciamento Ambiental Restritivo",
    category: "regulatory",
    subcategory: "Permissões",
    exposure: 80,
    sensitivity: 75,
    financialImpact: 85,
    riskScore: 80,
    affectedAssets: ["Novos Projetos", "Expansões"],
    horizon: "medium",
    probability: "high",
    impactType: ["CAPEX", "Cronograma"],
    financialRange: { min: 20, max: 60 },
    description: "Aumento das exigências para obtenção de licenças ambientais",
    mitigationStatus: "partial"
  }
];

const marketRisks: TransitionRisk[] = [
  {
    id: "m1",
    name: "Mudança na Demanda por Produtos",
    category: "market",
    subcategory: "Preferências do Consumidor",
    exposure: 75,
    sensitivity: 80,
    financialImpact: 85,
    riskScore: 80,
    affectedAssets: ["Linha de Produtos A", "Mercado Exportação"],
    horizon: "medium",
    probability: "high",
    impactType: ["Receita", "Market Share"],
    financialRange: { min: 25, max: 70 },
    description: "Clientes priorizando produtos com menor pegada de carbono",
    mitigationStatus: "partial"
  },
  {
    id: "m2",
    name: "Aumento do Custo de Capital",
    category: "market",
    subcategory: "Acesso a Financiamento",
    exposure: 85,
    sensitivity: 70,
    financialImpact: 75,
    riskScore: 77,
    affectedAssets: ["Projetos de Expansão", "Refinanciamentos"],
    horizon: "short",
    probability: "high",
    impactType: ["WACC", "Viabilidade de Projetos"],
    financialRange: { min: 15, max: 45 },
    description: "Investidores e bancos aplicando prêmio de risco climático",
    mitigationStatus: "none"
  },
  {
    id: "m3",
    name: "Volatilidade de Preços de Energia",
    category: "market",
    subcategory: "Commodities",
    exposure: 70,
    sensitivity: 90,
    financialImpact: 70,
    riskScore: 77,
    affectedAssets: ["Operações Intensivas em Energia"],
    horizon: "short",
    probability: "certain",
    impactType: ["OPEX", "Margem"],
    financialRange: { min: 10, max: 35 },
    description: "Flutuações no custo de energia devido à transição energética",
    mitigationStatus: "partial"
  }
];

const technologyRisks: TransitionRisk[] = [
  {
    id: "t1",
    name: "Obsolescência de Ativos Fósseis",
    category: "technology",
    subcategory: "Stranded Assets",
    exposure: 80,
    sensitivity: 95,
    financialImpact: 95,
    riskScore: 90,
    affectedAssets: ["Caldeiras a Carvão", "Frota Diesel", "Infraestrutura Fóssil"],
    horizon: "medium",
    probability: "high",
    impactType: ["Depreciação", "Write-off"],
    financialRange: { min: 40, max: 120 },
    description: "Ativos intensivos em carbono perdendo valor ou tornando-se inviáveis",
    mitigationStatus: "partial"
  },
  {
    id: "t2",
    name: "CAPEX para Descarbonização",
    category: "technology",
    subcategory: "Investimentos",
    exposure: 90,
    sensitivity: 75,
    financialImpact: 80,
    riskScore: 82,
    affectedAssets: ["Toda a planta industrial"],
    horizon: "medium",
    probability: "certain",
    impactType: ["CAPEX", "Fluxo de Caixa"],
    financialRange: { min: 50, max: 150 },
    description: "Necessidade de investimentos significativos em tecnologias limpas",
    mitigationStatus: "partial"
  },
  {
    id: "t3",
    name: "Disponibilidade de Tecnologias Limpas",
    category: "technology",
    subcategory: "Inovação",
    exposure: 65,
    sensitivity: 60,
    financialImpact: 55,
    riskScore: 60,
    affectedAssets: ["Processos Específicos"],
    horizon: "long",
    probability: "medium",
    impactType: ["Viabilidade", "Timing"],
    financialRange: { min: 10, max: 40 },
    description: "Incerteza sobre maturidade e custo de tecnologias de substituição",
    mitigationStatus: "none"
  }
];

const reputationRisks: TransitionRisk[] = [
  {
    id: "rep1",
    name: "Perda de Licença Social",
    category: "reputation",
    subcategory: "Comunidades",
    exposure: 70,
    sensitivity: 85,
    financialImpact: 80,
    riskScore: 78,
    affectedAssets: ["Operações Locais", "Novos Projetos"],
    horizon: "short",
    probability: "medium",
    impactType: ["Operação", "Expansão"],
    financialRange: { min: 20, max: 60 },
    description: "Resistência de comunidades e stakeholders a operações de alto carbono",
    mitigationStatus: "partial"
  },
  {
    id: "rep2",
    name: "Pressão de Investidores ESG",
    category: "reputation",
    subcategory: "Stakeholders",
    exposure: 85,
    sensitivity: 75,
    financialImpact: 70,
    riskScore: 77,
    affectedAssets: ["Toda a empresa"],
    horizon: "short",
    probability: "high",
    impactType: ["Valor de Mercado", "Acesso a Capital"],
    financialRange: { min: 15, max: 50 },
    description: "Desinvestimento ou exclusão de índices por fundos ESG",
    mitigationStatus: "advanced"
  },
  {
    id: "rep3",
    name: "Litigância Climática",
    category: "reputation",
    subcategory: "Legal",
    exposure: 55,
    sensitivity: 90,
    financialImpact: 85,
    riskScore: 77,
    affectedAssets: ["Corporação"],
    horizon: "medium",
    probability: "medium",
    impactType: ["Contingências", "Imagem"],
    financialRange: { min: 25, max: 100 },
    description: "Ações judiciais relacionadas a danos climáticos ou greenwashing",
    mitigationStatus: "none"
  }
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "regulatory": return <Scale className="h-5 w-5" />;
    case "market": return <TrendingUp className="h-5 w-5" />;
    case "technology": return <Cpu className="h-5 w-5" />;
    case "reputation": return <MessageSquare className="h-5 w-5" />;
    default: return <AlertTriangle className="h-5 w-5" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "regulatory": return "text-purple-500 bg-purple-500/10";
    case "market": return "text-blue-500 bg-blue-500/10";
    case "technology": return "text-cyan-500 bg-cyan-500/10";
    case "reputation": return "text-orange-500 bg-orange-500/10";
    default: return "text-muted-foreground bg-muted";
  }
};

const getRiskColor = (score: number) => {
  if (score >= 80) return "text-destructive";
  if (score >= 60) return "text-warning";
  if (score >= 40) return "text-info";
  return "text-success";
};

const getRiskBgColor = (score: number) => {
  if (score >= 80) return "bg-destructive/10";
  if (score >= 60) return "bg-warning/10";
  if (score >= 40) return "bg-info/10";
  return "bg-success/10";
};

const getRiskLabel = (score: number) => {
  if (score >= 80) return "Crítico";
  if (score >= 60) return "Alto";
  if (score >= 40) return "Médio";
  return "Baixo";
};

const getHorizonLabel = (horizon: string) => {
  switch (horizon) {
    case "short": return "0-3 anos";
    case "medium": return "3-10 anos";
    case "long": return "10-30 anos";
    default: return horizon;
  }
};

const getMitigationBadge = (status: string) => {
  switch (status) {
    case "advanced": return <Badge className="bg-success/10 text-success">Avançado</Badge>;
    case "partial": return <Badge className="bg-warning/10 text-warning">Parcial</Badge>;
    case "none": return <Badge className="bg-destructive/10 text-destructive">Não Iniciado</Badge>;
    default: return null;
  }
};

const TransitionRiskCard = ({ risk }: { risk: TransitionRisk }) => {
  const colorClass = getCategoryColor(risk.category);
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${colorClass}`}>
              {getCategoryIcon(risk.category)}
            </div>
            <div>
              <h4 className="font-medium text-sm">{risk.name}</h4>
              <p className="text-xs text-muted-foreground">{risk.subcategory}</p>
            </div>
          </div>
          <Badge className={getRiskBgColor(risk.riskScore) + " " + getRiskColor(risk.riskScore)}>
            {getRiskLabel(risk.riskScore)}
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground mb-4">{risk.description}</p>

        {/* Risk Assessment */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Exposição</span>
            <span className="font-medium">{risk.exposure}%</span>
          </div>
          <Progress value={risk.exposure} className="h-1.5" />

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Sensibilidade</span>
            <span className="font-medium">{risk.sensitivity}%</span>
          </div>
          <Progress value={risk.sensitivity} className="h-1.5" />

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Impacto Financeiro</span>
            <span className="font-medium">{risk.financialImpact}%</span>
          </div>
          <Progress value={risk.financialImpact} className="h-1.5" />
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="text-xs">
            <Target className="h-3 w-3 mr-1" />
            {getHorizonLabel(risk.horizon)}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Building className="h-3 w-3 mr-1" />
            {risk.affectedAssets.length} ativos
          </Badge>
          {getMitigationBadge(risk.mitigationStatus)}
        </div>

        {/* Impact Types */}
        <div className="flex flex-wrap gap-1 mb-3">
          {risk.impactType.map((type, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {type}
            </Badge>
          ))}
        </div>

        {/* Financial Impact */}
        <div className="p-2 bg-secondary/50 rounded-lg">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Impacto Estimado
            </span>
            <span className="font-semibold">
              R$ {risk.financialRange.min}M - {risk.financialRange.max}M
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function TransitionRisksPanel() {
  const allRisks = [...regulatoryRisks, ...marketRisks, ...technologyRisks, ...reputationRisks];
  const criticalCount = allRisks.filter(r => r.riskScore >= 80).length;
  const totalFinancialMax = allRisks.reduce((acc, r) => acc + r.financialRange.max, 0);
  const avgScore = Math.round(allRisks.reduce((acc, r) => acc + r.riskScore, 0) / allRisks.length);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Scale className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Regulatórios</p>
                <p className="text-2xl font-bold">{regulatoryRisks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Mercado</p>
                <p className="text-2xl font-bold">{marketRisks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Cpu className="h-5 w-5 text-cyan-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tecnológicos</p>
                <p className="text-2xl font-bold">{technologyRisks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <MessageSquare className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Reputacionais</p>
                <p className="text-2xl font-bold">{reputationRisks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-destructive/5 border-destructive/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Riscos Críticos</p>
                <p className="text-3xl font-bold text-destructive">{criticalCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-warning/5 border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Score Médio</p>
                <p className="text-3xl font-bold text-warning">{avgScore}</p>
              </div>
              <Target className="h-8 w-8 text-warning/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Impacto Máximo Total</p>
                <p className="text-3xl font-bold text-primary">R$ {totalFinancialMax}M</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Formula */}
      <Card className="bg-secondary/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="font-medium">Risco de Transição</span>
            <span>=</span>
            <Badge variant="outline">Exposição</Badge>
            <span>×</span>
            <Badge variant="outline">Sensibilidade</Badge>
            <span>×</span>
            <Badge variant="outline">Impacto Financeiro</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tabs by Category */}
      <Tabs defaultValue="regulatory" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="regulatory" className="flex items-center gap-1 text-xs sm:text-sm">
            <Scale className="h-4 w-4" />
            <span className="hidden sm:inline">Regulatório</span>
          </TabsTrigger>
          <TabsTrigger value="market" className="flex items-center gap-1 text-xs sm:text-sm">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Mercado</span>
          </TabsTrigger>
          <TabsTrigger value="technology" className="flex items-center gap-1 text-xs sm:text-sm">
            <Cpu className="h-4 w-4" />
            <span className="hidden sm:inline">Tecnologia</span>
          </TabsTrigger>
          <TabsTrigger value="reputation" className="flex items-center gap-1 text-xs sm:text-sm">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Reputação</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="regulatory" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Scale className="h-5 w-5 text-purple-500" />
                Riscos Regulatórios e de Política
              </CardTitle>
              <CardDescription>
                Mudanças em legislação, regulação e políticas climáticas
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regulatoryRisks.map(risk => (
              <TransitionRiskCard key={risk.id} risk={risk} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Riscos de Mercado
              </CardTitle>
              <CardDescription>
                Mudanças na demanda, custos e acesso a capital
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketRisks.map(risk => (
              <TransitionRiskCard key={risk.id} risk={risk} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="technology" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Cpu className="h-5 w-5 text-cyan-500" />
                Riscos Tecnológicos
              </CardTitle>
              <CardDescription>
                Obsolescência de ativos e necessidade de investimentos em descarbonização
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {technologyRisks.map(risk => (
              <TransitionRiskCard key={risk.id} risk={risk} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reputation" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-orange-500" />
                Riscos Reputacionais
              </CardTitle>
              <CardDescription>
                Perda de licença social, pressão de stakeholders e litigância
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reputationRisks.map(risk => (
              <TransitionRiskCard key={risk.id} risk={risk} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
