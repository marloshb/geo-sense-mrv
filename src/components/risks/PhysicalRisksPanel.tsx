import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Flame, 
  Droplets, 
  Wind, 
  ThermometerSun, 
  CloudRain, 
  Mountain,
  AlertTriangle,
  MapPin,
  Building,
  TrendingUp,
  Shield
} from "lucide-react";

interface PhysicalRisk {
  id: string;
  name: string;
  type: "acute" | "chronic";
  category: string;
  icon: React.ReactNode;
  exposure: number;
  vulnerability: number;
  impact: number;
  riskScore: number;
  territories: string[];
  assets: string[];
  financialImpact: { min: number; max: number };
  trend: "increasing" | "stable" | "decreasing";
  description: string;
}

const acuteRisks: PhysicalRisk[] = [
  {
    id: "1",
    name: "Chuvas Intensas e Enchentes",
    type: "acute",
    category: "Precipitação Extrema",
    icon: <CloudRain className="h-5 w-5" />,
    exposure: 85,
    vulnerability: 70,
    impact: 90,
    riskScore: 82,
    territories: ["Terminal SP", "Área Portuária", "Mina Norte"],
    assets: ["Barragem 01", "Pátio de Estocagem", "Via de Acesso Principal"],
    financialImpact: { min: 15, max: 45 },
    trend: "increasing",
    description: "Eventos de precipitação extrema com potencial de inundação em áreas operacionais baixas"
  },
  {
    id: "2",
    name: "Ondas de Calor Extremo",
    type: "acute",
    category: "Temperatura Extrema",
    icon: <ThermometerSun className="h-5 w-5" />,
    exposure: 75,
    vulnerability: 60,
    impact: 65,
    riskScore: 67,
    territories: ["Planta Industrial MG", "Centro de Distribuição"],
    assets: ["Linha de Produção A", "Sistema de Refrigeração"],
    financialImpact: { min: 8, max: 25 },
    trend: "increasing",
    description: "Temperaturas acima de 40°C por períodos prolongados afetando operações e colaboradores"
  },
  {
    id: "3",
    name: "Tempestades e Ventos Fortes",
    type: "acute",
    category: "Eventos Meteorológicos",
    icon: <Wind className="h-5 w-5" />,
    exposure: 60,
    vulnerability: 55,
    impact: 70,
    riskScore: 62,
    territories: ["Área Costeira Sul"],
    assets: ["Torres de Transmissão", "Estruturas Metálicas"],
    financialImpact: { min: 5, max: 20 },
    trend: "stable",
    description: "Ventos acima de 100km/h com potencial de danos estruturais"
  },
  {
    id: "4",
    name: "Incêndios Florestais",
    type: "acute",
    category: "Fogo",
    icon: <Flame className="h-5 w-5" />,
    exposure: 70,
    vulnerability: 80,
    impact: 95,
    riskScore: 82,
    territories: ["Área de Conservação", "Buffer Zone"],
    assets: ["Infraestrutura de Apoio", "Linhas de Transmissão"],
    financialImpact: { min: 20, max: 60 },
    trend: "increasing",
    description: "Risco de incêndios em áreas de vegetação próximas às operações"
  },
  {
    id: "5",
    name: "Deslizamentos de Terra",
    type: "acute",
    category: "Movimentos de Massa",
    icon: <Mountain className="h-5 w-5" />,
    exposure: 55,
    vulnerability: 75,
    impact: 85,
    riskScore: 72,
    territories: ["Mina Carajás", "Acesso Norte"],
    assets: ["Via de Acesso", "Taludes"],
    financialImpact: { min: 10, max: 35 },
    trend: "stable",
    description: "Movimentação de massa em áreas de declive após eventos de chuva"
  }
];

const chronicRisks: PhysicalRisk[] = [
  {
    id: "6",
    name: "Aumento da Temperatura Média",
    type: "chronic",
    category: "Mudança Climática",
    icon: <ThermometerSun className="h-5 w-5" />,
    exposure: 90,
    vulnerability: 65,
    impact: 70,
    riskScore: 75,
    territories: ["Todas as operações"],
    assets: ["Equipamentos de Climatização", "Processos Térmicos"],
    financialImpact: { min: 12, max: 40 },
    trend: "increasing",
    description: "Aumento gradual da temperatura média afetando eficiência operacional"
  },
  {
    id: "7",
    name: "Escassez Hídrica Estrutural",
    type: "chronic",
    category: "Recursos Hídricos",
    icon: <Droplets className="h-5 w-5" />,
    exposure: 95,
    vulnerability: 85,
    impact: 90,
    riskScore: 90,
    territories: ["Planta Industrial MG", "Mina Norte"],
    assets: ["Sistema de Resfriamento", "Processo Produtivo", "Reservatórios"],
    financialImpact: { min: 25, max: 80 },
    trend: "increasing",
    description: "Redução da disponibilidade hídrica para operações industriais"
  },
  {
    id: "8",
    name: "Mudança no Regime de Chuvas",
    type: "chronic",
    category: "Padrões Climáticos",
    icon: <CloudRain className="h-5 w-5" />,
    exposure: 80,
    vulnerability: 60,
    impact: 65,
    riskScore: 68,
    territories: ["Área Agrícola", "Bacias Hidrográficas"],
    assets: ["Sistemas de Drenagem", "Reservatórios"],
    financialImpact: { min: 10, max: 30 },
    trend: "increasing",
    description: "Alteração dos padrões sazonais de precipitação"
  },
  {
    id: "9",
    name: "Elevação do Nível do Mar",
    type: "chronic",
    category: "Oceanos",
    icon: <Droplets className="h-5 w-5" />,
    exposure: 70,
    vulnerability: 90,
    impact: 95,
    riskScore: 85,
    territories: ["Terminal Portuário SP", "Área Costeira Sul"],
    assets: ["Infraestrutura Portuária", "Armazéns Costeiros"],
    financialImpact: { min: 50, max: 150 },
    trend: "increasing",
    description: "Aumento gradual do nível do mar ameaçando infraestrutura costeira"
  }
];

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

