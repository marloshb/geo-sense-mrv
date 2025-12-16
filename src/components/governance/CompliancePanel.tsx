import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, XCircle, Clock, AlertTriangle, FileText, Shield, Link, ExternalLink } from "lucide-react";
import { useState } from "react";

interface ComplianceRequirement {
  id: string;
  code: string;
  name: string;
  regulation: string;
  category: string;
  status: "compliant" | "in_progress" | "non_compliant" | "not_applicable";
  indicators: string[];
  evidence: string[];
  dueDate: string;
  lastReview: string;
  notes: string;
}

const mockRequirements: ComplianceRequirement[] = [
  {
    id: "1",
    code: "CVM-193-01",
    name: "Divulgação de Riscos Climáticos",
    regulation: "CVM 193",
    category: "Disclosure",
    status: "compliant",
    indicators: ["Emissões Scope 1", "Emissões Scope 2", "Riscos Físicos"],
    evidence: ["Relatório IFRS S2", "Mapa de Riscos"],
    dueDate: "2025-03-31",
    lastReview: "2024-12-01",
    notes: "Divulgação anual conforme cronograma regulatório"
  },
  {
    id: "2",
    code: "CVM-193-02",
    name: "Métricas de Emissões GEE",
    regulation: "CVM 193",
    category: "Métricas",
    status: "compliant",
    indicators: ["Emissões Totais", "Intensidade de Carbono"],
    evidence: ["Inventário GEE", "Cálculos MRV"],
    dueDate: "2025-03-31",
    lastReview: "2024-12-10",
    notes: "Metodologia GHG Protocol aplicada"
  },
  {
    id: "3",
    code: "IFRS-S2-15",
    name: "Análise de Cenários Climáticos",
    regulation: "IFRS S2",
    category: "Análise",
    status: "in_progress",
    indicators: ["Cenário RCP 4.5", "Cenário RCP 8.5"],
    evidence: [],
    dueDate: "2025-06-30",
    lastReview: "2024-11-15",
    notes: "Em desenvolvimento - análise de cenários para 2030 e 2050"
  },
  {
    id: "4",
    code: "IFRS-S2-22",
    name: "Impactos Financeiros de Riscos Climáticos",
    regulation: "IFRS S2",
    category: "Financeiro",
    status: "in_progress",
    indicators: ["Impacto CAPEX", "Impacto OPEX", "Impacto Receita"],
    evidence: ["Avaliação Preliminar"],
    dueDate: "2025-06-30",
    lastReview: "2024-12-05",
    notes: "Quantificação em andamento para riscos prioritários"
  },
  {
    id: "5",
    code: "ENV-001",
    name: "Licenciamento Ambiental",
    regulation: "Legislação Ambiental",
    category: "Licenças",
    status: "compliant",
    indicators: [],
    evidence: ["Licença de Operação", "Condicionantes"],
    dueDate: "2026-12-31",
    lastReview: "2024-10-01",
    notes: "Licença válida até 2026"
  },
  {
    id: "6",
    code: "IFRS-S2-29",
    name: "Governança Climática",
    regulation: "IFRS S2",
    category: "Governança",
    status: "non_compliant",
    indicators: [],
    evidence: [],
    dueDate: "2025-03-31",
    lastReview: "2024-12-01",
    notes: "Necessário formalizar comitê de sustentabilidade"
  }
];

const regulationSummary = [
  { regulation: "CVM 193", total: 2, compliant: 2, inProgress: 0, nonCompliant: 0 },
  { regulation: "IFRS S2", total: 3, compliant: 0, inProgress: 2, nonCompliant: 1 },
  { regulation: "Legislação Ambiental", total: 1, compliant: 1, inProgress: 0, nonCompliant: 0 },
];

