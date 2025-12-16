import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileSpreadsheet, Database, Calendar, Play, Pause, CheckCircle, XCircle, Clock, Settings, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ImportJob {
  id: string;
  name: string;
  source: string;
  type: "csv" | "excel" | "api";
  status: "completed" | "running" | "failed" | "scheduled";
  records: number;
  errors: number;
  territory: string;
  lastRun: string;
  nextRun?: string;
  progress?: number;
}

const mockImportJobs: ImportJob[] = [
  {
    id: "1",
    name: "Consumo Energético Mensal",
    source: "ERP SAP",
    type: "api",
    status: "completed",
    records: 1250,
    errors: 3,
    territory: "Mina Norte",
    lastRun: "2024-12-16 06:00"
  },
  {
    id: "2",
    name: "Dados de Combustível",
    source: "Planilha Excel",
    type: "excel",
    status: "running",
    records: 456,
    errors: 0,
    territory: "Planta Industrial Sul",
    lastRun: "2024-12-16 14:30",
    progress: 67
  },
  {
    id: "3",
    name: "Produção Diária",
    source: "Sistema MES",
    type: "api",
    status: "scheduled",
    records: 0,
    errors: 0,
    territory: "Todas",
    lastRun: "2024-12-15 06:00",
    nextRun: "2024-12-17 06:00"
  },
  {
    id: "4",
    name: "Emissões Fugitivas",
    source: "CSV Manual",
    type: "csv",
    status: "failed",
    records: 0,
    errors: 15,
    territory: "Área de Influência",
    lastRun: "2024-12-14 10:00"
  }
];

const fieldMappings = [
  { source: "energy_kwh", target: "quantity", type: "number", required: true },
  { source: "date", target: "period_start", type: "date", required: true },
  { source: "unit_code", target: "asset_id", type: "lookup", required: true },
  { source: "meter_id", target: "source", type: "string", required: false },
  { source: "notes", target: "notes", type: "string", required: false }
];

export function DataIngestionPanel() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedTerritory, setSelectedTerritory] = useState("");
  const [dataType, setDataType] = useState("");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast.info(`Arquivo selecionado: ${file.name}`);
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !selectedTerritory || !dataType) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          toast.success("Arquivo processado com sucesso!");
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const getStatusIcon = (status: ImportJob["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "running":
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "scheduled":
        return <Calendar className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: ImportJob["status"]) => {
    switch (status) {
      case "completed":
        return "Concluído";
      case "running":
        return "Em Execução";
      case "failed":
        return "Falhou";
      case "scheduled":
        return "Agendado";
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Dados Operacionais
          </CardTitle>
          <CardDescription>
            Faça upload de arquivos CSV ou Excel para importar dados operacionais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload">
            <TabsList>
              <TabsTrigger value="upload">Upload Manual</TabsTrigger>
              <TabsTrigger value="mapping">Mapeamento de Campos</TabsTrigger>
              <TabsTrigger value="schedule">Agendamento</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Território de Destino *</Label>
                  <Select value={selectedTerritory} onValueChange={setSelectedTerritory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o território" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mina-norte">Mina Norte</SelectItem>
                      <SelectItem value="planta-sul">Planta Industrial Sul</SelectItem>
                      <SelectItem value="area-influencia">Área de Influência</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Dado *</Label>
                  <Select value={dataType} onValueChange={setDataType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="energy">Consumo Energético</SelectItem>
                      <SelectItem value="fuel">Combustível</SelectItem>
                      <SelectItem value="production">Produção</SelectItem>
                      <SelectItem value="emissions">Emissões Diretas</SelectItem>
                      <SelectItem value="water">Consumo de Água</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <FileSpreadsheet className="h-12 w-12 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {selectedFile ? selectedFile.name : "Clique ou arraste um arquivo CSV ou Excel"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Máximo 10MB • CSV, XLSX, XLS
                    </p>
                  </div>
                </label>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processando...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancelar</Button>
                <Button onClick={handleUpload} disabled={isUploading}>
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Dados
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="mapping" className="space-y-4 mt-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Configure o mapeamento entre os campos do arquivo fonte e o modelo MRV
                </p>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Novo Template
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campo Fonte</TableHead>
                    <TableHead>Campo MRV</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Obrigatório</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fieldMappings.map((mapping, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{mapping.source}</code>
                      </TableCell>
                      <TableCell>
                        <Select defaultValue={mapping.target}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="quantity">quantity</SelectItem>
                            <SelectItem value="period_start">period_start</SelectItem>
                            <SelectItem value="period_end">period_end</SelectItem>
                            <SelectItem value="asset_id">asset_id</SelectItem>
                            <SelectItem value="source">source</SelectItem>
                            <SelectItem value="notes">notes</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{mapping.type}</Badge>
                      </TableCell>
                      <TableCell>
                        {mapping.required ? (
                          <Badge>Sim</Badge>
                        ) : (
                          <Badge variant="secondary">Não</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Frequência</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a frequência" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diário</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Horário de Execução</Label>
                  <Input type="time" defaultValue="06:00" />
                </div>
              </div>

              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    A importação agendada irá buscar dados automaticamente da fonte configurada 
                    e associá-los ao território selecionado. Certifique-se de que as credenciais 
                    de acesso estão configuradas corretamente.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Import Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Histórico de Importações
          </CardTitle>
          <CardDescription>
            Acompanhe o status das importações de dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Fonte</TableHead>
                <TableHead>Território</TableHead>
                <TableHead>Registros</TableHead>
                <TableHead>Erros</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Execução</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockImportJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {job.type === "csv" && <FileSpreadsheet className="h-4 w-4" />}
                      {job.type === "excel" && <FileSpreadsheet className="h-4 w-4" />}
                      {job.type === "api" && <Database className="h-4 w-4" />}
                      <span className="text-sm">{job.source}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{job.territory}</span>
                    </div>
                  </TableCell>
                  <TableCell>{job.records.toLocaleString()}</TableCell>
                  <TableCell>
                    {job.errors > 0 ? (
                      <Badge variant="destructive">{job.errors}</Badge>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(job.status)}
                      <span className="text-sm">{getStatusLabel(job.status)}</span>
                    </div>
                    {job.status === "running" && job.progress && (
                      <Progress value={job.progress} className="h-1 mt-1 w-20" />
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {job.lastRun}
                    {job.nextRun && (
                      <div className="text-xs">Próx: {job.nextRun}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {job.status === "running" ? (
                        <Button variant="ghost" size="icon">
                          <Pause className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="icon">
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
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
    </div>
  );
}
