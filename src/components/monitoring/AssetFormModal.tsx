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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Factory, MapPin, Settings, FileText } from "lucide-react";
import { toast } from "sonner";

interface AssetFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset?: AssetFormData | null;
  territories: Array<{ id: string; name: string }>;
  onSave: (asset: AssetFormData) => void;
}

export interface AssetFormData {
  name: string;
  type: string;
  territoryId: string;
  status: "operational" | "maintenance" | "inactive";
  description: string;
  latitude: string;
  longitude: string;
  metadata: {
    capacity?: string;
    startDate?: string;
    responsible?: string;
    notes?: string;
  };
}

const assetTypes = [
  { value: "plant", label: "Planta Industrial" },
  { value: "infrastructure", label: "Infraestrutura" },
  { value: "logistics", label: "Centro Logístico" },
  { value: "energy", label: "Geração de Energia" },
  { value: "monitoring", label: "Estação de Monitoramento" },
  { value: "mining", label: "Área de Mineração" },
  { value: "storage", label: "Armazenamento" },
  { value: "processing", label: "Processamento" },
];

const statusOptions = [
  { value: "operational", label: "Operacional" },
  { value: "maintenance", label: "Em Manutenção" },
  { value: "inactive", label: "Inativo" },
];

export const AssetFormModal = ({
  open,
  onOpenChange,
  asset,
  territories,
  onSave,
}: AssetFormModalProps) => {
  const [formData, setFormData] = useState<AssetFormData>({
    name: asset?.name || "",
    type: asset?.type || "",
    territoryId: asset?.territoryId || "",
    status: asset?.status || "operational",
    description: asset?.description || "",
    latitude: asset?.latitude || "",
    longitude: asset?.longitude || "",
    metadata: {
      capacity: asset?.metadata?.capacity || "",
      startDate: asset?.metadata?.startDate || "",
      responsible: asset?.metadata?.responsible || "",
      notes: asset?.metadata?.notes || "",
    },
  });

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error("Nome do ativo é obrigatório");
      return;
    }
    if (!formData.type) {
      toast.error("Tipo de ativo é obrigatório");
      return;
    }
    if (!formData.territoryId) {
      toast.error("Território associado é obrigatório");
      return;
    }
    onSave(formData);
    onOpenChange(false);
    toast.success(`Ativo "${formData.name}" salvo com sucesso`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Factory className="w-5 h-5" />
            {asset ? "Editar Ativo" : "Novo Ativo Espacial"}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic" className="gap-1">
              <Settings className="w-3 h-3" />
              Básico
            </TabsTrigger>
            <TabsTrigger value="location" className="gap-1">
              <MapPin className="w-3 h-3" />
              Localização
            </TabsTrigger>
            <TabsTrigger value="metadata" className="gap-1">
              <FileText className="w-3 h-3" />
              Metadados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="asset-name">Nome do Ativo *</Label>
              <Input
                id="asset-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Usina de Processamento A"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Ativo *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {assetTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status Operacional</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    status: value as AssetFormData["status"] 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Território Associado *</Label>
              <Select
                value={formData.territoryId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, territoryId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o território" />
                </SelectTrigger>
                <SelectContent>
                  {territories.map((territory) => (
                    <SelectItem key={territory.id} value={territory.id}>
                      {territory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="asset-description">Descrição</Label>
              <Textarea
                id="asset-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição do ativo..."
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="location" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  value={formData.latitude}
                  onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                  placeholder="Ex: -6.0234"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  value={formData.longitude}
                  onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                  placeholder="Ex: -50.1234"
                />
              </div>
            </div>

            <div className="p-4 bg-secondary/30 rounded-lg">
              <p className="text-sm font-medium mb-2">Dica</p>
              <p className="text-xs text-muted-foreground">
                Você pode obter as coordenadas clicando no mapa na aba "Mapa" ou usando 
                ferramentas como Google Maps. As coordenadas devem estar no formato decimal.
              </p>
            </div>

            <div className="p-4 border border-dashed border-border rounded-lg text-center">
              <MapPin className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Visualização do mapa disponível após salvar
              </p>
            </div>
          </TabsContent>

          <TabsContent value="metadata" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacidade</Label>
              <Input
                id="capacity"
                value={formData.metadata.capacity}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  metadata: { ...prev.metadata, capacity: e.target.value }
                }))}
                placeholder="Ex: 5000 t/dia"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Data de Início de Operação</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.metadata.startDate}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  metadata: { ...prev.metadata, startDate: e.target.value }
                }))}
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
                placeholder="Nome do responsável pelo ativo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta-notes">Observações</Label>
              <Textarea
                id="meta-notes"
                value={formData.metadata.notes}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  metadata: { ...prev.metadata, notes: e.target.value }
                }))}
                placeholder="Observações adicionais..."
                rows={3}
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {asset ? "Salvar Alterações" : "Cadastrar Ativo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
