import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map, Calculator, BarChart3, Shield, Globe, Brain, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const modules = [
  {
    icon: <Map className="h-8 w-8" />,
    title: "Monitoring Territorial",
    subtitle: "GIS Core",
    description: "Gestão geoespacial de territórios e ativos. Mapas interativos, camadas temáticas e séries temporais vinculadas ao espaço.",
    color: "primary",
    path: "/monitoring"
  },
  {
    icon: <Calculator className="h-8 w-8" />,
    title: "MRV Analytics",
    subtitle: "IA Engine",
    description: "Cálculos automatizados de emissões (Scope 1, 2 e 3), métricas normalizadas e detecção de anomalias.",
    color: "green-500",
    path: "/analytics"
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Reporting & Dashboards",
    subtitle: "Visualização",
    description: "Dashboards executivos, relatórios IFRS-ready e narrativas automáticas para diferentes públicos.",
    color: "blue-500",
    path: "/reports"
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Verification & Audit",
    subtitle: "Compliance",
    description: "Trilhas de auditoria, versionamento de dados, evidências espaciais e validação formal.",
    color: "purple-500",
    path: "/audit"
  },
  {
    icon: <Brain className="h-8 w-8" />,
    title: "Governança & Risco",
    subtitle: "GRC",
    description: "Gestão de riscos climáticos, materialidade, compliance regulatório e planos de ação.",
    color: "orange-500",
    path: "/governance"
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: "Integrações & APIs",
    subtitle: "Conectividade",
    description: "Conectores para ERPs, IoT, satélites e sistemas externos. APIs abertas e webhooks.",
    color: "cyan-500",
    path: "/integrations"
  }
];

export function ModulesSection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="px-4 py-2 mb-4">
            Módulos
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Plataforma Completa de MRV
          </h2>
          <p className="text-lg text-muted-foreground">
            Seis módulos integrados que cobrem todo o ciclo de governança climática, 
            do dado bruto à decisão estratégica.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => navigate(module.path)}
            >
              <CardContent className="pt-6">
                <div className={`p-3 bg-${module.color}/10 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform`}>
                  <div className={`text-${module.color}`}>{module.icon}</div>
                </div>

                <h3 className="text-xl font-bold mb-1">{module.title}</h3>
                <p className={`text-sm text-${module.color} font-medium mb-3`}>{module.subtitle}</p>
                <p className="text-sm text-muted-foreground mb-4">{module.description}</p>

                <Button variant="ghost" size="sm" className="group-hover:translate-x-2 transition-transform">
                  Explorar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
