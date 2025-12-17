import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Sparkles, 
  AlertTriangle,
  TrendingUp,
  Target,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  MapPin,
  Clock,
  CheckCircle2
} from "lucide-react";

interface AIInsight {
  id: string;
  type: "hotspot" | "priority" | "mitigation" | "narrative" | "alert";
  title: string;
  content: string;
  severity: "info" | "warning" | "critical";
  relatedRisks: string[];
  relatedTerritories: string[];
  recommendation: string;
  confidence: number;
  timestamp: string;
}

const aiInsights: AIInsight[] = [
  {
    id: "1",
    type: "hotspot",
    title: "Hotspot de Risco Identificado: Terminal Portuário SP",
    content: "A análise espacial identificou o Terminal Portuário SP como área de concentração crítica de riscos. A combinação de exposição à elevação do nível do mar, eventos de tempestade e dependência operacional cria um cenário de vulnerabilidade sistêmica.",
    severity: "critical",
    relatedRisks: ["Elevação do Nível do Mar", "Tempestades Costeiras", "Interrupção Operacional"],
    relatedTerritories: ["Terminal Portuário SP", "Área Costeira Sul"],
    recommendation: "Priorizar investimentos em infraestrutura de proteção costeira e desenvolver plano de contingência operacional para eventos extremos.",
    confidence: 92,
    timestamp: "2024-03-15T10:30:00"
  },
  {
    id: "2",
    type: "priority",
    title: "Priorização de Riscos: Escassez Hídrica Requer Ação Imediata",
    content: "Com base na análise de cenários e projeções climáticas, o risco de escassez hídrica na Planta Industrial MG apresenta a maior relação impacto/probabilidade no curto prazo. A região já apresenta sinais de estresse hídrico e a tendência é de agravamento.",
    severity: "critical",
    relatedRisks: ["Escassez Hídrica Estrutural", "Estresse Hídrico Operacional"],
    relatedTerritories: ["Planta Industrial MG"],
    recommendation: "Acelerar implementação do Sistema de Gestão Hídrica e avaliar fontes alternativas de água.",
    confidence: 88,
    timestamp: "2024-03-14T14:15:00"
  },
  {
    id: "3",
    type: "mitigation",
    title: "Sugestão de Mitigação: Diversificação Energética",
    content: "A análise de riscos de transição indica alta exposição à volatilidade de preços de energia e à precificação de carbono. A diversificação da matriz energética com fontes renováveis reduziria simultaneamente múltiplos riscos.",
    severity: "warning",
    relatedRisks: ["Volatilidade de Preços de Energia", "Precificação de Carbono"],
    relatedTerritories: ["Todas as operações"],
    recommendation: "Desenvolver roadmap de transição energética com metas intermediárias para 2025, 2030 e 2035.",
    confidence: 85,
    timestamp: "2024-03-13T09:45:00"
  },
  {
    id: "4",
    type: "narrative",
    title: "Narrativa Executiva: Exposição Consolidada ao Risco Climático",
    content: "A organização apresenta exposição material a riscos climáticos físicos e de transição. No cenário de transição ordenada, o impacto financeiro consolidado é estimado entre R$ 80M e R$ 180M em 10 anos. Os principais drivers são: (1) precificação de carbono, (2) escassez hídrica, e (3) eventos climáticos extremos em áreas costeiras.",
    severity: "info",
    relatedRisks: ["Todos os riscos mapeados"],
    relatedTerritories: ["Consolidado"],
    recommendation: "Apresentar análise ao Conselho de Administração e integrar riscos climáticos ao planejamento estratégico.",
    confidence: 90,
    timestamp: "2024-03-12T16:00:00"
  },
  {
    id: "5",
    type: "alert",
    title: "Alerta Estratégico: Regulação de Carbono em Tramitação",
    content: "Monitoramento identificou avanço na tramitação do PL de Mercado de Carbono no Senado. Probabilidade de aprovação em 2024 aumentou para 75%. Impacto estimado: aumento de R$ 15-25M/ano em custos operacionais a partir de 2025.",
    severity: "warning",
    relatedRisks: ["Precificação de Carbono", "Requisitos Regulatórios"],
    relatedTerritories: ["Todas as operações"],
    recommendation: "Antecipar estratégia de compliance e avaliar oportunidades de créditos de carbono.",
    confidence: 78,
    timestamp: "2024-03-11T11:20:00"
  },
  {
    id: "6",
    type: "hotspot",
    title: "Detecção de Anomalia: Aumento de Eventos Extremos na Mina Norte",
    content: "Análise de séries temporais detectou aumento de 40% na frequência de eventos de precipitação extrema na região da Mina Norte nos últimos 3 anos comparado à média histórica. Padrão consistente com projeções de mudança climática para a região.",
    severity: "warning",
    relatedRisks: ["Chuvas Intensas e Enchentes", "Deslizamentos de Terra"],
    relatedTerritories: ["Mina Norte", "Área de Influência"],
    recommendation: "Revisar protocolos de segurança e sistema de alerta precoce. Avaliar necessidade de obras de contenção.",
    confidence: 82,
    timestamp: "2024-03-10T08:30:00"
  }
];

