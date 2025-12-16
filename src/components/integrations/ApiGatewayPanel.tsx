import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Key, Copy, RefreshCw, Plus, Activity, Lock, Unlock, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  status: "active" | "revoked";
  createdAt: string;
  lastUsed: string;
  rateLimit: number;
  tenant: string;
}

const mockApiKeys: ApiKey[] = [
  {
    id: "1",
    name: "ERP Integration",
    key: "mrv_live_sk_xxxx...xxxx1234",
    permissions: ["read:metrics", "read:territories"],
    status: "active",
    createdAt: "2024-01-15",
    lastUsed: "2024-12-16 14:30",
    rateLimit: 1000,
    tenant: "Organização Principal"
  },
  {
    id: "2",
    name: "BI Dashboard",
    key: "mrv_live_sk_xxxx...xxxx5678",
    permissions: ["read:metrics", "read:reports"],
    status: "active",
    createdAt: "2024-02-20",
    lastUsed: "2024-12-16 10:15",
    rateLimit: 500,
    tenant: "Organização Principal"
  },
  {
    id: "3",
    name: "Legacy System",
    key: "mrv_live_sk_xxxx...xxxx9012",
    permissions: ["read:territories"],
    status: "revoked",
    createdAt: "2023-11-10",
    lastUsed: "2024-06-01 08:00",
    rateLimit: 100,
    tenant: "Organização Principal"
  }
];

const mockAccessLogs = [
  { id: "1", endpoint: "/api/v1/metrics", method: "GET", status: 200, ip: "192.168.1.100", timestamp: "2024-12-16 14:30:45", duration: "120ms" },
  { id: "2", endpoint: "/api/v1/territories", method: "GET", status: 200, ip: "192.168.1.101", timestamp: "2024-12-16 14:28:12", duration: "85ms" },
  { id: "3", endpoint: "/api/v1/reports/export", method: "POST", status: 201, ip: "192.168.1.100", timestamp: "2024-12-16 14:25:00", duration: "2450ms" },
  { id: "4", endpoint: "/api/v1/metrics", method: "GET", status: 429, ip: "10.0.0.50", timestamp: "2024-12-16 14:20:33", duration: "5ms" },
  { id: "5", endpoint: "/api/v1/auth/token", method: "POST", status: 401, ip: "unknown", timestamp: "2024-12-16 14:15:00", duration: "15ms" }
];

export function ApiGatewayPanel() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys);
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyRateLimit, setNewKeyRateLimit] = useState("1000");

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("Chave copiada para a área de transferência");
  };

  const handleCreateKey = () => {
    if (!newKeyName) {
      toast.error("Nome da chave é obrigatório");
      return;
    }

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `mrv_live_sk_${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`,
      permissions: ["read:metrics"],
      status: "active",
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: "-",
      rateLimit: parseInt(newKeyRateLimit),
      tenant: "Organização Principal"
    };

    setApiKeys([newKey, ...apiKeys]);
    setShowNewKeyForm(false);
    setNewKeyName("");
    toast.success("Nova chave API criada com sucesso");
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === id ? { ...key, status: "revoked" as const } : key
    ));
    toast.success("Chave API revogada");
  };

  const handleActivateKey = (id: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === id ? { ...key, status: "active" as const } : key
    ));
    toast.success("Chave API reativada");
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Key className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Chaves Ativas</p>
                <p className="text-2xl font-bold">{apiKeys.filter(k => k.status === "active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Activity className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Requisições Hoje</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Shield className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rate Limit Hits</p>
                <p className="text-2xl font-bold">23</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <Lock className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Falhas Auth</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Keys Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Chaves de API
            </CardTitle>
            <CardDescription>Gerencie as chaves de acesso à API da plataforma</CardDescription>
          </div>
          <Button onClick={() => setShowNewKeyForm(!showNewKeyForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Chave
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {showNewKeyForm && (
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Nome da Chave</Label>
                    <Input 
                      placeholder="Ex: Integração ERP"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rate Limit (req/hora)</Label>
                    <Select value={newKeyRateLimit} onValueChange={setNewKeyRateLimit}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">100</SelectItem>
                        <SelectItem value="500">500</SelectItem>
                        <SelectItem value="1000">1.000</SelectItem>
                        <SelectItem value="5000">5.000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleCreateKey} className="w-full">
                      Criar Chave
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Chave</TableHead>
                <TableHead>Permissões</TableHead>
                <TableHead>Rate Limit</TableHead>
                <TableHead>Último Uso</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell className="font-medium">{apiKey.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded">{apiKey.key}</code>
                      <Button variant="ghost" size="icon" onClick={() => handleCopyKey(apiKey.key)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {apiKey.permissions.map((perm) => (
                        <Badge key={perm} variant="outline" className="text-xs">
                          {perm}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{apiKey.rateLimit}/h</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{apiKey.lastUsed}</TableCell>
                  <TableCell>
                    <Badge variant={apiKey.status === "active" ? "default" : "secondary"}>
                      {apiKey.status === "active" ? "Ativa" : "Revogada"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {apiKey.status === "active" ? (
                        <Button variant="ghost" size="icon" onClick={() => handleRevokeKey(apiKey.id)}>
                          <Lock className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="icon" onClick={() => handleActivateKey(apiKey.id)}>
                          <Unlock className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Access Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Logs de Acesso
          </CardTitle>
          <CardDescription>Registro de chamadas à API</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Endpoint</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAccessLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <code className="text-xs">{log.endpoint}</code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.method}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={log.status < 300 ? "default" : log.status < 500 ? "secondary" : "destructive"}
                    >
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{log.ip}</TableCell>
                  <TableCell>{log.duration}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{log.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
