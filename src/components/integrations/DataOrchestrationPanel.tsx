import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitBranch, CheckCircle, XCircle, AlertTriangle, Clock, RefreshCw, Play, Settings, Database, FileCheck, Activity, BarChart3 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Pipeline {
  id: string;
  name: string;
  source: string;
  destination: string;
  status: "healthy" | "warning" | "error" | "running";
  lastRun: string;
  nextRun: string;
  recordsProcessed: number;
  errorCount: number;
  avgDuration: string;
}

interface ValidationRule {
  id: string;
  name: string;
  type: "schema" | "consistency" | "range" | "reference";
  description: string;
  severity: "error" | "warning";
  passRate: number;
  lastCheck: string;
}

const mockPipelines: Pipeline[] = [
  {
    id: "1",
    name: "ERP → Dados Operacionais",
    source: "SAP ERP",
    destination: "operational_data",
    status: "healthy",
    lastRun: "2024-12-16 06:00",
    nextRun: "2024-12-17 06:00",
    recordsProcessed: 12450,
    errorCount: 3,
    avgDuration: "4m 32s"
  },
  {
    id: "2",
    name: "Planilhas → Emissões",
    source: "Excel Upload",
    destination: "emissions_data",
    status: "running",
    lastRun: "2024-12-16 14:30",
    nextRun: "-",
    recordsProcessed: 567,
    errorCount: 0,
    avgDuration: "1m 15s"
  },
  {
    id: "3",
    name: "API Climática → Contexto",
    source: "INMET API",
    destination: "climate_context",
    status: "warning",
    lastRun: "2024-12-16 08:00",
    nextRun: "2024-12-17 08:00",
    recordsProcessed: 890,
    errorCount: 12,
    avgDuration: "2m 45s"
  },
  {
    id: "4",
    name: "GIS → Territórios",
    source: "Shapefile Import",
    destination: "territories",
    status: "error",
    lastRun: "2024-12-15 10:00",
    nextRun: "Aguardando correção",
    recordsProcessed: 0,
    errorCount: 45,
    avgDuration: "-"
  }
];

const mockValidationRules: ValidationRule[] = [
  {
    id: "1",
    name: "Schema de Dados Operacionais",
    type: "schema",
    description: "Valida estrutura e tipos de dados do arquivo de entrada",
    severity: "error",
    passRate: 98.5,
    lastCheck: "2024-12-16 14:30"
  },
  {
    id: "2",
    name: "Consistência Temporal",
    type: "consistency",
    description: "Verifica se período_fim > período_início",
    severity: "error",
    passRate: 100,
    lastCheck: "2024-12-16 14:30"
  },
  {
    id: "3",
    name: "Valores de Emissões",
    type: "range",
    description: "Emissões devem estar entre 0 e 1.000.000 tCO2e",
    severity: "warning",
    passRate: 95.2,
    lastCheck: "2024-12-16 14:30"
  },
  {
    id: "4",
    name: "Referência Territorial",
    type: "reference",
    description: "Território referenciado deve existir no sistema",
    severity: "error",
    passRate: 99.8,
    lastCheck: "2024-12-16 14:30"
  },
  {
    id: "5",
    name: "Duplicidade de Registros",
    type: "consistency",
    description: "Detecta registros duplicados por chave única",
    severity: "warning",
    passRate: 97.3,
    lastCheck: "2024-12-16 14:30"
  }
];

const recentErrors = [
  { id: "1", pipeline: "GIS → Territórios", error: "Geometria inválida no registro 23", timestamp: "2024-12-15 10:05", status: "pending" },
  { id: "2", pipeline: "GIS → Territórios", error: "SRID não especificado", timestamp: "2024-12-15 10:04", status: "pending" },
  { id: "3", pipeline: "API Climática → Contexto", error: "Timeout na conexão", timestamp: "2024-12-16 08:15", status: "resolved" },
  { id: "4", pipeline: "ERP → Dados Operacionais", error: "Campo 'quantity' nulo", timestamp: "2024-12-16 06:02", status: "resolved" }
];