const getTypeIcon = (type: AIInsight["type"]) => {
  switch (type) {
    case "hotspot": return <MapPin className="h-4 w-4" />;
    case "priority": return <Target className="h-4 w-4" />;
    case "mitigation": return <Lightbulb className="h-4 w-4" />;
    case "narrative": return <TrendingUp className="h-4 w-4" />;
    case "alert": return <AlertTriangle className="h-4 w-4" />;
    default: return <Sparkles className="h-4 w-4" />;
  }
};

const getTypeLabel = (type: AIInsight["type"]) => {
  switch (type) {
    case "hotspot": return "Hotspot";
    case "priority": return "Priorização";
    case "mitigation": return "Mitigação";
    case "narrative": return "Narrativa";
    case "alert": return "Alerta";
    default: return type;
  }
};

const getSeverityColor = (severity: AIInsight["severity"]) => {
  switch (severity) {
    case "critical": return "bg-destructive/10 text-destructive border-destructive/30";
    case "warning": return "bg-warning/10 text-warning border-warning/30";
    case "info": return "bg-info/10 text-info border-info/30";
    default: return "bg-muted text-muted-foreground";
  }
};

const InsightCard = ({ insight }: { insight: AIInsight }) => (
  <Card className={`border-l-4 ${getSeverityColor(insight.severity).split(' ')[2]}`}>
    <CardHeader className="pb-2">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded ${getSeverityColor(insight.severity).split(' ').slice(0, 2).join(' ')}`}>
            {getTypeIcon(insight.type)}
          </div>
          <div>
            <Badge variant="outline" className="text-xs mb-1">
              {getTypeLabel(insight.type)}
            </Badge>
            <CardTitle className="text-sm">{insight.title}</CardTitle>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Brain className="h-3 w-3" />
          <span>{insight.confidence}%</span>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      <p className="text-sm text-muted-foreground">{insight.content}</p>

      {/* Recommendation */}
      <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-primary mb-1">Recomendação</p>
            <p className="text-xs">{insight.recommendation}</p>
          </div>
        </div>
      </div>

      {/* Related Items */}
      <div className="flex flex-wrap gap-2">
        <div className="flex-1 min-w-[120px]">
          <p className="text-xs text-muted-foreground mb-1">Riscos Relacionados</p>
          <div className="flex flex-wrap gap-1">
            {insight.relatedRisks.slice(0, 2).map((risk, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {risk}
              </Badge>
            ))}
            {insight.relatedRisks.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{insight.relatedRisks.length - 2}
              </Badge>
            )}
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Territórios</p>
          <div className="flex items-center gap-1 text-xs">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span>{insight.relatedTerritories.length}</span>
          </div>
        </div>
      </div>

      {/* Timestamp */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>{new Date(insight.timestamp).toLocaleString('pt-BR')}</span>
      </div>
    </CardContent>
  </Card>
);

export function ClimateRiskAIPanel() {
  const criticalInsights = aiInsights.filter(i => i.severity === "critical").length;
  const warningInsights = aiInsights.filter(i => i.severity === "warning").length;
  const avgConfidence = Math.round(aiInsights.reduce((acc, i) => acc + i.confidence, 0) / aiInsights.length);

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  Inteligência Artificial para Riscos Climáticos
                  <Sparkles className="h-4 w-4 text-primary" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  Análise automatizada de hotspots, priorização, mitigação e alertas estratégicos
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar Análise
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Alertas Críticos</p>
                <p className="text-2xl font-bold">{criticalInsights}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Lightbulb className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Recomendações</p>
                <p className="text-2xl font-bold">{warningInsights}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-info/10 rounded-lg">
                <Sparkles className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total de Insights</p>
                <p className="text-2xl font-bold">{aiInsights.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Brain className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Confiança Média</p>
                <p className="text-2xl font-bold">{avgConfidence}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Capabilities */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Capacidades de IA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="p-3 bg-secondary/50 rounded-lg text-center">
              <MapPin className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-xs font-medium">Detecção de Hotspots</p>
            </div>
            <div className="p-3 bg-secondary/50 rounded-lg text-center">
              <Target className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-xs font-medium">Priorização Automática</p>
            </div>
            <div className="p-3 bg-secondary/50 rounded-lg text-center">
              <Lightbulb className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-xs font-medium">Sugestão de Mitigação</p>
            </div>
            <div className="p-3 bg-secondary/50 rounded-lg text-center">
              <TrendingUp className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-xs font-medium">Narrativas Executivas</p>
            </div>
            <div className="p-3 bg-secondary/50 rounded-lg text-center">
              <AlertTriangle className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-xs font-medium">Alertas Estratégicos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights List */}
      <div>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Insights Gerados por IA
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {aiInsights.map(insight => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>
    </div>
  );
}
