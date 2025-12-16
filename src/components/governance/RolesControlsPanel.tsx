import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Shield, CheckSquare, User, Building, FileCheck, AlertTriangle, Clock } from "lucide-react";
import { useState } from "react";

interface RoleAssignment {
  id: string;
  riskArea: string;
  responsible: string;
  accountable: string;
  consulted: string[];
  informed: string[];
  controls: string[];
  reviewFrequency: string;
  lastReview: string;
}

interface InternalControl {
  id: string;
  name: string;
  type: "preventive" | "detective" | "corrective";
  indicator: string;
  owner: string;
  frequency: string;
  status: "effective" | "needs_improvement" | "not_effective";
  lastTest: string;
  evidence: string;
}

const mockRoleAssignments: RoleAssignment[] = [
  {
    id: "1",
    riskArea: "Emissões de GEE",
    responsible: "Gerente Ambiental",
    accountable: "Diretor de Sustentabilidade",
    consulted: ["Operações", "Financeiro"],
    informed: ["Conselho", "Investidores"],
    controls: ["Monitoramento mensal", "Verificação externa"],
    reviewFrequency: "Mensal",
    lastReview: "2024-12-01"
  },
  {
    id: "2",
    riskArea: "Riscos Climáticos Físicos",
    responsible: "Gerente de Riscos",
    accountable: "Diretor de Operações",
    consulted: ["Engenharia", "Ambiental"],
    informed: ["Comitê de Riscos"],
    controls: ["Avaliação trimestral", "Plano de contingência"],
    reviewFrequency: "Trimestral",
    lastReview: "2024-10-15"
  },
  {
    id: "3",
    riskArea: "Compliance Regulatório",
    responsible: "Coordenador de Compliance",
    accountable: "Diretor Jurídico",
    consulted: ["Sustentabilidade", "RI"],
    informed: ["Conselho", "Auditoria"],
    controls: ["Checklist mensal", "Auditoria semestral"],
    reviewFrequency: "Mensal",
    lastReview: "2024-12-05"
  },
  {
    id: "4",
    riskArea: "Gestão de Recursos Hídricos",
    responsible: "Gerente de Utilidades",
    accountable: "Diretor de Operações",
    consulted: ["Ambiental", "Comunidades"],
    informed: ["Reguladores"],
    controls: ["Medição contínua", "Relatório mensal"],
    reviewFrequency: "Semanal",
    lastReview: "2024-12-10"
  }
];

const mockControls: InternalControl[] = [
  {
    id: "1",
    name: "Verificação de Inventário GEE",
    type: "detective",
    indicator: "Emissões Scope 1 e 2",
    owner: "Gerente Ambiental",
    frequency: "Anual",
    status: "effective",
    lastTest: "2024-11-15",
    evidence: "Relatório de verificação externa"
  },
  {
    id: "2",
    name: "Monitoramento de Consumo Energético",
    type: "preventive",
    indicator: "Intensidade Energética",
    owner: "Gerente de Utilidades",
    frequency: "Mensal",
    status: "effective",
    lastTest: "2024-12-01",
    evidence: "Dashboards operacionais"
  },
  {
    id: "3",
    name: "Avaliação de Riscos Climáticos",
    type: "preventive",
    indicator: "Score de Risco Territorial",
    owner: "Gerente de Riscos",
    frequency: "Trimestral",
    status: "needs_improvement",
    lastTest: "2024-10-01",
    evidence: "Matriz de riscos"
  },
  {
    id: "4",
    name: "Reconciliação de Dados de Emissões",
    type: "detective",
    indicator: "Acurácia dos Dados",
    owner: "Analista MRV",
    frequency: "Mensal",
    status: "effective",
    lastTest: "2024-12-05",
    evidence: "Relatório de reconciliação"
  },
  {
    id: "5",
    name: "Revisão de Compliance Regulatório",
    type: "detective",
    indicator: "Taxa de Conformidade",
    owner: "Coordenador de Compliance",
    frequency: "Mensal",
    status: "effective",
    lastTest: "2024-12-10",
    evidence: "Checklist de compliance"
  },
  {
    id: "6",
    name: "Plano de Ação Corretiva",
    type: "corrective",
    indicator: "Tempo de Resolução",
    owner: "Gerente de Riscos",
    frequency: "Sob demanda",
    status: "needs_improvement",
    lastTest: "2024-11-20",
    evidence: "Registro de ações"
  }
];

