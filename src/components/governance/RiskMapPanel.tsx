import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Map, Layers, AlertTriangle, Thermometer, Droplets, Wind, Eye, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { RiskTerritoryMap } from "./RiskTerritoryMap";

interface RiskLayer {
  id: string;
  name: string;
  type: "physical" | "transition" | "combined";
  enabled: boolean;
  opacity: number;
  icon: React.ReactNode;
}

const riskLayers: RiskLayer[] = [
  { id: "flood", name: "Risco de Inundação", type: "physical", enabled: true, opacity: 70, icon: <Droplets className="h-4 w-4 text-blue-500" /> },
  { id: "drought", name: "Estresse Hídrico", type: "physical", enabled: true, opacity: 60, icon: <Thermometer className="h-4 w-4 text-orange-500" /> },
  { id: "heat", name: "Ondas de Calor", type: "physical", enabled: false, opacity: 50, icon: <Thermometer className="h-4 w-4 text-red-500" /> },
  { id: "wind", name: "Ventos Extremos", type: "physical", enabled: false, opacity: 50, icon: <Wind className="h-4 w-4 text-cyan-500" /> },
  { id: "carbon", name: "Exposição Regulatória", type: "transition", enabled: true, opacity: 80, icon: <AlertTriangle className="h-4 w-4 text-purple-500" /> },
  { id: "combined", name: "Risco Combinado", type: "combined", enabled: false, opacity: 75, icon: <Layers className="h-4 w-4 text-primary" /> },
];

const territoryRisks = [
  { id: "1", name: "Complexo Mineração Norte", riskLevel: "critical", risks: ["Estresse Hídrico", "Ondas de Calor"], score: 92 },
  { id: "2", name: "Planta Industrial Sul", riskLevel: "high", risks: ["Inundação", "Ventos"], score: 78 },
  { id: "3", name: "Área Operacional Centro-Oeste", riskLevel: "medium", risks: ["Seca"], score: 45 },
  { id: "4", name: "Reserva Ambiental Leste", riskLevel: "low", risks: [], score: 18 },
  { id: "5", name: "Terminal Portuário Nordeste", riskLevel: "high", risks: ["Elevação do Mar", "Tempestades"], score: 72 },
  { id: "6", name: "Complexo Agroindustrial", riskLevel: "medium", risks: ["Seca", "Geada"], score: 52 },
];

export function RiskMapPanel() {
  const [layers, setLayers] = useState<RiskLayer[]>(riskLayers);
  const [selectedScenario, setSelectedScenario] = useState("current");
  const [selectedHorizon, setSelectedHorizon] = useState("2030");

  const handleToggleLayer = (id: string) => {
    setLayers(layers.map(layer =>
      layer.id === id ? { ...layer, enabled: !layer.enabled } : layer
    ));
  };

  const handleOpacityChange = (id: string, value: number[]) => {
    setLayers(layers.map(layer =>
      layer.id === id ? { ...layer, opacity: value[0] } : layer
    ));
  };

  const handleExportMap = () => {
    toast.info("Preparando exportação do mapa de risco...");
    setTimeout(() => toast.success("Mapa exportado com sucesso!"), 1500);
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "critical": return "bg-destructive";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-muted";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5" />
                  Mapa de Risco Territorial
                </CardTitle>
                <CardDescription>Visualização espacial de riscos climáticos com Mapbox</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={handleExportMap}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <RiskTerritoryMap 
                layers={layers}
                scenario={selectedScenario}
                horizon={selectedHorizon}
              />
            </CardContent>
          </Card>

          {/* Territory Risk Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resumo de Risco por Território</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {territoryRisks.map((territory) => (
                  <div key={territory.id} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{territory.name}</span>
                      <Badge className={getRiskLevelColor(territory.riskLevel)}>
                        {territory.score}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {territory.risks.map((risk) => (
                        <Badge key={risk} variant="outline" className="text-xs">
                          {risk}
                        </Badge>
                      ))}
                      {territory.risks.length === 0 && (
                        <span className="text-xs text-muted-foreground">Sem riscos ativos</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls Sidebar */}
        <div className="space-y-4">
          {/* Scenario Selection */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Cenário Climático</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Cenário</Label>
                <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Atual (Baseline)</SelectItem>
                    <SelectItem value="rcp45">RCP 4.5 (Moderado)</SelectItem>
                    <SelectItem value="rcp85">RCP 8.5 (Severo)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Horizonte Temporal</Label>
                <Select value={selectedHorizon} onValueChange={setSelectedHorizon}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2030">2030</SelectItem>
                    <SelectItem value="2040">2040</SelectItem>
                    <SelectItem value="2050">2050</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Layer Controls */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Camadas de Risco
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {layers.map((layer) => (
                <div key={layer.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {layer.icon}
                      <span className="text-sm">{layer.name}</span>
                    </div>
                    <Switch
                      checked={layer.enabled}
                      onCheckedChange={() => handleToggleLayer(layer.id)}
                    />
                  </div>
                  {layer.enabled && (
                    <div className="flex items-center gap-2 pl-6">
                      <Eye className="h-3 w-3 text-muted-foreground" />
                      <Slider
                        value={[layer.opacity]}
                        onValueChange={(value) => handleOpacityChange(layer.id, value)}
                        max={100}
                        step={10}
                        className="flex-1"
                      />
                      <span className="text-xs text-muted-foreground w-8">{layer.opacity}%</span>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Área em risco crítico</span>
                <span className="font-medium">1,250 ha</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ativos expostos</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Score médio de risco</span>
                <span className="font-medium">57.5</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Variação vs. anterior</span>
                <span className="font-medium text-destructive">+12%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
