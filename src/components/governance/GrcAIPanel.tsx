import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Sparkles, AlertTriangle, TrendingUp, Lightbulb, RefreshCw, Send, FileText, Target } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AIInsight {
  id: string;
  type: "priority" | "mitigation" | "alert" | "recommendation";
  title: string;
  content: string;
  severity: "high" | "medium" | "low";
  relatedRisks: string[];
  actionItems: string[];
  generatedAt: string;
}

const mockInsights: AIInsight[] = [
  {
    id: "1",
    type: "priority",
    title: "Risco de Inundação requer atenção imediata",
    content: "O território Mina Norte apresenta alta probabilidade de inundação nos próximos 6 meses. A combinação de eventos climáticos previstos e a exposição de ativos críticos sugere priorização de medidas preventivas.",
    severity: "high",
    relatedRisks: ["Inundações em Áreas Operacionais"],
    actionItems: ["Revisar plano de contingência", "Verificar seguros de ativos", "Comunicar operações"],
    generatedAt: "2024-12-16 10:30"
  },
  {
    id: "2",
    type: "mitigation",
    title: "Estratégia de mitigação para riscos de transição",
    content: "A precificação de carbono prevista para 2025 pode impactar significativamente os custos operacionais. Recomenda-se acelerar projetos de eficiência energética e avaliar alternativas de combustível.",
    severity: "high",
    relatedRisks: ["Regulação de Carbono"],
    actionItems: ["Mapear projetos de eficiência", "Avaliar PPAs de energia renovável", "Atualizar projeções financeiras"],
    generatedAt: "2024-12-16 09:15"
  },
  {
    id: "3",
    type: "alert",
    title: "Inconsistência detectada em dados de emissões",
    content: "Os dados de emissões do território Planta Industrial Sul apresentam variação atípica em relação ao histórico. Sugere-se verificação dos fatores de emissão e dados de atividade.",
    severity: "medium",
    relatedRisks: ["Emissões de GEE"],
    actionItems: ["Revisar cálculos", "Verificar dados de entrada", "Documentar justificativa"],
    generatedAt: "2024-12-16 08:00"
  },
  {
    id: "4",
    type: "recommendation",
    title: "Oportunidade de melhoria em governança",
    content: "A formalização de um comitê de sustentabilidade com reuniões regulares pode melhorar a supervisão de riscos climáticos e atender requisitos do IFRS S2.",
    severity: "medium",
    relatedRisks: ["Governança Climática"],
    actionItems: ["Definir estrutura do comitê", "Estabelecer agenda de reuniões", "Documentar atribuições"],
    generatedAt: "2024-12-15 16:00"
  }
];

