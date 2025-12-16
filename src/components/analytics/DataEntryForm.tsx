import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, AlertTriangle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const operationalDataSchema = z.object({
  dataType: z.enum(["energy", "fuel", "production", "transport", "water", "waste", "other"]),
  quantity: z.number().positive("Quantidade deve ser positiva"),
  unit: z.string().min(1, "Unidade é obrigatória"),
  periodStart: z.string().min(1, "Data inicial é obrigatória"),
  periodEnd: z.string().min(1, "Data final é obrigatória"),
  source: z.string().optional(),
  notes: z.string().optional(),
});

type OperationalDataForm = z.infer<typeof operationalDataSchema>;

interface DataEntryFormProps {
  territoryId?: string;
  assetId?: string;
  onSubmitSuccess?: () => void;
}

interface AIValidation {
  isValid: boolean;
  warnings: { field: string; message: string; severity: string }[];
  suggestions: { field: string; suggestedValue: string; reason: string }[];
  confidence: number;
}

const dataTypeOptions = [
  { value: "energy", label: "Energia Elétrica", unit: "MWh" },
  { value: "fuel", label: "Combustível", unit: "m³" },
  { value: "production", label: "Produção", unit: "t" },
  { value: "transport", label: "Transporte", unit: "km" },
  { value: "water", label: "Água", unit: "m³" },
  { value: "waste", label: "Resíduos", unit: "t" },
  { value: "other", label: "Outro", unit: "un" },
];

export const DataEntryForm = ({ territoryId, assetId, onSubmitSuccess }: DataEntryFormProps) => {
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiValidation, setAiValidation] = useState<AIValidation | null>(null);

  const form = useForm<OperationalDataForm>({
    resolver: zodResolver(operationalDataSchema),
    defaultValues: {
      dataType: "energy",
      quantity: 0,
      unit: "MWh",
      periodStart: new Date().toISOString().split("T")[0],
      periodEnd: new Date().toISOString().split("T")[0],
      source: "",
      notes: "",
    },
  });

  const selectedDataType = form.watch("dataType");

  // Update unit when data type changes
  const handleDataTypeChange = (value: string) => {
    form.setValue("dataType", value as OperationalDataForm["dataType"]);
    const option = dataTypeOptions.find((opt) => opt.value === value);
    if (option) {
      form.setValue("unit", option.unit);
    }
  };

  const validateWithAI = async () => {
    const values = form.getValues();
    setIsValidating(true);
    setAiValidation(null);

    try {
      const { data, error } = await supabase.functions.invoke("mrv-ai-insights", {
        body: {
          type: "validate_data",
          data: values,
          context: {
            territoryId,
            assetId,
          },
        },
      });

      if (error) throw error;

      if (data?.result) {
        setAiValidation(data.result);
      }
    } catch (error) {
      console.error("AI validation error:", error);
      toast.error("Erro ao validar com IA");
    } finally {
      setIsValidating(false);
    }
  };

  const onSubmit = async (values: OperationalDataForm) => {
    if (!territoryId) {
      toast.error("Selecione um território primeiro");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("operational_data").insert({
        territory_id: territoryId,
        asset_id: assetId || null,
        data_type: values.dataType,
        quantity: values.quantity,
        unit: values.unit,
        period_start: values.periodStart,
        period_end: values.periodEnd,
        source: values.source || null,
        notes: values.notes || null,
      });

      if (error) throw error;

      toast.success("Dados registrados com sucesso!");
      form.reset();
      setAiValidation(null);
      onSubmitSuccess?.();
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error.message || "Erro ao registrar dados");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          Entrada de Dados Operacionais
          {aiValidation && (
            <Badge variant={aiValidation.isValid ? "default" : "destructive"}>
              {aiValidation.isValid ? "Validado" : "Revisar"}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dataType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Dado</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={handleDataTypeChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dataTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.001"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidade</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="periodStart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Inicial</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="periodEnd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Final</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fonte dos Dados</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Medidor #123, Fatura de energia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informações adicionais relevantes..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* AI Validation Results */}
            {aiValidation && (
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  {aiValidation.isValid ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-warning" />
                  )}
                  <span className="font-medium">
                    Validação IA ({aiValidation.confidence}% confiança)
                  </span>
                </div>

                {aiValidation.warnings.length > 0 && (
                  <div className="space-y-2">
                    {aiValidation.warnings.map((warning, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-sm text-warning"
                      >
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{warning.message}</span>
                      </div>
                    ))}
                  </div>
                )}

                {aiValidation.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Sugestões:</p>
                    {aiValidation.suggestions.map((suggestion, i) => (
                      <div key={i} className="text-sm text-muted-foreground">
                        <strong>{suggestion.field}:</strong> {suggestion.suggestedValue} - {suggestion.reason}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={validateWithAI}
                disabled={isValidating}
              >
                {isValidating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Validar com IA
              </Button>

              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Registrar Dados
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
