import { Card, CardContent } from "@/components/ui/card";
import { FileSpreadsheet, AlertOctagon, Clock, Search, Shield, Database } from "lucide-react";

const painPoints = [
  {
    icon: <Database className="h-8 w-8" />,
    title: "Dados Dispersos",
    description: "Informações climáticas e operacionais em silos, sem conexão territorial ou temporal."
  },
  {
    icon: <FileSpreadsheet className="h-8 w-8" />,
    title: "Relatórios Manuais",
    description: "Processos lentos, propensos a erros e impossíveis de escalar para múltiplos territórios."
  },
  {
    icon: <AlertOctagon className="h-8 w-8" />,
    title: "Risco Regulatório",
    description: "Exposição a não conformidade com IFRS S2, CVM 193 e normas ambientais crescentes."
  },
  {
    icon: <Search className="h-8 w-8" />,
    title: "Falta de Rastreabilidade",
    description: "Impossibilidade de vincular métricas a fontes espaciais e temporais verificáveis."
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Dificuldade de Auditoria",
    description: "Sem trilhas de evidência, versionamento ou validação formal de dados climáticos."
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: "Decisões Atrasadas",
    description: "Ciclos longos entre coleta de dados e tomada de decisão estratégica."
  }
];

export function PainPointsSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Os Desafios da Governança Climática Atual
          </h2>
          <p className="text-lg text-muted-foreground">
            Organizações enfrentam barreiras críticas para transformar compromissos climáticos 
            em ação mensurável e defensável.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {painPoints.map((point, index) => (
            <Card 
              key={index} 
              className="border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition-colors group"
            >
              <CardContent className="pt-6">
                <div className="text-destructive/70 mb-4 group-hover:scale-110 transition-transform">
                  {point.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{point.title}</h3>
                <p className="text-sm text-muted-foreground">{point.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
