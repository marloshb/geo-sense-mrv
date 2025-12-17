import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Download,
  Printer,
  Building2,
  Users,
  Target,
  AlertTriangle,
  TrendingUp,
  Shield,
  Leaf,
  Factory,
  Truck,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
} from "lucide-react";

// ============================================================
// SYNTHETIC DATA - IFRS S2 COMPLIANT REPORT
// ============================================================

const reportMetadata = {
  title: "Relatório de Divulgações Climáticas",
  standard: "IFRS S2 - Climate-related Disclosures",
  organization: "Mineração Norte S.A.",
  cnpj: "12.345.678/0001-90",
  sector: "Mineração e Metalurgia",
  reportingPeriod: "01/01/2024 a 31/12/2024",
  baseYear: "2019",
  publicationDate: new Date().toLocaleDateString("pt-BR"),
  version: "1.0",
  preparedBy: "Comitê de Sustentabilidade e Riscos Climáticos",
  approvedBy: "Conselho de Administração",
  auditor: "Ernst & Young Auditores Independentes S.S.",
  assuranceLevel: "Asseguração Limitada",
};

// PILAR 1: GOVERNANÇA
const governanceData = {
  boardOversight: {
    description: "O Conselho de Administração supervisiona os riscos e oportunidades climáticas por meio do Comitê de Sustentabilidade, que se reúne trimestralmente para avaliar o desempenho climático da organização.",
    meetingsPerYear: 4,
    lastMeeting: "15/11/2024",
    climateAgendaItems: 12,
  },
  committeeStructure: [
    {
      name: "Comitê de Sustentabilidade",
      chair: "Maria Silva",
      members: 5,
      frequency: "Trimestral",
      responsibilities: "Supervisão estratégica de riscos climáticos, aprovação de metas e revisão de progresso",
    },
    {
      name: "Comitê de Riscos",
      chair: "João Santos",
      members: 4,
      frequency: "Mensal",
      responsibilities: "Identificação, avaliação e monitoramento de riscos climáticos operacionais",
    },
    {
      name: "Comitê de Auditoria",
      chair: "Ana Costa",
      members: 3,
      frequency: "Trimestral",
      responsibilities: "Verificação de dados climáticos e conformidade com IFRS S2",
    },
  ],
  managementRoles: [
    { role: "CEO", name: "Carlos Oliveira", climateResponsibility: "Direção estratégica e accountability geral" },
    { role: "CFO", name: "Patricia Lima", climateResponsibility: "Alocação de recursos e impacto financeiro" },
    { role: "CSO (Sustentabilidade)", name: "Roberto Mendes", climateResponsibility: "Implementação da estratégia climática" },
    { role: "CRO (Riscos)", name: "Fernanda Souza", climateResponsibility: "Gestão integrada de riscos climáticos" },
  ],
  executiveCompensation: {
    linkedToClimate: true,
    percentage: 15,
    metrics: ["Redução de emissões (Escopo 1+2)", "Implementação de planos de mitigação", "Cumprimento de metas de eficiência energética"],
  },
  skillsAndTraining: {
    boardMembersWithClimateExpertise: 3,
    trainingHoursPerYear: 24,
    lastTrainingDate: "10/09/2024",
    trainingTopics: ["Cenários climáticos IPCC", "Regulamentação de carbono", "Riscos físicos e de transição"],
  },
};

