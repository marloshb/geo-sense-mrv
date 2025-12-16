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
  Map,
  FileText,
  Image,
  Upload,
  Download,
  Eye,
  Calendar,
  MapPin,
  Link2,
  Search,
  Filter,
} from "lucide-react";

interface Evidence {
  id: string;
  type: "map" | "document" | "image";
  name: string;
  description: string;
  territory: string;
  indicator?: string;
  uploadedBy: string;
  uploadedAt: string;
  period: string;
  fileSize?: string;
}

const evidences: Evidence[] = [
  {
    id: "1",
    type: "map",
    name: "Mapa de Emissões - Carajás",
    description: "Distribuição espacial de emissões por fonte",
    territory: "Mina Carajás",
    indicator: "Emissões Escopo 1",
    uploadedBy: "Maria Silva",
    uploadedAt: "15/12/2024",
    period: "2024",
  },
  {
    id: "2",
    type: "document",
    name: "Nota Fiscal - Diesel",
    description: "Comprovante de aquisição de combustível",
    territory: "Mina Carajás",
    indicator: "Consumo de Combustível",
    uploadedBy: "Carlos Ferreira",
    uploadedAt: "14/12/2024",
    period: "Dez/2024",
    fileSize: "2.4 MB",
  },
  {
    id: "3",
    type: "image",
    name: "Área de Reflorestamento - Antes",
    description: "Imagem aérea da área antes do projeto",
    territory: "Reserva AM",
    indicator: "Sequestro de Carbono",
    uploadedBy: "Ana Oliveira",
    uploadedAt: "10/12/2024",
    period: "Jan/2024",
    fileSize: "5.1 MB",
  },
  {
    id: "4",
    type: "image",
    name: "Área de Reflorestamento - Depois",
    description: "Imagem aérea da área após 6 meses",
    territory: "Reserva AM",
    indicator: "Sequestro de Carbono",
    uploadedBy: "Ana Oliveira",
    uploadedAt: "10/12/2024",
    period: "Jul/2024",
    fileSize: "4.8 MB",
  },
  {
    id: "5",
    type: "document",
    name: "Relatório de Medição",
    description: "Laudo técnico de emissões atmosféricas",
    territory: "Planta MG",
    indicator: "Emissões Escopo 1",
    uploadedBy: "João Santos",
    uploadedAt: "08/12/2024",
    period: "Q3 2024",
    fileSize: "1.2 MB",
  },
  {
    id: "6",
    type: "map",
    name: "Limites Territoriais",
    description: "Polígonos atualizados dos territórios",
    territory: "Todos",
    uploadedBy: "Sistema",
    uploadedAt: "01/12/2024",
    period: "2024",
  },
];

export const EvidencePanel = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterTerritory, setFilterTerritory] = useState("all");

  const getTypeIcon = (type: Evidence["type"]) => {
    switch (type) {
      case "map":
        return <Map className="w-5 h-5 text-success" />;
      case "document":
        return <FileText className="w-5 h-5 text-info" />;
      case "image":
        return <Image className="w-5 h-5 text-warning" />;
    }
  };

  const getTypeBadge = (type: Evidence["type"]) => {
    switch (type) {
      case "map":
        return (
          <Badge className="bg-success/10 text-success">Mapa</Badge>
        );
      case "document":
        return (
          <Badge className="bg-info/10 text-info">Documento</Badge>
        );
      case "image":
        return (
          <Badge className="bg-warning/10 text-warning">Imagem</Badge>
        );
    }
  };

  const filteredEvidences = evidences.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || e.type === filterType;
    const matchesTerritory =
      filterTerritory === "all" || e.territory === filterTerritory;
    return matchesSearch && matchesType && matchesTerritory;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar evidências..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="map">Mapas</SelectItem>
                <SelectItem value="document">Documentos</SelectItem>
                <SelectItem value="image">Imagens</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterTerritory} onValueChange={setFilterTerritory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Território" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Mina Carajás">Mina Carajás</SelectItem>
                <SelectItem value="Planta MG">Planta MG</SelectItem>
                <SelectItem value="Reserva AM">Reserva AM</SelectItem>
                <SelectItem value="Terminal SP">Terminal SP</SelectItem>
              </SelectContent>
            </Select>
            <Button className="gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{evidences.length}</div>
                <div className="text-xs text-muted-foreground">
                  Total de Evidências
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Map className="w-5 h-5 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {evidences.filter((e) => e.type === "map").length}
                </div>
                <div className="text-xs text-muted-foreground">Mapas</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-info" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {evidences.filter((e) => e.type === "document").length}
                </div>
                <div className="text-xs text-muted-foreground">Documentos</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Image className="w-5 h-5 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {evidences.filter((e) => e.type === "image").length}
                </div>
                <div className="text-xs text-muted-foreground">Imagens</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Evidence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvidences.map((evidence) => (
          <Card key={evidence.id} className="hover:border-primary/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  {getTypeIcon(evidence.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-medium text-sm truncate">
                      {evidence.name}
                    </div>
                    {getTypeBadge(evidence.type)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {evidence.description}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {evidence.territory}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {evidence.period}
                    </div>
                  </div>

                  {evidence.indicator && (
                    <div className="flex items-center gap-1 mt-2">
                      <Link2 className="w-3 h-3 text-primary" />
                      <span className="text-xs text-primary">
                        {evidence.indicator}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="text-xs text-muted-foreground">
                      {evidence.uploadedBy} • {evidence.uploadedAt}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Before/After Comparison */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Image className="w-4 h-4" />
            Comparação Temporal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-secondary/30 rounded-lg">
              <div className="text-sm font-medium mb-2">
                Antes (Jan/2024)
              </div>
              <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Image className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-sm">Área de Reflorestamento - Antes</div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg">
              <div className="text-sm font-medium mb-2">
                Depois (Jul/2024)
              </div>
              <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Image className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-sm">Área de Reflorestamento - Depois</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-success/10 rounded-lg">
            <div className="text-sm">
              <strong>Resultado:</strong> Aumento de 45% na cobertura vegetal,
              estimativa de sequestro adicional de 320 tCO₂e/ano
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
