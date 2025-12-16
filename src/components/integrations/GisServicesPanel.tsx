import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, Layers, Download, Copy, Globe, Database, Code, Eye, MapPin, Shapes } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface GisService {
  id: string;
  name: string;
  type: "feature" | "map" | "wms" | "wfs";
  description: string;
  format: string[];
  layers: number;
  status: "active" | "inactive";
}

const mockGisServices: GisService[] = [
  {
    id: "1",
    name: "Territórios MRV",
    type: "feature",
    description: "Polígonos de territórios cadastrados com metadados",
    format: ["GeoJSON", "Shapefile", "KML"],
    layers: 1,
    status: "active"
  },
  {
    id: "2",
    name: "Ativos Operacionais",
    type: "feature",
    description: "Pontos e polígonos de ativos vinculados aos territórios",
    format: ["GeoJSON", "Shapefile"],
    layers: 1,
    status: "active"
  },
  {
    id: "3",
    name: "Mapa de Emissões",
    type: "map",
    description: "Mapa temático de emissões por território",
    format: ["PNG", "JPEG", "PDF"],
    layers: 3,
    status: "active"
  },
  {
    id: "4",
    name: "Riscos Climáticos",
    type: "map",
    description: "Mapa de exposição a riscos físicos e de transição",
    format: ["PNG", "JPEG"],
    layers: 5,
    status: "active"
  },
  {
    id: "5",
    name: "Web Map Service",
    type: "wms",
    description: "Serviço WMS para integração com GIS externos",
    format: ["WMS 1.3.0"],
    layers: 8,
    status: "active"
  },
  {
    id: "6",
    name: "Web Feature Service",
    type: "wfs",
    description: "Serviço WFS para consulta de features espaciais",
    format: ["WFS 2.0.0"],
    layers: 4,
    status: "inactive"
  }
];

const spatialQueries = [
  {
    name: "Territórios por Bioma",
    query: "ST_Intersects(territory.geom, bioma.geom)",
    description: "Retorna territórios que intersectam um bioma específico"
  },
  {
    name: "Ativos em Raio",
    query: "ST_DWithin(asset.geom, point, distance)",
    description: "Busca ativos dentro de um raio de distância"
  },
  {
    name: "Área de Sobreposição",
    query: "ST_Area(ST_Intersection(a.geom, b.geom))",
    description: "Calcula área de sobreposição entre geometrias"
  },
  {
    name: "Territórios Contíguos",
    query: "ST_Touches(t1.geom, t2.geom)",
    description: "Identifica territórios adjacentes"
  }
];

export function GisServicesPanel() {
  const [selectedFormat, setSelectedFormat] = useState("geojson");

  const handleCopyUrl = (service: GisService) => {
    const url = `https://gis.mrv-territorial.com/services/${service.id}`;
    navigator.clipboard.writeText(url);
    toast.success("URL do serviço copiada!");
  };

  const handleDownload = (service: GisService) => {
    toast.info(`Preparando download do serviço "${service.name}"...`);
    setTimeout(() => {
      toast.success("Download iniciado!");
    }, 1000);
  };

  const getServiceIcon = (type: GisService["type"]) => {
    switch (type) {
      case "feature":
        return <Shapes className="h-4 w-4" />;
      case "map":
        return <Map className="h-4 w-4" />;
      case "wms":
        return <Globe className="h-4 w-4" />;
      case "wfs":
        return <Database className="h-4 w-4" />;
    }
  };

  const getServiceTypeLabel = (type: GisService["type"]) => {
    switch (type) {
      case "feature":
        return "Feature Service";
      case "map":
        return "Map Service";
      case "wms":
        return "WMS";
      case "wfs":
        return "WFS";
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Map className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Serviços GIS</p>
                <p className="text-2xl font-bold">{mockGisServices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Layers className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Camadas</p>
                <p className="text-2xl font-bold">22</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Features</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Download className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Downloads/Mês</p>
                <p className="text-2xl font-bold">342</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="services">
        <TabsList>
          <TabsTrigger value="services">Serviços Disponíveis</TabsTrigger>
          <TabsTrigger value="queries">Consultas Espaciais</TabsTrigger>
          <TabsTrigger value="export">Exportação</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Serviços GIS
              </CardTitle>
              <CardDescription>
                APIs e serviços espaciais para integração com plataformas GIS externas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Formatos</TableHead>
                    <TableHead>Camadas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockGisServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getServiceIcon(service.type)}
                          {service.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getServiceTypeLabel(service.type)}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs">
                        {service.description}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {service.format.map((fmt) => (
                            <Badge key={fmt} variant="secondary" className="text-xs">
                              {fmt}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{service.layers}</TableCell>
                      <TableCell>
                        <Badge variant={service.status === "active" ? "default" : "secondary"}>
                          {service.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleCopyUrl(service)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDownload(service)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* WMS/WFS URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">WMS Endpoint</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-3 py-2 rounded flex-1 overflow-hidden">
                    https://gis.mrv-territorial.com/wms?service=WMS&request=GetCapabilities
                  </code>
                  <Button variant="outline" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">WFS Endpoint</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-3 py-2 rounded flex-1 overflow-hidden">
                    https://gis.mrv-territorial.com/wfs?service=WFS&request=GetCapabilities
                  </code>
                  <Button variant="outline" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="queries" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Consultas Espaciais via API
              </CardTitle>
              <CardDescription>
                Execute queries espaciais diretamente via API REST
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Operação</TableHead>
                    <TableHead>Query</TableHead>
                    <TableHead>Descrição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {spatialQueries.map((query, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{query.name}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {query.query}
                        </code>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {query.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Exemplo de Requisição</h4>
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto">
{`POST /api/v1/gis/query HTTP/1.1
Content-Type: application/json

{
  "operation": "intersects",
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[-43.5, -22.9], [-43.4, -22.9], [-43.4, -22.8], [-43.5, -22.8], [-43.5, -22.9]]]
  },
  "layer": "territories",
  "properties": ["id", "name", "area_hectares"]
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Exportação de Geometrias
              </CardTitle>
              <CardDescription>
                Exporte camadas e geometrias em diversos formatos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Camada</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a camada" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="territories">Territórios</SelectItem>
                      <SelectItem value="assets">Ativos</SelectItem>
                      <SelectItem value="emissions">Mapa de Emissões</SelectItem>
                      <SelectItem value="risks">Riscos Climáticos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Formato</label>
                  <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="geojson">GeoJSON</SelectItem>
                      <SelectItem value="shapefile">Shapefile</SelectItem>
                      <SelectItem value="kml">KML</SelectItem>
                      <SelectItem value="geopackage">GeoPackage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <Card className="bg-muted/50">
                  <CardContent className="pt-4 text-center">
                    <Shapes className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="font-medium">GeoJSON</p>
                    <p className="text-xs text-muted-foreground">Padrão web, leve</p>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50">
                  <CardContent className="pt-4 text-center">
                    <Database className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="font-medium">Shapefile</p>
                    <p className="text-xs text-muted-foreground">Compatível com ArcGIS</p>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50">
                  <CardContent className="pt-4 text-center">
                    <Globe className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="font-medium">KML</p>
                    <p className="text-xs text-muted-foreground">Google Earth</p>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50">
                  <CardContent className="pt-4 text-center">
                    <Layers className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="font-medium">GeoPackage</p>
                    <p className="text-xs text-muted-foreground">Multi-camadas</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