// PILAR 2: ESTRATÉGIA
const strategyData = {
  businessModelImpacts: {
    shortTerm: {
      horizon: "0-2 anos",
      risks: [
        "Aumento de custos operacionais com precificação de carbono",
        "Interrupções na cadeia de suprimentos por eventos climáticos extremos",
      ],
      opportunities: [
        "Eficiência energética gerando economia de R$ 12M/ano",
        "Posicionamento em mercado de commodities de baixo carbono",
      ],
    },
    mediumTerm: {
      horizon: "2-5 anos",
      risks: [
        "Necessidade de CAPEX para descarbonização (R$ 150-200M)",
        "Mudança regulatória com restrições de licenciamento",
      ],
      opportunities: [
        "Acesso a green bonds com taxas preferenciais",
        "Novos contratos com clientes que exigem supply chain sustentável",
      ],
    },
    longTerm: {
      horizon: "5-10+ anos",
      risks: [
        "Obsolescência de ativos intensivos em carbono",
        "Escassez hídrica crônica em regiões operacionais",
      ],
      opportunities: [
        "Liderança em mineração sustentável",
        "Expansão para mercado de minerais críticos para transição energética",
      ],
    },
  },
  transitionPlan: {
    targetYear: 2050,
    netZeroCommitment: true,
    intermediateTargets: [
      { year: 2025, target: "Redução de 15% em Escopo 1+2 vs. 2019" },
      { year: 2030, target: "Redução de 42% em Escopo 1+2 vs. 2019" },
      { year: 2040, target: "Redução de 75% em Escopo 1+2 vs. 2019" },
      { year: 2050, target: "Net Zero (incluindo Escopo 3)" },
    ],
    keyActions: [
      { action: "Eletrificação de frota de mineração", investment: "R$ 85M", timeline: "2024-2028" },
      { action: "Instalação de usina solar fotovoltaica", investment: "R$ 45M", timeline: "2025-2026" },
      { action: "Programa de eficiência hídrica", investment: "R$ 22M", timeline: "2024-2027" },
      { action: "Substituição de combustíveis fósseis", investment: "R$ 120M", timeline: "2026-2032" },
    ],
    assumptions: [
      "Precificação de carbono crescente (cenário de R$ 150/tCO₂e até 2030)",
      "Disponibilidade de tecnologias de eletrificação para equipamentos pesados",
      "Continuidade de incentivos fiscais para energia renovável",
      "Estabilidade regulatória no setor de mineração",
    ],
  },
  climateResilience: {
    scenariosAnalyzed: [
      {
        name: "Cenário de Aquecimento Atual (SSP2-4.5)",
        temperature: "+2.7°C até 2100",
        physicalImpact: "Moderado a Alto",
        transitionImpact: "Moderado",
        financialImpact: "R$ 180-320M em 10 anos",
      },
      {
        name: "Cenário de Transição Ordenada (SSP1-2.6)",
        temperature: "+1.8°C até 2100",
        physicalImpact: "Baixo a Moderado",
        transitionImpact: "Alto",
        financialImpact: "R$ 220-380M em 10 anos",
      },
      {
        name: "Cenário Net Zero (SSP1-1.9)",
        temperature: "+1.5°C até 2100",
        physicalImpact: "Baixo",
        transitionImpact: "Muito Alto",
        financialImpact: "R$ 280-450M em 10 anos",
      },
    ],
    adaptationMeasures: [
      "Diversificação geográfica de operações",
      "Investimento em infraestrutura resiliente",
      "Sistemas de alerta precoce para eventos extremos",
      "Seguros climáticos para ativos críticos",
    ],
  },
};

