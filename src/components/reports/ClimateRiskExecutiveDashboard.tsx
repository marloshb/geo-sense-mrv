import { useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  FileText,
  AlertTriangle,
  ThermometerSun,
  Scale,
  TrendingUp,
  Target,
  Shield,
  CheckCircle2,
  MapPin,
  Calendar,
  Printer,
  Brain,
  DollarSign
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

const executiveSummary = {
  reportDate: new Date().toLocaleDateString('pt-BR'),
  reportingPeriod: "2024",
  organization: "Mineração Norte S.A.",
  preparedBy: "Comitê de Riscos Climáticos",
  approvedBy: "Conselho de Administração",
  version: "1.0"
};

const keyMetrics = {
  totalRisks: 21,
  criticalRisks: 8,
  physicalRisks: 9,
  transitionRisks: 12,
  totalFinancialExposure: { min: 130, max: 485 },
  mitigationInvestment: 31.5,
  riskReductionAchieved: 23
};

const physicalRisksOverview = [
  { name: "Escassez Hídrica", score: 90, trend: "up", impact: "R$ 25-80M" },
  { name: "Inundações", score: 82, trend: "up", impact: "R$ 15-45M" },
  { name: "Incêndios Florestais", score: 82, trend: "up", impact: "R$ 20-60M" },
  { name: "Elevação Nível do Mar", score: 85, trend: "stable", impact: "R$ 50-150M" },
  { name: "Ondas de Calor", score: 67, trend: "up", impact: "R$ 8-25M" }
];

const transitionRisksOverview = [
  { name: "Precificação de Carbono", score: 90, trend: "up", impact: "R$ 30-80M" },
  { name: "Obsolescência de Ativos", score: 90, trend: "stable", impact: "R$ 40-120M" },
  { name: "CAPEX Descarbonização", score: 82, trend: "stable", impact: "R$ 50-150M" },
  { name: "Mudança Demanda", score: 80, trend: "up", impact: "R$ 25-70M" },
  { name: "Licenciamento Restritivo", score: 80, trend: "up", impact: "R$ 20-60M" }
];

const scenarioAnalysis = [
  { 
    name: "Tendência Atual", 
    temperature: "+3.0°C", 
    physicalRisk: "critical",
    transitionRisk: "medium",
    impact: "R$ 80-200M",
    probability: 40
  },
  { 
    name: "Transição Ordenada", 
    temperature: "+2.0°C", 
    physicalRisk: "medium",
    transitionRisk: "high",
    impact: "R$ 50-120M",
    probability: 35
  },
  { 
    name: "Transição Acelerada", 
    temperature: "+1.5°C", 
    physicalRisk: "low",
    transitionRisk: "critical",
    impact: "R$ 70-180M",
    probability: 25
  }
];

const actionPlansStatus = {
  total: 6,
  completed: 1,
  inProgress: 4,
  delayed: 1,
  totalBudget: 31700000,
  executedBudget: 11440000
};

const ifrsS2Compliance = [
  { requirement: "Governança de riscos climáticos", status: "compliant", details: "Comitê estabelecido" },
  { requirement: "Identificação de riscos materiais", status: "compliant", details: "21 riscos mapeados" },
  { requirement: "Análise de cenários", status: "compliant", details: "3 cenários avaliados" },
  { requirement: "Métricas e metas", status: "partial", details: "Métricas definidas, metas em revisão" },
  { requirement: "Estratégia de mitigação", status: "compliant", details: "6 planos de ação" },
  { requirement: "Impacto financeiro", status: "compliant", details: "Quantificação por cenário" }
];

const territoriesAtRisk = [
  { name: "Terminal Portuário SP", risks: 5, severity: "critical", mainRisk: "Elevação do mar" },
  { name: "Planta Industrial MG", risks: 4, severity: "critical", mainRisk: "Escassez hídrica" },
  { name: "Mina Norte", risks: 4, severity: "high", mainRisk: "Inundações" },
  { name: "Área Costeira Sul", risks: 3, severity: "high", mainRisk: "Tempestades" }
];

const aiRecommendations = [
  { title: "Prioridade #1", description: "Implementar sistema de monitoramento hídrico em tempo real na Planta MG", impact: "Redução de 35% no risco de escassez" },
  { title: "Prioridade #2", description: "Acelerar transição energética no Terminal SP", impact: "Economia de R$ 15M em taxas de carbono" },
  { title: "Prioridade #3", description: "Desenvolver plano de contingência para eventos extremos", impact: "Redução de 40% no tempo de resposta" }
];

function getRiskColor(score: number): string {
  if (score >= 80) return "text-destructive";
  if (score >= 60) return "text-warning";
  if (score >= 40) return "text-info";
  return "text-success";
}

function getSeverityBadge(severity: string) {
  const config: Record<string, { className: string; label: string }> = {
    critical: { className: "bg-destructive/10 text-destructive", label: "Crítico" },
    high: { className: "bg-warning/10 text-warning", label: "Alto" },
    medium: { className: "bg-info/10 text-info", label: "Médio" },
    low: { className: "bg-success/10 text-success", label: "Baixo" }
  };
  const { className, label } = config[severity] || config.low;
  return <Badge className={className}>{label}</Badge>;
}

function getComplianceBadge(status: string) {
  const config: Record<string, { className: string; label: string }> = {
    compliant: { className: "bg-success/10 text-success", label: "Conforme" },
    partial: { className: "bg-warning/10 text-warning", label: "Parcial" },
    "non-compliant": { className: "bg-destructive/10 text-destructive", label: "Não Conforme" }
  };
  const { className, label } = config[status] || config["non-compliant"];
  return <Badge className={className}>{label}</Badge>;
}

export function ClimateRiskExecutiveDashboard() {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    if (!dashboardRef.current) return;
    
    setIsExporting(true);
    toast.info("Gerando PDF...");

    try {
      const element = dashboardRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      const pageHeight = pdfHeight - 20;
      const scaledHeight = imgHeight * ratio;
      let heightLeft = scaledHeight;
      let position = imgY;

      pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, scaledHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - scaledHeight + imgY;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, scaledHeight);
        heightLeft -= pageHeight;
      }

      pdf.setPage(1);
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`IFRS S2 Climate Risk Report - ${executiveSummary.organization}`, 10, 5);
      pdf.text(`Generated: ${new Date().toLocaleString('pt-BR')}`, pdfWidth - 60, 5);

      pdf.save(`Relatorio_Riscos_Climaticos_IFRS_S2_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("PDF exportado com sucesso!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Erro ao exportar PDF");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Dashboard Executivo de Riscos Climáticos</h2>
          <p className="text-sm text-muted-foreground">Conforme IFRS S2 - Divulgações relacionadas ao clima</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button onClick={exportToPDF} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Exportando..." : "Exportar PDF"}
          </Button>
        </div>
      </div>

      <div ref={dashboardRef} className="space-y-6 bg-background p-6 rounded-lg">
        <div className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Relatório de Riscos Climáticos</h1>
              <p className="text-muted-foreground">IFRS S2 - Climate-related Disclosures</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{executiveSummary.organization}</p>
              <p className="text-sm text-muted-foreground">Período: {executiveSummary.reportingPeriod}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-4 text-xs text-muted-foreground">
            <div><span className="font-medium">Data:</span> {executiveSummary.reportDate}</div>
            <div><span className="font-medium">Versão:</span> {executiveSummary.version}</div>
            <div><span className="font-medium">Preparado por:</span> {executiveSummary.preparedBy}</div>
            <div><span className="font-medium">Aprovado por:</span> {executiveSummary.approvedBy}</div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Resumo Executivo
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-destructive/10 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Riscos Críticos</p>
                    <p className="text-2xl font-bold">{keyMetrics.criticalRisks}</p>
                    <p className="text-xs text-muted-foreground">de {keyMetrics.totalRisks} total</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Exposição Financeira</p>
                    <p className="text-xl font-bold">R$ {keyMetrics.totalFinancialExposure.min}-{keyMetrics.totalFinancialExposure.max}M</p>
                    <p className="text-xs text-muted-foreground">em 10 anos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <Shield className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Investimento Mitigação</p>
                    <p className="text-2xl font-bold">R$ {keyMetrics.mitigationInvestment}M</p>
                    <p className="text-xs text-muted-foreground">alocado</p>
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
                    <p className="text-xs text-muted-foreground">Redução de Risco</p>
                    <p className="text-2xl font-bold">{keyMetrics.riskReductionAchieved}%</p>
                    <p className="text-xs text-muted-foreground">alcançado</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <ThermometerSun className="h-5 w-5 text-destructive" />
                Riscos Físicos (Top 5)
              </CardTitle>
              <CardDescription>Exposição a eventos climáticos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {physicalRisksOverview.map((risk, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${getRiskColor(risk.score)}`}>{risk.score}</span>
                    <span className="text-sm">{risk.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {risk.trend === "up" && <TrendingUp className="h-3 w-3 text-destructive" />}
                    <span className="text-xs text-muted-foreground">{risk.impact}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Scale className="h-5 w-5 text-purple-500" />
                Riscos de Transição (Top 5)
              </CardTitle>
              <CardDescription>Exposição à economia de baixo carbono</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {transitionRisksOverview.map((risk, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${getRiskColor(risk.score)}`}>{risk.score}</span>
                    <span className="text-sm">{risk.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {risk.trend === "up" && <TrendingUp className="h-3 w-3 text-destructive" />}
                    <span className="text-xs text-muted-foreground">{risk.impact}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Análise de Cenários Climáticos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scenarioAnalysis.map((scenario, idx) => (
              <Card key={idx} className={idx === 0 ? "border-destructive/30" : idx === 1 ? "border-warning/30" : "border-info/30"}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{scenario.name}</CardTitle>
                    <Badge variant="outline">{scenario.probability}%</Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <ThermometerSun className="h-3 w-3" />
                    {scenario.temperature}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Risco Físico</span>
                    {getSeverityBadge(scenario.physicalRisk)}
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Risco Transição</span>
                    {getSeverityBadge(scenario.transitionRisk)}
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">Impacto Financeiro</p>
                    <p className="font-bold">{scenario.impact}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Territórios em Risco
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {territoriesAtRisk.map((territory, idx) => (
              <Card key={idx}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{territory.name}</h4>
                    {getSeverityBadge(territory.severity)}
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>{territory.risks} riscos identificados</p>
                    <p>Principal: {territory.mainRisk}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Status dos Planos de Ação
          </h3>
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{actionPlansStatus.total}</p>
                  <p className="text-xs text-muted-foreground">Total de Planos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">{actionPlansStatus.completed}</p>
                  <p className="text-xs text-muted-foreground">Concluídos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-info">{actionPlansStatus.inProgress}</p>
                  <p className="text-xs text-muted-foreground">Em Andamento</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-destructive">{actionPlansStatus.delayed}</p>
                  <p className="text-xs text-muted-foreground">Atrasados</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Execução Orçamentária</span>
                  <span>{Math.round((actionPlansStatus.executedBudget / actionPlansStatus.totalBudget) * 100)}%</span>
                </div>
                <Progress value={(actionPlansStatus.executedBudget / actionPlansStatus.totalBudget) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  R$ {(actionPlansStatus.executedBudget / 1000000).toFixed(1)}M de R$ {(actionPlansStatus.totalBudget / 1000000).toFixed(1)}M
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Conformidade IFRS S2
          </h3>
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                {ifrsS2Compliance.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{item.requirement}</p>
                      <p className="text-xs text-muted-foreground">{item.details}</p>
                    </div>
                    {getComplianceBadge(item.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Recomendações IA
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiRecommendations.map((rec, idx) => (
              <Card key={idx} className="border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary">{rec.title}</Badge>
                  </div>
                  <p className="text-sm mb-2">{rec.description}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Impacto esperado:</span> {rec.impact}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center pt-4 border-t text-xs text-muted-foreground">
          <p>Relatório gerado automaticamente pela plataforma MRV Territorial</p>
          <p>Este documento atende aos requisitos de divulgação da IFRS S2</p>
        </div>
      </div>
    </div>
  );
}
