import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Leaf, Shield, Cog, FileSearch, CheckCircle } from "lucide-react";

const audiences = [
  {
    id: "executives",
    icon: <Users className="h-5 w-5" />,
    title: "Executivos / Conselho",
    benefits: [
      "Visão consolidada de riscos climáticos e financeiros",
      "Dashboards estratégicos para tomada de decisão",
      "Compliance regulatório demonstrável (CVM 193, IFRS S2)",
      "Redução de exposição a riscos reputacionais",
      "ROI mensurável em governança climática"
    ]
  },
  {
    id: "esg",
    icon: <Leaf className="h-5 w-5" />,
    title: "Sustentabilidade / ESG",
    benefits: [
      "Cálculos automatizados de emissões (Scope 1, 2, 3)",
      "Rastreabilidade completa de métricas",
      "Relatórios IFRS S2 ready",
      "Gestão de metas e KPIs climáticos",
      "Insights de IA para otimização"
    ]
  },
  {
    id: "risk",
    icon: <Shield className="h-5 w-5" />,
    title: "Risco & Compliance",
    benefits: [
      "Inventário estruturado de riscos climáticos",
      "Avaliação de impacto financeiro",
      "Matriz de materialidade auditável",
      "Monitoramento contínuo de exposição",
      "Alertas automáticos de não conformidade"
    ]
  },
  {
    id: "operations",
    icon: <Cog className="h-5 w-5" />,
    title: "Operação",
    benefits: [
      "Dados operacionais territorializados",
      "Monitoramento em tempo real",
      "Identificação de hotspots de emissões",
      "Planos de ação com acompanhamento",
      "Integração com sistemas existentes"
    ]
  },
  {
    id: "audit",
    icon: <FileSearch className="h-5 w-5" />,
    title: "Auditoria / Regulador",
    benefits: [
      "Trilhas de auditoria completas",
      "Versionamento e histórico de alterações",
      "Evidências espaciais anexadas",
      "Validações formais documentadas",
      "Exportação para verificação externa"
    ]
  }
];

export function AudienceSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="px-4 py-2 mb-4">
            Para Quem
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Valor para Cada Perfil
          </h2>
          <p className="text-lg text-muted-foreground">
            Uma plataforma, múltiplos públicos. Cada stakeholder encontra 
            o que precisa para sua função.
          </p>
        </div>

        <Tabs defaultValue="executives" className="w-full">
          <TabsList className="flex flex-wrap justify-center gap-2 h-auto mb-8">
            {audiences.map((audience) => (
              <TabsTrigger 
                key={audience.id} 
                value={audience.id}
                className="flex items-center gap-2 px-4 py-2"
              >
                {audience.icon}
                <span className="hidden sm:inline">{audience.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {audiences.map((audience) => (
            <TabsContent key={audience.id} value={audience.id}>
              <Card className="max-w-3xl mx-auto">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      {audience.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{audience.title}</h3>
                      <p className="text-sm text-muted-foreground">Benefícios específicos</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {audience.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{benefit}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