// PILAR 3: GESTÃO DE RISCOS
const riskManagementData = {
  identificationProcess: {
    methodology: "Framework TCFD adaptado com análise de materialidade climática",
    frequency: "Semestral com revisões trimestrais",
    scope: "Todos os territórios operacionais e cadeia de valor (upstream e downstream)",
    tools: ["Matriz de riscos climáticos", "Análise de cenários IPCC", "Modelagem de impacto financeiro"],
  },
  assessmentCriteria: {
    likelihood: ["Raro (<5%)", "Improvável (5-25%)", "Possível (25-50%)", "Provável (50-75%)", "Quase Certo (>75%)"],
    impact: ["Insignificante (<R$ 1M)", "Menor (R$ 1-5M)", "Moderado (R$ 5-25M)", "Maior (R$ 25-100M)", "Catastrófico (>R$ 100M)"],
    riskAppetite: "A organização aceita riscos climáticos com impacto financeiro até R$ 25M e probabilidade de até 25%, desde que existam medidas de mitigação implementadas.",
  },
  physicalRisks: [
    {
      risk: "Escassez hídrica severa",
      type: "Crônico",
      territories: ["Mina Norte", "Planta Industrial MG"],
      likelihood: "Provável",
      impact: "Maior",
      financialExposure: "R$ 25-80M",
      mitigation: "Programa de reciclagem de água, captação de água de chuva, dessalinização",
      residualRisk: "Moderado",
    },
    {
      risk: "Inundações e tempestades severas",
      type: "Agudo",
      territories: ["Terminal Portuário SP", "Área Costeira Sul"],
      likelihood: "Possível",
      impact: "Maior",
      financialExposure: "R$ 15-45M",
      mitigation: "Infraestrutura de drenagem, seguros, planos de contingência",
      residualRisk: "Moderado",
    },
    {
      risk: "Ondas de calor extremo",
      type: "Agudo",
      territories: ["Todas as operações"],
      likelihood: "Provável",
      impact: "Moderado",
      financialExposure: "R$ 8-25M",
      mitigation: "Climatização de áreas de trabalho, ajuste de turnos, monitoramento de saúde",
      residualRisk: "Baixo",
    },
    {
      risk: "Incêndios florestais",
      type: "Agudo",
      territories: ["Reserva Ambiental", "Mina Norte"],
      likelihood: "Possível",
      impact: "Maior",
      financialExposure: "R$ 20-60M",
      mitigation: "Brigadas de incêndio, aceiros, monitoramento por satélite",
      residualRisk: "Moderado",
    },
    {
      risk: "Elevação do nível do mar",
      type: "Crônico",
      territories: ["Terminal Portuário SP"],
      likelihood: "Provável",
      impact: "Catastrófico",
      financialExposure: "R$ 50-150M",
      mitigation: "Estudos de relocação, infraestrutura elevada, planejamento de longo prazo",
      residualRisk: "Alto",
    },
  ],
  transitionRisks: [
    {
      risk: "Precificação de carbono",
      category: "Política e Legal",
      likelihood: "Quase Certo",
      impact: "Maior",
      financialExposure: "R$ 30-80M/ano",
      mitigation: "Programa de descarbonização, hedge de carbono, eficiência operacional",
      residualRisk: "Moderado",
    },
    {
      risk: "Obsolescência de ativos intensivos em carbono",
      category: "Tecnologia",
      likelihood: "Provável",
      impact: "Catastrófico",
      financialExposure: "R$ 40-120M",
      mitigation: "Plano de transição tecnológica, depreciação acelerada, parcerias de P&D",
      residualRisk: "Alto",
    },
    {
      risk: "Mudança na demanda por produtos de baixo carbono",
      category: "Mercado",
      likelihood: "Provável",
      impact: "Maior",
      financialExposure: "R$ 25-70M",
      mitigation: "Certificação de produto verde, diversificação de portfólio",
      residualRisk: "Moderado",
    },
    {
      risk: "Restrições regulatórias de licenciamento",
      category: "Política e Legal",
      likelihood: "Possível",
      impact: "Maior",
      financialExposure: "R$ 20-60M",
      mitigation: "Engajamento regulatório, compliance proativo, monitoramento legal",
      residualRisk: "Moderado",
    },
    {
      risk: "Dano reputacional por performance climática",
      category: "Reputação",
      likelihood: "Possível",
      impact: "Moderado",
      financialExposure: "R$ 10-30M",
      mitigation: "Transparência em relatórios, metas baseadas em ciência, engajamento stakeholders",
      residualRisk: "Baixo",
    },
  ],
  integrationWithERM: {
    description: "Os riscos climáticos são integrados ao Sistema de Gestão de Riscos Empresariais (ERM), sendo avaliados com a mesma metodologia e reportados ao Comitê de Riscos mensalmente.",
    climateRisksInTopTen: 4,
    reportingFrequency: "Mensal ao Comitê de Riscos, Trimestral ao Conselho",
  },
};