const getTrendIcon = (trend: string) => {
  if (trend === "increasing") return <TrendingUp className="h-3 w-3 text-destructive" />;
  if (trend === "decreasing") return <TrendingUp className="h-3 w-3 text-success rotate-180" />;
  return <span className="h-3 w-3 text-muted-foreground">→</span>;
};

const RiskCard = ({ risk }: { risk: PhysicalRisk }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${getRiskBgColor(risk.riskScore)}`}>
            <span className={getRiskColor(risk.riskScore)}>{risk.icon}</span>
          </div>
          <div>
            <h4 className="font-medium text-sm">{risk.name}</h4>
            <p className="text-xs text-muted-foreground">{risk.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {getTrendIcon(risk.trend)}
          <Badge className={getRiskBgColor(risk.riskScore) + " " + getRiskColor(risk.riskScore)}>
            {getRiskLabel(risk.riskScore)}
          </Badge>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-4">{risk.description}</p>

      {/* Risk Score Breakdown */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Exposição</span>
          <span className="font-medium">{risk.exposure}%</span>
        </div>
        <Progress value={risk.exposure} className="h-1.5" />

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Vulnerabilidade</span>
          <span className="font-medium">{risk.vulnerability}%</span>
        </div>
        <Progress value={risk.vulnerability} className="h-1.5" />

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Impacto</span>
          <span className="font-medium">{risk.impact}%</span>
        </div>
        <Progress value={risk.impact} className="h-1.5" />
      </div>

      {/* Territories & Assets */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <span>{risk.territories.length} territórios</span>
        </div>
        <div className="flex items-center gap-1">
          <Building className="h-3 w-3" />
          <span>{risk.assets.length} ativos</span>
        </div>
      </div>

      {/* Financial Impact */}
      <div className="p-2 bg-secondary/50 rounded-lg">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Impacto Financeiro Estimado</span>
          <span className="font-semibold">
            R$ {risk.financialImpact.min}M - {risk.financialImpact.max}M
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
);

export function PhysicalRisksPanel() {
  const allRisks = [...acuteRisks, ...chronicRisks];
  const criticalCount = allRisks.filter(r => r.riskScore >= 80).length;
  const highCount = allRisks.filter(r => r.riskScore >= 60 && r.riskScore < 80).length;
  const avgScore = Math.round(allRisks.reduce((acc, r) => acc + r.riskScore, 0) / allRisks.length);
  const totalFinancialMax = allRisks.reduce((acc, r) => acc + r.financialImpact.max, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Riscos Críticos</p>
                <p className="text-2xl font-bold">{criticalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Shield className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Riscos Altos</p>
                <p className="text-2xl font-bold">{highCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-info/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Score Médio</p>
                <p className="text-2xl font-bold">{avgScore}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <span className="text-primary font-bold text-sm">R$</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Impacto Máximo</p>
                <p className="text-2xl font-bold">R$ {totalFinancialMax}M</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment Formula */}
      <Card className="bg-secondary/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="font-medium">Risco Físico</span>
            <span>=</span>
            <Badge variant="outline">Exposição</Badge>
            <span>×</span>
            <Badge variant="outline">Vulnerabilidade</Badge>
            <span>×</span>
            <Badge variant="outline">Impacto</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Acute vs Chronic */}
      <Tabs defaultValue="acute" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="acute" className="flex items-center gap-2">
            <Flame className="h-4 w-4" />
            Riscos Agudos ({acuteRisks.length})
          </TabsTrigger>
          <TabsTrigger value="chronic" className="flex items-center gap-2">
            <ThermometerSun className="h-4 w-4" />
            Riscos Crônicos ({chronicRisks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="acute" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Flame className="h-5 w-5 text-destructive" />
                Riscos Físicos Agudos
              </CardTitle>
              <CardDescription>
                Eventos climáticos extremos com impacto imediato nas operações
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {acuteRisks.map(risk => (
              <RiskCard key={risk.id} risk={risk} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chronic" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <ThermometerSun className="h-5 w-5 text-warning" />
                Riscos Físicos Crônicos
              </CardTitle>
              <CardDescription>
                Mudanças climáticas graduais com impacto de longo prazo
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chronicRisks.map(risk => (
              <RiskCard key={risk.id} risk={risk} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
