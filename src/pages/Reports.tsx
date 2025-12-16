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
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
            <p className="text-muted-foreground">
              Geração e gestão de relatórios de sustentabilidade
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Relatório
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="annual">Anuais</TabsTrigger>
              <TabsTrigger value="quarterly">Trimestrais</TabsTrigger>
              <TabsTrigger value="special">Especiais</TabsTrigger>
            </TabsList>
            <Select defaultValue="2024">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
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
                { name: "Sustentabilidade", desc: "Relatório anual completo" },
                { name: "Inventário GEE", desc: "Escopos 1, 2 e 3" },
                { name: "Riscos Climáticos", desc: "Análise física e transição" },
              ].map((template) => (
                <div
                  key={template.name}
                  className="p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
                >
                  <h4 className="font-medium text-sm">{template.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {template.desc}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Reports;