export function DataOrchestrationPanel() {
  const [pipelines, setPipelines] = useState<Pipeline[]>(mockPipelines);

  const handleRunPipeline = (id: string) => {
    toast.info("Iniciando pipeline...");
    setPipelines(pipelines.map(p => 
      p.id === id ? { ...p, status: "running" as const } : p
    ));
    
    setTimeout(() => {
      setPipelines(pipelines.map(p => 
        p.id === id ? { ...p, status: "healthy" as const, lastRun: new Date().toLocaleString('pt-BR') } : p
      ));
      toast.success("Pipeline executado com sucesso!");
    }, 3000);
  };

  const getStatusIcon = (status: Pipeline["status"]) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "running":
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
    }
  };

  const getStatusLabel = (status: Pipeline["status"]) => {
    switch (status) {
      case "healthy":
        return "Saudável";
      case "warning":
        return "Atenção";
      case "error":
        return "Erro";
      case "running":
        return "Executando";
    }
  };

  const healthyPipelines = pipelines.filter(p => p.status === "healthy").length;
  const totalRecords = pipelines.reduce((acc, p) => acc + p.recordsProcessed, 0);
  const totalErrors = pipelines.reduce((acc, p) => acc + p.errorCount, 0);

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <GitBranch className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pipelines</p>
                <p className="text-2xl font-bold">{pipelines.length}</p>
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
                <p className="text-sm text-muted-foreground">Saudáveis</p>
                <p className="text-2xl font-bold">{healthyPipelines}/{pipelines.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Database className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Registros Hoje</p>
                <p className="text-2xl font-bold">{totalRecords.toLocaleString()}</p>
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
                <p className="text-sm text-muted-foreground">Erros</p>
                <p className="text-2xl font-bold">{totalErrors}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pipelines">
        <TabsList>
          <TabsTrigger value="pipelines">Pipelines</TabsTrigger>
          <TabsTrigger value="validation">Regras de Validação</TabsTrigger>
          <TabsTrigger value="errors">Erros e Falhas</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
        </TabsList>

        <TabsContent value="pipelines" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Pipelines de Dados
              </CardTitle>
              <CardDescription>
                Orquestração de fluxos de dados entre sistemas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pipeline</TableHead>
                    <TableHead>Fonte → Destino</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registros</TableHead>
                    <TableHead>Erros</TableHead>
                    <TableHead>Última Execução</TableHead>
                    <TableHead>Próxima</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pipelines.map((pipeline) => (
                    <TableRow key={pipeline.id}>
                      <TableCell className="font-medium">{pipeline.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {pipeline.source} → {pipeline.destination}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(pipeline.status)}
                          <span className="text-sm">{getStatusLabel(pipeline.status)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{pipeline.recordsProcessed.toLocaleString()}</TableCell>
                      <TableCell>
                        {pipeline.errorCount > 0 ? (
                          <Badge variant="destructive">{pipeline.errorCount}</Badge>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {pipeline.lastRun}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {pipeline.nextRun}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleRunPipeline(pipeline.id)}
                            disabled={pipeline.status === "running"}
                          >
                            {pipeline.status === "running" ? (
                              <Clock className="h-4 w-4 animate-spin" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                Regras de Validação
              </CardTitle>
              <CardDescription>
                Regras de consistência e qualidade de dados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Regra</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Severidade</TableHead>
                    <TableHead>Taxa de Sucesso</TableHead>
                    <TableHead>Última Verificação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockValidationRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{rule.type}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs">
                        {rule.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant={rule.severity === "error" ? "destructive" : "secondary"}>
                          {rule.severity === "error" ? "Erro" : "Aviso"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={rule.passRate} className="w-16 h-2" />
                          <span className={rule.passRate >= 95 ? "text-green-500" : rule.passRate >= 80 ? "text-yellow-500" : "text-destructive"}>
                            {rule.passRate}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {rule.lastCheck}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Erros e Falhas Recentes
              </CardTitle>
              <CardDescription>
                Registro de erros nos pipelines de dados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pipeline</TableHead>
                    <TableHead>Erro</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentErrors.map((error) => (
                    <TableRow key={error.id}>
                      <TableCell className="font-medium">{error.pipeline}</TableCell>
                      <TableCell className="text-sm">{error.error}</TableCell>
                      <TableCell>
                        {error.status === "pending" ? (
                          <Badge variant="destructive">Pendente</Badge>
                        ) : (
                          <Badge className="bg-green-500">Resolvido</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {error.timestamp}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Reprocessar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="h-4 w-4" />
                  Saúde dos Pipelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pipelines.map((pipeline) => (
                  <div key={pipeline.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{pipeline.name}</span>
                      <span className="text-muted-foreground">{pipeline.avgDuration}</span>
                    </div>
                    <Progress 
                      value={pipeline.status === "healthy" ? 100 : pipeline.status === "warning" ? 70 : 30} 
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="h-4 w-4" />
                  Volume de Dados (Últimos 7 dias)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Seg</span>
                    <Progress value={75} className="w-3/4 h-3" />
                    <span className="text-sm text-muted-foreground">12.4k</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Ter</span>
                    <Progress value={85} className="w-3/4 h-3" />
                    <span className="text-sm text-muted-foreground">14.2k</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Qua</span>
                    <Progress value={60} className="w-3/4 h-3" />
                    <span className="text-sm text-muted-foreground">10.1k</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Qui</span>
                    <Progress value={90} className="w-3/4 h-3" />
                    <span className="text-sm text-muted-foreground">15.0k</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sex</span>
                    <Progress value={70} className="w-3/4 h-3" />
                    <span className="text-sm text-muted-foreground">11.7k</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sáb</span>
                    <Progress value={25} className="w-3/4 h-3" />
                    <span className="text-sm text-muted-foreground">4.2k</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Dom</span>
                    <Progress value={15} className="w-3/4 h-3" />
                    <span className="text-sm text-muted-foreground">2.5k</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
