import { AppLayout } from "@/components/layout/AppLayout";
import { TerritoryMap } from "@/components/monitoring/TerritoryMap";
import { TerritoryList } from "@/components/monitoring/TerritoryList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layers, Upload, Filter, Download } from "lucide-react";

const Monitoring = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Monitoramento</h1>
            <p className="text-muted-foreground">
              Visualização geoespacial e monitoramento de territórios
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

        {/* Tabs */}
        <Tabs defaultValue="map" className="space-y-4">
          <TabsList>
            <TabsTrigger value="map">Mapa</TabsTrigger>
            <TabsTrigger value="satellite">Satélite</TabsTrigger>
            <TabsTrigger value="layers">Camadas</TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TerritoryMap />
              </div>
              <div>
                <TerritoryList />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="satellite">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <Layers className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">Imagens de Satélite</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Configure integração com provedores de imagens satelitais (ópticas e SAR) 
                    para séries temporais automatizadas.
                  </p>
                  <Button variant="outline" className="mt-4">
                    Configurar Integração
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layers">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Camadas Geoespaciais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Limites Territoriais", type: "Polígono", active: true },
                    { name: "Uso do Solo - 2024", type: "Raster", active: true },
                    { name: "Biomas Brasileiros", type: "Polígono", active: false },
                    { name: "Hidrografia", type: "Linha", active: false },
                    { name: "Áreas Protegidas", type: "Polígono", active: true },
                  ].map((layer, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            layer.active ? "bg-success" : "bg-muted"
                          }`}
                        />
                        <div>
                          <p className="font-medium text-sm">{layer.name}</p>
                          <p className="text-xs text-muted-foreground">{layer.type}</p>
                        </div>
                      </div>
                      <Badge variant={layer.active ? "default" : "secondary"}>
                        {layer.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Monitoring;
