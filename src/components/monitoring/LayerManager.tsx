import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Layers,
  Plus,
  Upload,
  Eye,
  EyeOff,
  Settings,
  Trash2,
  GripVertical,
  Map,
  Mountain,
  Droplets,
  Trees,
  Shield,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface GeoLayer {
  id: string;
  name: string;
  type: "polygon" | "line" | "raster" | "point";
  category: "base" | "context" | "user";
  visible: boolean;
  opacity: number;
  source: string;
  icon: typeof Layers;
  color: string;
  metadata?: {
    date?: string;
    source?: string;
    responsible?: string;
  };
}

const defaultLayers: GeoLayer[] = [
  {
    id: "layer-1",
    name: "Limites Territoriais",
    type: "polygon",
    category: "base",
    visible: true,
    opacity: 100,
    source: "Sistema",
    icon: Map,
    color: "text-primary",
  },
  {
    id: "layer-2",
    name: "Uso do Solo - 2024",
    type: "raster",
    category: "context",
    visible: true,
    opacity: 80,
    source: "MapBiomas",
    icon: Mountain,
    color: "text-success",
  },
  {
    id: "layer-3",
    name: "Biomas Brasileiros",
    type: "polygon",
    category: "context",
    visible: false,
    opacity: 70,
    source: "IBGE",
    icon: Trees,
    color: "text-success",
  },
  {
    id: "layer-4",
    name: "Hidrografia",
    type: "line",
    category: "context",
    visible: false,
    opacity: 100,
    source: "ANA",
    icon: Droplets,
    color: "text-blue-500",
  },
  {
    id: "layer-5",
    name: "Áreas Protegidas",
    type: "polygon",
    category: "context",
    visible: true,
    opacity: 60,
    source: "ICMBio",
    icon: Shield,
    color: "text-warning",
  },
  {
    id: "layer-6",
    name: "Municípios",
    type: "polygon",
    category: "context",
    visible: false,
    opacity: 50,
    source: "IBGE",
    icon: Building,
    color: "text-muted-foreground",
  },
];

const layerTypes = [
  { value: "polygon", label: "Polígono" },
  { value: "line", label: "Linha" },
  { value: "point", label: "Ponto" },
  { value: "raster", label: "Raster" },
];

const layerCategories = [
  { value: "base", label: "Camada Base" },
  { value: "context", label: "Contexto" },
  { value: "user", label: "Personalizada" },
];

interface LayerManagerProps {
  onLayerToggle?: (layerId: string, visible: boolean) => void;
  onLayerOpacityChange?: (layerId: string, opacity: number) => void;
}