export function CompliancePanel() {
  const [filterRegulation, setFilterRegulation] = useState<string>("all");

  const getStatusIcon = (status: ComplianceRequirement["status"]) => {
    switch (status) {
      case "compliant": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in_progress": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "non_compliant": return <XCircle className="h-4 w-4 text-destructive" />;
      case "not_applicable": return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: ComplianceRequirement["status"]) => {
    switch (status) {
      case "compliant": return "Conforme";
      case "in_progress": return "Em Adequação";
      case "non_compliant": return "Não Conforme";
      case "not_applicable": return "N/A";
    }
  };

  const getStatusBadge = (status: ComplianceRequirement["status"]) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      compliant: "default",
      in_progress: "secondary",
      non_compliant: "destructive",
      not_applicable: "outline"
    };
    return (
      <Badge variant={variants[status]} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {getStatusLabel(status)}
      </Badge>
    );
  };

  const compliantCount = mockRequirements.filter(r => r.status === "compliant").length;
  const inProgressCount = mockRequirements.filter(r => r.status === "in_progress").length;
  const nonCompliantCount = mockRequirements.filter(r => r.status === "non_compliant").length;
  const complianceRate = (compliantCount / mockRequirements.length) * 100;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Conformidade</p>
                <p className="text-2xl font-bold">{complianceRate.toFixed(0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conforme</p>
                <p className="text-2xl font-bold">{compliantCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Em Adequação</p>
                <p className="text-2xl font-bold">{inProgressCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Não Conforme</p>
                <p className="text-2xl font-bold">{nonCompliantCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requirements">
        <TabsList>
          <TabsTrigger value="requirements">Requisitos</TabsTrigger>
          <TabsTrigger value="regulations">Por Regulação</TabsTrigger>
          <TabsTrigger value="timeline">Cronograma</TabsTrigger>
        </TabsList>

        <TabsContent value="requirements" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Mapa de Compliance Regulatório
              </CardTitle>
              <CardDescription>
                Requisitos regulatórios e status de conformidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Requisito</TableHead>
                    <TableHead>Regulação</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Indicadores</TableHead>
                    <TableHead>Evidências</TableHead>
                    <TableHead>Prazo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRequirements.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{req.code}</code>
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px]">
                        {req.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{req.regulation}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{req.category}</TableCell>
                      <TableCell>{getStatusBadge(req.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Link className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{req.indicators.length}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{req.evidence.length}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {req.dueDate}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regulations" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {regulationSummary.map((reg) => (
              <Card key={reg.regulation}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    {reg.regulation}
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Conformidade</span>
                      <span>{((reg.compliant / reg.total) * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={(reg.compliant / reg.total) * 100} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-green-500/10 rounded">
                      <p className="text-lg font-bold text-green-500">{reg.compliant}</p>
                      <p className="text-xs text-muted-foreground">Conforme</p>
                    </div>
                    <div className="p-2 bg-yellow-500/10 rounded">
                      <p className="text-lg font-bold text-yellow-500">{reg.inProgress}</p>
                      <p className="text-xs text-muted-foreground">Em Progresso</p>
                    </div>
                    <div className="p-2 bg-destructive/10 rounded">
                      <p className="text-lg font-bold text-destructive">{reg.nonCompliant}</p>
                      <p className="text-xs text-muted-foreground">Pendente</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Detalhes por Regulação</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="cvm">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Badge>CVM 193</Badge>
                      <span>Resolução CVM 193/2023 - Informações de Sustentabilidade</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground space-y-2">
                    <p>
                      A Resolução CVM 193 estabelece regras para divulgação de informações 
                      relacionadas à sustentabilidade por companhias abertas brasileiras.
                    </p>
                    <p>
                      <strong>Requisitos principais:</strong> Divulgação de riscos climáticos, 
                      métricas de emissões GEE, governança climática e metas de sustentabilidade.
                    </p>
                    <p>
                      <strong>Cronograma:</strong> Implementação gradual de 2024 a 2026.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="ifrs">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">IFRS S2</Badge>
                      <span>Climate-related Disclosures</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground space-y-2">
                    <p>
                      O IFRS S2 estabelece requisitos para divulgação de informações sobre 
                      riscos e oportunidades relacionados ao clima.
                    </p>
                    <p>
                      <strong>Pilares:</strong> Governança, Estratégia, Gestão de Riscos, 
                      Métricas e Metas.
                    </p>
                    <p>
                      <strong>Alinhamento:</strong> Recomendações TCFD integradas ao padrão.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cronograma de Compliance</CardTitle>
              <CardDescription>Prazos e marcos regulatórios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRequirements
                  .filter(r => r.status !== "compliant")
                  .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                  .map((req) => (
                    <div key={req.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        {getStatusIcon(req.status)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{req.name}</p>
                          <Badge variant="outline">{req.regulation}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{req.notes}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Prazo: {req.dueDate}</span>
                          <span>Última revisão: {req.lastReview}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
