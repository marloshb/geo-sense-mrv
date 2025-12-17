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
  Droplets,
  Scale,
  TrendingUp,
  TrendingDown,
  Target,
  Shield,
  Clock,
  CheckCircle2,
  Building,
  MapPin,
  Calendar,
  Printer,
  Brain,
  ArrowRight,
  DollarSign,
  Users
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

// Executive Summary Data
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
  mitigatedRisks: 5,
  monitoredRisks: 16,
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
    physicalRisk: "Crítico",
    transitionRisk: "Médio",
    impact: "R$ 80-200M",
    probability: 40
  },
  { 
    name: "Transição Ordenada", 
    temperature: "+2.0°C", 
    physicalRisk: "Médio",
    transitionRisk: "Alto",
    impact: "R$ 50-120M",
    probability: 35
  },
  { 
    name: "Transição Acelerada", 
    temperature: "+1.5°C", 
    physicalRisk: "Baixo",
    transitionRisk: "Crítico",
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

const getRiskColor = (score: number) => {
  if (score >= 80) return "text-destructive";
  if (score >= 60) return "text-warning";
  if (score >= 40) return "text-info";
  return "text-success";
};

const getRiskBg = (score: number) => {
  if (score >= 80) return "bg-destructive/10";
  if (score >= 60) return "bg-warning/10";
  if (score >= 40) return "bg-info/10";
  return "bg-success/10";
};

const getSeverityBadge = (severity: string) => {
  switch (severity) {
    case "critical": return <Badge className="bg-destructive/10 text-destructive">Crítico</Badge>;
    case "high": return <Badge className="bg-warning/10 text-warning">Alto</Badge>;
    case "medium": return <Badge className="bg-info/10 text-info">Médio</Badge>;
    default: return <Badge className="bg-success/10 text-success">Baixo</Badge>;
  }
};

const getComplianceBadge = (status: string) => {
  switch (status) {
    case "compliant": return <Badge className="bg-success/10 text-success">Conforme</Badge>;
    case "partial": return <Badge className="bg-warning/10 text-warning">Parcial</Badge>;
    default: return <Badge className="bg-destructive/10 text-destructive">Não Conforme</Badge>;
  }
};

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

      // Add multiple pages if content is long
      const pageHeight = pdfHeight - 20;
      const scaledHeight = imgHeight * ratio;
      let heightLeft = scaledHeight;
      let position = imgY;
      let page = 1;

      pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, scaledHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - scaledHeight + imgY;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, scaledHeight);
        heightLeft -= pageHeight;
        page++;
      }

      // Add header to first page
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
      {/* Export Actions */}
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

      {/* Dashboard Content - This is what gets exported */}
      <div ref={dashboardRef} className="space-y-6 bg-background p-6 rounded-lg">
        {/* Report Header */}
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

        {/* Executive Summary KPIs */}
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
                    <TrendingDown className="h-5 w-5 text-info" />
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

        {/* Risk Overview - Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Physical Risks */}
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

          {/* Transition Risks */}
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

        {/* Scenario Analysis */}
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
                    {getSeverityBadge(scenario.physicalRisk.toLowerCase())}
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Risco Transição</span>
                    {getSeverityBadge(scenario.transitionRisk.toLowerCase())}
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

        {/* Territories at Risk */}
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
                  <p className="text-xs text-muted-foreground mb-1">{territory.risks} riscos identificados</p>
                  <p className="text-xs"><span className="font-medium">Principal:</span> {territory.mainRisk}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        {/* Action Plans Status */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Status dos Planos de Ação
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Planos de Ação</span>
                  <span className="font-bold">{actionPlansStatus.total}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <p className="text-lg font-bold text-success">{actionPlansStatus.completed}</p>
                    <p className="text-xs text-muted-foreground">Concluídos</p>
                  </div>
                  <div className="p-2 bg-info/10 rounded-lg">
                    <p className="text-lg font-bold text-info">{actionPlansStatus.inProgress}</p>
                    <p className="text-xs text-muted-foreground">Em Andamento</p>
                  </div>
                  <div className="p-2 bg-destructive/10 rounded-lg">
                    <p className="text-lg font-bold text-destructive">{actionPlansStatus.delayed}</p>
                    <p className="text-xs text-muted-foreground">Atrasados</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Execução Orçamentária</span>
                  <span className="font-bold">
                    {Math.round((actionPlansStatus.executedBudget / actionPlansStatus.totalBudget) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={(actionPlansStatus.executedBudget / actionPlansStatus.totalBudget) * 100} 
                  className="h-3" 
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Executado: R$ {(actionPlansStatus.executedBudget / 1000000).toFixed(1)}M</span>
                  <span>Total: R$ {(actionPlansStatus.totalBudget / 1000000).toFixed(1)}M</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        {/* IFRS S2 Compliance */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Conformidade IFRS S2
          </h3>
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ifrsS2Compliance.map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between p-3 bg-secondary/30 rounded-lg">
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

        {/* AI Recommendations */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Recomendações Estratégicas (IA)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2 p-3 bg-background rounded-lg">
              <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Priorizar mitigação de escassez hídrica</p>
                <p className="text-xs text-muted-foreground">
                  Maior relação impacto/probabilidade no curto prazo. Acelerar Sistema de Gestão Hídrica.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-background rounded-lg">
              <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Antecipar estratégia de carbono</p>
                <p className="text-xs text-muted-foreground">
                  Regulação de carbono em tramitação com 75% de probabilidade de aprovação em 2024.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-background rounded-lg">
              <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Investir em adaptação costeira</p>
                <p className="text-xs text-muted-foreground">
                  Terminal Portuário SP é hotspot crítico. Proteção de infraestrutura é urgente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pt-4 border-t">
          <p>Este relatório foi preparado em conformidade com IFRS S2 - Climate-related Disclosures</p>
          <p>© {new Date().getFullYear()} {executiveSummary.organization} - Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  );
}
