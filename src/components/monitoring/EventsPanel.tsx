import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  AlertTriangle,
  Plus,
  MapPin,
  Calendar,
  Bell,
  AlertCircle,
  CheckCircle,
  Info,
  ChevronRight,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface TerritorialEvent {
  id: string;
  title: string;
  description: string;
  type: "incident" | "change" | "observation" | "alert";
  severity: "high" | "medium" | "low" | "info";
  territoryId: string;
  territoryName: string;
  date: string;
  status: "open" | "resolved" | "monitoring";
  coordinates?: [number, number];
}

const mockEvents: TerritorialEvent[] = [
  {
    id: "evt-1",
    title: "Alteração de limites detectada",
    description: "Detectada alteração nos limites do setor norte, possível invasão de área.",
    type: "alert",
    severity: "high",
    territoryId: "1",
    territoryName: "Mina Carajás",
    date: "2024-01-15",
    status: "open",
  },
  {
    id: "evt-2",
    title: "Sobreposição com área protegida",
    description: "Identificada sobreposição parcial com área de preservação permanente.",
    type: "alert",
    severity: "medium",
    territoryId: "3",
    territoryName: "Planta Industrial MG",
    date: "2024-01-14",
    status: "monitoring",
  },
  {
    id: "evt-3",
    title: "Atualização de geometria",
    description: "Geometria do território atualizada após levantamento topográfico.",
    type: "change",
    severity: "info",
    territoryId: "2",
    territoryName: "Terminal Portuário SP",
    date: "2024-01-12",
    status: "resolved",
  },
  {
    id: "evt-4",
    title: "Incidente ambiental registrado",
    description: "Vazamento menor identificado no setor de processamento. Contenção realizada.",
    type: "incident",
    severity: "high",
    territoryId: "1",
    territoryName: "Mina Carajás",
    date: "2024-01-10",
    status: "resolved",
  },
  {
    id: "evt-5",
    title: "Observação de campo",
    description: "Registro fotográfico da área de revegetação mostra progresso positivo.",
    type: "observation",
    severity: "low",
    territoryId: "4",
    territoryName: "Reserva Florestal AM",
    date: "2024-01-08",
    status: "resolved",
  },
];

const eventTypeConfig = {
  incident: { label: "Incidente", icon: AlertTriangle, color: "text-destructive" },
  change: { label: "Alteração", icon: Info, color: "text-primary" },
  observation: { label: "Observação", icon: CheckCircle, color: "text-success" },
  alert: { label: "Alerta", icon: Bell, color: "text-warning" },
};

const severityConfig = {
  high: { label: "Alta", className: "bg-destructive/10 text-destructive" },
  medium: { label: "Média", className: "bg-warning/10 text-warning" },
  low: { label: "Baixa", className: "bg-success/10 text-success" },
  info: { label: "Info", className: "bg-primary/10 text-primary" },
};

const statusConfig = {
  open: { label: "Aberto", className: "bg-destructive/10 text-destructive" },
  monitoring: { label: "Monitorando", className: "bg-warning/10 text-warning" },
  resolved: { label: "Resolvido", className: "bg-success/10 text-success" },
};

const territories = [
  { id: "1", name: "Mina Carajás" },
  { id: "2", name: "Terminal Portuário SP" },
  { id: "3", name: "Planta Industrial MG" },
  { id: "4", name: "Reserva Florestal AM" },
];

interface EventsPanelProps {
  onEventSelect?: (event: TerritorialEvent) => void;
  territoryFilter?: string;
}

