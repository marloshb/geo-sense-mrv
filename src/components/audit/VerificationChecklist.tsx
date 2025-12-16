import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ClipboardCheck,
  CheckCircle2,
  Circle,
  MinusCircle,
  MessageSquare,
  Save,
  Download,
} from "lucide-react";
import { toast } from "sonner";

interface ChecklistItem {
  id: string;
  description: string;
  status: "pending" | "ok" | "na" | "issue";
  comment?: string;
  required: boolean;
}

interface ChecklistSection {
  id: string;
  name: string;
  items: ChecklistItem[];
}

const initialChecklist: ChecklistSection[] = [
  {
    id: "data",
    name: "Qualidade dos Dados",
    items: [
      {
        id: "d1",
        description: "Todos os dados possuem fonte documentada",
        status: "ok",
        required: true,
      },
      {
        id: "d2",
        description: "Dados estão associados ao território correto",
        status: "ok",
        required: true,
      },
      {
        id: "d3",
        description: "Período de coleta está dentro do intervalo esperado",
        status: "pending",
        required: true,
      },
      {
        id: "d4",
        description: "Unidades de medida estão consistentes",
        status: "ok",
        required: true,
      },
      {
        id: "d5",
        description: "Não há lacunas significativas nos dados",
        status: "issue",
        comment: "Faltam dados de consumo para o mês de março",
        required: true,
      },
    ],
  },
  {
    id: "methodology",
    name: "Metodologia",
    items: [
      {
        id: "m1",
        description: "Fatores de emissão utilizados são os mais recentes",
        status: "ok",
        required: true,
      },
      {
        id: "m2",
        description: "Metodologia está de acordo com GHG Protocol",
        status: "ok",
        required: true,
      },
      {
        id: "m3",
        description: "Fronteiras organizacionais estão bem definidas",
        status: "pending",
        required: true,
      },
      {
        id: "m4",
        description: "Categorias de escopo estão corretamente classificadas",
        status: "ok",
        required: true,
      },
    ],
  },
  {
    id: "evidence",
    name: "Evidências",
    items: [
      {
        id: "e1",
        description: "Mapas temáticos estão anexados",
        status: "ok",
        required: false,
      },
      {
        id: "e2",
        description: "Documentos de suporte estão disponíveis",
        status: "pending",
        required: true,
      },
      {
        id: "e3",
        description: "Fotografias/imagens de evidência anexadas",
        status: "na",
        required: false,
      },
      {
        id: "e4",
        description: "Notas fiscais/recibos estão arquivados",
        status: "ok",
        required: true,
      },
    ],
  },
  {
    id: "compliance",
    name: "Conformidade Regulatória",
    items: [
      {
        id: "c1",
        description: "Atende requisitos IFRS S1",
        status: "ok",
        required: true,
      },
      {
        id: "c2",
        description: "Atende requisitos IFRS S2",
        status: "pending",
        required: true,
      },
      {
        id: "c3",
        description: "Compatível com CVM 193",
        status: "pending",
        required: true,
      },
      {
        id: "c4",
        description: "Divulgações de risco estão completas",
        status: "pending",
        required: true,
      },
    ],
  },
];

export const VerificationChecklist = () => {
  const [checklist, setChecklist] = useState(initialChecklist);
  const [selectedReport, setSelectedReport] = useState("ifrs-s2-2024");

  const updateItemStatus = (
    sectionId: string,
    itemId: string,
    status: ChecklistItem["status"]
  ) => {
    setChecklist((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item) =>
                item.id === itemId ? { ...item, status } : item
              ),
            }
          : section
      )
    );
  };

  const updateItemComment = (
    sectionId: string,
    itemId: string,
    comment: string
  ) => {
    setChecklist((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item) =>
                item.id === itemId ? { ...item, comment } : item
              ),
            }
          : section
      )
    );
  };

  const getStatusIcon = (status: ChecklistItem["status"]) => {
    switch (status) {
      case "ok":
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "issue":
        return <MinusCircle className="w-4 h-4 text-destructive" />;
      case "na":
        return <Circle className="w-4 h-4 text-muted-foreground" />;
      default:
        return <Circle className="w-4 h-4 text-warning" />;
    }
  };

  const calculateProgress = () => {
    const allItems = checklist.flatMap((s) => s.items);
    const completed = allItems.filter(
      (i) => i.status === "ok" || i.status === "na"
    ).length;
    return Math.round((completed / allItems.length) * 100);
  };

  const getSectionProgress = (section: ChecklistSection) => {
    const completed = section.items.filter(
      (i) => i.status === "ok" || i.status === "na"
    ).length;
    return Math.round((completed / section.items.length) * 100);
  };

  const handleSave = () => {
    toast.success("Checklist salvo com sucesso");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Selecione o relatório" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ifrs-s2-2024">
                    Relatório IFRS S2 - 2024
                  </SelectItem>
                  <SelectItem value="sustainability-2024">
                    Sustentabilidade 2024
                  </SelectItem>
                  <SelectItem value="gee-q3">Inventário GEE Q3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  Progresso Geral
                </div>
                <div className="text-2xl font-bold">{calculateProgress()}%</div>
              </div>
              <Progress value={calculateProgress()} className="w-32 h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checklist Sections */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4" />
            Checklist de Verificação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={["data", "methodology"]}>
            {checklist.map((section) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <span>{section.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {getSectionProgress(section)}%
                      </Badge>
                      <Progress
                        value={getSectionProgress(section)}
                        className="w-20 h-1.5"
                      />
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    {section.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-secondary/30 rounded-lg space-y-3"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            {getStatusIcon(item.status)}
                            <div>
                              <div className="text-sm">{item.description}</div>
                              {item.required && (
                                <Badge
                                  variant="outline"
                                  className="text-xs mt-1"
                                >
                                  Obrigatório
                                </Badge>
                              )}
                            </div>
                          </div>

                          <Select
                            value={item.status}
                            onValueChange={(value) =>
                              updateItemStatus(
                                section.id,
                                item.id,
                                value as ChecklistItem["status"]
                              )
                            }
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pendente</SelectItem>
                              <SelectItem value="ok">OK</SelectItem>
                              <SelectItem value="issue">Pendência</SelectItem>
                              <SelectItem value="na">N/A</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {(item.status === "issue" || item.comment) && (
                          <div className="pl-7">
                            <div className="flex items-center gap-2 mb-1">
                              <MessageSquare className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                Comentário
                              </span>
                            </div>
                            <Textarea
                              placeholder="Adicione observações..."
                              className="text-sm"
                              rows={2}
                              value={item.comment || ""}
                              onChange={(e) =>
                                updateItemComment(
                                  section.id,
                                  item.id,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="flex gap-2 mt-6 pt-4 border-t">
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              Salvar Checklist
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