// PILAR 4: MÉTRICAS E METAS
const metricsData = {
  ghgEmissions: {
    scope1: {
      current: 145_230,
      previous: 152_450,
      baseYear: 168_900,
      unit: "tCO₂e",
      change: -4.7,
      categories: [
        { name: "Combustão estacionária", value: 42_150, percentage: 29 },
        { name: "Combustão móvel", value: 68_420, percentage: 47 },
        { name: "Emissões fugitivas", value: 18_340, percentage: 13 },
        { name: "Processos industriais", value: 16_320, percentage: 11 },
      ],
    },
    scope2: {
      locationBased: 89_650,
      marketBased: 72_430,
      previous: 94_200,
      baseYear: 105_400,
      unit: "tCO₂e",
      change: -4.8,
      renewablePercentage: 32,
    },
    scope3: {
      total: 892_400,
      previous: 875_600,
      unit: "tCO₂e",
      change: 1.9,
      material: true,
      categories: [
        { category: "1. Bens e serviços adquiridos", value: 245_600, materiality: "Alta" },
        { category: "2. Bens de capital", value: 67_800, materiality: "Média" },
        { category: "3. Combustíveis e energia", value: 45_200, materiality: "Média" },
        { category: "4. Transporte upstream", value: 123_400, materiality: "Alta" },
        { category: "9. Transporte downstream", value: 189_700, materiality: "Alta" },
        { category: "11. Uso de produtos vendidos", value: 156_300, materiality: "Alta" },
        { category: "12. Tratamento de fim de vida", value: 64_400, materiality: "Média" },
      ],
    },
    totalScope123: 1_110_060,
    methodology: "GHG Protocol Corporate Standard",
    verificationStatus: "Verificado por terceira parte (ISAE 3410)",
  },
  energyMetrics: {
    totalConsumption: 2_456_780,
    unit: "GJ",
    bySource: [
      { source: "Diesel", value: 1_245_600, percentage: 50.7, renewable: false },
      { source: "Eletricidade da rede", value: 678_900, percentage: 27.6, renewable: false },
      { source: "Energia solar", value: 312_400, percentage: 12.7, renewable: true },
      { source: "Gás natural", value: 156_200, percentage: 6.4, renewable: false },
      { source: "Biomassa", value: 63_680, percentage: 2.6, renewable: true },
    ],
    renewablePercentage: 15.3,
    intensityPerRevenue: 0.82,
    intensityUnit: "GJ/R$ milhão",
  },
  waterMetrics: {
    totalWithdrawal: 12_450_000,
    unit: "m³",
    recycledPercentage: 68,
    stressedAreasWithdrawal: 4_230_000,
    intensityPerProduction: 2.45,
    intensityUnit: "m³/tonelada produzida",
  },
  financialMetrics: {
    assetsVulnerableToPhysicalRisks: {
      value: 890_000_000,
      percentage: 18,
      description: "Ativos localizados em áreas de alto risco de escassez hídrica ou inundação",
    },
    assetsAlignedWithOpportunities: {
      value: 245_000_000,
      percentage: 5,
      description: "Investimentos em tecnologias de baixo carbono e energia renovável",
    },
    climateRelatedCapex: {
      current: 78_500_000,
      planned: 272_000_000,
      horizon: "2024-2030",
    },
    internalCarbonPrice: {
      value: 85,
      unit: "R$/tCO₂e",
      application: "Análise de viabilidade de novos projetos",
    },
  },
  targets: [
    {
      metric: "Emissões Escopo 1+2",
      baseYear: 2019,
      baseValue: "274.300 tCO₂e",
      target2025: "-15%",
      target2030: "-42%",
      target2050: "Net Zero",
      progress: 14,
      status: "On Track",
      scienceBasedTarget: true,
    },
    {
      metric: "Emissões Escopo 3",
      baseYear: 2019,
      baseValue: "865.200 tCO₂e",
      target2025: "-5%",
      target2030: "-25%",
      target2050: "Net Zero",
      progress: -3,
      status: "Behind",
      scienceBasedTarget: true,
    },
    {
      metric: "Energia Renovável",
      baseYear: 2019,
      baseValue: "5%",
      target2025: "20%",
      target2030: "50%",
      target2050: "100%",
      progress: 15.3,
      status: "On Track",
      scienceBasedTarget: false,
    },
    {
      metric: "Intensidade de Carbono",
      baseYear: 2019,
      baseValue: "0.95 tCO₂e/t",
      target2025: "-10%",
      target2030: "-30%",
      target2050: "-90%",
      progress: 12,
      status: "On Track",
      scienceBasedTarget: true,
    },
  ],
};

// ============================================================
// COMPONENT
// ============================================================

