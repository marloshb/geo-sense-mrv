import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Plus, Shield, Thermometer, Droplets, Wind, TrendingUp, Building, MapPin, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ClimateRisk {
  id: string;
  name: string;
  type: "physical" | "transition";
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  likelihood: "rare" | "unlikely" | "possible" | "likely" | "certain";
  horizon: "short" | "medium" | "long";
  territories: string[];
  assets: string[];
  responsible: string;
  description: string;
  status: "identified" | "assessed" | "mitigated" | "monitored";
  createdAt: string;
}

const mockRisks: ClimateRisk[] = [
  {
    id: "1",
    name: "Inundações em Áreas Operacionais",
    type: "physical",
    category: "Eventos Extremos",
    severity: "high",
    likelihood: "likely",
    horizon: "short",
    territories: ["Mina Norte", "Área de Influência"],
    assets: ["Planta de Beneficiamento", "Barragem 01"],
    responsible: "João Silva",
    description: "Risco de inundação devido ao aumento de precipitação extrema na região",
    status: "assessed",
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    name: "Estresse Hídrico",
    type: "physical",
    category: "Crônico",
    severity: "critical",
    likelihood: "possible",
    horizon: "medium",
    territories: ["Planta Industrial Sul"],
    assets: ["Sistema de Resfriamento", "Reservatório Principal"],
    responsible: "Maria Santos",
    description: "Redução da disponibilidade hídrica afetando operações",
    status: "identified",
    createdAt: "2024-02-20"
  },
  {
    id: "3",
    name: "Regulação de Carbono",
    type: "transition",
    category: "Política e Legal",
    severity: "high",
    likelihood: "certain",
    horizon: "short",
    territories: ["Todas"],
    assets: ["Frota Diesel", "Caldeiras"],
    responsible: "Carlos Oliveira",
    description: "Implementação de precificação de carbono e novas regulações",
    status: "mitigated",
    createdAt: "2024-03-10"
  },
  {
    id: "4",
    name: "Mudança de Preferências de Mercado",
    type: "transition",
    category: "Mercado",
    severity: "medium",
    likelihood: "likely",
    horizon: "medium",
    territories: ["Todas"],
    assets: [],
    responsible: "Ana Costa",
    description: "Demanda por produtos com menor pegada de carbono",
    status: "monitored",
    createdAt: "2024-04-05"
  }
];

