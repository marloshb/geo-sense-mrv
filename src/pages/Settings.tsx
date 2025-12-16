import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, Bell, Palette, Globe, Key } from "lucide-react";

const Settings = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações da plataforma
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid grid-cols-2 lg:grid-cols-6 w-full lg:w-auto">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="permissions">Permissões</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="integrations">Integrações</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Organização
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome da Organização</Label>
                    <Input defaultValue="Vale S.A." />
                  </div>
                  <div className="space-y-2">
                    <Label>CNPJ</Label>
                    <Input defaultValue="33.592.510/0001-54" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Setor</Label>
                  <Select defaultValue="mining">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mining">Mineração</SelectItem>
                      <SelectItem value="energy">Energia</SelectItem>
                      <SelectItem value="oil_gas">Óleo e Gás</SelectItem>
                      <SelectItem value="agro">Agronegócio</SelectItem>
                      <SelectItem value="industry">Indústria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <Select defaultValue="pt">
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt">Português (Brasil)</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>Salvar Alterações</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Usuários da Organização
                  </CardTitle>
                  <Button size="sm">Convidar Usuário</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Maria Silva", email: "maria@vale.com", role: "Admin", status: "active" },
                    { name: "João Santos", email: "joao@vale.com", role: "Analista", status: "active" },
                    { name: "Ana Oliveira", email: "ana@vale.com", role: "Operacional", status: "active" },
                    { name: "Carlos Ferreira", email: "carlos@vale.com", role: "Auditor", status: "pending" },
                  ].map((user, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{user.role}</Badge>
                        <Badge
                          className={
                            user.status === "active"
                              ? "bg-success/10 text-success"
                              : "bg-warning/10 text-warning"
                          }
                        >
                          {user.status === "active" ? "Ativo" : "Pendente"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Perfis de Acesso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Administrador", desc: "Acesso total ao sistema", users: 2 },
                    { name: "Analista ESG", desc: "Dados, analytics e relatórios", users: 5 },
                    { name: "Operacional", desc: "Entrada de dados e monitoramento", users: 8 },
                    { name: "Executivo", desc: "Dashboards e relatórios", users: 3 },
                    { name: "Auditor", desc: "Somente leitura e auditoria", users: 2 },
                  ].map((role, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{role.name}</p>
                        <p className="text-sm text-muted-foreground">{role.desc}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          {role.users} usuários
                        </span>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Preferências de Notificação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { label: "Alertas de anomalias", desc: "Receber alertas quando anomalias forem detectadas" },
                  { label: "Relatórios prontos", desc: "Notificar quando relatórios forem gerados" },
                  { label: "Atualizações de dados", desc: "Alertar sobre novos dados importados" },
                  { label: "Vencimento de prazos", desc: "Lembrar sobre prazos de compliance" },
                ].map((setting, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{setting.label}</p>
                      <p className="text-xs text-muted-foreground">{setting.desc}</p>
                    </div>
                    <Switch defaultChecked={idx < 2} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  Configure integrações com sistemas externos, ERPs e plataformas ESG
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Chaves de API
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm">Chave de Produção</p>
                    <Badge>Ativa</Badge>
                  </div>
                  <code className="text-xs text-muted-foreground">
                    mrv_prod_****************************
                  </code>
                </div>
                <Button variant="outline">Gerar Nova Chave</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
