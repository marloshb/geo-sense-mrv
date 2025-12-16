import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layers, Maximize2, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

// Demo territories with coordinates in Brazil
const territories = [
  {
    id: "1",
    name: "Mina Carajás",
    type: "Mineração",
    coordinates: [-50.0, -6.0],
    emissions: 4200,
    area: 8500,
    status: "active",
  },
  {
    id: "2",
    name: "Terminal Portuário SP",
    type: "Logística",
    coordinates: [-46.3, -23.9],
    emissions: 1800,
    area: 1200,
    status: "active",
  },
  {
    id: "3",
    name: "Planta Industrial MG",
    type: "Industrial",
    coordinates: [-43.9, -19.9],
    emissions: 2100,
    area: 450,
    status: "monitoring",
  },
  {
    id: "4",
    name: "Reserva Florestal AM",
    type: "Conservação",
    coordinates: [-60.0, -3.0],
    emissions: 320,
    area: 15000,
    status: "active",
  },
  {
    id: "5",
    name: "Porto Rio de Janeiro",
    type: "Logística",
    coordinates: [-43.2, -22.9],
    emissions: 1400,
    area: 890,
    status: "alert",
  },
];

interface TerritoryMapProps {
  onTerritorySelect?: (territory: typeof territories[0]) => void;
  mapboxToken?: string;
}

export const TerritoryMap = ({ onTerritorySelect, mapboxToken }: TerritoryMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedTerritory, setSelectedTerritory] = useState<typeof territories[0] | null>(null);
  const [token, setToken] = useState(mapboxToken || "");
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-55, -15],
      zoom: 3.5,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

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
  }, [token, onTerritorySelect]);

  if (!token) {
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
              Configure seu token do Mapbox para visualizar o mapa interativo
            </p>
            <div className="w-full max-w-sm space-y-3">
              <Input
                placeholder="Cole seu Mapbox Public Token aqui"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
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
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-1" />
              Filtros
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          <div ref={mapContainer} className="h-[400px] rounded-b-lg" />
          
          {/* Selected Territory Panel */}
          {selectedTerritory && (
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
        </div>
      </CardContent>
    </Card>
  );
};
