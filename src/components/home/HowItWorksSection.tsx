import { Badge } from "@/components/ui/badge";
import { MapPin, Calculator, BarChart3, Shield, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: <MapPin className="h-8 w-8" />,
    title: "Território & Dados",
    subtitle: "GIS como backbone",
    description: "Conecte ativos, territórios e dados operacionais em uma estrutura geoespacial unificada. Cada métrica vinculada a um ponto no mapa.",
    color: "primary"
  },
  {
    number: "02",
    icon: <Calculator className="h-8 w-8" />,
    title: "Analytics & MRV",
    subtitle: "IA como motor",
    description: "Calcule emissões, indicadores e riscos automaticamente. A IA detecta anomalias, gera insights e sugere ações estratégicas.",
    color: "green-500"
  },
  {
    number: "03",
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Reporting & Dashboards",
    subtitle: "Visualização executiva",
    description: "Dashboards dinâmicos, relatórios IFRS-ready e narrativas automáticas para diferentes públicos: operação, gestão e conselho.",
    color: "blue-500"
  },
  {
    number: "04",
    icon: <Shield className="h-8 w-8" />,
    title: "Auditoria & Decisão",
    subtitle: "Compliance garantido",
    description: "Trilhas de evidência, versionamento completo e validação formal. Dados prontos para auditores e reguladores.",
    color: "purple-500"
  }
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="px-4 py-2 mb-4">
            Como Funciona
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Do Território à Decisão em 4 Passos
          </h2>
          <p className="text-lg text-muted-foreground">
            Uma jornada clara de dados brutos a insights acionáveis, 
            com rastreabilidade total e compliance nativo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-card border rounded-2xl p-6 h-full hover:shadow-lg transition-shadow">
                {/* Step Number */}
                <div className={`text-5xl font-bold text-${step.color}/20 mb-4`}>
                  {step.number}
                </div>

                {/* Icon */}
                <div className={`p-3 bg-${step.color}/10 rounded-xl w-fit mb-4`}>
                  <div className={`text-${step.color}`}>{step.icon}</div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-1">{step.title}</h3>
                <p className={`text-sm text-${step.color} font-medium mb-3`}>{step.subtitle}</p>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>

              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-6 w-6 text-muted-foreground/30" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