export function IFRSS2ReportGenerator() {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = () => {
    setIsExporting(true);
    toast.message("Abrindo impressão para PDF...", {
      description: "Selecione 'Salvar como PDF' no diálogo de impressão.",
    });
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 200);
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, string> = {
      "On Track": "bg-success/10 text-success",
      "Behind": "bg-destructive/10 text-destructive",
      "At Risk": "bg-warning/10 text-warning",
    };
    return <Badge className={config[status] || "bg-muted"}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Export Actions */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h2 className="text-xl font-bold">Gerador de Relatório IFRS S2</h2>
          <p className="text-sm text-muted-foreground">Relatório completo de divulgações climáticas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button onClick={exportToPDF} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Gerando..." : "Exportar PDF"}
          </Button>
        </div>
      </div>

      {/* REPORT CONTENT */}
      <div ref={reportRef} className="bg-background rounded-lg p-8 space-y-8 print:p-0">
        
        {/* COVER PAGE */}
        <section className="text-center space-y-6 pb-8 border-b-2">
          <div className="space-y-2">
            <Badge variant="outline" className="text-lg px-4 py-1">{reportMetadata.standard}</Badge>
            <h1 className="text-3xl font-bold mt-4">{reportMetadata.title}</h1>
            <p className="text-xl text-muted-foreground">{reportMetadata.organization}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-8">
            <div><span className="text-muted-foreground">CNPJ:</span><br/>{reportMetadata.cnpj}</div>
            <div><span className="text-muted-foreground">Setor:</span><br/>{reportMetadata.sector}</div>
            <div><span className="text-muted-foreground">Período:</span><br/>{reportMetadata.reportingPeriod}</div>
            <div><span className="text-muted-foreground">Ano Base:</span><br/>{reportMetadata.baseYear}</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-t pt-4">
            <div><span className="text-muted-foreground">Publicação:</span><br/>{reportMetadata.publicationDate}</div>
            <div><span className="text-muted-foreground">Versão:</span><br/>{reportMetadata.version}</div>
            <div><span className="text-muted-foreground">Verificação:</span><br/>{reportMetadata.auditor}</div>
            <div><span className="text-muted-foreground">Nível:</span><br/>{reportMetadata.assuranceLevel}</div>
          </div>
        </section>

        {/* TABLE OF CONTENTS */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Índice
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="p-2 bg-secondary/30 rounded">1. Governança Climática</div>
            <div className="p-2 bg-secondary/30 rounded">2. Estratégia Climática</div>
            <div className="p-2 bg-secondary/30 rounded">3. Gestão de Riscos Climáticos</div>
            <div className="p-2 bg-secondary/30 rounded">4. Métricas e Metas</div>
          </div>
        </section>

        <Separator className="my-8" />

        {/* SECTION 1: GOVERNANCE */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-primary">
            <Building2 className="h-6 w-6" />
            1. Governança Climática
          </h2>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">1.1 Supervisão do Conselho</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{governanceData.boardOversight.description}</p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-secondary/30 rounded-lg">
                  <p className="text-2xl font-bold">{governanceData.boardOversight.meetingsPerYear}</p>
                  <p className="text-xs text-muted-foreground">Reuniões/ano</p>
                </div>
                <div className="p-3 bg-secondary/30 rounded-lg">
                  <p className="text-2xl font-bold">{governanceData.boardOversight.climateAgendaItems}</p>
                  <p className="text-xs text-muted-foreground">Itens de pauta climática</p>
                </div>
                <div className="p-3 bg-secondary/30 rounded-lg">
                  <p className="text-sm font-bold">{governanceData.boardOversight.lastMeeting}</p>
                  <p className="text-xs text-muted-foreground">Última reunião</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">1.2 Estrutura de Comitês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {governanceData.committeeStructure.map((committee) => (
                  <div key={committee.name} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{committee.name}</p>
                        <p className="text-xs text-muted-foreground">Presidente: {committee.chair} | {committee.members} membros</p>
                      </div>
                      <Badge variant="outline">{committee.frequency}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{committee.responsibilities}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">1.3 Responsabilidades da Gestão Executiva</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {governanceData.managementRoles.map((exec) => (
                  <div key={exec.role} className="p-3 bg-secondary/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-sm">{exec.role}</span>
                    </div>
                    <p className="text-xs">{exec.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{exec.climateResponsibility}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">1.4 Remuneração Vinculada ao Clima</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-success/10 rounded-lg text-center">
                  <p className="text-2xl font-bold text-success">{governanceData.executiveCompensation.percentage}%</p>
                  <p className="text-xs">da remuneração variável</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">Métricas vinculadas:</p>
                  <ul className="text-xs space-y-1">
                    {governanceData.executiveCompensation.metrics.map((metric, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-success" />
                        {metric}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-8" />

        {/* SECTION 2: STRATEGY */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-primary">
            <Target className="h-6 w-6" />
            2. Estratégia Climática
          </h2>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">2.1 Impactos no Modelo de Negócio por Horizonte Temporal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { data: strategyData.businessModelImpacts.shortTerm, title: "Curto Prazo" },
                  { data: strategyData.businessModelImpacts.mediumTerm, title: "Médio Prazo" },
                  { data: strategyData.businessModelImpacts.longTerm, title: "Longo Prazo" },
                ].map(({ data, title }) => (
                  <div key={title} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold">{title}</span>
                      <Badge variant="outline">{data.horizon}</Badge>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-destructive flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Riscos
                        </p>
                        <ul className="text-xs mt-1 space-y-1">
                          {data.risks.map((r, i) => <li key={i}>• {r}</li>)}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-success flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" /> Oportunidades
                        </p>
                        <ul className="text-xs mt-1 space-y-1">
                          {data.opportunities.map((o, i) => <li key={i}>• {o}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">2.2 Plano de Transição para Net Zero</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <Badge className="bg-success/10 text-success text-lg px-4 py-2">
                  Net Zero {strategyData.transitionPlan.targetYear}
                </Badge>
                <span className="text-sm text-muted-foreground">Compromisso assumido e publicamente declarado</span>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Metas Intermediárias:</p>
                <div className="flex flex-wrap gap-2">
                  {strategyData.transitionPlan.intermediateTargets.map((t) => (
                    <Badge key={t.year} variant="outline" className="text-xs">
                      {t.year}: {t.target}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Ações-chave de Descarbonização:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {strategyData.transitionPlan.keyActions.map((action) => (
                    <div key={action.action} className="p-2 bg-secondary/30 rounded text-xs">
                      <p className="font-medium">{action.action}</p>
                      <p className="text-muted-foreground">{action.investment} | {action.timeline}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">2.3 Análise de Cenários e Resiliência Climática</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {strategyData.climateResilience.scenariosAnalyzed.map((scenario) => (
                  <div key={scenario.name} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-sm">{scenario.name}</p>
                        <p className="text-xs text-muted-foreground">{scenario.temperature}</p>
                      </div>
                      <Badge>{scenario.financialImpact}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Risco Físico: <span className="font-medium">{scenario.physicalImpact}</span></div>
                      <div>Risco Transição: <span className="font-medium">{scenario.transitionImpact}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-8" />

        {/* SECTION 3: RISK MANAGEMENT */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-primary">
            <Shield className="h-6 w-6" />
            3. Gestão de Riscos Climáticos
          </h2>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">3.1 Processo de Identificação e Avaliação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="p-3 bg-secondary/30 rounded-lg">
                  <p className="font-medium">Metodologia</p>
                  <p className="text-xs text-muted-foreground">{riskManagementData.identificationProcess.methodology}</p>
                </div>
                <div className="p-3 bg-secondary/30 rounded-lg">
                  <p className="font-medium">Frequência</p>
                  <p className="text-xs text-muted-foreground">{riskManagementData.identificationProcess.frequency}</p>
                </div>
                <div className="p-3 bg-secondary/30 rounded-lg">
                  <p className="font-medium">Escopo</p>
                  <p className="text-xs text-muted-foreground">{riskManagementData.identificationProcess.scope}</p>
                </div>
                <div className="p-3 bg-secondary/30 rounded-lg">
                  <p className="font-medium">Ferramentas</p>
                  <p className="text-xs text-muted-foreground">{riskManagementData.identificationProcess.tools.join(", ")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">3.2 Riscos Físicos Identificados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Risco</th>
                      <th className="text-left p-2">Tipo</th>
                      <th className="text-left p-2">Territórios</th>
                      <th className="text-left p-2">Probabilidade</th>
                      <th className="text-left p-2">Impacto</th>
                      <th className="text-left p-2">Exposição</th>
                      <th className="text-left p-2">Risco Residual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riskManagementData.physicalRisks.map((risk) => (
                      <tr key={risk.risk} className="border-b">
                        <td className="p-2 font-medium">{risk.risk}</td>
                        <td className="p-2">{risk.type}</td>
                        <td className="p-2">{risk.territories.join(", ")}</td>
                        <td className="p-2">{risk.likelihood}</td>
                        <td className="p-2">{risk.impact}</td>
                        <td className="p-2">{risk.financialExposure}</td>
                        <td className="p-2">
                          <Badge variant="outline" className="text-xs">{risk.residualRisk}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">3.3 Riscos de Transição Identificados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Risco</th>
                      <th className="text-left p-2">Categoria</th>
                      <th className="text-left p-2">Probabilidade</th>
                      <th className="text-left p-2">Impacto</th>
                      <th className="text-left p-2">Exposição</th>
                      <th className="text-left p-2">Risco Residual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riskManagementData.transitionRisks.map((risk) => (
                      <tr key={risk.risk} className="border-b">
                        <td className="p-2 font-medium">{risk.risk}</td>
                        <td className="p-2">{risk.category}</td>
                        <td className="p-2">{risk.likelihood}</td>
                        <td className="p-2">{risk.impact}</td>
                        <td className="p-2">{risk.financialExposure}</td>
                        <td className="p-2">
                          <Badge variant="outline" className="text-xs">{risk.residualRisk}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-8" />

        {/* SECTION 4: METRICS AND TARGETS */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-primary">
            <TrendingUp className="h-6 w-6" />
            4. Métricas e Metas
          </h2>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Factory className="h-4 w-4" />
                4.1 Emissões de Gases de Efeito Estufa (GEE)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Scope 1 */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold">Escopo 1 - Emissões Diretas</p>
                    <p className="text-xs text-muted-foreground">Combustão estacionária, móvel, fugitivas e processos</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{metricsData.ghgEmissions.scope1.current.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{metricsData.ghgEmissions.scope1.unit}</p>
                    <Badge className={metricsData.ghgEmissions.scope1.change < 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}>
                      {metricsData.ghgEmissions.scope1.change > 0 ? "+" : ""}{metricsData.ghgEmissions.scope1.change}% vs. ano anterior
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {metricsData.ghgEmissions.scope1.categories.map((cat) => (
                    <div key={cat.name} className="p-2 bg-secondary/30 rounded text-xs">
                      <p className="font-medium">{cat.name}</p>
                      <p>{cat.value.toLocaleString()} tCO₂e ({cat.percentage}%)</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scope 2 */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold">Escopo 2 - Emissões Indiretas (Energia)</p>
                    <p className="text-xs text-muted-foreground">Eletricidade adquirida e consumida</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{metricsData.ghgEmissions.scope2.marketBased.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{metricsData.ghgEmissions.scope2.unit} (market-based)</p>
                    <Badge className="bg-success/10 text-success">
                      {metricsData.ghgEmissions.scope2.change}% vs. ano anterior
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-2 bg-secondary/30 rounded">
                    <p className="text-xs text-muted-foreground">Location-based</p>
                    <p className="font-medium">{metricsData.ghgEmissions.scope2.locationBased.toLocaleString()} tCO₂e</p>
                  </div>
                  <div className="p-2 bg-secondary/30 rounded">
                    <p className="text-xs text-muted-foreground">% Energia Renovável</p>
                    <p className="font-medium">{metricsData.ghgEmissions.scope2.renewablePercentage}%</p>
                  </div>
                </div>
              </div>

              {/* Scope 3 */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold">Escopo 3 - Outras Emissões Indiretas</p>
                    <p className="text-xs text-muted-foreground">Cadeia de valor (upstream e downstream)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{metricsData.ghgEmissions.scope3.total.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{metricsData.ghgEmissions.scope3.unit}</p>
                    <Badge className="bg-warning/10 text-warning">
                      +{metricsData.ghgEmissions.scope3.change}% vs. ano anterior
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  {metricsData.ghgEmissions.scope3.categories.map((cat) => (
                    <div key={cat.category} className="flex justify-between items-center text-xs p-2 bg-secondary/30 rounded">
                      <span>{cat.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{cat.value.toLocaleString()} tCO₂e</span>
                        <Badge variant="outline">{cat.materiality}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="p-4 bg-primary/5 border-2 border-primary rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-lg">Total Escopo 1 + 2 + 3</p>
                    <p className="text-sm text-muted-foreground">Metodologia: {metricsData.ghgEmissions.methodology}</p>
                    <p className="text-sm text-muted-foreground">{metricsData.ghgEmissions.verificationStatus}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">{metricsData.ghgEmissions.totalScope123.toLocaleString()}</p>
                    <p className="text-sm">tCO₂e</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                4.2 Métricas de Energia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-3 bg-secondary/30 rounded-lg text-center">
                  <p className="text-2xl font-bold">{(metricsData.energyMetrics.totalConsumption / 1000).toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">Consumo Total (TJ)</p>
                </div>
                <div className="p-3 bg-success/10 rounded-lg text-center">
                  <p className="text-2xl font-bold text-success">{metricsData.energyMetrics.renewablePercentage}%</p>
                  <p className="text-xs text-muted-foreground">Energia Renovável</p>
                </div>
                <div className="p-3 bg-secondary/30 rounded-lg text-center">
                  <p className="text-2xl font-bold">{metricsData.energyMetrics.intensityPerRevenue}</p>
                  <p className="text-xs text-muted-foreground">{metricsData.energyMetrics.intensityUnit}</p>
                </div>
              </div>
              <div className="space-y-2">
                {metricsData.energyMetrics.bySource.map((source) => (
                  <div key={source.source} className="flex items-center gap-2">
                    <div className="w-24 text-xs">{source.source}</div>
                    <div className="flex-1">
                      <Progress value={source.percentage} className="h-2" />
                    </div>
                    <div className="w-16 text-xs text-right">{source.percentage}%</div>
                    {source.renewable && <Leaf className="h-3 w-3 text-success" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                4.3 Métricas Financeiras Relacionadas ao Clima
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="font-semibold text-sm mb-2">Ativos Vulneráveis a Riscos Físicos</p>
                  <p className="text-2xl font-bold">R$ {(metricsData.financialMetrics.assetsVulnerableToPhysicalRisks.value / 1_000_000).toFixed(0)}M</p>
                  <p className="text-xs text-muted-foreground">
                    {metricsData.financialMetrics.assetsVulnerableToPhysicalRisks.percentage}% do total de ativos
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="font-semibold text-sm mb-2">CAPEX Climático Planejado</p>
                  <p className="text-2xl font-bold">R$ {(metricsData.financialMetrics.climateRelatedCapex.planned / 1_000_000).toFixed(0)}M</p>
                  <p className="text-xs text-muted-foreground">
                    {metricsData.financialMetrics.climateRelatedCapex.horizon}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="font-semibold text-sm mb-2">Preço Interno de Carbono</p>
                  <p className="text-2xl font-bold">R$ {metricsData.financialMetrics.internalCarbonPrice.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {metricsData.financialMetrics.internalCarbonPrice.unit} - {metricsData.financialMetrics.internalCarbonPrice.application}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="font-semibold text-sm mb-2">Investimentos em Baixo Carbono</p>
                  <p className="text-2xl font-bold">R$ {(metricsData.financialMetrics.assetsAlignedWithOpportunities.value / 1_000_000).toFixed(0)}M</p>
                  <p className="text-xs text-muted-foreground">
                    {metricsData.financialMetrics.assetsAlignedWithOpportunities.percentage}% do total de ativos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4" />
                4.4 Metas Climáticas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Métrica</th>
                      <th className="text-left p-2">Ano Base</th>
                      <th className="text-left p-2">Meta 2025</th>
                      <th className="text-left p-2">Meta 2030</th>
                      <th className="text-left p-2">Meta 2050</th>
                      <th className="text-left p-2">Progresso</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">SBTi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metricsData.targets.map((target) => (
                      <tr key={target.metric} className="border-b">
                        <td className="p-2 font-medium">{target.metric}</td>
                        <td className="p-2 text-xs">{target.baseYear}<br/>{target.baseValue}</td>
                        <td className="p-2">{target.target2025}</td>
                        <td className="p-2">{target.target2030}</td>
                        <td className="p-2">{target.target2050}</td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <Progress value={Math.abs(target.progress)} className="h-2 w-16" />
                            <span className="text-xs">{target.progress > 0 ? "+" : ""}{target.progress}%</span>
                          </div>
                        </td>
                        <td className="p-2">{getStatusBadge(target.status)}</td>
                        <td className="p-2">
                          {target.scienceBasedTarget ? (
                            <CheckCircle2 className="h-4 w-4 text-success" />
                          ) : (
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FOOTER */}
        <footer className="mt-12 pt-6 border-t text-center text-xs text-muted-foreground">
          <p className="font-medium">{reportMetadata.organization}</p>
          <p>{reportMetadata.standard} | {reportMetadata.reportingPeriod}</p>
          <p className="mt-2">
            Este relatório foi preparado em conformidade com os requisitos do IFRS S2 - Climate-related Disclosures
            e verificado por {reportMetadata.auditor} ({reportMetadata.assuranceLevel}).
          </p>
          <p className="mt-2">Documento gerado em {reportMetadata.publicationDate}</p>
        </footer>
      </div>
    </div>
  );
}
