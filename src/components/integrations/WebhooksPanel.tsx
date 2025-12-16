import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell, Webhook, Plus, Play, Pause, Trash2, Settings, CheckCircle, XCircle, Clock, Send, AlertTriangle, FileText, Calculator, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: "active" | "paused" | "error";
  lastTriggered: string;
  successRate: number;
  enabled: boolean;
}

const mockWebhooks: WebhookConfig[] = [
  {
    id: "1",
    name: "Notificação ERP",
    url: "https://erp.empresa.com/webhooks/mrv",
    events: ["metric.calculated", "data.imported"],
    status: "active",
    lastTriggered: "2024-12-16 14:30",
    successRate: 98.5,
    enabled: true
  },
  {
    id: "2",
    name: "Slack Alertas",
    url: "https://hooks.slack.com/services/xxx/yyy",
    events: ["alert.created", "report.generated"],
    status: "active",
    lastTriggered: "2024-12-16 10:15",
    successRate: 100,
    enabled: true
  },
  {
    id: "3",
    name: "Sistema de Compliance",
    url: "https://compliance.empresa.com/api/events",
    events: ["report.frozen", "audit.completed"],
    status: "paused",
    lastTriggered: "2024-12-10 08:00",
    successRate: 95.2,
    enabled: false
  },
  {
    id: "4",
    name: "BI Dashboard",
    url: "https://bi.empresa.com/webhooks",
    events: ["metric.calculated"],
    status: "error",
    lastTriggered: "2024-12-15 22:00",
    successRate: 78.3,
    enabled: true
  }
];

const eventTypes = [
  { id: "data.imported", label: "Dado Importado", icon: <FileText className="h-4 w-4" />, description: "Quando novos dados operacionais são importados" },
  { id: "metric.calculated", label: "Métrica Calculada", icon: <Calculator className="h-4 w-4" />, description: "Quando uma métrica MRV é recalculada" },
  { id: "alert.created", label: "Alerta Gerado", icon: <AlertTriangle className="h-4 w-4" />, description: "Quando um novo alerta é criado" },
  { id: "report.generated", label: "Relatório Gerado", icon: <FileText className="h-4 w-4" />, description: "Quando um relatório é finalizado" },
  { id: "report.frozen", label: "Período Congelado", icon: <Lock className="h-4 w-4" />, description: "Quando um período é congelado para auditoria" },
  { id: "audit.completed", label: "Auditoria Concluída", icon: <CheckCircle className="h-4 w-4" />, description: "Quando uma auditoria é finalizada" }
];

const recentEvents = [
  { id: "1", type: "metric.calculated", territory: "Mina Norte", timestamp: "2024-12-16 14:35:22", webhook: "Notificação ERP", status: "delivered" },
  { id: "2", type: "data.imported", territory: "Planta Sul", timestamp: "2024-12-16 14:30:00", webhook: "Notificação ERP", status: "delivered" },
  { id: "3", type: "alert.created", territory: "Área de Influência", timestamp: "2024-12-16 10:15:45", webhook: "Slack Alertas", status: "delivered" },
  { id: "4", type: "metric.calculated", territory: "Mina Norte", timestamp: "2024-12-15 22:00:00", webhook: "BI Dashboard", status: "failed" },
  { id: "5", type: "report.generated", territory: "Consolidado", timestamp: "2024-12-15 18:00:00", webhook: "Slack Alertas", status: "delivered" }
];

