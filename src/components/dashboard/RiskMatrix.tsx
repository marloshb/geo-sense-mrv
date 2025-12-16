import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Risk {
  id: string;
  name: string;
  territory: string;
  probability: number;
  impact: number;
}

const risks: Risk[] = [
  { id: "1", name: "Inundação Costeira", territory: "Terminal Portuário SP", probability: 4, impact: 5 },
  { id: "2", name: "Seca Severa", territory: "Mina Carajás", probability: 3, impact: 4 },
  { id: "3", name: "Incêndio Florestal", territory: "Área de Conservação", probability: 4, impact: 4 },
  { id: "4", name: "Desmatamento", territory: "Bacia Hidrográfica", probability: 2, impact: 3 },
  { id: "5", name: "Ondas de Calor", territory: "Planta Industrial", probability: 3, impact: 3 },
];

const getCellColor = (prob: number, impact: number) => {
  const score = prob * impact;
  if (score >= 16) return "bg-destructive/20 text-destructive";
  if (score >= 9) return "bg-warning/20 text-warning";
  if (score >= 4) return "bg-info/20 text-info";
  return "bg-success/20 text-success";
};

const getRiskLevel = (prob: number, impact: number) => {
  const score = prob * impact;
  if (score >= 16) return "Crítico";
  if (score >= 9) return "Alto";
  if (score >= 4) return "Médio";
  return "Baixo";
};

export const RiskMatrix = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Matriz de Riscos Climáticos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {risks.map((risk) => (
            <div
              key={risk.id}
              className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{risk.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {risk.territory}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-muted-foreground">P: {risk.probability} | I: {risk.impact}</p>
                </div>
                <Badge
                  className={cn(
                    "text-xs font-medium",
                    getCellColor(risk.probability, risk.impact)
                  )}
                >
                  {getRiskLevel(risk.probability, risk.impact)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
