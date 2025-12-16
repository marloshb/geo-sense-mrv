import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Map,
  Layers,
  Download,
  ZoomIn,
  Maximize2,
  Camera,
  Palette,
} from "lucide-react";

interface MapLayer {
  id: string;
  name: string;
  type: "indicator" | "context" | "risk";
  enabled: boolean;
  opacity: number;
}

export const SpatialReporting = () => {
  const [selectedIndicator, setSelectedIndicator] = useState("emissions");
  const [layers, setLayers] = useState<MapLayer[]>([
    { id: "emissions", name: "Emissões por Território", type: "indicator", enabled: true, opacity: 100 },
    { id: "risks", name: "Riscos Climáticos", type: "risk", enabled: false, opacity: 80 },
    { id: "sequestration", name: "Sequestro de Carbono", type: "indicator", enabled: false, opacity: 100 },
    { id: "biomes", name: "Biomas", type: "context", enabled: true, opacity: 60 },
    { id: "hydro", name: "Hidrografia", type: "context", enabled: false, opacity: 70 },
  ]);

  const indicators = [
    { id: "emissions", name: "Emissões (tCO₂e)", color: "chart-1" },
    { id: "intensity", name: "Intensidade Carbônica", color: "chart-2" },
    { id: "risks", name: "Nível de Risco", color: "warning" },
    { id: "sequestration", name: "Sequestro de Carbono", color: "success" },
    { id: "energy", name: "Consumo Energético", color: "info" },
  ];

  const toggleLayer = (layerId: string) => {
    setLayers((prev) =>
      prev.map((l) =>
        l.id === layerId ? { ...l, enabled: !l.enabled } : l
      )
    );
  };

  const exportMap = (format: "png" | "pdf" | "geojson") => {
    // Placeholder for map export functionality
    console.log(`Exporting map as ${format}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Controls */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Indicador no Mapa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={selectedIndicator}
              onValueChange={setSelectedIndicator}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {indicators.map((ind) => (
                  <SelectItem key={ind.id} value={ind.id}>
                    {ind.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Legend */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Legenda</Label>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-destructive" />
                    <span>Alto</span>
                  </div>
                  <span className="text-muted-foreground">&gt; 5000</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-warning" />
                    <span>Médio</span>
                  </div>
                  <span className="text-muted-foreground">1000-5000</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-success" />
                    <span>Baixo</span>
                  </div>
                  <span className="text-muted-foreground">&lt; 1000</span>
                </div>
              </div>
            </div>

            {/* Layers */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <Layers className="w-3 h-3" />
                Camadas Contextuais
              </Label>
              <div className="space-y-2">
                {layers
                  .filter((l) => l.type === "context")
                  .map((layer) => (
                    <div
                      key={layer.id}
                      className="flex items-center justify-between"
                    >
                      <Label htmlFor={layer.id} className="text-sm cursor-pointer">
                        {layer.name}
                      </Label>
                      <Switch
                        id={layer.id}
                        checked={layer.enabled}
                        onCheckedChange={() => toggleLayer(layer.id)}
                      />
                    </div>
                  ))}
              </div>
            </div>

            {/* Export Options */}
            <div className="space-y-2 pt-4 border-t">
              <Label className="text-xs text-muted-foreground">
                Exportar Mapa
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportMap("png")}
                  className="text-xs"
                >
                  PNG
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportMap("pdf")}
                  className="text-xs"
                >
                  PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportMap("geojson")}
                  className="text-xs"
                >
                  GeoJSON
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Preview */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Map className="w-4 h-4" />
                Mapa Temático
                <Badge variant="secondary" className="text-xs">
                  {indicators.find((i) => i.id === selectedIndicator)?.name}
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Maximize2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Map Placeholder - in production this would be a real map component */}
            <div className="relative w-full h-[400px] bg-secondary/30 rounded-lg overflow-hidden">
              {/* Simulated thematic map with territories */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Territory polygons simulation */}
                  <div
                    className="absolute bg-destructive/40 border-2 border-destructive rounded-lg"
                    style={{
                      top: "15%",
                      left: "20%",
                      width: "25%",
                      height: "30%",
                    }}
                  >
                    <div className="absolute bottom-2 left-2 bg-background/90 px-2 py-1 rounded text-xs">
                      <div className="font-medium">Carajás</div>
                      <div className="text-muted-foreground">4,200 tCO₂e</div>
                    </div>
                  </div>

                  <div
                    className="absolute bg-warning/40 border-2 border-warning rounded-lg"
                    style={{
                      top: "25%",
                      left: "55%",
                      width: "20%",
                      height: "25%",
                    }}
                  >
                    <div className="absolute bottom-2 left-2 bg-background/90 px-2 py-1 rounded text-xs">
                      <div className="font-medium">Planta MG</div>
                      <div className="text-muted-foreground">2,100 tCO₂e</div>
                    </div>
                  </div>

                  <div
                    className="absolute bg-success/40 border-2 border-success rounded-lg"
                    style={{
                      top: "55%",
                      left: "10%",
                      width: "30%",
                      height: "35%",
                    }}
                  >
                    <div className="absolute bottom-2 left-2 bg-background/90 px-2 py-1 rounded text-xs">
                      <div className="font-medium">Reserva AM</div>
                      <div className="text-muted-foreground">320 tCO₂e</div>
                    </div>
                  </div>

                  <div
                    className="absolute bg-warning/40 border-2 border-warning rounded-lg"
                    style={{
                      top: "60%",
                      left: "50%",
                      width: "18%",
                      height: "20%",
                    }}
                  >
                    <div className="absolute bottom-2 left-2 bg-background/90 px-2 py-1 rounded text-xs">
                      <div className="font-medium">Terminal SP</div>
                      <div className="text-muted-foreground">1,800 tCO₂e</div>
                    </div>
                  </div>

                  <div
                    className="absolute bg-info/40 border-2 border-info rounded-lg"
                    style={{
                      top: "45%",
                      left: "75%",
                      width: "15%",
                      height: "18%",
                    }}
                  >
                    <div className="absolute bottom-2 left-2 bg-background/90 px-2 py-1 rounded text-xs">
                      <div className="font-medium">Porto RJ</div>
                      <div className="text-muted-foreground">1,400 tCO₂e</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map controls overlay */}
              <div className="absolute bottom-4 right-4 bg-background/90 rounded-lg p-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Escala:</span>
                  <div className="w-16 h-1 bg-foreground/50 relative">
                    <span className="absolute -bottom-4 left-0">0</span>
                    <span className="absolute -bottom-4 right-0">500km</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Territory Summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
              {[
                { name: "Carajás", emissions: 4200, level: "high" },
                { name: "Planta MG", emissions: 2100, level: "medium" },
                { name: "Terminal SP", emissions: 1800, level: "medium" },
                { name: "Porto RJ", emissions: 1400, level: "low" },
                { name: "Reserva AM", emissions: 320, level: "low" },
              ].map((territory) => (
                <div
                  key={territory.name}
                  className="p-2 bg-secondary/50 rounded-lg text-center"
                >
                  <div className="text-xs font-medium truncate">
                    {territory.name}
                  </div>
                  <div className="text-sm font-bold">
                    {territory.emissions.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">tCO₂e</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
