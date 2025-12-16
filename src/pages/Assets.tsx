import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, MoreHorizontal, Building2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const assets = [
  {
    id: "1",
    name: "Mina S11D",
    territory: "Mina Carajás",
    type: "Extração",
    capacity: "90 Mt/ano",
    emissions: 2100,
    status: "operational",
  },
  {
    id: "2",
    name: "Usina de Pelotização",
    territory: "Planta Industrial MG",
    type: "Processamento",
    capacity: "25 Mt/ano",
    emissions: 1800,
    status: "operational",
  },
  {
    id: "3",
    name: "Terminal Marítimo",
    territory: "Terminal Portuário SP",
    type: "Logística",
    capacity: "150 navios/ano",
    emissions: 950,
    status: "operational",
  },
  {
    id: "4",
    name: "Usina Solar",
    territory: "Reserva Florestal AM",
    type: "Energia",
    capacity: "50 MW",
    emissions: 0,
    status: "operational",
  },
  {
    id: "5",
    name: "Novo Terminal RJ",
    territory: "Porto Rio de Janeiro",
    type: "Logística",
    capacity: "Em definição",
    emissions: 0,
    status: "construction",
  },
];

const Assets = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Ativos</h1>
            <p className="text-muted-foreground">
              Gestão de ativos operacionais por território
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Ativo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total de Ativos</p>
              <p className="text-2xl font-bold">47</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Operacionais</p>
              <p className="text-2xl font-bold text-success">42</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Em Construção</p>
              <p className="text-2xl font-bold text-info">3</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Em Manutenção</p>
              <p className="text-2xl font-bold text-warning">2</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar ativos por nome, tipo ou território..." className="pl-10" />
            </div>
          </CardContent>
        </Card>

        {/* Assets Table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Lista de Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ativo</TableHead>
                  <TableHead>Território</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Capacidade</TableHead>
                  <TableHead>Emissões (tCO₂e)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium">{asset.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {asset.territory}
                    </TableCell>
                    <TableCell>{asset.type}</TableCell>
                    <TableCell>{asset.capacity}</TableCell>
                    <TableCell>
                      {asset.emissions > 0 ? asset.emissions.toLocaleString() : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          asset.status === "operational"
                            ? "bg-success/10 text-success"
                            : asset.status === "construction"
                            ? "bg-info/10 text-info"
                            : "bg-warning/10 text-warning"
                        }
                      >
                        {asset.status === "operational"
                          ? "Operacional"
                          : asset.status === "construction"
                          ? "Em Construção"
                          : "Manutenção"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Ver no Mapa</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

export default Assets;
