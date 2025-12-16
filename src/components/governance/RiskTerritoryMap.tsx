import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, RefreshCw } from "lucide-react";

interface RiskLayer {
  id: string;
  name: string;
  type: "physical" | "transition" | "combined";
  enabled: boolean;
  opacity: number;
}

interface TerritoryRisk {
  id: string;
  name: string;
  riskLevel: string;
  score: number;
  coordinates: [number, number][];
  center: [number, number];
  risks: string[];
}

interface RiskTerritoryMapProps {
  layers: RiskLayer[];
  scenario: string;
  horizon: string;
  onTerritorySelect?: (territory: TerritoryRisk | null) => void;
}

// Dados de territórios com riscos climáticos (coordenadas fictícias baseadas no Brasil)
const territoriesWithRisks: TerritoryRisk[] = [
  {
    id: "1",
    name: "Complexo Mineração Norte",
    riskLevel: "critical",
    score: 92,
    center: [-49.2, -16.3],
    coordinates: [
      [-49.4, -16.1], [-49.0, -16.1], [-49.0, -16.5], [-49.4, -16.5], [-49.4, -16.1]
    ],
    risks: ["Estresse Hídrico", "Ondas de Calor", "Regulação"]
  },
  {
    id: "2", 
    name: "Planta Industrial Sul",
    riskLevel: "high",
    score: 78,
    center: [-51.2, -29.9],
    coordinates: [
      [-51.4, -29.7], [-51.0, -29.7], [-51.0, -30.1], [-51.4, -30.1], [-51.4, -29.7]
    ],
    risks: ["Inundação", "Ventos Extremos"]
  },
  {
    id: "3",
    name: "Área Operacional Centro-Oeste",
    riskLevel: "medium",
    score: 45,
    center: [-55.8, -15.6],
    coordinates: [
      [-56.2, -15.2], [-55.4, -15.2], [-55.4, -16.0], [-56.2, -16.0], [-56.2, -15.2]
    ],
    risks: ["Seca", "Incêndio"]
  },
  {
    id: "4",
    name: "Reserva Ambiental Leste",
    riskLevel: "low",
    score: 18,
    center: [-43.2, -22.9],
    coordinates: [
      [-43.5, -22.7], [-42.9, -22.7], [-42.9, -23.1], [-43.5, -23.1], [-43.5, -22.7]
    ],
    risks: []
  },
  {
    id: "5",
    name: "Terminal Portuário Nordeste",
    riskLevel: "high",
    score: 72,
    center: [-38.5, -3.7],
    coordinates: [
      [-38.7, -3.5], [-38.3, -3.5], [-38.3, -3.9], [-38.7, -3.9], [-38.7, -3.5]
    ],
    risks: ["Elevação do Mar", "Tempestades"]
  },
  {
    id: "6",
    name: "Complexo Agroindustrial",
    riskLevel: "medium",
    score: 52,
    center: [-47.9, -21.2],
    coordinates: [
      [-48.3, -20.8], [-47.5, -20.8], [-47.5, -21.6], [-48.3, -21.6], [-48.3, -20.8]
    ],
    risks: ["Seca", "Geada"]
  }
];

// Pontos de risco simulados (heatmap data)
const riskHotspots = [
  { coordinates: [-49.2, -16.3], intensity: 0.95, type: "heat" },
  { coordinates: [-49.1, -16.4], intensity: 0.85, type: "heat" },
  { coordinates: [-51.2, -29.9], intensity: 0.75, type: "flood" },
  { coordinates: [-51.3, -29.8], intensity: 0.70, type: "flood" },
  { coordinates: [-55.8, -15.6], intensity: 0.50, type: "drought" },
  { coordinates: [-38.5, -3.7], intensity: 0.72, type: "flood" },
  { coordinates: [-47.9, -21.2], intensity: 0.55, type: "drought" },
];

const getRiskColor = (level: string): string => {
  switch (level) {
    case "critical": return "#ef4444";
    case "high": return "#f97316";
    case "medium": return "#eab308";
    case "low": return "#22c55e";
    default: return "#6b7280";
  }
};

const MAPBOX_TOKEN_KEY = 'mapbox_risk_token';

