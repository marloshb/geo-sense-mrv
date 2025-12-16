import { AppLayout } from "@/components/layout/AppLayout";
import { TerritoryList } from "@/components/monitoring/TerritoryList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Upload } from "lucide-react";

const Territories = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Territórios</h1>
            <p className="text-muted-foreground">
              Gestão de territórios e áreas monitoradas
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Upload className="w-4 h-4" />
              Importar
            </Button>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Território
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Territory List */}
          <div className="lg:col-span-2">
            <TerritoryList />
          </div>

          {/* Territory Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cadastrar Território</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome do Território</Label>
                  <Input placeholder="Ex: Mina Norte" />
                </div>

                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mining">Mineração</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="logistics">Logística</SelectItem>
                      <SelectItem value="conservation">Conservação</SelectItem>
                      <SelectItem value="project">Projeto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Categoria Operacional</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owned">Próprio</SelectItem>
                      <SelectItem value="leased">Arrendado</SelectItem>
                      <SelectItem value="joint">Joint Venture</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Área (hectares)</Label>
                  <Input type="number" placeholder="Ex: 1500" />
                </div>

                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea placeholder="Descrição do território..." rows={3} />
                </div>

                <div className="space-y-2">
                  <Label>Geometria (GeoJSON)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Arraste um arquivo GeoJSON ou clique para selecionar
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Selecionar Arquivo
                    </Button>
                  </div>
                </div>

                <Button className="w-full">Cadastrar Território</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Territories;
