import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Code, Copy, Play, FileJson, BarChart3, MapPin, FileText, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const apiEndpoints = [
  {
    category: "Métricas MRV",
    endpoints: [
      { method: "GET", path: "/api/v1/metrics", description: "Lista todas as métricas calculadas", params: ["territory_id", "period_start", "period_end", "metric_type"] },
      { method: "GET", path: "/api/v1/metrics/{id}", description: "Detalhe de uma métrica específica", params: [] },
      { method: "GET", path: "/api/v1/metrics/summary", description: "Resumo agregado de métricas", params: ["territory_id", "year"] }
    ]
  },
  {
    category: "Territórios",
    endpoints: [
      { method: "GET", path: "/api/v1/territories", description: "Lista todos os territórios", params: ["status", "type"] },
      { method: "GET", path: "/api/v1/territories/{id}", description: "Detalhe de um território", params: ["include_geometry"] },
      { method: "GET", path: "/api/v1/territories/{id}/assets", description: "Ativos de um território", params: [] }
    ]
  },
  {
    category: "Indicadores",
    endpoints: [
      { method: "GET", path: "/api/v1/kpis", description: "Lista KPIs disponíveis", params: ["category"] },
      { method: "GET", path: "/api/v1/kpis/emissions", description: "KPIs de emissões", params: ["territory_id", "scope"] },
      { method: "GET", path: "/api/v1/kpis/risks", description: "KPIs de riscos climáticos", params: ["territory_id", "risk_type"] }
    ]
  },
  {
    category: "Relatórios",
    endpoints: [
      { method: "GET", path: "/api/v1/reports", description: "Lista relatórios gerados", params: ["type", "status"] },
      { method: "GET", path: "/api/v1/reports/{id}", description: "Detalhe de um relatório", params: [] },
      { method: "GET", path: "/api/v1/reports/{id}/download", description: "Download do relatório", params: ["format"] }
    ]
  },
  {
    category: "Evidências",
    endpoints: [
      { method: "GET", path: "/api/v1/evidence", description: "Lista evidências espaciais", params: ["territory_id", "type"] },
      { method: "GET", path: "/api/v1/evidence/{id}", description: "Detalhe de uma evidência", params: [] }
    ]
  }
];

const sampleResponse = `{
  "data": [
    {
      "id": "mrv_001",
      "metric_type": "emissions_scope1",
      "value": 12450.5,
      "unit": "tCO2e",
      "territory_id": "ter_mina_norte",
      "period_start": "2024-01-01",
      "period_end": "2024-12-31",
      "calculated_at": "2024-12-16T10:30:00Z",
      "methodology_version": "GHG_2024_v1"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 156,
    "total_pages": 8
  }
}`;

export function OutboundApisPanel() {
  const [selectedEndpoint, setSelectedEndpoint] = useState("/api/v1/metrics");
  const [selectedMethod, setSelectedMethod] = useState("GET");
  const [testResponse, setTestResponse] = useState("");

  const handleCopyEndpoint = (path: string) => {
    navigator.clipboard.writeText(`https://api.mrv-territorial.com${path}`);
    toast.success("Endpoint copiado!");
  };

  const handleTestEndpoint = () => {
    setTestResponse("");
    toast.info("Executando requisição...");
    setTimeout(() => {
      setTestResponse(sampleResponse);
      toast.success("Requisição concluída!");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* API Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Send className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Endpoints</p>
                <p className="text-2xl font-bold">15</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <BarChart3 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Métricas Expostas</p>
                <p className="text-2xl font-bold">156</p>
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
                <p className="text-sm text-muted-foreground">Territórios</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <FileText className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Relatórios</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="endpoints">
        <TabsList>
          <TabsTrigger value="endpoints">Endpoints Disponíveis</TabsTrigger>
          <TabsTrigger value="playground">API Playground</TabsTrigger>
          <TabsTrigger value="docs">Documentação</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-4 mt-4">
          {apiEndpoints.map((category) => (
            <Card key={category.category}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  {category.category === "Métricas MRV" && <BarChart3 className="h-4 w-4" />}
                  {category.category === "Territórios" && <MapPin className="h-4 w-4" />}
                  {category.category === "Indicadores" && <FileJson className="h-4 w-4" />}
                  {category.category === "Relatórios" && <FileText className="h-4 w-4" />}
                  {category.category === "Evidências" && <AlertTriangle className="h-4 w-4" />}
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Método</TableHead>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Parâmetros</TableHead>
                      <TableHead className="w-20">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {category.endpoints.map((endpoint, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <Badge variant={endpoint.method === "GET" ? "default" : "secondary"}>
                            {endpoint.method}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">{endpoint.path}</code>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {endpoint.description}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {endpoint.params.map((param) => (
                              <Badge key={param} variant="outline" className="text-xs">
                                {param}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleCopyEndpoint(endpoint.path)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="playground" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                API Playground
              </CardTitle>
              <CardDescription>
                Teste os endpoints da API diretamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Método</Label>
                  <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Endpoint</Label>
                  <Select value={selectedEndpoint} onValueChange={setSelectedEndpoint}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {apiEndpoints.flatMap(cat => cat.endpoints).map((ep, idx) => (
                        <SelectItem key={idx} value={ep.path}>{ep.path}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button onClick={handleTestEndpoint} className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Executar
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Parâmetros (Query String)</Label>
                  <Input placeholder="territory_id=ter_001&year=2024" />
                </div>
                <div className="space-y-2">
                  <Label>Headers</Label>
                  <Input placeholder="Authorization: Bearer ..." disabled />
                </div>
              </div>

              {testResponse && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Resposta</Label>
                    <Badge variant="outline" className="text-green-500">200 OK</Badge>
                  </div>
                  <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-80">
                    {testResponse}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentação da API</CardTitle>
              <CardDescription>
                Guia de referência para integração com a API MRV Territorial
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h4 className="font-semibold">Autenticação</h4>
                <p className="text-sm text-muted-foreground">
                  Todas as requisições devem incluir o header de autorização com sua API Key:
                </p>
                <pre className="bg-muted p-3 rounded-lg text-xs">
                  {`Authorization: Bearer mrv_live_sk_xxxx...`}
                </pre>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Base URL</h4>
                <pre className="bg-muted p-3 rounded-lg text-xs">
                  https://api.mrv-territorial.com/v1
                </pre>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Rate Limiting</h4>
                <p className="text-sm text-muted-foreground">
                  As requisições são limitadas de acordo com o plano da API Key. 
                  O limite é retornado nos headers da resposta:
                </p>
                <pre className="bg-muted p-3 rounded-lg text-xs">
                  {`X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 987
X-RateLimit-Reset: 1702742400`}
                </pre>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Paginação</h4>
                <p className="text-sm text-muted-foreground">
                  Endpoints que retornam listas suportam paginação via query params:
                </p>
                <pre className="bg-muted p-3 rounded-lg text-xs">
                  {`?page=1&per_page=20`}
                </pre>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Filtros por Território</h4>
                <p className="text-sm text-muted-foreground">
                  A maioria dos endpoints aceita filtros por território e período:
                </p>
                <pre className="bg-muted p-3 rounded-lg text-xs">
                  {`?territory_id=ter_001&period_start=2024-01-01&period_end=2024-12-31`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
