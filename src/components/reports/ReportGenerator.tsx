import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Download,
  Settings,
  Map,
  BarChart3,
  Brain,
  Shield,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

interface ReportConfig {
  type: string;
  territory: string;
  period: string;
  includeSections: {
    executiveSummary: boolean;
    emissions: boolean;
    risks: boolean;
    maps: boolean;
    charts: boolean;
    aiNarratives: boolean;
    methodology: boolean;
  };
  customNotes: string;
}

export const ReportGenerator = () => {
  const [config, setConfig] = useState<ReportConfig>({
    type: "sustainability",
    territory: "all",
    period: "2024",
    includeSections: {
      executiveSummary: true,
      emissions: true,
      risks: true,
      maps: true,
      charts: true,
      aiNarratives: true,
      methodology: true,
    },
    customNotes: "",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");

  const reportTypes = [
    {
      id: "sustainability",
      name: "Relatório de Sustentabilidade",
      description: "Relatório anual completo para stakeholders",
    },
    {
      id: "ifrs-s2",
      name: "Relatório Climático (IFRS S2)",
      description: "Estrutura regulatória para divulgação climática",
    },
    {
      id: "territorial",
      name: "Relatório Territorial",
      description: "Análise detalhada por território/projeto",
    },
    {
      id: "emissions",
      name: "Inventário de Emissões",
      description: "Detalhamento de Escopos 1, 2 e 3",
    },
    {
      id: "risks",
      name: "Análise de Riscos Climáticos",
      description: "Mapeamento de riscos físicos e transição",
    },
  ];

  const generateReport = async () => {
    setIsGenerating(true);
    setProgress(0);

    const steps = [
      { name: "Coletando dados territoriais...", duration: 800 },
      { name: "Calculando métricas de emissões...", duration: 1000 },
      { name: "Analisando riscos climáticos...", duration: 800 },
      { name: "Gerando mapas temáticos...", duration: 1200 },
      { name: "Criando gráficos e visualizações...", duration: 1000 },
      { name: "Gerando narrativas com IA...", duration: 1500 },
      { name: "Compilando relatório final...", duration: 800 },
    ];

    try {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i].name);
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise((resolve) => setTimeout(resolve, steps[i].duration));
      }

      toast.success("Relatório gerado com sucesso!", {
        description: "Clique em Download para baixar o PDF.",
      });
    } catch (error) {
      toast.error("Erro ao gerar relatório");
    } finally {
      setIsGenerating(false);
      setProgress(100);
      setCurrentStep("");
    }
  };

  const handleSectionToggle = (section: keyof typeof config.includeSections) => {
    setConfig((prev) => ({
      ...prev,
      includeSections: {
        ...prev.includeSections,
        [section]: !prev.includeSections[section],
      },
    }));
  };

  const selectedType = reportTypes.find((t) => t.id === config.type);

  return (
    <div className="space-y-6">
      {/* Report Type Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Tipo de Relatório
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {reportTypes.map((type) => (
              <div
                key={type.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  config.type === type.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setConfig((prev) => ({ ...prev, type: type.id }))}
              >
                <div className="font-medium text-sm">{type.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {type.description}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configurações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Território</Label>
              <Select
                value={config.territory}
                onValueChange={(value) =>
                  setConfig((prev) => ({ ...prev, territory: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Territórios</SelectItem>
                  <SelectItem value="carajas">Carajás</SelectItem>
                  <SelectItem value="terminal-sp">Terminal SP</SelectItem>
                  <SelectItem value="planta-mg">Planta MG</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Período</Label>
              <Select
                value={config.period}
                onValueChange={(value) =>
                  setConfig((prev) => ({ ...prev, period: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="q3-2024">Q3 2024</SelectItem>
                  <SelectItem value="q2-2024">Q2 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Notas Adicionais</Label>
              <Textarea
                placeholder="Adicione observações ou contexto para o relatório..."
                value={config.customNotes}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, customNotes: e.target.value }))
                }
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section Selection */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Seções do Relatório</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="executiveSummary"
                  checked={config.includeSections.executiveSummary}
                  onCheckedChange={() => handleSectionToggle("executiveSummary")}
                />
                <Label htmlFor="executiveSummary" className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary" />
                  Sumário Executivo
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emissions"
                  checked={config.includeSections.emissions}
                  onCheckedChange={() => handleSectionToggle("emissions")}
                />
                <Label htmlFor="emissions" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-info" />
                  Inventário de Emissões
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="risks"
                  checked={config.includeSections.risks}
                  onCheckedChange={() => handleSectionToggle("risks")}
                />
                <Label htmlFor="risks" className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-warning" />
                  Análise de Riscos
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="maps"
                  checked={config.includeSections.maps}
                  onCheckedChange={() => handleSectionToggle("maps")}
                />
                <Label htmlFor="maps" className="flex items-center gap-2">
                  <Map className="w-4 h-4 text-success" />
                  Mapas Temáticos
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="charts"
                  checked={config.includeSections.charts}
                  onCheckedChange={() => handleSectionToggle("charts")}
                />
                <Label htmlFor="charts" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-chart-1" />
                  Gráficos e Visualizações
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="aiNarratives"
                  checked={config.includeSections.aiNarratives}
                  onCheckedChange={() => handleSectionToggle("aiNarratives")}
                />
                <Label htmlFor="aiNarratives" className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary" />
                  Narrativas IA
                  <Badge variant="secondary" className="text-xs">
                    IA
                  </Badge>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="methodology"
                  checked={config.includeSections.methodology}
                  onCheckedChange={() => handleSectionToggle("methodology")}
                />
                <Label htmlFor="methodology">Metodologia e Fontes</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generate Button */}
      <Card>
        <CardContent className="p-4">
          {isGenerating ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{currentStep}</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          ) : progress === 100 ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Relatório pronto!</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setProgress(0)}>
                  Novo Relatório
                </Button>
                <Button className="gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{selectedType?.name}</div>
                <div className="text-sm text-muted-foreground">
                  {Object.values(config.includeSections).filter(Boolean).length}{" "}
                  seções selecionadas
                </div>
              </div>
              <Button onClick={generateReport} className="gap-2">
                <FileText className="w-4 h-4" />
                Gerar Relatório
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