export function RiskTerritoryMap({ layers, scenario, horizon, onTerritorySelect }: RiskTerritoryMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapToken, setMapToken] = useState<string>(() => {
    return localStorage.getItem(MAPBOX_TOKEN_KEY) || '';
  });
  const [tokenInput, setTokenInput] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedTerritory, setSelectedTerritory] = useState<TerritoryRisk | null>(null);

  const handleSaveToken = () => {
    if (tokenInput.trim()) {
      localStorage.setItem(MAPBOX_TOKEN_KEY, tokenInput.trim());
      setMapToken(tokenInput.trim());
    }
  };

  const handleChangeToken = () => {
    localStorage.removeItem(MAPBOX_TOKEN_KEY);
    setMapToken('');
    setTokenInput('');
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    setIsMapLoaded(false);
  };

  // Inicializa o mapa
  useEffect(() => {
    if (!mapContainer.current || !mapToken) return;

    mapboxgl.accessToken = mapToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-50.0, -15.0],
      zoom: 4,
      pitch: 30,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      'top-right'
    );

    map.current.on('load', () => {
      if (!map.current) return;
      setIsMapLoaded(true);

      // Adiciona fonte de territórios
      map.current.addSource('territories', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: territoriesWithRisks.map(t => ({
            type: 'Feature',
            properties: {
              id: t.id,
              name: t.name,
              riskLevel: t.riskLevel,
              score: t.score,
              risks: t.risks.join(', ')
            },
            geometry: {
              type: 'Polygon',
              coordinates: [t.coordinates]
            }
          }))
        }
      });

      // Camada de preenchimento dos territórios
      map.current.addLayer({
        id: 'territories-fill',
        type: 'fill',
        source: 'territories',
        paint: {
          'fill-color': [
            'match',
            ['get', 'riskLevel'],
            'critical', '#ef4444',
            'high', '#f97316',
            'medium', '#eab308',
            'low', '#22c55e',
            '#6b7280'
          ],
          'fill-opacity': 0.5
        }
      });

      // Camada de contorno dos territórios
      map.current.addLayer({
        id: 'territories-outline',
        type: 'line',
        source: 'territories',
        paint: {
          'line-color': [
            'match',
            ['get', 'riskLevel'],
            'critical', '#dc2626',
            'high', '#ea580c',
            'medium', '#ca8a04',
            'low', '#16a34a',
            '#4b5563'
          ],
          'line-width': 2
        }
      });

      // Adiciona fonte de hotspots para heatmap
      map.current.addSource('risk-hotspots', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: riskHotspots.map(h => ({
            type: 'Feature',
            properties: { intensity: h.intensity, type: h.type },
            geometry: {
              type: 'Point',
              coordinates: h.coordinates
            }
          }))
        }
      });

      // Camada de heatmap de riscos
      map.current.addLayer({
        id: 'risk-heatmap',
        type: 'heatmap',
        source: 'risk-hotspots',
        paint: {
          'heatmap-weight': ['get', 'intensity'],
          'heatmap-intensity': 1.5,
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0,0,0,0)',
            0.2, 'rgba(34,197,94,0.4)',
            0.4, 'rgba(234,179,8,0.5)',
            0.6, 'rgba(249,115,22,0.6)',
            0.8, 'rgba(239,68,68,0.7)',
            1, 'rgba(185,28,28,0.9)'
          ],
          'heatmap-radius': 50,
          'heatmap-opacity': 0.7
        }
      });

      // Adiciona marcadores para cada território
      territoriesWithRisks.forEach(territory => {
        const el = document.createElement('div');
        el.className = 'risk-marker';
        el.style.cssText = `
          width: 30px;
          height: 30px;
          background-color: ${getRiskColor(territory.riskLevel)};
          border: 3px solid white;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          color: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        `;
        el.innerHTML = `${territory.score}`;

        const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
          .setHTML(`
            <div style="padding: 8px; min-width: 200px;">
              <h3 style="font-weight: bold; margin-bottom: 4px; font-size: 14px;">${territory.name}</h3>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <span style="background: ${getRiskColor(territory.riskLevel)}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">
                  Score: ${territory.score}
                </span>
              </div>
              ${territory.risks.length > 0 ? `
                <p style="font-size: 12px; color: #666; margin-bottom: 4px;">Riscos identificados:</p>
                <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                  ${territory.risks.map(r => `<span style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 11px;">${r}</span>`).join('')}
                </div>
              ` : '<p style="font-size: 12px; color: #22c55e;">Sem riscos críticos identificados</p>'}
            </div>
          `);

        const marker = new mapboxgl.Marker(el)
          .setLngLat(territory.center)
          .setPopup(popup)
          .addTo(map.current!);

        el.addEventListener('click', () => {
          setSelectedTerritory(territory);
          onTerritorySelect?.(territory);
        });
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [mapToken]);

  // Atualiza visibilidade das camadas baseado nos controles
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    const floodLayer = layers.find(l => l.id === 'flood');
    const heatmapVisible = layers.some(l => l.enabled && (l.id === 'flood' || l.id === 'drought' || l.id === 'heat'));
    
    if (map.current.getLayer('risk-heatmap')) {
      map.current.setLayoutProperty(
        'risk-heatmap',
        'visibility',
        heatmapVisible ? 'visible' : 'none'
      );
      
      if (heatmapVisible) {
        const avgOpacity = layers.filter(l => l.enabled).reduce((acc, l) => acc + l.opacity, 0) / 
                          layers.filter(l => l.enabled).length || 70;
        map.current.setPaintProperty('risk-heatmap', 'heatmap-opacity', avgOpacity / 100);
      }
    }
  }, [layers, isMapLoaded]);

  // Se não tem token, mostra formulário
  if (!mapToken) {
    return (
      <Card className="h-[500px] flex items-center justify-center">
        <CardContent className="text-center space-y-4 max-w-md">
          <Key className="h-12 w-12 text-muted-foreground mx-auto" />
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Configure o Mapbox</h3>
            <p className="text-sm text-muted-foreground">
              Para visualizar o mapa de risco territorial, insira seu token público do Mapbox.
              Obtenha em <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="token">Token Público Mapbox</Label>
            <Input
              id="token"
              type="text"
              placeholder="pk.eyJ1Ijo..."
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
            />
          </div>
          <Button onClick={handleSaveToken} disabled={!tokenInput.trim()}>
            Ativar Mapa
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative h-[500px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Botão para trocar token */}
      <div className="absolute top-4 right-16 z-10">
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={handleChangeToken}
          className="bg-background/90 hover:bg-background"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Trocar Token
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/95 p-3 rounded-lg shadow-lg z-10">
        <p className="text-xs font-semibold mb-2">Níveis de Risco</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ef4444' }} />
            <span className="text-xs">Crítico (≥80)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f97316' }} />
            <span className="text-xs">Alto (60-79)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#eab308' }} />
            <span className="text-xs">Médio (40-59)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#22c55e' }} />
            <span className="text-xs">Baixo (&lt;40)</span>
          </div>
        </div>
      </div>

      {/* Scenario Info */}
      <div className="absolute top-4 left-4 bg-background/95 p-2 rounded-lg z-10">
        <p className="text-xs font-semibold">
          Cenário: {scenario === "current" ? "Atual" : scenario === "rcp45" ? "RCP 4.5" : "RCP 8.5"}
        </p>
        <p className="text-xs text-muted-foreground">Horizonte: {horizon}</p>
      </div>

      {/* Selected territory info */}
      {selectedTerritory && (
        <div className="absolute bottom-4 right-4 bg-background/95 p-3 rounded-lg shadow-lg z-10 max-w-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-sm">{selectedTerritory.name}</span>
            <button 
              onClick={() => {
                setSelectedTerritory(null);
                onTerritorySelect?.(null);
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
          <div 
            className="text-white text-xs px-2 py-1 rounded inline-block mb-2"
            style={{ backgroundColor: getRiskColor(selectedTerritory.riskLevel) }}
          >
            Score de Risco: {selectedTerritory.score}
          </div>
          {selectedTerritory.risks.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selectedTerritory.risks.map(risk => (
                <span key={risk} className="text-xs bg-muted px-2 py-0.5 rounded">
                  {risk}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
