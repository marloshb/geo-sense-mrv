import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Factory,
  MapPin,
  Plus,
  Search,
  ChevronRight,
  Building2,
  Truck,
  Leaf,
  Zap,
  HardHat,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Asset {
  id: string;
  name: string;
  type: string;
  territoryId: string;
  territoryName: string;
  status: "operational" | "maintenance" | "inactive";
  coordinates: [number, number];
  metadata?: {
    capacity?: string;
    startDate?: string;
    responsible?: string;
  };
}

const mockAssets: Asset[] = [
  {
    id: "asset-1",
    name: "Usina de Processamento A",
    type: "plant",
    territoryId: "1",
    territoryName: "Mina Carajás",
    status: "operational",
    coordinates: [-50.1, -6.1],
    metadata: {
      capacity: "5000 t/dia",
      startDate: "2018-03-15",
      responsible: "João Silva",
    },
  },
  {
    id: "asset-2",
    name: "Pátio de Estocagem B",
    type: "infrastructure",
    territoryId: "1",
    territoryName: "Mina Carajás",
    status: "operational",
    coordinates: [-50.05, -6.05],
    metadata: {
      capacity: "200.000 t",
      startDate: "2019-08-20",
    },
  },
  {
    id: "asset-3",
    name: "Terminal de Carga",
    type: "logistics",
    territoryId: "2",
    territoryName: "Terminal Portuário SP",
    status: "maintenance",
    coordinates: [-46.35, -23.92],
    metadata: {
      capacity: "1000 TEUs/dia",
    },
  },
  {
    id: "asset-4",
    name: "Caldeira Industrial",
    type: "energy",
    territoryId: "3",
    territoryName: "Planta Industrial MG",
    status: "operational",
    coordinates: [-43.92, -19.92],
  },
  {
    id: "asset-5",
    name: "Estação de Monitoramento",
    type: "monitoring",
    territoryId: "4",
    territoryName: "Reserva Florestal AM",
    status: "operational",
    coordinates: [-60.05, -3.05],
  },
];

const assetTypeConfig: Record<string, { label: string; icon: typeof Factory; color: string }> = {
  plant: { label: "Planta", icon: Factory, color: "text-primary" },
  infrastructure: { label: "Infraestrutura", icon: Building2, color: "text-secondary-foreground" },
  logistics: { label: "Logística", icon: Truck, color: "text-warning" },
  energy: { label: "Energia", icon: Zap, color: "text-destructive" },
  monitoring: { label: "Monitoramento", icon: Leaf, color: "text-success" },
  mining: { label: "Mineração", icon: HardHat, color: "text-primary" },
};

const statusConfig = {
  operational: { label: "Operacional", className: "bg-success/10 text-success" },
  maintenance: { label: "Manutenção", className: "bg-warning/10 text-warning" },
  inactive: { label: "Inativo", className: "bg-muted text-muted-foreground" },
};

interface AssetListProps {
  onAssetSelect?: (asset: Asset) => void;
  onAddAsset?: () => void;
  territoryFilter?: string;
}

export const AssetList = ({ onAssetSelect, onAddAsset, territoryFilter }: AssetListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredAssets = mockAssets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.territoryName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || asset.type === typeFilter;
    const matchesStatus = statusFilter === "all" || asset.status === statusFilter;
    const matchesTerritory = !territoryFilter || asset.territoryId === territoryFilter;
    return matchesSearch && matchesType && matchesStatus && matchesTerritory;
  });

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Factory className="w-4 h-4" />
            Ativos Espaciais
          </CardTitle>
          <Button size="sm" onClick={onAddAsset}>
            <Plus className="w-4 h-4 mr-1" />
            Novo Ativo
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar ativos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="flex-1">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {Object.entries(assetTypeConfig).map(([value, config]) => (
                  <SelectItem key={value} value={value}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="operational">Operacional</SelectItem>
                <SelectItem value="maintenance">Manutenção</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Asset List */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {filteredAssets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Factory className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhum ativo encontrado</p>
            </div>
          ) : (
            filteredAssets.map((asset) => {
              const typeConfig = assetTypeConfig[asset.type] || assetTypeConfig.plant;
              const TypeIcon = typeConfig.icon;
              const status = statusConfig[asset.status];

              return (
                <div
                  key={asset.id}
                  onClick={() => onAssetSelect?.(asset)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg cursor-pointer",
                    "bg-secondary/50 hover:bg-secondary transition-colors"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg bg-background flex items-center justify-center",
                      typeConfig.color
                    )}>
                      <TypeIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{asset.name}</p>
                        <Badge className={cn("text-[10px]", status.className)}>
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {asset.territoryName} • {typeConfig.label}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              );
            })
          )}
        </div>

        {/* Summary */}
        <div className="pt-3 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total de ativos:</span>
            <span className="font-medium">{filteredAssets.length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
