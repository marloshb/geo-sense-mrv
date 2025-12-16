import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Shield, TrendingUp, Users, Building2, Leaf } from "lucide-react";

const metrics = [
  {
    icon: <Clock className="h-8 w-8" />,
    value: "80%",
    label: "Redução no tempo de reporte",
    description: "De semanas para horas"
  },
  {
    icon: <Shield className="h-8 w-8" />,
    value: "100%",
    label: "Rastreabilidade de dados",
    description: "Evidência espacial completa"
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    value: "3x",
    label: "Velocidade de decisão",
    description: "Insights em tempo real"
  },
  {
    icon: <Users className="h-8 w-8" />,
    value: "95%",
    label: "Satisfação em auditorias",
    description: "Compliance demonstrável"
  }
];

const testimonials = [
  {
    quote: "A plataforma transformou nossa governança climática. Saímos de planilhas para decisões baseadas em dados territoriais.",
    author: "Diretor de Sustentabilidade",
    company: "Grande Mineradora",
    sector: "Mineração"
  },
  {
    quote: "Reduzimos o tempo de preparação de relatórios de 3 semanas para 2 dias. E com muito mais qualidade.",
    author: "CFO",
    company: "Grupo Energético",
    sector: "Energia"
  },
  {
    quote: "Pela primeira vez conseguimos demonstrar compliance climático de forma auditável e defensável.",
    author: "Head de Risco",
    company: "Instituição Financeira",
    sector: "Financeiro"
  }
];

const sectors = [
  { icon: <Building2 className="h-6 w-6" />, name: "Mineração" },
  { icon: <Leaf className="h-6 w-6" />, name: "Agronegócio" },
  { icon: <TrendingUp className="h-6 w-6" />, name: "Energia" },
  { icon: <Shield className="h-6 w-6" />, name: "Financeiro" },
  { icon: <Users className="h-6 w-6" />, name: "Infraestrutura" },
  { icon: <Clock className="h-6 w-6" />, name: "Óleo & Gás" },
];

export function ImpactSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="px-4 py-2 mb-4">
            Impacto
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Resultados Comprovados
          </h2>
          <p className="text-lg text-muted-foreground">
            Métricas reais de transformação em governança climática.
          </p>
        </div>

        {/* Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {metrics.map((metric, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="text-primary/60 mx-auto mb-4">{metric.icon}</div>
                <p className="text-4xl font-bold text-primary mb-2">{metric.value}</p>
                <p className="font-semibold mb-1">{metric.label}</p>
                <p className="text-sm text-muted-foreground">{metric.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card">
              <CardContent className="pt-6">
                <p className="text-sm italic mb-4">"{testimonial.quote}"</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-sm">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                  <Badge variant="outline" className="mt-2 text-xs">{testimonial.sector}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sectors */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-6">Setores que confiam na plataforma</p>
          <div className="flex flex-wrap justify-center gap-8">
            {sectors.map((sector, index) => (
              <div key={index} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                {sector.icon}
                <span className="font-medium">{sector.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