export function RiskManagementPanel() {
  const [risks, setRisks] = useState<ClimateRisk[]>(mockRisks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  const getSeverityBadge = (severity: ClimateRisk["severity"]) => {
    const config = {
      low: { label: "Baixo", className: "bg-green-500" },
      medium: { label: "Médio", className: "bg-yellow-500" },
      high: { label: "Alto", className: "bg-orange-500" },
      critical: { label: "Crítico", className: "bg-destructive" }
    };
    return <Badge className={config[severity].className}>{config[severity].label}</Badge>;
  };

  const getLikelihoodBadge = (likelihood: ClimateRisk["likelihood"]) => {
    const labels = {
      rare: "Raro",
      unlikely: "Improvável",
      possible: "Possível",
      likely: "Provável",
      certain: "Certo"
    };
    return <Badge variant="outline">{labels[likelihood]}</Badge>;
  };

  const getTypeIcon = (type: ClimateRisk["type"], category: string) => {
    if (type === "physical") {
      if (category.includes("Extremo")) return <Droplets className="h-4 w-4 text-blue-500" />;
      if (category.includes("Crônico")) return <Thermometer className="h-4 w-4 text-orange-500" />;
      return <Wind className="h-4 w-4 text-cyan-500" />;
    }
    if (category.includes("Política")) return <Shield className="h-4 w-4 text-purple-500" />;
    if (category.includes("Mercado")) return <TrendingUp className="h-4 w-4 text-green-500" />;
    return <Building className="h-4 w-4 text-gray-500" />;
  };

  const filteredRisks = risks.filter(risk => {
    if (filterType !== "all" && risk.type !== filterType) return false;
    if (filterSeverity !== "all" && risk.severity !== filterSeverity) return false;
    return true;
  });

  const physicalCount = risks.filter(r => r.type === "physical").length;
  const transitionCount = risks.filter(r => r.type === "transition").length;
  const criticalCount = risks.filter(r => r.severity === "critical" || r.severity === "high").length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Riscos</p>
                <p className="text-2xl font-bold">{risks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Droplets className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Riscos Físicos</p>
                <p className="text-2xl font-bold">{physicalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Riscos de Transição</p>
                <p className="text-2xl font-bold">{transitionCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Alta Severidade</p>
                <p className="text-2xl font-bold">{criticalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex gap-4">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              <SelectItem value="physical">Físico</SelectItem>
              <SelectItem value="transition">Transição</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Severidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="critical">Crítico</SelectItem>
              <SelectItem value="high">Alto</SelectItem>
              <SelectItem value="medium">Médio</SelectItem>
              <SelectItem value="low">Baixo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Risco
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Risco Climático</DialogTitle>
              <DialogDescription>
                Registre um novo risco climático ou de transição para monitoramento
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Nome do Risco</Label>
                <Input placeholder="Ex: Inundações em áreas operacionais" />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physical">Físico</SelectItem>
                    <SelectItem value="transition">Transição</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="extreme">Eventos Extremos</SelectItem>
                    <SelectItem value="chronic">Crônico</SelectItem>
                    <SelectItem value="policy">Política e Legal</SelectItem>
                    <SelectItem value="market">Mercado</SelectItem>
                    <SelectItem value="technology">Tecnologia</SelectItem>
                    <SelectItem value="reputation">Reputação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Severidade</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixo</SelectItem>
                    <SelectItem value="medium">Médio</SelectItem>
                    <SelectItem value="high">Alto</SelectItem>
                    <SelectItem value="critical">Crítico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Probabilidade</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rare">Raro</SelectItem>
                    <SelectItem value="unlikely">Improvável</SelectItem>
                    <SelectItem value="possible">Possível</SelectItem>
                    <SelectItem value="likely">Provável</SelectItem>
                    <SelectItem value="certain">Certo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Horizonte Temporal</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Curto Prazo (0-2 anos)</SelectItem>
                    <SelectItem value="medium">Médio Prazo (2-5 anos)</SelectItem>
                    <SelectItem value="long">Longo Prazo (5+ anos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Território Associado</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mina-norte">Mina Norte</SelectItem>
                    <SelectItem value="planta-sul">Planta Industrial Sul</SelectItem>
                    <SelectItem value="area-influencia">Área de Influência</SelectItem>
                    <SelectItem value="todas">Todas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Responsável</Label>
                <Input placeholder="Nome do responsável" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Descrição</Label>
                <Textarea placeholder="Descreva o risco e seus potenciais impactos..." />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => {
                toast.success("Risco cadastrado com sucesso!");
                setIsDialogOpen(false);
              }}>
                Cadastrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Risks Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Inventário de Riscos Climáticos
          </CardTitle>
          <CardDescription>
            Riscos identificados e classificados conforme IFRS S2
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risco</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Severidade</TableHead>
                <TableHead>Probabilidade</TableHead>
                <TableHead>Horizonte</TableHead>
                <TableHead>Territórios</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRisks.map((risk) => (
                <TableRow key={risk.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(risk.type, risk.category)}
                      <div>
                        <p className="font-medium">{risk.name}</p>
                        <p className="text-xs text-muted-foreground">{risk.category}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={risk.type === "physical" ? "default" : "secondary"}>
                      {risk.type === "physical" ? "Físico" : "Transição"}
                    </Badge>
                  </TableCell>
                  <TableCell>{getSeverityBadge(risk.severity)}</TableCell>
                  <TableCell>{getLikelihoodBadge(risk.likelihood)}</TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {risk.horizon === "short" ? "Curto" : risk.horizon === "medium" ? "Médio" : "Longo"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{risk.territories.length}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{risk.responsible}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {risk.status === "identified" ? "Identificado" :
                       risk.status === "assessed" ? "Avaliado" :
                       risk.status === "mitigated" ? "Mitigado" : "Monitorado"}
                    </Badge>
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
