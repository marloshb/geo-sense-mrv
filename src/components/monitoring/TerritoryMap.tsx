import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layers, Maximize2, Filter, Pencil, Square, Trash2, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Demo territories with coordinates in Brazil
const initialTerritories = [
  {
    id: "1",
    name: "Mina Carajás",
    type: "Mineração",
    coordinates: [-50.0, -6.0],
    emissions: 4200,
    area: 8500,
    status: "active",
    polygon: null as GeoJSON.Polygon | null,
  },
  {
    id: "2",
    name: "Terminal Portuário SP",
    type: "Logística",
    coordinates: [-46.3, -23.9],
    emissions: 1800,
    area: 1200,
    status: "active",
    polygon: null as GeoJSON.Polygon | null,
  },
  {
    id: "3",
    name: "Planta Industrial MG",
    type: "Industrial",
    coordinates: [-43.9, -19.9],
    emissions: 2100,
    area: 450,
    status: "monitoring",
    polygon: null as GeoJSON.Polygon | null,
  },
  {
    id: "4",
    name: "Reserva Florestal AM",
    type: "Conservação",
    coordinates: [-60.0, -3.0],
    emissions: 320,
    area: 15000,
    status: "active",
    polygon: null as GeoJSON.Polygon | null,
  },
  {
    id: "5",
    name: "Porto Rio de Janeiro",
    type: "Logística",
    coordinates: [-43.2, -22.9],
    emissions: 1400,
    area: 890,
    status: "alert",
    polygon: null as GeoJSON.Polygon | null,
  },
];

type Territory = typeof initialTerritories[0];

interface TerritoryMapProps {
  onTerritorySelect?: (territory: Territory) => void;
  onTerritoryCreate?: (territory: Territory) => void;
  mapboxToken?: string;
}

const MAPBOX_TOKEN_KEY = "mapbox_public_token";

const territoryTypes = [
  { value: "Mineração", label: "Mineração" },
  { value: "Logística", label: "Logística" },
  { value: "Industrial", label: "Industrial" },
  { value: "Conservação", label: "Conservação" },
  { value: "Agricultura", label: "Agricultura" },
  { value: "Energia", label: "Energia" },
  { value: "Outro", label: "Outro" },
];

// Calculate approximate area from polygon coordinates (in hectares)
const calculatePolygonArea = (coordinates: number[][]): number => {
  if (coordinates.length < 3) return 0;
  
  let area = 0;
  const n = coordinates.length;
  
  for (let i = 0; i < n - 1; i++) {
    const [x1, y1] = coordinates[i];
    const [x2, y2] = coordinates[i + 1];
    area += x1 * y2 - x2 * y1;
  }
  
  area = Math.abs(area) / 2;
  // Convert from square degrees to hectares (approximate)
  const areaInKm2 = area * 111 * 111 * Math.cos((coordinates[0][1] * Math.PI) / 180);
  return Math.round(areaInKm2 * 100); // hectares
};

// Get center point of polygon
const getPolygonCenter = (coordinates: number[][]): [number, number] => {
  let sumLng = 0;
  let sumLat = 0;
  const n = coordinates.length - 1; // Exclude closing point
  
  for (let i = 0; i < n; i++) {
    sumLng += coordinates[i][0];
    sumLat += coordinates[i][1];
  }
  
  return [sumLng / n, sumLat / n];
};

