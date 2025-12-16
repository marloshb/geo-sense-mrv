import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, MapPin, History, GitBranch } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TerritoryFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  territory?: Territory | null;
  parentTerritories?: Territory[];
  onSave: (territory: TerritoryFormData) => void;
}

interface Territory {
  id: string;
  name: string;
  type: string;
  status: string;
}

export interface TerritoryFormData {
  name: string;
  type: string;
  operationalCategory: string;
  parentId: string | null;
  description: string;
  validFrom: Date | undefined;
  validUntil: Date | undefined;
  area: number;
  geometry: string;
  metadata: {
    source: string;
    responsible: string;
    notes: string;
  };
}

const territoryTypes = [
  { value: "operational_asset", label: "Ativo Operacional" },
  { value: "project", label: "Projeto" },
  { value: "municipality", label: "Município" },
  { value: "influence_area", label: "Área de Influência" },
  { value: "conservation", label: "Conservação" },
  { value: "mining", label: "Mineração" },
  { value: "industrial", label: "Industrial" },
  { value: "logistics", label: "Logística" },
];

const operationalCategories = [
  { value: "owned", label: "Próprio" },
  { value: "leased", label: "Arrendado" },
  { value: "joint_venture", label: "Joint Venture" },
  { value: "managed", label: "Gestão Terceirizada" },
];

const mockVersions = [
  { version: 3, date: "2024-01-15", author: "João Silva", changes: "Ajuste de limites norte" },
  { version: 2, date: "2023-09-20", author: "Maria Santos", changes: "Expansão área sul" },
  { version: 1, date: "2023-01-10", author: "Carlos Lima", changes: "Versão inicial" },
];

export const TerritoryFormModal = ({
  open,
  onOpenChange,
  territory,
  parentTerritories = [],
  onSave,
}: TerritoryFormModalProps) => {
  const [formData, setFormData] = useState<TerritoryFormData>({
    name: territory?.name || "",
    type: territory?.type || "",
    operationalCategory: "",
    parentId: null,
    description: "",
    validFrom: new Date(),
    validUntil: undefined,
    area: 0,
    geometry: "",
    metadata: {
      source: "",
      responsible: "",
      notes: "",
    },
  });

  const [geoJsonFile, setGeoJsonFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.name.endsWith(".geojson") || file.name.endsWith(".json")) {
        setGeoJsonFile(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const json = JSON.parse(event.target?.result as string);
            setFormData(prev => ({ ...prev, geometry: JSON.stringify(json) }));
            toast.success("Arquivo GeoJSON carregado com sucesso");
          } catch {
            toast.error("Arquivo GeoJSON inválido");
          }
        };
        reader.readAsText(file);
      } else {
        toast.error("Por favor, selecione um arquivo .geojson ou .json");
      }
    }
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error("Nome do território é obrigatório");
      return;
    }
    if (!formData.type) {
      toast.error("Tipo de território é obrigatório");
      return;
    }
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {territory ? "Editar Território" : "Novo Território"}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
            <TabsTrigger value="geometry">Geometria</TabsTrigger>
            <TabsTrigger value="metadata">Metadados</TabsTrigger>
            <TabsTrigger value="history" disabled={!territory}>
              Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Território *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Mina Norte"
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo de Território *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                >
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoria Operacional</Label>
                <Select
                  value={formData.operationalCategory}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, operationalCategory: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {operationalCategories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <GitBranch className="w-3 h-3" />
                  Território Pai (Hierarquia)
                </Label>
                <Select
                  value={formData.parentId || ""}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, parentId: value || null }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Nenhum (raiz)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum (território raiz)</SelectItem>
                    {parentTerritories.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Válido a partir de</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.validFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.validFrom ? (
                        format(formData.validFrom, "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        "Selecionar data"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.validFrom}
                      onSelect={(date) => setFormData(prev => ({ ...prev, validFrom: date }))}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Válido até (opcional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.validUntil && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.validUntil ? (
                        format(formData.validUntil, "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        "Indefinido"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.validUntil}
                      onSelect={(date) => setFormData(prev => ({ ...prev, validUntil: date }))}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição do território e sua importância..."
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="geometry" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Upload de Geometria (GeoJSON)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground mb-2">
                  Arraste um arquivo GeoJSON ou clique para selecionar
                </p>
                <input
                  type="file"
                  accept=".geojson,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="geojson-upload"
                />
                <label htmlFor="geojson-upload">
                  <Button variant="outline" size="sm" asChild>
                    <span>Selecionar Arquivo</span>
                  </Button>
                </label>
                {geoJsonFile && (
                  <div className="mt-3">
                    <Badge variant="secondary" className="gap-1">
                      {geoJsonFile.name}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Área Calculada (hectares)</Label>
              <Input
                id="area"
                type="number"
                value={formData.area || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, area: parseFloat(e.target.value) || 0 }))}
                placeholder="Será calculada automaticamente"
              />
              <p className="text-xs text-muted-foreground">
                A área será calculada automaticamente ao importar a geometria
              </p>
            </div>

            <div className="p-4 bg-secondary/30 rounded-lg">
              <p className="text-sm font-medium mb-2">Formatos Suportados</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• GeoJSON (.geojson, .json)</li>
                <li>• Shapefile simplificado (em breve)</li>
                <li>• Desenho direto no mapa (disponível na aba Mapa)</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="metadata" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="source">Fonte dos Dados</Label>
              <Input
                id="source"
                value={formData.metadata.source}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  metadata: { ...prev.metadata, source: e.target.value }
                }))}
                placeholder="Ex: Levantamento topográfico 2024"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsible">Responsável</Label>
              <Input
                id="responsible"
                value={formData.metadata.responsible}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  metadata: { ...prev.metadata, responsible: e.target.value }
                }))}
                placeholder="Nome do responsável pelo cadastro"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.metadata.notes}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  metadata: { ...prev.metadata, notes: e.target.value }
                }))}
                placeholder="Observações adicionais sobre o território..."
                rows={4}
              />
            </div>

            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm font-medium mb-1">Rastreabilidade</p>
              <p className="text-xs text-muted-foreground">
                Todas as alterações são registradas automaticamente para fins de auditoria.
                O histórico de versões está disponível na aba "Histórico".
              </p>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-4">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Versionamento de Geometria</span>
            </div>

            <div className="space-y-3">
              {mockVersions.map((version, index) => (
                <div
                  key={version.version}
                  className={cn(
                    "p-3 rounded-lg border",
                    index === 0 ? "border-primary bg-primary/5" : "border-border bg-secondary/30"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={index === 0 ? "default" : "secondary"}>
                        v{version.version}
                      </Badge>
                      <span className="text-sm font-medium">{version.date}</span>
                    </div>
                    {index === 0 && (
                      <Badge variant="outline" className="text-xs">
                        Atual
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{version.changes}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Por: {version.author}
                  </p>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full">
              <History className="w-4 h-4 mr-2" />
              Comparar Versões
            </Button>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {territory ? "Salvar Alterações" : "Cadastrar Território"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
