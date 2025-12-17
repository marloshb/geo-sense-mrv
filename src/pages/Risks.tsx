import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhysicalRisksPanel } from "@/components/risks/PhysicalRisksPanel";
import { TransitionRisksPanel } from "@/components/risks/TransitionRisksPanel";
import { ClimateScenariosPanel } from "@/components/risks/ClimateScenariosPanel";
import { RiskActionPlansPanel } from "@/components/risks/RiskActionPlansPanel";
import { ClimateRiskAIPanel } from "@/components/risks/ClimateRiskAIPanel";
import { RiskMatrix } from "@/components/dashboard/RiskMatrix";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  ThermometerSun,
  Droplets,
  Scale,
  Brain,
  Target,
  Calendar,
  LayoutGrid,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Risks = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Riscos Climáticos</h1>
            <p className="text-muted-foreground">
              Avaliação e gestão de riscos físicos e de transição baseados em território
            </p>
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Território" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os territórios</SelectItem>
              <SelectItem value="carajas">Mina Carajás</SelectItem>
              <SelectItem value="terminal">Terminal SP</SelectItem>
              <SelectItem value="planta">Planta MG</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Riscos Críticos</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Droplets className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Físicos</p>
                  <p className="text-2xl font-bold">9</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Scale className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Transição</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <span className="text-primary font-bold text-sm">R$</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Impacto Máx.</p>
                  <p className="text-2xl font-bold">R$ 485M</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="flex flex-wrap h-auto gap-1">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Visão Geral</span>
            </TabsTrigger>
            <TabsTrigger value="physical" className="flex items-center gap-1">
              <ThermometerSun className="h-4 w-4" />
              <span className="hidden sm:inline">Físicos</span>
            </TabsTrigger>
            <TabsTrigger value="transition" className="flex items-center gap-1">
              <Scale className="h-4 w-4" />
              <span className="hidden sm:inline">Transição</span>
            </TabsTrigger>
            <TabsTrigger value="scenarios" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Cenários</span>
            </TabsTrigger>
            <TabsTrigger value="actions" className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Planos</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-1">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">IA</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RiskMatrix />
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">
                    Impacto Financeiro por Cenário
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Tendência Atual (+3.0°C)</span>
                      <Badge className="bg-destructive/10 text-destructive">Crítico</Badge>
                    </div>
                    <p className="text-2xl font-bold">R$ 80M - 200M</p>
                    <p className="text-xs text-muted-foreground mt-1">Impacto em 10 anos</p>
                  </div>
                  <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Transição Ordenada (+2.0°C)</span>
                      <Badge className="bg-warning/10 text-warning">Alto</Badge>
                    </div>
                    <p className="text-2xl font-bold">R$ 50M - 120M</p>
                    <p className="text-xs text-muted-foreground mt-1">Impacto em 10 anos</p>
                  </div>
                  <div className="p-4 bg-info/5 border border-info/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Transição Acelerada (+1.5°C)</span>
                      <Badge className="bg-info/10 text-info">Médio</Badge>
                    </div>
                    <p className="text-2xl font-bold">R$ 70M - 180M</p>
                    <p className="text-xs text-muted-foreground mt-1">Impacto em 10 anos</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="physical">
            <PhysicalRisksPanel />
          </TabsContent>

          <TabsContent value="transition">
            <TransitionRisksPanel />
          </TabsContent>

          <TabsContent value="scenarios">
            <ClimateScenariosPanel />
          </TabsContent>

          <TabsContent value="actions">
            <RiskActionPlansPanel />
          </TabsContent>

          <TabsContent value="ai">
            <ClimateRiskAIPanel />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Risks;
