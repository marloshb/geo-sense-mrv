import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFybG9zaGVucmlxdWUiLCJhIjoiY21hNG1rM2ZiMDh3NTJ2b2J0cmo2ZnB3NCJ9.l46r0hLceJZVdLGUDJKBlQ';

interface TerritoryEmission {
  id: string;
  name: string;
  emissions: number;
  level: 'high' | 'medium' | 'low';
  coordinates: [number, number][];
  center: [number, number];
}

const territoriesEmissions: TerritoryEmission[] = [
  {
    id: "1",
    name: "Carajás",
    emissions: 4200,
    level: "high",
    center: [-49.9, -6.1],
    coordinates: [
      [-50.5, -5.5], [-49.3, -5.5], [-49.3, -6.7], [-50.5, -6.7], [-50.5, -5.5]
    ]
  },
  {
    id: "2",
    name: "Planta MG",
    emissions: 2100,
    level: "medium",
    center: [-44.0, -19.9],
    coordinates: [
      [-44.5, -19.4], [-43.5, -19.4], [-43.5, -20.4], [-44.5, -20.4], [-44.5, -19.4]
    ]
  },
  {
    id: "3",
    name: "Reserva AM",
    emissions: 320,
    level: "low",
    center: [-60.0, -3.1],
    coordinates: [
      [-61.0, -2.0], [-59.0, -2.0], [-59.0, -4.2], [-61.0, -4.2], [-61.0, -2.0]
    ]
  },
  {
    id: "4",
    name: "Terminal SP",
    emissions: 1800,
    level: "medium",
    center: [-46.3, -23.5],
    coordinates: [
      [-46.8, -23.0], [-45.8, -23.0], [-45.8, -24.0], [-46.8, -24.0], [-46.8, -23.0]
    ]
  },
  {
    id: "5",
    name: "Porto RJ",
    emissions: 1400,
    level: "low",
    center: [-43.2, -22.9],
    coordinates: [
      [-43.6, -22.5], [-42.8, -22.5], [-42.8, -23.3], [-43.6, -23.3], [-43.6, -22.5]
    ]
  }
];

const getEmissionColor = (level: string): string => {
  switch (level) {
    case "high": return "#ef4444";
    case "medium": return "#f59e0b";
    case "low": return "#22c55e";
    default: return "#6b7280";
  }
};

interface EmissionsMapProps {
  selectedIndicator?: string;
}

export function EmissionsMap({ selectedIndicator = 'emissions' }: EmissionsMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-52.0, -14.0],
      zoom: 3.5,
      pitch: 20,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      'top-right'
    );

    map.current.on('load', () => {
      if (!map.current) return;
      setIsMapLoaded(true);

      // Add territories source
      map.current.addSource('emissions-territories', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: territoriesEmissions.map(t => ({
            type: 'Feature',
            properties: {
              id: t.id,
              name: t.name,
              emissions: t.emissions,
              level: t.level
            },
            geometry: {
              type: 'Polygon',
              coordinates: [t.coordinates]
            }
          }))
        }
      });

      // Territory fill layer
      map.current.addLayer({
        id: 'emissions-fill',
        type: 'fill',
        source: 'emissions-territories',
        paint: {
          'fill-color': [
            'match',
            ['get', 'level'],
            'high', '#ef4444',
            'medium', '#f59e0b',
            'low', '#22c55e',
            '#6b7280'
          ],
          'fill-opacity': 0.6
        }
      });

      // Territory outline layer
      map.current.addLayer({
        id: 'emissions-outline',
        type: 'line',
        source: 'emissions-territories',
        paint: {
          'line-color': [
            'match',
            ['get', 'level'],
            'high', '#dc2626',
            'medium', '#d97706',
            'low', '#16a34a',
            '#4b5563'
          ],
          'line-width': 2
        }
      });

      // Add markers with emissions values
      territoriesEmissions.forEach(territory => {
        const el = document.createElement('div');
        el.className = 'emissions-marker';
        el.style.cssText = `
          background-color: ${getEmissionColor(territory.level)};
          border: 2px solid white;
          border-radius: 8px;
          padding: 4px 8px;
          cursor: pointer;
          font-size: 11px;
          font-weight: bold;
          color: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          white-space: nowrap;
        `;
        el.innerHTML = `${territory.emissions.toLocaleString()} tCO₂e`;

        const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
          .setHTML(`
            <div style="padding: 8px; min-width: 150px;">
              <h3 style="font-weight: bold; margin-bottom: 4px; font-size: 14px;">${territory.name}</h3>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <span style="background: ${getEmissionColor(territory.level)}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">
                  ${territory.emissions.toLocaleString()} tCO₂e
                </span>
              </div>
              <p style="font-size: 11px; color: #666;">
                Nível: ${territory.level === 'high' ? 'Alto' : territory.level === 'medium' ? 'Médio' : 'Baixo'}
              </p>
            </div>
          `);

        new mapboxgl.Marker(el)
          .setLngLat(territory.center)
          .setPopup(popup)
          .addTo(map.current!);
      });
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/95 p-3 rounded-lg shadow-lg z-10">
        <p className="text-xs font-semibold mb-2">Emissões (tCO₂e)</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ef4444' }} />
            <span className="text-xs">Alto (&gt; 3000)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f59e0b' }} />
            <span className="text-xs">Médio (1000-3000)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#22c55e' }} />
            <span className="text-xs">Baixo (&lt; 1000)</span>
          </div>
        </div>
      </div>

      {/* Indicator badge */}
      <div className="absolute top-4 left-4 bg-background/95 px-3 py-1.5 rounded-lg z-10">
        <p className="text-xs font-semibold">Mapa Temático: Emissões</p>
      </div>
    </div>
  );
}