export const LayerManager = ({ onLayerToggle, onLayerOpacityChange }: LayerManagerProps) => {
  const [layers, setLayers] = useState<GeoLayer[]>(defaultLayers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<GeoLayer | null>(null);
  const [newLayerName, setNewLayerName] = useState("");
  const [newLayerType, setNewLayerType] = useState<string>("");
  const [newLayerCategory, setNewLayerCategory] = useState<string>("user");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleToggleVisibility = (layerId: string) => {
    setLayers(prev => prev.map(layer => {
      if (layer.id === layerId) {
        const newVisible = !layer.visible;
        onLayerToggle?.(layerId, newVisible);
        return { ...layer, visible: newVisible };
      }
      return layer;
    }));
  };

  const handleOpacityChange = (layerId: string, opacity: number) => {
    setLayers(prev => prev.map(layer => {
      if (layer.id === layerId) {
        onLayerOpacityChange?.(layerId, opacity);
        return { ...layer, opacity };
      }
      return layer;
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.name.endsWith(".geojson") || file.name.endsWith(".json") || file.name.endsWith(".kml")) {
        setUploadedFile(file);
        if (!newLayerName) {
          setNewLayerName(file.name.replace(/\.(geojson|json|kml)$/, ""));
        }
      } else {
        toast.error("Formato não suportado. Use GeoJSON ou KML.");
      }
    }
  };

  const handleAddLayer = () => {
    if (!newLayerName.trim()) {
      toast.error("Nome da camada é obrigatório");
      return;
    }
    if (!newLayerType) {
      toast.error("Tipo da camada é obrigatório");
      return;
    }

    const newLayer: GeoLayer = {
      id: `layer-${Date.now()}`,
      name: newLayerName,
      type: newLayerType as GeoLayer["type"],
      category: newLayerCategory as GeoLayer["category"],
      visible: true,
      opacity: 100,
      source: "Upload do usuário",
      icon: Layers,
      color: "text-primary",
      metadata: {
        date: new Date().toISOString().split("T")[0],
        responsible: "Usuário",
      },
    };

    setLayers(prev => [...prev, newLayer]);
    toast.success(`Camada "${newLayerName}" adicionada com sucesso`);
    
    // Reset form
    setNewLayerName("");
    setNewLayerType("");
    setNewLayerCategory("user");
    setUploadedFile(null);
    setIsAddModalOpen(false);
  };

  const handleDeleteLayer = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer?.category !== "user") {
      toast.error("Apenas camadas personalizadas podem ser removidas");
      return;
    }
    setLayers(prev => prev.filter(l => l.id !== layerId));
    toast.success("Camada removida com sucesso");
  };

  const groupedLayers = {
    base: layers.filter(l => l.category === "base"),
    context: layers.filter(l => l.category === "context"),
    user: layers.filter(l => l.category === "user"),
  };

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Camadas Geoespaciais
            </CardTitle>
            <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Base Layers */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
              Camadas Base
            </h4>
            <div className="space-y-2">
              {groupedLayers.base.map((layer) => (
                <LayerItem
                  key={layer.id}
                  layer={layer}
                  onToggle={handleToggleVisibility}
                  onOpacityChange={handleOpacityChange}
                  onSelect={setSelectedLayer}
                  onDelete={handleDeleteLayer}
                />
              ))}
            </div>
          </div>

          {/* Context Layers */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
              Contexto Territorial
            </h4>
            <div className="space-y-2">
              {groupedLayers.context.map((layer) => (
                <LayerItem
                  key={layer.id}
                  layer={layer}
                  onToggle={handleToggleVisibility}
                  onOpacityChange={handleOpacityChange}
                  onSelect={setSelectedLayer}
                  onDelete={handleDeleteLayer}
                />
              ))}
            </div>
          </div>

          {/* User Layers */}
          {groupedLayers.user.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                Camadas Personalizadas
              </h4>
              <div className="space-y-2">
                {groupedLayers.user.map((layer) => (
                  <LayerItem
                    key={layer.id}
                    layer={layer}
                    onToggle={handleToggleVisibility}
                    onOpacityChange={handleOpacityChange}
                    onSelect={setSelectedLayer}
                    onDelete={handleDeleteLayer}
                    canDelete
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Layer Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Adicionar Nova Camada
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="layer-name">Nome da Camada *</Label>
              <Input
                id="layer-name"
                value={newLayerName}
                onChange={(e) => setNewLayerName(e.target.value)}
                placeholder="Ex: Limite da Propriedade"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Geometria *</Label>
                <Select value={newLayerType} onValueChange={setNewLayerType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {layerTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={newLayerCategory} onValueChange={setNewLayerCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {layerCategories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Upload de Arquivo</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Arraste um arquivo ou clique para selecionar
                </p>
                <input
                  type="file"
                  accept=".geojson,.json,.kml"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="layer-upload"
                />
                <label htmlFor="layer-upload">
                  <Button variant="outline" size="sm" asChild>
                    <span>Selecionar Arquivo</span>
                  </Button>
                </label>
                {uploadedFile && (
                  <div className="mt-2">
                    <Badge variant="secondary">{uploadedFile.name}</Badge>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Formatos: GeoJSON, KML
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddLayer}>Adicionar Camada</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface LayerItemProps {
  layer: GeoLayer;
  onToggle: (id: string) => void;
  onOpacityChange: (id: string, opacity: number) => void;
  onSelect: (layer: GeoLayer) => void;
  onDelete: (id: string) => void;
  canDelete?: boolean;
}

const LayerItem = ({ layer, onToggle, onOpacityChange, onSelect, onDelete, canDelete }: LayerItemProps) => {
  const [showOpacity, setShowOpacity] = useState(false);
  const LayerIcon = layer.icon;

  return (
    <div
      className={cn(
        "p-2 rounded-lg border transition-colors",
        layer.visible ? "bg-secondary/50 border-border" : "bg-muted/30 border-transparent"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
          <LayerIcon className={cn("w-4 h-4 flex-shrink-0", layer.color)} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{layer.name}</p>
            <p className="text-xs text-muted-foreground">{layer.source}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setShowOpacity(!showOpacity)}
          >
            <Settings className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onToggle(layer.id)}
          >
            {layer.visible ? (
              <Eye className="w-3.5 h-3.5" />
            ) : (
              <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </Button>
          {canDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={() => onDelete(layer.id)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      {showOpacity && (
        <div className="mt-2 pt-2 border-t border-border">
          <div className="flex items-center gap-3">
            <Label className="text-xs">Opacidade:</Label>
            <input
              type="range"
              min="0"
              max="100"
              value={layer.opacity}
              onChange={(e) => onOpacityChange(layer.id, parseInt(e.target.value))}
              className="flex-1 h-1.5 bg-secondary rounded-full appearance-none cursor-pointer"
            />
            <span className="text-xs text-muted-foreground w-8">{layer.opacity}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
