import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiskManagementPanel } from "@/components/governance/RiskManagementPanel";
import { RiskMapPanel } from "@/components/governance/RiskMapPanel";
import { FinancialImpactPanel } from "@/components/governance/FinancialImpactPanel";
import { CompliancePanel } from "@/components/governance/CompliancePanel";
import { MaterialityPanel } from "@/components/governance/MaterialityPanel";
import { RolesControlsPanel } from "@/components/governance/RolesControlsPanel";
import { GrcAIPanel } from "@/components/governance/GrcAIPanel";
import { ActionPlansPanel } from "@/components/governance/ActionPlansPanel";
import { Shield, Map, DollarSign, FileCheck, Target, Users, Brain, ClipboardList } from "lucide-react";
import { useState } from "react";

const Governance = () => {
  const [activeTab, setActiveTab] = useState("risks");

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Governança, Risco & Compliance</h1>
          <p className="text-muted-foreground">
            Gestão integrada de riscos climáticos, compliance regulatório e governança corporativa
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="risks" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Riscos</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Mapa de Risco</span>
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Impacto Financeiro</span>
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Compliance</span>
            </TabsTrigger>
            <TabsTrigger value="materiality" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Materialidade</span>
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Papéis & Controles</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">IA</span>
            </TabsTrigger>
            <TabsTrigger value="actions" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Planos de Ação</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="risks">
            <RiskManagementPanel />
          </TabsContent>

          <TabsContent value="map">
            <RiskMapPanel />
          </TabsContent>

          <TabsContent value="financial">
            <FinancialImpactPanel />
          </TabsContent>

          <TabsContent value="compliance">
            <CompliancePanel />
          </TabsContent>

          <TabsContent value="materiality">
            <MaterialityPanel />
          </TabsContent>

          <TabsContent value="roles">
            <RolesControlsPanel />
          </TabsContent>

          <TabsContent value="ai">
            <GrcAIPanel />
          </TabsContent>

          <TabsContent value="actions">
            <ActionPlansPanel />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Governance;
