import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Cloud, Database, Globe, MapPin, Leaf, Droplets, Thermometer, Building, RefreshCw, Settings, CheckCircle, XCircle, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ExternalSource {
  id: string;
  name: string;
  type: "climate" | "territorial" | "environmental" | "socioeconomic";
  provider: string;
  status: "connected" | "disconnected" | "error";
  lastSync: string;
  nextSync: string;
  dataPoints: number;
  enabled: boolean;
  description: string;
}

const mockExternalSources: ExternalSource[] = [
  {
    id: "1",
    name: "Dados Climáticos Agregados",
    type: "climate",
    provider: "INMET / Copernicus",
    status: "connected",
    lastSync: "2024-12-16 08:00",
    nextSync: "2024-12-17 08:00",
    dataPoints: 15420,
    enabled: true,
    description: "Temperatura, precipitação, umidade e eventos extremos"
  },
  {
    id: "2",
    name: "Limites Territoriais Oficiais",
    type: "territorial",
    provider: "IBGE",
    status: "connected",
    lastSync: "2024-12-01 00:00",
    nextSync: "2025-01-01 00:00",
    dataPoints: 5570,
    enabled: true,
    description: "Municípios, estados, regiões e setores censitários"
  },
  {
    id: "3",
    name: "Biomas e Vegetação",
    type: "environmental",
    provider: "MapBiomas",
    status: "connected",
    lastSync: "2024-11-15 12:00",
    nextSync: "2025-02-15 12:00",
    dataPoints: 8340,
    enabled: true,
    description: "Cobertura e uso do solo, biomas, desmatamento"
  },
  {
    id: "4",
    name: "Hidrografia",
    type: "environmental",
    provider: "ANA",
    status: "disconnected",
    lastSync: "2024-10-01 00:00",
    nextSync: "-",
    dataPoints: 0,
    enabled: false,
    description: "Bacias hidrográficas, corpos d'água, qualidade"
  },
  {
    id: "5",
    name: "Índices Socioeconômicos",
    type: "socioeconomic",
    provider: "IBGE / IPEA",
    status: "error",
    lastSync: "2024-12-10 14:00",
    nextSync: "Aguardando correção",
    dataPoints: 2100,
    enabled: true,
    description: "IDH, PIB municipal, população, vulnerabilidade"
  },
  {
    id: "6",
    name: "Áreas Protegidas",
    type: "environmental",
    provider: "ICMBio / MMA",
    status: "connected",
    lastSync: "2024-12-05 00:00",
    nextSync: "2025-01-05 00:00",
    dataPoints: 3250,
    enabled: true,
    description: "Unidades de conservação, terras indígenas, APPs"
  }
];

export function ExternalSourcesPanel() {
  const [sources, setSources] = useState<ExternalSource[]>(mockExternalSources);

  const getTypeIcon = (type: ExternalSource["type"]) => {
    switch (type) {
      case "climate":
        return <Thermometer className="h-4 w-4" />;
      case "territorial":
        return <MapPin className="h-4 w-4" />;
      case "environmental":
        return <Leaf className="h-4 w-4" />;
      case "socioeconomic":
        return <Building className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: ExternalSource["type"]) => {
    switch (type) {
      case "climate":
        return "Climático";
      case "territorial":
        return "Territorial";
      case "environmental":
        return "Ambiental";
      case "socioeconomic":
        return "Socioeconômico";
    }
  };

  const getStatusIcon = (status: ExternalSource["status"]) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "disconnected":
        return <XCircle className="h-4 w-4 text-muted-foreground" />;
      case "error":
        return <XCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const handleToggleSource = (id: string) => {
    setSources(sources.map(source => {
      if (source.id === id) {
        const newEnabled = !source.enabled;
        toast.success(newEnabled ? "Fonte ativada" : "Fonte desativada");
        return { ...source, enabled: newEnabled };
      }
      return source;
    }));
  };

  const handleSync = (id: string) => {
    toast.info("Sincronização iniciada...");
    setTimeout(() => {
      setSources(sources.map(source => {
        if (source.id === id) {
          return { ...source, lastSync: new Date().toLocaleString('pt-BR'), status: "connected" as const };
        }
        return source;
      }));
      toast.success("Sincronização concluída!");
    }, 2000);
  };

  const connectedCount = sources.filter(s => s.status === "connected").length;
  const totalDataPoints = sources.reduce((acc, s) => acc + s.dataPoints, 0);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fontes Externas</p>
                <p className="text-2xl font-bold">{sources.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conectadas</p>
                <p className="text-2xl font-bold">{connectedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Database className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pontos de Dados</p>
                <p className="text-2xl font-bold">{totalDataPoints.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Última Sincr.</p>
                <p className="text-2xl font-bold">08:00</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* External Sources List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Fontes de Dados Externas
          </CardTitle>
          <CardDescription>
            Conectores para enriquecer o contexto territorial e climático
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ativo</TableHead>
                <TableHead>Fonte</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Provedor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dados</TableHead>
                <TableHead>Última Sincr.</TableHead>
                <TableHead>Próxima</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sources.map((source) => (
                <TableRow key={source.id}>
                  <TableCell>
                    <Switch 
                      checked={source.enabled}
                      onCheckedChange={() => handleToggleSource(source.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{source.name}</p>
                      <p className="text-xs text-muted-foreground">{source.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(source.type)}
                      <Badge variant="outline">{getTypeLabel(source.type)}</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{source.provider}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(source.status)}
                      <span className="text-sm capitalize">
                        {source.status === "connected" ? "Conectado" : 
                         source.status === "disconnected" ? "Desconectado" : "Erro"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{source.dataPoints.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{source.lastSync}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{source.nextSync}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleSync(source.id)}
                        disabled={!source.enabled}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Data Layers Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-orange-500" />
              <CardTitle className="text-base">Dados Climáticos</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Temperatura média</span>
                <span>24.5°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Precipitação (mês)</span>
                <span>145mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Eventos extremos</span>
                <Badge variant="secondary">3</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-green-500" />
              <CardTitle className="text-base">Cobertura do Solo</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Floresta nativa</span>
                <span>45%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pastagem</span>
                <span>30%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Área urbana</span>
                <span>15%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <CardTitle className="text-base">Recursos Hídricos</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bacias na área</span>
                <span>3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Corpos d'água</span>
                <span>12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Qualidade</span>
                <Badge className="bg-green-500">Boa</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
