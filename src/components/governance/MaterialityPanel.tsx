import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Target, TrendingUp, Leaf, DollarSign, Users, FileText, Save, History } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";

interface MaterialTopic {
  id: string;
  name: string;
  category: "environmental" | "social" | "governance";
  financialImpact: number; // 1-5
  environmentalImpact: number; // 1-5
  stakeholderRelevance: number; // 1-5
  priority: "high" | "medium" | "low";
  justification: string;
  risks: string[];
  opportunities: string[];
}

const mockTopics: MaterialTopic[] = [
  {
    id: "1",
    name: "Emissões de GEE",
    category: "environmental",
    financialImpact: 5,
    environmentalImpact: 5,
    stakeholderRelevance: 5,
    priority: "high",
    justification: "Impacto direto em custos operacionais, exposição regulatória e reputação",
    risks: ["Precificação de carbono", "Regulação crescente"],
    opportunities: ["Eficiência energética", "Créditos de carbono"]
  },
  {
    id: "2",
    name: "Gestão de Recursos Hídricos",
    category: "environmental",
    financialImpact: 4,
    environmentalImpact: 5,
    stakeholderRelevance: 4,
    priority: "high",
    justification: "Essencial para operações e relacionamento com comunidades",
    risks: ["Escassez hídrica", "Conflitos de uso"],
    opportunities: ["Reuso de água", "Tecnologias de tratamento"]
  },
  {
    id: "3",
    name: "Riscos Climáticos Físicos",
    category: "environmental",
    financialImpact: 4,
    environmentalImpact: 4,
    stakeholderRelevance: 3,
    priority: "high",
    justification: "Exposição direta de ativos a eventos climáticos extremos",
    risks: ["Danos a ativos", "Interrupção operacional"],
    opportunities: ["Resiliência", "Adaptação"]
  },
  {
    id: "4",
    name: "Biodiversidade e Uso do Solo",
    category: "environmental",
    financialImpact: 3,
    environmentalImpact: 5,
    stakeholderRelevance: 4,
    priority: "medium",
    justification: "Requisito para licenciamento e expectativa de stakeholders",
    risks: ["Perda de licença", "Passivos ambientais"],
    opportunities: ["Restauração", "Compensação"]
  },
  {
    id: "5",
    name: "Saúde e Segurança",
    category: "social",
    financialImpact: 4,
    environmentalImpact: 2,
    stakeholderRelevance: 5,
    priority: "high",
    justification: "Valor fundamental e requisito legal",
    risks: ["Acidentes", "Responsabilidade legal"],
    opportunities: ["Cultura de segurança", "Bem-estar"]
  },
  {
    id: "6",
    name: "Relacionamento com Comunidades",
    category: "social",
    financialImpact: 3,
    environmentalImpact: 3,
    stakeholderRelevance: 4,
    priority: "medium",
    justification: "Licença social para operar",
    risks: ["Conflitos", "Bloqueios operacionais"],
    opportunities: ["Desenvolvimento local", "Parcerias"]
  },
  {
    id: "7",
    name: "Governança Climática",
    category: "governance",
    financialImpact: 3,
    environmentalImpact: 3,
    stakeholderRelevance: 4,
    priority: "medium",
    justification: "Requisito regulatório e expectativa de investidores",
    risks: ["Não conformidade", "Falta de supervisão"],
    opportunities: ["Integração estratégica", "Liderança"]
  }
];

