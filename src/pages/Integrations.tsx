import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiGatewayPanel } from "@/components/integrations/ApiGatewayPanel";
import { DataIngestionPanel } from "@/components/integrations/DataIngestionPanel";
import { ExternalSourcesPanel } from "@/components/integrations/ExternalSourcesPanel";
import { OutboundApisPanel } from "@/components/integrations/OutboundApisPanel";
import { GisServicesPanel } from "@/components/integrations/GisServicesPanel";
import { WebhooksPanel } from "@/components/integrations/WebhooksPanel";
import { DataOrchestrationPanel } from "@/components/integrations/DataOrchestrationPanel";
import { Shield, Upload, Cloud, Send, Map, Bell, GitBranch } from "lucide-react";
import { useState } from "react";

const Integrations = () => {
  const [activeTab, setActiveTab] = useState("gateway");

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrações & APIs</h1>
          <p className="text-muted-foreground">
            Conecte o MRV ao ecossistema corporativo de forma segura e rastreável
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="gateway" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">API Gateway</span>
              <span className="sm:hidden">Gateway</span>
            </TabsTrigger>
            <TabsTrigger value="ingestion" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Ingestão</span>
              <span className="sm:hidden">Dados</span>
            </TabsTrigger>
            <TabsTrigger value="external" className="flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              <span className="hidden sm:inline">Fontes Externas</span>
              <span className="sm:hidden">Externas</span>
            </TabsTrigger>
            <TabsTrigger value="outbound" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">APIs de Consumo</span>
              <span className="sm:hidden">APIs</span>
            </TabsTrigger>
            <TabsTrigger value="gis" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Serviços GIS</span>
              <span className="sm:hidden">GIS</span>
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Webhooks</span>
              <span className="sm:hidden">Eventos</span>
            </TabsTrigger>
            <TabsTrigger value="orchestration" className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              <span className="hidden sm:inline">Orquestração</span>
              <span className="sm:hidden">Pipeline</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gateway">
            <ApiGatewayPanel />
          </TabsContent>

          <TabsContent value="ingestion">
            <DataIngestionPanel />
          </TabsContent>

          <TabsContent value="external">
            <ExternalSourcesPanel />
          </TabsContent>

          <TabsContent value="outbound">
            <OutboundApisPanel />
          </TabsContent>

          <TabsContent value="gis">
            <GisServicesPanel />
          </TabsContent>

          <TabsContent value="webhooks">
            <WebhooksPanel />
          </TabsContent>

          <TabsContent value="orchestration">
            <DataOrchestrationPanel />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Integrations;