export function WebhooksPanel() {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>(mockWebhooks);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newWebhookName, setNewWebhookName] = useState("");
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const handleToggleWebhook = (id: string) => {
    setWebhooks(webhooks.map(wh => {
      if (wh.id === id) {
        const newEnabled = !wh.enabled;
        toast.success(newEnabled ? "Webhook ativado" : "Webhook pausado");
        return { ...wh, enabled: newEnabled, status: newEnabled ? "active" as const : "paused" as const };
      }
      return wh;
    }));
  };

  const handleTestWebhook = (webhook: WebhookConfig) => {
    toast.info(`Enviando evento de teste para "${webhook.name}"...`);
    setTimeout(() => {
      toast.success("Evento de teste enviado com sucesso!");
    }, 1500);
  };

  const handleCreateWebhook = () => {
    if (!newWebhookName || !newWebhookUrl || selectedEvents.length === 0) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const newWebhook: WebhookConfig = {
      id: Date.now().toString(),
      name: newWebhookName,
      url: newWebhookUrl,
      events: selectedEvents,
      status: "active",
      lastTriggered: "-",
      successRate: 100,
      enabled: true
    };

    setWebhooks([newWebhook, ...webhooks]);
    setShowNewForm(false);
    setNewWebhookName("");
    setNewWebhookUrl("");
    setSelectedEvents([]);
    toast.success("Webhook criado com sucesso!");
  };

  const toggleEventSelection = (eventId: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(e => e !== eventId)
        : [...prev, eventId]
    );
  };

  const getStatusIcon = (status: WebhookConfig["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "paused":
        return <Pause className="h-4 w-4 text-muted-foreground" />;
      case "error":
        return <XCircle className="h-4 w-4 text-destructive" />;
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
                <Webhook className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Webhooks</p>
                <p className="text-2xl font-bold">{webhooks.length}</p>
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
                <p className="text-sm text-muted-foreground">Ativos</p>
                <p className="text-2xl font-bold">{webhooks.filter(w => w.status === "active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Send className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Eventos Hoje</p>
                <p className="text-2xl font-bold">47</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Falhas</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Webhooks Configuration */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              Configuração de Webhooks
            </CardTitle>
            <CardDescription>
              Configure endpoints para receber notificações de eventos do sistema
            </CardDescription>
          </div>
          <Button onClick={() => setShowNewForm(!showNewForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Webhook
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {showNewForm && (
            <Card className="border-dashed">
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome do Webhook</Label>
                    <Input 
                      placeholder="Ex: Notificação Teams"
                      value={newWebhookName}
                      onChange={(e) => setNewWebhookName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>URL do Endpoint</Label>
                    <Input 
                      placeholder="https://..."
                      value={newWebhookUrl}
                      onChange={(e) => setNewWebhookUrl(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Eventos</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {eventTypes.map((event) => (
                      <div 
                        key={event.id}
                        className="flex items-center space-x-2 p-2 border rounded-lg"
                      >
                        <Checkbox 
                          id={event.id}
                          checked={selectedEvents.includes(event.id)}
                          onCheckedChange={() => toggleEventSelection(event.id)}
                        />
                        <label htmlFor={event.id} className="flex items-center gap-2 text-sm cursor-pointer">
                          {event.icon}
                          {event.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowNewForm(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateWebhook}>
                    Criar Webhook
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ativo</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Eventos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Taxa Sucesso</TableHead>
                <TableHead>Último Disparo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks.map((webhook) => (
                <TableRow key={webhook.id}>
                  <TableCell>
                    <Switch 
                      checked={webhook.enabled}
                      onCheckedChange={() => handleToggleWebhook(webhook.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{webhook.name}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded truncate max-w-[200px] block">
                      {webhook.url}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="outline" className="text-xs">
                          {event.split('.')[1]}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(webhook.status)}
                      <span className="text-sm capitalize">
                        {webhook.status === "active" ? "Ativo" : 
                         webhook.status === "paused" ? "Pausado" : "Erro"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={webhook.successRate >= 95 ? "text-green-500" : webhook.successRate >= 80 ? "text-yellow-500" : "text-destructive"}>
                      {webhook.successRate}%
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {webhook.lastTriggered}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleTestWebhook(webhook)}
                      >
                        <Play className="h-4 w-4" />
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

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Eventos Recentes
          </CardTitle>
          <CardDescription>
            Histórico de eventos disparados para os webhooks configurados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evento</TableHead>
                <TableHead>Território</TableHead>
                <TableHead>Webhook</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <Badge variant="outline">{event.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{event.territory}</TableCell>
                  <TableCell className="text-sm">{event.webhook}</TableCell>
                  <TableCell>
                    {event.status === "delivered" ? (
                      <Badge className="bg-green-500">Entregue</Badge>
                    ) : (
                      <Badge variant="destructive">Falhou</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {event.timestamp}
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
