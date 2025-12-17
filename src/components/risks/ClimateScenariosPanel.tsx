import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  Target, 
  TrendingUp,
  ThermometerSun,
  Droplets,
  Scale,
  AlertTriangle,
  ArrowRight,
  Calendar
} from "lucide-react";

interface Scenario {
  id: string;
  name: string;
  description: string;
  temperature: string;
  probability: number;
  physicalRiskLevel: "low" | "medium" | "high" | "critical";
  transitionRiskLevel: "low" | "medium" | "high" | "critical";
  financialImpact: { min: number; max: number };
  keyAssumptions: string[];
  color: string;
}

interface TimeHorizon {
  id: string;
  name: string;
  years: string;
  description: string;
  keyRisks: string[];
  actions: string[];
  color: string;
}

const scenarios: Scenario[] = [
  {
    id: "current",
    name: "Tendência Atual",
    description: "Continuação das políticas atuais sem ações adicionais significativas",
    temperature: "+3.0°C - 3.5°C",
    probability: 40,
    physicalRiskLevel: "critical",
    transitionRiskLevel: "medium",
    financialImpact: { min: 80, max: 200 },
    keyAssumptions: [
      "Políticas climáticas permanecem insuficientes",
      "Aumento gradual de eventos extremos",
      "Transição lenta para economia de baixo carbono"
    ],
    color: "destructive"
  },
  {
    id: "transition",
    name: "Transição Ordenada",
    description: "Implementação gradual de políticas climáticas alinhadas ao Acordo de Paris",
    temperature: "+1.5°C - 2.0°C",
    probability: 35,
    physicalRiskLevel: "medium",
    transitionRiskLevel: "high",
    financialImpact: { min: 50, max: 120 },
    keyAssumptions: [
      "Precificação de carbono ampliada globalmente",
      "Investimentos significativos em tecnologias limpas",
      "Regulação climática progressiva"
    ],
    color: "warning"
  },
  {
    id: "accelerated",
    name: "Transição Acelerada",
    description: "Ação climática agressiva com mudanças disruptivas no curto prazo",
    temperature: "+1.5°C",
    probability: 25,
    physicalRiskLevel: "low",
    transitionRiskLevel: "critical",
    financialImpact: { min: 70, max: 180 },
    keyAssumptions: [
      "Proibição rápida de combustíveis fósseis",
      "Preço de carbono acima de $150/tCO2",
      "Stranded assets em larga escala"
    ],
    color: "info"
  }
];

const timeHorizons: TimeHorizon[] = [
  {
    id: "short",
    name: "Curto Prazo",
    years: "0-3 anos",
    description: "Foco em compliance regulatório imediato e gestão de riscos existentes",
    keyRisks: [
      "Precificação de carbono iminente",
      "Requisitos IFRS S2",
      "Eventos climáticos extremos",
      "Pressão de investidores ESG"
    ],
    actions: [
      "Inventário de emissões atualizado",
      "Plano de disclosure climático",
      "Mapeamento de exposição física",
      "Quick wins de eficiência"
    ],
    color: "destructive"
  },
  {
    id: "medium",
    name: "Médio Prazo",
    years: "3-10 anos",
    description: "Implementação de estratégia de descarbonização e adaptação",
    keyRisks: [
      "Obsolescência tecnológica",
      "Mudança na demanda de mercado",
      "Escassez hídrica estrutural",
      "Aumento do custo de capital"
    ],
    actions: [
      "Roadmap de descarbonização",
      "Investimentos em tecnologias limpas",
      "Diversificação de fornecedores",
      "Adaptação de infraestrutura"
    ],
    color: "warning"
  },
  {
    id: "long",
    name: "Longo Prazo",
    years: "10-30 anos",
    description: "Transformação do modelo de negócio e resiliência climática",
    keyRisks: [
      "Mudanças climáticas permanentes",
      "Transformação setorial profunda",
      "Novos padrões de consumo",
      "Realocação de ativos"
    ],
    actions: [
      "Net Zero até 2050",
      "Modelo de negócio circular",
      "Infraestrutura resiliente",
      "Inovação em produtos/serviços"
    ],
    color: "info"
  }
];

const getRiskLevelBadge = (level: string) => {
  switch (level) {
    case "critical":
      return <Badge className="bg-destructive/10 text-destructive">Crítico</Badge>;
    case "high":
      return <Badge className="bg-warning/10 text-warning">Alto</Badge>;
    case "medium":
      return <Badge className="bg-info/10 text-info">Médio</Badge>;
    case "low":
      return <Badge className="bg-success/10 text-success">Baixo</Badge>;
    default:
      return null;
  }
};

