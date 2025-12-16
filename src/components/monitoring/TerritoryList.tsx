import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Territory {
  id: string;
  name: string;
  type: string;
  area: number;
  emissions: number;
  status: "active" | "monitoring" | "alert";
  lastUpdate: string;
}

const territories: Territory[] = [
  {
    id: "1",
    name: "Mina Carajás",
    type: "Mineração",
    area: 8500,
    emissions: 4200,
    status: "active",
    lastUpdate: "Há 2 horas",
  },
  {
    id: "2",
    name: "Terminal Portuário SP",
    type: "Logística",
    area: 1200,
    emissions: 1800,
    status: "active",
    lastUpdate: "Há 4 horas",
  },
  {
    id: "3",
    name: "Planta Industrial MG",
    type: "Industrial",
    area: 450,
    emissions: 2100,
    status: "monitoring",
    lastUpdate: "Há 1 dia",
  },
  {
    id: "4",
    name: "Reserva Florestal AM",
    type: "Conservação",
    area: 15000,
    emissions: 320,
    status: "active",
    lastUpdate: "Há 6 horas",
  },
  {
    id: "5",
    name: "Porto Rio de Janeiro",
    type: "Logística",
    area: 890,
    emissions: 1400,
    status: "alert",
    lastUpdate: "Há 30 min",
  },
];

const getStatusConfig = (status: Territory["status"]) => {
  switch (status) {
    case "alert":
      return { label: "Alerta", className: "bg-destructive/10 text-destructive" };
    case "monitoring":
      return { label: "Monitorando", className: "bg-warning/10 text-warning" };
    default:
      return { label: "Ativo", className: "bg-success/10 text-success" };
  }
};

interface TerritoryListProps {
  onTerritorySelect?: (territory: Territory) => void;
}

export const TerritoryList = ({ onTerritorySelect }: TerritoryListProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Territórios</CardTitle>
          <Button size="sm" variant="outline" className="gap-1">
            <Plus className="w-4 h-4" />
            Novo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {territories.map((territory) => {
            const statusConfig = getStatusConfig(territory.status);
            return (
              <div
                key={territory.id}
                onClick={() => onTerritorySelect?.(territory)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg cursor-pointer",
                  "bg-secondary/50 hover:bg-secondary transition-colors"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{territory.name}</p>
                      <Badge className={cn("text-[10px]", statusConfig.className)}>
                        {statusConfig.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {territory.type} • {territory.area.toLocaleString()} ha
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium">
                      {territory.emissions.toLocaleString()} tCO₂e
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {territory.lastUpdate}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