export const TerritoryMap = ({ onTerritorySelect, onTerritoryCreate, mapboxToken }: TerritoryMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const draw = useRef<MapboxDraw | null>(null);
  const [territories, setTerritories] = useState<Territory[]>(initialTerritories);
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [token, setToken] = useState(() => mapboxToken || localStorage.getItem(MAPBOX_TOKEN_KEY) || "");
  const [tokenInput, setTokenInput] = useState("");
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnPolygon, setDrawnPolygon] = useState<GeoJSON.Feature | null>(null);
  const [newTerritoryName, setNewTerritoryName] = useState("");
  const [newTerritoryType, setNewTerritoryType] = useState("");

  const handleSaveToken = () => {
    if (tokenInput.trim()) {
      localStorage.setItem(MAPBOX_TOKEN_KEY, tokenInput.trim());
      setToken(tokenInput.trim());
      setShowTokenInput(false);
    }
  };

  const handleChangeToken = () => {
    setTokenInput(token);
    setShowTokenInput(true);
  };

  const startDrawing = () => {
    if (draw.current) {
      draw.current.changeMode("draw_polygon");
      setIsDrawing(true);
      setSelectedTerritory(null);
    }
  };

  const cancelDrawing = () => {
    if (draw.current) {
      draw.current.deleteAll();
      draw.current.changeMode("simple_select");
    }
    setIsDrawing(false);
    setDrawnPolygon(null);
    setNewTerritoryName("");
    setNewTerritoryType("");
  };

  const deleteSelected = () => {
    if (draw.current) {
      const selected = draw.current.getSelected();
      if (selected.features.length > 0) {
        draw.current.delete(selected.features.map(f => f.id as string));
        setDrawnPolygon(null);
      }
    }
  };

  const saveTerritory = useCallback(() => {
    if (!drawnPolygon || !newTerritoryName.trim() || !newTerritoryType) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const polygonGeometry = drawnPolygon.geometry as GeoJSON.Polygon;
    const coordinates = polygonGeometry.coordinates[0];
    const center = getPolygonCenter(coordinates);
    const area = calculatePolygonArea(coordinates);

    const newTerritory: Territory = {
      id: `new-${Date.now()}`,
      name: newTerritoryName.trim(),
      type: newTerritoryType,
      coordinates: center,
      emissions: 0,
      area: area,
      status: "active",
      polygon: polygonGeometry,
    };

    setTerritories(prev => [...prev, newTerritory]);
    onTerritoryCreate?.(newTerritory);
    
    // Add marker for new territory
    if (map.current) {
      const markerEl = document.createElement("div");
      markerEl.className = "territory-marker";
      markerEl.style.cssText = `
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #22c55e;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: transform 0.2s;
      `;
      markerEl.addEventListener("mouseenter", () => {
        markerEl.style.transform = "scale(1.2)";
      });
      markerEl.addEventListener("mouseleave", () => {
        markerEl.style.transform = "scale(1)";
      });
      markerEl.addEventListener("click", () => {
        setSelectedTerritory(newTerritory);
        onTerritorySelect?.(newTerritory);
      });

      new mapboxgl.Marker(markerEl)
        .setLngLat(center)
        .addTo(map.current);
    }

    toast.success(`Território "${newTerritoryName}" criado com sucesso!`);
    
    // Keep the polygon visible but exit draw mode
    if (draw.current) {
      draw.current.changeMode("simple_select");
    }
    
    setIsDrawing(false);
    setDrawnPolygon(null);
    setNewTerritoryName("");
    setNewTerritoryType("");
  }, [drawnPolygon, newTerritoryName, newTerritoryType, onTerritoryCreate, onTerritorySelect]);

  useEffect(() => {
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [-55, -15],
      zoom: 3.5,
    });

    // Initialize draw control
    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {},
      defaultMode: "simple_select",
      styles: [
        {
          id: "gl-draw-polygon-fill",
          type: "fill",
          filter: ["all", ["==", "$type", "Polygon"]],
          paint: {
            "fill-color": "#22c55e",
            "fill-opacity": 0.3,
          },
        },
        {
          id: "gl-draw-polygon-stroke",
          type: "line",
          filter: ["all", ["==", "$type", "Polygon"]],
          paint: {
            "line-color": "#22c55e",
            "line-width": 2,
          },
        },
        {
          id: "gl-draw-polygon-midpoint",
          type: "circle",
          filter: ["all", ["==", "$type", "Point"], ["==", "meta", "midpoint"]],
          paint: {
            "circle-radius": 4,
            "circle-color": "#22c55e",
          },
        },
        {
          id: "gl-draw-polygon-vertex",
          type: "circle",
          filter: ["all", ["==", "$type", "Point"], ["==", "meta", "vertex"]],
          paint: {
            "circle-radius": 6,
            "circle-color": "#ffffff",
            "circle-stroke-color": "#22c55e",
            "circle-stroke-width": 2,
          },
        },
      ],
    });

    map.current.addControl(draw.current as unknown as mapboxgl.IControl, "top-right");
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Handle draw events
    map.current.on("draw.create", (e: { features: GeoJSON.Feature[] }) => {
      if (e.features.length > 0) {
        setDrawnPolygon(e.features[0]);
      }
    });

    map.current.on("draw.update", (e: { features: GeoJSON.Feature[] }) => {
      if (e.features.length > 0) {
        setDrawnPolygon(e.features[0]);
      }
    });

    map.current.on("draw.delete", () => {
      setDrawnPolygon(null);
    });

    map.current.on("load", () => {
      setIsMapLoaded(true);

      // Add territory markers
      territories.forEach((territory) => {
        const markerEl = document.createElement("div");
        markerEl.className = "territory-marker";
        markerEl.style.cssText = `
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: ${territory.status === "alert" ? "#ef4444" : territory.status === "monitoring" ? "#f59e0b" : "#22c55e"};
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          transition: transform 0.2s;
        `;
        markerEl.addEventListener("mouseenter", () => {
          markerEl.style.transform = "scale(1.2)";
        });
        markerEl.addEventListener("mouseleave", () => {
          markerEl.style.transform = "scale(1)";
        });
        markerEl.addEventListener("click", () => {
          setSelectedTerritory(territory);
          onTerritorySelect?.(territory);
        });

        new mapboxgl.Marker(markerEl)
          .setLngLat(territory.coordinates as [number, number])
          .addTo(map.current!);
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [token]);

  if (!token || showTokenInput) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Mapa Territorial
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex flex-col items-center justify-center bg-secondary/30 rounded-lg">
            <p className="text-muted-foreground mb-4 text-center px-4">
              {showTokenInput ? "Alterar token do Mapbox" : "Configure seu token do Mapbox para visualizar o mapa interativo"}
            </p>
            <div className="w-full max-w-sm space-y-3">
              <Input
                placeholder="Cole seu Mapbox Public Token aqui"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveToken()}
              />
              <div className="flex gap-2">
                <Button onClick={handleSaveToken} className="flex-1">
                  Salvar Token
                </Button>
                {showTokenInput && (
                  <Button variant="outline" onClick={() => setShowTokenInput(false)}>
                    Cancelar
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Obtenha seu token em{" "}
                <a
                  href="https://mapbox.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  mapbox.com
                </a>
                {" "}→ Tokens
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Mapa Territorial
          </CardTitle>
          <div className="flex items-center gap-2">
            {!isDrawing ? (
              <>
                <Button variant="default" size="sm" onClick={startDrawing}>
                  <Pencil className="w-4 h-4 mr-1" />
                  Desenhar Território
                </Button>
                <Button variant="outline" size="sm" onClick={handleChangeToken}>
                  Alterar Token
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={deleteSelected}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Excluir
                </Button>
                <Button variant="destructive" size="sm" onClick={cancelDrawing}>
                  <X className="w-4 h-4 mr-1" />
                  Cancelar
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          <div ref={mapContainer} className="h-[400px] rounded-b-lg" />
          
          {/* Drawing Instructions */}
          {isDrawing && !drawnPolygon && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-sm border border-border rounded-lg px-4 py-2 shadow-lg">
              <p className="text-sm font-medium">Clique no mapa para desenhar o polígono do território</p>
              <p className="text-xs text-muted-foreground">Clique duas vezes para finalizar</p>
            </div>
          )}

          {/* Save Territory Panel */}
          {drawnPolygon && (
            <div className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg">
              <h3 className="font-semibold mb-3">Salvar Novo Território</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="territory-name">Nome do Território *</Label>
                  <Input
                    id="territory-name"
                    placeholder="Ex: Reserva Norte"
                    value={newTerritoryName}
                    onChange={(e) => setNewTerritoryName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Tipo de Território *</Label>
                  <Select value={newTerritoryType} onValueChange={setNewTerritoryType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {territoryTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-muted-foreground">
                  Área estimada:{" "}
                  <span className="font-medium text-foreground">
                    {calculatePolygonArea(
                      (drawnPolygon.geometry as GeoJSON.Polygon).coordinates[0]
                    ).toLocaleString()}{" "}
                    ha
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveTerritory} className="flex-1">
                    <Save className="w-4 h-4 mr-1" />
                    Salvar Território
                  </Button>
                  <Button variant="outline" onClick={cancelDrawing}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Selected Territory Panel */}
          {selectedTerritory && !isDrawing && (
            <div className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{selectedTerritory.name}</h3>
                    <Badge
                      variant={
                        selectedTerritory.status === "alert"
                          ? "destructive"
                          : selectedTerritory.status === "monitoring"
                          ? "secondary"
                          : "default"
                      }
                      className="text-xs"
                    >
                      {selectedTerritory.status === "alert"
                        ? "Alerta"
                        : selectedTerritory.status === "monitoring"
                        ? "Monitorando"
                        : "Ativo"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedTerritory.type}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTerritory(null)}
                >
                  ✕
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <p className="text-xs text-muted-foreground">Emissões</p>
                  <p className="font-semibold">{selectedTerritory.emissions.toLocaleString()} tCO₂e</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Área</p>
                  <p className="font-semibold">{selectedTerritory.area.toLocaleString()} ha</p>
                </div>
              </div>
            </div>
          )}

          {/* Legend */}
          {!isDrawing && !drawnPolygon && (
            <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3">
              <p className="text-xs font-medium mb-2">Legenda</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-xs">Ativo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <span className="text-xs">Monitorando</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="text-xs">Alerta</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