const ScenarioCard = ({ scenario }: { scenario: Scenario }) => (
  <Card className={`border-${scenario.color}/30`}>
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div>
          <CardTitle className="text-lg">{scenario.name}</CardTitle>
          <CardDescription className="mt-1">{scenario.description}</CardDescription>
        </div>
        <Badge variant="outline" className="text-xs">
          {scenario.probability}% probabilidade
        </Badge>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {/* Temperature */}
      <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
        <ThermometerSun className="h-5 w-5 text-destructive" />
        <div>
          <p className="text-xs text-muted-foreground">Aquecimento Projetado</p>
          <p className="font-bold">{scenario.temperature}</p>
        </div>
      </div>

      {/* Risk Levels */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-secondary/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-muted-foreground">Risco Físico</span>
          </div>
          {getRiskLevelBadge(scenario.physicalRiskLevel)}
        </div>
        <div className="p-3 bg-secondary/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="h-4 w-4 text-purple-500" />
            <span className="text-xs text-muted-foreground">Risco Transição</span>
          </div>
          {getRiskLevelBadge(scenario.transitionRiskLevel)}
        </div>
      </div>

      {/* Financial Impact */}
      <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Impacto Financeiro</span>
          <span className="font-bold">
            R$ {scenario.financialImpact.min}M - {scenario.financialImpact.max}M
          </span>
        </div>
      </div>

      {/* Key Assumptions */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Premissas-Chave</p>
        <ul className="space-y-1">
          {scenario.keyAssumptions.map((assumption, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs">
              <ArrowRight className="h-3 w-3 mt-0.5 text-muted-foreground flex-shrink-0" />
              <span>{assumption}</span>
            </li>
          ))}
        </ul>
      </div>
    </CardContent>
  </Card>
);

const TimeHorizonCard = ({ horizon }: { horizon: TimeHorizon }) => (
  <Card>
    <CardHeader className="pb-3">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-${horizon.color}/10`}>
          <Clock className={`h-5 w-5 text-${horizon.color}`} />
        </div>
        <div>
          <CardTitle className="text-lg">{horizon.name}</CardTitle>
          <CardDescription>{horizon.years}</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <p className="text-sm text-muted-foreground">{horizon.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Key Risks */}
        <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium">Riscos Principais</span>
          </div>
          <ul className="space-y-1">
            {horizon.keyRisks.map((risk, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs">
                <span className="text-destructive">•</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Key Actions */}
        <div className="p-3 bg-success/5 border border-success/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-success" />
            <span className="text-sm font-medium">Ações Prioritárias</span>
          </div>
          <ul className="space-y-1">
            {horizon.actions.map((action, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs">
                <span className="text-success">•</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </CardContent>
  </Card>
);

export function ClimateScenariosPanel() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Análise de Cenários Climáticos</h3>
              <p className="text-sm text-muted-foreground">
                Avaliação de riscos sob diferentes horizontes temporais e cenários de aquecimento global
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="scenarios" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scenarios" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Cenários Climáticos
          </TabsTrigger>
          <TabsTrigger value="horizons" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Horizontes Temporais
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Cenários de Aquecimento Global</CardTitle>
              <CardDescription>
                Baseados em projeções do IPCC e análise de materialidade
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {scenarios.map(scenario => (
              <ScenarioCard key={scenario.id} scenario={scenario} />
            ))}
          </div>

          {/* Scenario Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Comparativo de Cenários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scenarios.map(scenario => (
                  <div key={scenario.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{scenario.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {scenario.temperature}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Risco Físico</span>
                          <span>{scenario.physicalRiskLevel === "critical" ? "95%" : scenario.physicalRiskLevel === "high" ? "70%" : scenario.physicalRiskLevel === "medium" ? "45%" : "20%"}</span>
                        </div>
                        <Progress 
                          value={scenario.physicalRiskLevel === "critical" ? 95 : scenario.physicalRiskLevel === "high" ? 70 : scenario.physicalRiskLevel === "medium" ? 45 : 20} 
                          className="h-2" 
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Risco Transição</span>
                          <span>{scenario.transitionRiskLevel === "critical" ? "95%" : scenario.transitionRiskLevel === "high" ? "70%" : scenario.transitionRiskLevel === "medium" ? "45%" : "20%"}</span>
                        </div>
                        <Progress 
                          value={scenario.transitionRiskLevel === "critical" ? 95 : scenario.transitionRiskLevel === "high" ? 70 : scenario.transitionRiskLevel === "medium" ? 45 : 20} 
                          className="h-2" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="horizons" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Horizontes Temporais de Análise</CardTitle>
              <CardDescription>
                Priorização de riscos e ações por período de materialização
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="space-y-4">
            {timeHorizons.map(horizon => (
              <TimeHorizonCard key={horizon.id} horizon={horizon} />
            ))}
          </div>

          {/* Timeline Visual */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Linha do Tempo de Riscos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                
                <div className="space-y-6">
                  {timeHorizons.map((horizon, idx) => (
                    <div key={horizon.id} className="relative pl-10">
                      <div className={`absolute left-2 w-4 h-4 rounded-full bg-${horizon.color} border-2 border-background`} />
                      <div className="p-3 bg-secondary/30 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{horizon.name}</span>
                          <Badge variant="outline">{horizon.years}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {horizon.keyRisks.length} riscos principais identificados
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
