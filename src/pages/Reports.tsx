import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  BarChart3,
  Map,
  PanelTop,
  Brain,
  Shield,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OperationalDashboard } from "@/components/reports/OperationalDashboard";
import { BoardDashboard } from "@/components/reports/BoardDashboard";
import { ReportGenerator } from "@/components/reports/ReportGenerator";
import { SpatialReporting } from "@/components/reports/SpatialReporting";
import { ClimateRiskExecutiveDashboard } from "@/components/reports/ClimateRiskExecutiveDashboard";

const reports = [
  {
    id: "1",
    name: "Relatório de Sustentabilidade 2024",
    type: "Anual",
    status: "completed",
    date: "15/12/2024",
    territories: 5,
  },
  {
    id: "2",
    name: "Inventário GEE - Q3 2024",
    type: "Trimestral",
    status: "completed",
    date: "30/09/2024",
    territories: 5,
  },
  {
    id: "3",
    name: "Análise de Riscos Climáticos",
    type: "Especial",
    status: "in_progress",
    date: "Em andamento",
    territories: 3,
  },
  {
    id: "4",
    name: "Relatório de Conformidade",
    type: "Regulatório",
    status: "pending",
    date: "Pendente",
    territories: 5,
  },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "completed":
      return { label: "Concluído", icon: CheckCircle2, className: "bg-success/10 text-success" };
    case "in_progress":
      return { label: "Em Progresso", icon: Clock, className: "bg-info/10 text-info" };
    default:
      return { label: "Pendente", icon: AlertCircle, className: "bg-warning/10 text-warning" };
  }
};

const Reports = () => {
  const [activeTab, setActiveTab] = useState("operational");
  const [yearFilter, setYearFilter] = useState("2024");

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Reporting & Dashboards
            </h1>
            <p className="text-muted-foreground">
              Dashboards operacionais, executivos e geração de relatórios
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Relatório
            </Button>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="operational" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Operacional</span>
            </TabsTrigger>
            <TabsTrigger value="executive" className="gap-2">
              <PanelTop className="w-4 h-4" />
              <span className="hidden sm:inline">Executivo</span>
            </TabsTrigger>
            <TabsTrigger value="climate" className="gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">IFRS S2</span>
            </TabsTrigger>
            <TabsTrigger value="spatial" className="gap-2">
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">Espacial</span>
            </TabsTrigger>
            <TabsTrigger value="generator" className="gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Relatórios</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Histórico</span>
            </TabsTrigger>
          </TabsList>

          {/* Operational Dashboard */}
          <TabsContent value="operational">
            <OperationalDashboard />
          </TabsContent>

          {/* Executive Dashboard (Board View) */}
          <TabsContent value="executive">
            <BoardDashboard />
          </TabsContent>

          {/* Climate Risk Executive Dashboard - IFRS S2 */}
          <TabsContent value="climate">
            <ClimateRiskExecutiveDashboard />
          </TabsContent>

          {/* Spatial Reporting */}
          <TabsContent value="spatial">
            <SpatialReporting />
          </TabsContent>

          {/* Report Generator */}
          <TabsContent value="generator">
            <ReportGenerator />
          </TabsContent>

          {/* Reports History */}
          <TabsContent value="history" className="space-y-4">
            <Tabs defaultValue="all" className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="annual">Anuais</TabsTrigger>
                  <TabsTrigger value="quarterly">Trimestrais</TabsTrigger>
                  <TabsTrigger value="special">Especiais</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="space-y-4">
                <div className="grid gap-4">
                  {reports.map((report) => {
                    const statusConfig = getStatusConfig(report.status);
                    const StatusIcon = statusConfig.icon;
                    return (
                      <Card key={report.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold">{report.name}</h3>
                                  <Badge variant="secondary" className="text-xs">
                                    {report.type}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {report.date}
                                  </span>
                                  <span>{report.territories} territórios</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className={statusConfig.className}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusConfig.label}
                              </Badge>
                              {report.status === "completed" && (
                                <Button variant="outline" size="sm" className="gap-1">
                                  <Download className="w-4 h-4" />
                                  PDF
                                </Button>
                              )}
                              {report.status !== "completed" && (
                                <Button variant="outline" size="sm">
                                  Continuar
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="annual">
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">
                      Filtro aplicado: Relatórios Anuais
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="quarterly">
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">
                      Filtro aplicado: Relatórios Trimestrais
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="special">
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">
                      Filtro aplicado: Relatórios Especiais
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Report Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Templates de Relatório</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: "Sustentabilidade", desc: "Relatório anual completo", icon: FileText },
                    { name: "Inventário GEE", desc: "Escopos 1, 2 e 3", icon: BarChart3 },
                    { name: "Riscos Climáticos", desc: "Análise física e transição", icon: AlertCircle },
                    { name: "IFRS S2", desc: "Divulgação climática regulatória", icon: FileText },
                    { name: "Territorial", desc: "Por projeto/ativo específico", icon: Map },
                    { name: "Com IA", desc: "Narrativas automáticas", icon: Brain },
                  ].map((template) => {
                    const IconComponent = template.icon;
                    return (
                      <div
                        key={template.name}
                        className="p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                            <IconComponent className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{template.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {template.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Reports;