export function MaterialityPanel() {
  const [topics, setTopics] = useState<MaterialTopic[]>(mockTopics);
  const [selectedVersion, setSelectedVersion] = useState("2024");

  const matrixData = topics.map(topic => ({
    name: topic.name,
    x: topic.financialImpact,
    y: topic.environmentalImpact,
    priority: topic.priority,
    category: topic.category
  }));

  const getCategoryIcon = (category: MaterialTopic["category"]) => {
    switch (category) {
      case "environmental": return <Leaf className="h-4 w-4 text-green-500" />;
      case "social": return <Users className="h-4 w-4 text-blue-500" />;
      case "governance": return <Target className="h-4 w-4 text-purple-500" />;
    }
  };

  const getCategoryLabel = (category: MaterialTopic["category"]) => {
    switch (category) {
      case "environmental": return "Ambiental";
      case "social": return "Social";
      case "governance": return "Governança";
    }
  };

  const getPriorityColor = (priority: MaterialTopic["priority"]) => {
    switch (priority) {
      case "high": return "#ef4444";
      case "medium": return "#f59e0b";
      case "low": return "#22c55e";
    }
  };

  const handleSave = () => {
    toast.success("Matriz de materialidade salva com sucesso!");
  };

  const highPriorityCount = topics.filter(t => t.priority === "high").length;
  const mediumPriorityCount = topics.filter(t => t.priority === "medium").length;

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Temas Materiais</p>
                <p className="text-2xl font-bold">{topics.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Alta Prioridade</p>
                <p className="text-2xl font-bold">{highPriorityCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Média Prioridade</p>
                <p className="text-2xl font-bold">{mediumPriorityCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <History className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Versão</p>
                <p className="text-2xl font-bold">{selectedVersion}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Materiality Matrix */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Matriz de Materialidade
                </CardTitle>
                <CardDescription>
                  Impacto financeiro vs. impacto ambiental/social
                </CardDescription>
              </div>
              <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Impacto Financeiro" 
                    domain={[0, 6]}
                    label={{ value: 'Impacto Financeiro', position: 'bottom', offset: 20 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Impacto Ambiental/Social" 
                    domain={[0, 6]}
                    label={{ value: 'Impacto Ambiental/Social', angle: -90, position: 'left', offset: 10 }}
                  />
                  <ReferenceLine x={3} stroke="#666" strokeDasharray="3 3" />
                  <ReferenceLine y={3} stroke="#666" strokeDasharray="3 3" />
                  <Tooltip 
                    formatter={(value: number, name: string) => [value, name === 'x' ? 'Impacto Financeiro' : 'Impacto Ambiental']}
                    labelFormatter={(label) => matrixData.find(d => d.name === label)?.name || ''}
                  />
                  <Scatter name="Temas" data={matrixData}>
                    {matrixData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getPriorityColor(entry.priority)} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span className="text-xs">Alta</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-xs">Média</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs">Baixa</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Priority List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Temas Prioritários</CardTitle>
            <CardDescription>Ordenado por relevância estratégica</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topics
              .sort((a, b) => {
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
              })
              .map((topic, index) => (
                <div key={topic.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(topic.category)}
                        <span className="font-medium text-sm">{topic.name}</span>
                      </div>
                      <Badge 
                        variant={topic.priority === "high" ? "destructive" : topic.priority === "medium" ? "secondary" : "outline"}
                      >
                        {topic.priority === "high" ? "Alta" : topic.priority === "medium" ? "Média" : "Baixa"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{topic.justification}</p>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detalhamento de Temas Materiais
            </CardTitle>
            <CardDescription>
              Justificativas, riscos e oportunidades por tema
            </CardDescription>
          </div>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Versão
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tema</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-center">Financeiro</TableHead>
                <TableHead className="text-center">Ambiental</TableHead>
                <TableHead className="text-center">Stakeholders</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Riscos</TableHead>
                <TableHead>Oportunidades</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topics.map((topic) => (
                <TableRow key={topic.id}>
                  <TableCell className="font-medium">{topic.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(topic.category)}
                      <span className="text-sm">{getCategoryLabel(topic.category)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{topic.financialImpact}/5</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{topic.environmentalImpact}/5</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{topic.stakeholderRelevance}/5</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={topic.priority === "high" ? "destructive" : topic.priority === "medium" ? "secondary" : "outline"}
                    >
                      {topic.priority === "high" ? "Alta" : topic.priority === "medium" ? "Média" : "Baixa"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {topic.risks.slice(0, 2).map((risk) => (
                        <Badge key={risk} variant="outline" className="text-xs">
                          {risk}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {topic.opportunities.slice(0, 2).map((opp) => (
                        <Badge key={opp} variant="outline" className="text-xs bg-green-500/10">
                          {opp}
                        </Badge>
                      ))}
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
