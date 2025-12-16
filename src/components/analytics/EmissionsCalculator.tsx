import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calculator, Sparkles, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EmissionResult {
  scope1: number;
  scope2: number;
  total: number;
  unit: string;
}

export const EmissionsCalculator = () => {
  const [territory, setTerritory] = useState("");
  const [energyConsumption, setEnergyConsumption] = useState("");
  const [fuelConsumption, setFuelConsumption] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [period, setPeriod] = useState("");
  const [result, setResult] = useState<EmissionResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = () => {
    setIsCalculating(true);
    
    // Simulate calculation
    setTimeout(() => {
      const energy = parseFloat(energyConsumption) || 0;
      const fuel = parseFloat(fuelConsumption) || 0;
      
      // Simplified emission factors
      const scope2Factor = 0.0817; // tCO2e/MWh (Brazil grid average)
      const fuelFactors: Record<string, number> = {
        diesel: 2.68,
        gasoline: 2.31,
        natural_gas: 2.75,
        lpg: 3.0,
      };
      
      const scope1 = fuel * (fuelFactors[fuelType] || 2.5);
      const scope2 = energy * scope2Factor;
      
      setResult({
        scope1: Math.round(scope1 * 100) / 100,
        scope2: Math.round(scope2 * 100) / 100,
        total: Math.round((scope1 + scope2) * 100) / 100,
        unit: "tCO₂e",
      });
      setIsCalculating(false);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          <CardTitle className="text-base font-semibold">
            Calculadora de Emissões
          </CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Calcule emissões de GEE (Escopos 1 e 2) para seus territórios
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Território</Label>
            <Select value={territory} onValueChange={setTerritory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o território" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="carajas">Mina Carajás</SelectItem>
                <SelectItem value="terminal_sp">Terminal Portuário SP</SelectItem>
                <SelectItem value="planta_mg">Planta Industrial MG</SelectItem>
                <SelectItem value="reserva_am">Reserva Florestal AM</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Período de Referência</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Mensal</SelectItem>
                <SelectItem value="quarterly">Trimestral</SelectItem>
                <SelectItem value="yearly">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-4 bg-secondary/50 rounded-lg space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-chart-1" />
            Escopo 2 - Energia Elétrica
          </div>
          <div className="space-y-2">
            <Label>Consumo de Energia (MWh)</Label>
            <Input
              type="number"
              placeholder="Ex: 1500"
              value={energyConsumption}
              onChange={(e) => setEnergyConsumption(e.target.value)}
            />
          </div>
        </div>

        <div className="p-4 bg-secondary/50 rounded-lg space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-chart-2" />
            Escopo 1 - Combustíveis
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Combustível</Label>
              <Select value={fuelType} onValueChange={setFuelType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="gasoline">Gasolina</SelectItem>
                  <SelectItem value="natural_gas">Gás Natural</SelectItem>
                  <SelectItem value="lpg">GLP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Consumo (litros/m³)</Label>
              <Input
                type="number"
                placeholder="Ex: 5000"
                value={fuelConsumption}
                onChange={(e) => setFuelConsumption(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-info/10 rounded-lg">
          <Sparkles className="w-4 h-4 text-info" />
          <p className="text-xs text-muted-foreground">
            A IA sugere fatores de emissão atualizados com base no território selecionado
          </p>
        </div>

        <Button
          onClick={handleCalculate}
          disabled={!territory || !period || isCalculating}
          className="w-full"
        >
          {isCalculating ? "Calculando..." : "Calcular Emissões"}
        </Button>

        {result && (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-sm font-medium mb-3">Resultado do Cálculo</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Escopo 1</p>
                <p className="text-lg font-bold text-chart-2">
                  {result.scope1.toLocaleString()} <span className="text-xs font-normal">{result.unit}</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Escopo 2</p>
                <p className="text-lg font-bold text-chart-1">
                  {result.scope2.toLocaleString()} <span className="text-xs font-normal">{result.unit}</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-bold text-foreground">
                  {result.total.toLocaleString()} <span className="text-xs font-normal">{result.unit}</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
