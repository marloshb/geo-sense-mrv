import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { TerritoryMap } from "@/components/monitoring/TerritoryMap";
import { TerritoryList } from "@/components/monitoring/TerritoryList";
import { TerritoryFormModal } from "@/components/monitoring/TerritoryFormModal";
import { AssetList } from "@/components/monitoring/AssetList";
import { AssetFormModal } from "@/components/monitoring/AssetFormModal";
import { LayerManager } from "@/components/monitoring/LayerManager";
import { TimeSeriesPanel } from "@/components/monitoring/TimeSeriesPanel";
import { EventsPanel } from "@/components/monitoring/EventsPanel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layers, Upload, Download, Map, Factory, Clock, AlertTriangle } from "lucide-react";

const mockTerritories = [
  { id: "1", name: "Mina Carajás", type: "Mineração", status: "active" },
  { id: "2", name: "Terminal Portuário SP", type: "Logística", status: "active" },
  { id: "3", name: "Planta Industrial MG", type: "Industrial", status: "monitoring" },
  { id: "4", name: "Reserva Florestal AM", type: "Conservação", status: "active" },
];

const Monitoring = () => {
  const [isTerritoryModalOpen, setIsTerritoryModalOpen] = useState(false);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("map");

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Monitoramento Territorial</h1>
            <p className="text-muted-foreground">
              Gestão de territórios, ativos e monitoramento geoespacial
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Importar Camada
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="map" className="gap-1">
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">Mapa</span>
            </TabsTrigger>
            <TabsTrigger value="assets" className="gap-1">
              <Factory className="w-4 h-4" />
              <span className="hidden sm:inline">Ativos</span>
            </TabsTrigger>
            <TabsTrigger value="layers" className="gap-1">
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Camadas</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="gap-1">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Temporal</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-1">
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Eventos</span>
            </TabsTrigger>
          </TabsList>

          {/* Map Tab */}
          <TabsContent value="map" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TerritoryMap />
              </div>
              <div>
                <TerritoryList onTerritorySelect={(t) => console.log("Selected:", t)} />
              </div>
            </div>
          </TabsContent>

          {/* Assets Tab */}
          <TabsContent value="assets" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TerritoryMap />
              </div>
              <div>
                <AssetList onAddAsset={() => setIsAssetModalOpen(true)} />
              </div>
            </div>
          </TabsContent>

          {/* Layers Tab */}
          <TabsContent value="layers">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TerritoryMap />
              </div>
              <div>
                <LayerManager />
              </div>
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TerritoryMap />
              </div>
              <div>
                <TimeSeriesPanel />
              </div>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TerritoryMap />
              </div>
              <div>
                <EventsPanel />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <TerritoryFormModal
        open={isTerritoryModalOpen}
        onOpenChange={setIsTerritoryModalOpen}
        parentTerritories={mockTerritories}
        onSave={(data) => console.log("Territory saved:", data)}
      />

      <AssetFormModal
        open={isAssetModalOpen}
        onOpenChange={setIsAssetModalOpen}
        territories={mockTerritories}
        onSave={(data) => console.log("Asset saved:", data)}
      />
    </AppLayout>
  );
};

export default Monitoring;
