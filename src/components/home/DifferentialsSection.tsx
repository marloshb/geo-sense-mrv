import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Map, MapPin, FileCheck, Brain, Shield, Cloud, Check } from "lucide-react";

const differentials = [
  {
    icon: <Map className="h-8 w-8" />,
    title: "GIS como Backbone",
    description: "Não é um add-on. O território é a fundação de toda a arquitetura.",
    highlights: ["Mapas nativos", "Camadas temáticas", "Análise espacial"]
  },
  {
    icon: <MapPin className="h-8 w-8" />,
    title: "MRV Territorializado",
    description: "Cada métrica vinculada a um ponto no espaço e no tempo.",
    highlights: ["Rastreabilidade total", "Evidência espacial", "Séries temporais"]
  },
  {
    icon: <FileCheck className="h-8 w-8" />,
    title: "Evidência Espacial",
    description: "Dados climáticos com prova de origem geográfica.",
    highlights: ["Coordenadas", "Polígonos", "Histórico"]
  },
  {
    icon: <Brain className="h-8 w-8" />,
    title: "IA Explicável",
    description: "Insights automáticos com justificativa clara e auditável.",
    highlights: ["Transparência", "Auditabilidade", "Recomendações"]
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Audit-Ready",
    description: "Projetado para verificadores externos e reguladores.",
    highlights: ["Trilhas completas", "Versionamento", "Validação formal"]
  },
  {
    icon: <Cloud className="h-8 w-8" />,
    title: "Escalável & SaaS",
    description: "De um território a milhares, sem mudança de arquitetura.",
    highlights: ["Multi-tenant", "APIs abertas", "Integrações"]
  }
];

export function DifferentialsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="px-4 py-2 mb-4">
            Por Que Nós
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Diferenciais Competitivos
          </h2>
          <p className="text-lg text-muted-foreground">
            O que torna esta plataforma única no mercado de governança climática.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {differentials.map((diff, index) => (
            <Card key={index} className="group hover:shadow-xl hover:border-primary/30 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                  <div className="text-primary">{diff.icon}</div>
                </div>

                <h3 className="text-xl font-bold mb-2">{diff.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{diff.description}</p>

                <div className="space-y-2">
                  {diff.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