export function GrcAIPanel() {
  const [insights, setInsights] = useState<AIInsight[]>(mockInsights);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisType, setAnalysisType] = useState("comprehensive");
  const [customPrompt, setCustomPrompt] = useState("");

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('mrv-ai-insights', {
        body: {
          type: 'risk_assessment',
          context: {
            analysisType,
            customPrompt,
            currentRisks: mockInsights.flatMap(i => i.relatedRisks)
          }
        }
      });

      if (error) throw error;

      toast.success("Análise de IA concluída!");
      // In a real implementation, we would update insights with the AI response
    } catch (error) {
      console.error('Error generating insights:', error);
      toast.error("Erro ao gerar análise. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomAnalysis = async () => {
    if (!customPrompt.trim()) {
      toast.error("Digite uma pergunta ou solicitação");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('mrv-ai-insights', {
        body: {
          type: 'risk_assessment',
          context: {
            customPrompt,
            analysisType: 'custom'
          }
        }
      });

      if (error) throw error;

      toast.success("Análise personalizada concluída!");
      setCustomPrompt("");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Erro ao processar solicitação.");
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: AIInsight["type"]) => {
    switch (type) {
      case "priority": return <Target className="h-4 w-4 text-destructive" />;
      case "mitigation": return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case "alert": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "recommendation": return <Lightbulb className="h-4 w-4 text-green-500" />;
    }
  };

  const getTypeLabel = (type: AIInsight["type"]) => {
    switch (type) {
      case "priority": return "Priorização";
      case "mitigation": return "Mitigação";
      case "alert": return "Alerta";
      case "recommendation": return "Recomendação";
    }
  };

  const highSeverityCount = insights.filter(i => i.severity === "high").length;
  const mediumSeverityCount = insights.filter(i => i.severity === "medium").length;

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Insights Gerados</p>
                <p className="text-2xl font-bold">{insights.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Alta Severidade</p>
                <p className="text-2xl font-bold">{highSeverityCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ações Sugeridas</p>
                <p className="text-2xl font-bold">
                  {insights.reduce((acc, i) => acc + i.actionItems.length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Sparkles className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Última Análise</p>
                <p className="text-2xl font-bold">10:30</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analysis Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Análise de IA
            </CardTitle>
            <CardDescription>
              Gere insights automáticos sobre riscos e governança
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Análise</label>
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comprehensive">Análise Completa</SelectItem>
                  <SelectItem value="risk_priority">Priorização de Riscos</SelectItem>
                  <SelectItem value="mitigation">Estratégias de Mitigação</SelectItem>
                  <SelectItem value="compliance">Análise de Compliance</SelectItem>
                  <SelectItem value="executive">Resumo Executivo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full" 
              onClick={handleGenerateInsights}
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Gerar Insights
            </Button>

            <div className="border-t pt-4 space-y-2">
              <label className="text-sm font-medium">Consulta Personalizada</label>
              <Textarea 
                placeholder="Ex: Quais são os principais riscos para o território Mina Norte nos próximos 2 anos?"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={3}
              />
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleCustomAnalysis}
                disabled={isLoading || !customPrompt.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar Consulta
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Insights List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Insights e Recomendações
              </CardTitle>
              <CardDescription>
                Análises automáticas baseadas em dados de riscos e métricas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.map((insight) => (
                <div 
                  key={insight.id} 
                  className={`p-4 border rounded-lg space-y-3 ${
                    insight.severity === "high" ? "border-destructive/50 bg-destructive/5" :
                    insight.severity === "medium" ? "border-yellow-500/50 bg-yellow-500/5" :
                    "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(insight.type)}
                      <Badge variant="outline">{getTypeLabel(insight.type)}</Badge>
                      <Badge 
                        variant={insight.severity === "high" ? "destructive" : insight.severity === "medium" ? "secondary" : "outline"}
                      >
                        {insight.severity === "high" ? "Alta" : insight.severity === "medium" ? "Média" : "Baixa"}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{insight.generatedAt}</span>
                  </div>

                  <div>
                    <h4 className="font-semibold">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{insight.content}</p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {insight.relatedRisks.map((risk) => (
                      <Badge key={risk} variant="outline" className="text-xs">
                        {risk}
                      </Badge>
                    ))}
                  </div>

                  <div className="border-t pt-3">
                    <p className="text-xs font-semibold mb-2">Ações Sugeridas:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {insight.actionItems.map((action, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resumo Executivo Automático
          </CardTitle>
          <CardDescription>
            Síntese gerada por IA para comunicação com o conselho
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted/50 rounded-lg space-y-4">
            <p className="text-sm">
              <strong>Visão Geral:</strong> A organização apresenta 4 riscos climáticos prioritários, 
              sendo 2 de alta severidade relacionados a riscos físicos (inundação) e de transição 
              (regulação de carbono). O território Mina Norte concentra a maior exposição a riscos físicos.
            </p>
            <p className="text-sm">
              <strong>Principais Preocupações:</strong> A precificação de carbono prevista para 2025 
              pode aumentar custos operacionais em até R$ 25 milhões anuais. Eventos climáticos 
              extremos previstos para os próximos 6 meses requerem ação preventiva imediata.
            </p>
            <p className="text-sm">
              <strong>Recomendações:</strong> Priorizar (1) revisão do plano de contingência para 
              inundações, (2) aceleração de projetos de eficiência energética, e (3) formalização 
              do comitê de sustentabilidade para atender requisitos IFRS S2.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
