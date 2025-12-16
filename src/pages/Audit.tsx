import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter, Download, Eye } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const auditLogs = [
  {
    id: "1",
    timestamp: "2024-12-16 14:32:15",
    user: "Maria Silva",
    action: "Atualização de Dados",
    resource: "Emissões - Mina Carajás",
    details: "Valor alterado de 4150 para 4200 tCO₂e",
    status: "success",
  },
  {
    id: "2",
    timestamp: "2024-12-16 11:20:45",
    user: "João Santos",
    action: "Upload de Camada",
    resource: "Uso do Solo 2024",
    details: "Arquivo GeoJSON importado com sucesso",
    status: "success",
  },
  {
    id: "3",
    timestamp: "2024-12-15 16:45:30",
    user: "Ana Oliveira",
    action: "Geração de Relatório",
    resource: "Inventário GEE Q3",
    details: "Relatório exportado em PDF",
    status: "success",
  },
  {
    id: "4",
    timestamp: "2024-12-15 09:12:00",
    user: "Sistema",
    action: "Alerta Automático",
    resource: "Porto Rio de Janeiro",
    details: "Anomalia detectada em emissões",
    status: "warning",
  },
  {
    id: "5",
    timestamp: "2024-12-14 18:30:22",
    user: "Carlos Ferreira",
    action: "Cadastro de Território",
    resource: "Reserva Florestal AM",
    details: "Novo território adicionado ao sistema",
    status: "success",
  },
];

const Audit = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Auditoria</h1>
            <p className="text-muted-foreground">
              Trilha de auditoria e rastreabilidade de dados
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar Logs
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total de Registros</p>
              <p className="text-2xl font-bold">1,247</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Hoje</p>
              <p className="text-2xl font-bold">23</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Alertas</p>
              <p className="text-2xl font-bold text-warning">5</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Usuários Ativos</p>
              <p className="text-2xl font-bold">8</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar por usuário, ação ou recurso..." className="pl-10" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="update">Atualizações</SelectItem>
                  <SelectItem value="create">Criações</SelectItem>
                  <SelectItem value="delete">Exclusões</SelectItem>
                  <SelectItem value="export">Exportações</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="7d">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Últimas 24h</SelectItem>
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Audit Table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Registros de Auditoria</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Recurso</TableHead>
                  <TableHead>Detalhes</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {log.timestamp}
                    </TableCell>
                    <TableCell className="font-medium">{log.user}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell className="text-sm">{log.resource}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {log.details}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          log.status === "success"
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning"
                        }
                      >
                        {log.status === "success" ? "OK" : "Alerta"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Audit;