const governanceStructure = [
  { level: "Conselho de Administração", role: "Supervisão estratégica de riscos climáticos", members: 7 },
  { level: "Comitê de Sustentabilidade", role: "Governança de temas ESG e climáticos", members: 5 },
  { level: "Diretoria Executiva", role: "Implementação da estratégia climática", members: 4 },
  { level: "Gerências Funcionais", role: "Execução operacional e controles", members: 12 }
];

export function RolesControlsPanel() {
  const [selectedTab, setSelectedTab] = useState("raci");

  const getControlTypeLabel = (type: InternalControl["type"]) => {
    switch (type) {
      case "preventive": return "Preventivo";
      case "detective": return "Detectivo";
      case "corrective": return "Corretivo";
    }
  };

  const getStatusBadge = (status: InternalControl["status"]) => {
    const config = {
      effective: { label: "Efetivo", className: "bg-green-500" },
      needs_improvement: { label: "Melhorar", className: "bg-yellow-500" },
      not_effective: { label: "Inefetivo", className: "bg-destructive" }
    };
    return <Badge className={config[status].className}>{config[status].label}</Badge>;
  };

  const effectiveControls = mockControls.filter(c => c.status === "effective").length;
  const controlsNeedingImprovement = mockControls.filter(c => c.status === "needs_improvement").length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Áreas de Risco</p>
                <p className="text-2xl font-bold">{mockRoleAssignments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Shield className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Controles Internos</p>
                <p className="text-2xl font-bold">{mockControls.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckSquare className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Controles Efetivos</p>
                <p className="text-2xl font-bold">{effectiveControls}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Requer Melhoria</p>
                <p className="text-2xl font-bold">{controlsNeedingImprovement}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="raci">Matriz RACI</TabsTrigger>
          <TabsTrigger value="controls">Controles Internos</TabsTrigger>
          <TabsTrigger value="structure">Estrutura de Governança</TabsTrigger>
        </TabsList>

        <TabsContent value="raci" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Matriz RACI - Responsabilidades por Área de Risco
              </CardTitle>
              <CardDescription>
                Definição de papéis e responsabilidades para gestão de riscos climáticos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Área de Risco</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <Badge className="bg-blue-500">R</Badge>
                        Responsável
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <Badge className="bg-purple-500">A</Badge>
                        Aprovador
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <Badge className="bg-yellow-500">C</Badge>
                        Consultado
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <Badge className="bg-gray-500">I</Badge>
                        Informado
                      </div>
                    </TableHead>
                    <TableHead>Controles</TableHead>
                    <TableHead>Última Revisão</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRoleAssignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">{assignment.riskArea}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {assignment.responsible.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{assignment.responsible}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {assignment.accountable.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{assignment.accountable}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {assignment.consulted.map((c) => (
                            <Badge key={c} variant="outline" className="text-xs">
                              {c}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {assignment.informed.map((i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {i}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {assignment.controls.length} controles
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {assignment.lastReview}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controls" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Controles Internos
              </CardTitle>
              <CardDescription>
                Controles de gestão de riscos climáticos e indicadores associados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Controle</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Indicador</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Frequência</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Último Teste</TableHead>
                    <TableHead>Evidência</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockControls.map((control) => (
                    <TableRow key={control.id}>
                      <TableCell className="font-medium">{control.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getControlTypeLabel(control.type)}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{control.indicator}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{control.owner}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{control.frequency}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(control.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {control.lastTest}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <FileCheck className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                            {control.evidence}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structure" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Estrutura de Governança Climática
              </CardTitle>
              <CardDescription>
                Níveis de governança e responsabilidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {governanceStructure.map((level, index) => (
                  <div key={level.level} className="relative">
                    {index > 0 && (
                      <div className="absolute -top-2 left-6 w-0.5 h-4 bg-border" />
                    )}
                    <div className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{level.level}</h4>
                          <Badge variant="outline">{level.members} membros</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{level.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Principais Responsabilidades do Conselho</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                  <li>Supervisão da estratégia climática e de sustentabilidade</li>
                  <li>Aprovação de metas de emissões e descarbonização</li>
                  <li>Monitoramento de riscos climáticos materiais</li>
                  <li>Aprovação de divulgações regulatórias (CVM 193, IFRS S2)</li>
                  <li>Revisão de cenários climáticos e impactos financeiros</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