export const EventsPanel = ({ onEventSelect, territoryFilter }: EventsPanelProps) => {
  const [events, setEvents] = useState<TerritorialEvent[]>(mockEvents);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Form state
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    type: "",
    severity: "",
    territoryId: "",
  });

  const filteredEvents = events.filter((event) => {
    const matchesType = typeFilter === "all" || event.type === typeFilter;
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    const matchesTerritory = !territoryFilter || event.territoryId === territoryFilter;
    return matchesType && matchesStatus && matchesTerritory;
  });

  const handleAddEvent = () => {
    if (!newEvent.title.trim() || !newEvent.type || !newEvent.territoryId) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    const territory = territories.find(t => t.id === newEvent.territoryId);
    const event: TerritorialEvent = {
      id: `evt-${Date.now()}`,
      title: newEvent.title,
      description: newEvent.description,
      type: newEvent.type as TerritorialEvent["type"],
      severity: (newEvent.severity || "medium") as TerritorialEvent["severity"],
      territoryId: newEvent.territoryId,
      territoryName: territory?.name || "",
      date: new Date().toISOString().split("T")[0],
      status: "open",
    };

    setEvents(prev => [event, ...prev]);
    toast.success("Evento registrado com sucesso");

    // Reset form
    setNewEvent({
      title: "",
      description: "",
      type: "",
      severity: "",
      territoryId: "",
    });
    setIsAddModalOpen(false);
  };

  const openAlerts = events.filter(e => e.status === "open" && e.severity === "high").length;

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Eventos & Alertas
              </CardTitle>
              {openAlerts > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {openAlerts} críticos
                </Badge>
              )}
            </div>
            <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Registrar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="flex-1">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="alert">Alertas</SelectItem>
                <SelectItem value="incident">Incidentes</SelectItem>
                <SelectItem value="change">Alterações</SelectItem>
                <SelectItem value="observation">Observações</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="open">Abertos</SelectItem>
                <SelectItem value="monitoring">Monitorando</SelectItem>
                <SelectItem value="resolved">Resolvidos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Events List */}
          <div className="space-y-2 max-h-[350px] overflow-y-auto">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhum evento encontrado</p>
              </div>
            ) : (
              filteredEvents.map((event) => {
                const typeConf = eventTypeConfig[event.type];
                const TypeIcon = typeConf.icon;
                const severity = severityConfig[event.severity];
                const status = statusConfig[event.status];

                return (
                  <div
                    key={event.id}
                    onClick={() => onEventSelect?.(event)}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-colors",
                      event.status === "open" && event.severity === "high"
                        ? "border-destructive/50 bg-destructive/5"
                        : "border-border bg-secondary/30 hover:bg-secondary/50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <TypeIcon className={cn("w-4 h-4", typeConf.color)} />
                        <span className="font-medium text-sm">{event.title}</span>
                      </div>
                      <Badge className={cn("text-[10px]", severity.className)}>
                        {severity.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {event.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.territoryName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {event.date}
                        </span>
                      </div>
                      <Badge variant="outline" className={cn("text-[10px]", status.className)}>
                        {status.label}
                      </Badge>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Summary */}
          <div className="pt-3 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-medium">{filteredEvents.length} eventos</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Event Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Registrar Novo Evento
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="event-title">Título *</Label>
              <Input
                id="event-title"
                value={newEvent.title}
                onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Alteração de limites detectada"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Evento *</Label>
                <Select
                  value={newEvent.type}
                  onValueChange={(value) => setNewEvent(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alert">Alerta</SelectItem>
                    <SelectItem value="incident">Incidente</SelectItem>
                    <SelectItem value="change">Alteração</SelectItem>
                    <SelectItem value="observation">Observação</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Severidade</Label>
                <Select
                  value={newEvent.severity}
                  onValueChange={(value) => setNewEvent(prev => ({ ...prev, severity: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="info">Informativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Território *</Label>
              <Select
                value={newEvent.territoryId}
                onValueChange={(value) => setNewEvent(prev => ({ ...prev, territoryId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o território" />
                </SelectTrigger>
                <SelectContent>
                  {territories.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-description">Descrição</Label>
              <Textarea
                id="event-description"
                value={newEvent.description}
                onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o evento com detalhes..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddEvent}>Registrar Evento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
