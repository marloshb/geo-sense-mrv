import { Badge } from "@/components/ui/badge";
import { Map, Brain, BarChart3, CheckCircle } from "lucide-react";

export function SolutionSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Text Content */}
          <div className="space-y-8">
            <Badge variant="outline" className="px-4 py-2">
              A Solução
            </Badge>

            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Infraestrutura Crítica para{" "}
              <span className="text-primary">MRV Territorial</span>
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Uma plataforma integrada que conecta território, dados operacionais e 
              inteligência artificial para transformar governança climática em vantagem 
              competitiva e compliance regulatório.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Map className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">GIS como Integrador</h4>
                  <p className="text-sm text-muted-foreground">
                    Todo dado vinculado a território, criando rastreabilidade espacial nativa.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h4 className="font-semibold">MRV Automatizado</h4>
                  <p className="text-sm text-muted-foreground">
                    Cálculos de emissões, métricas e tendências com metodologia auditável.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Brain className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-semibold">IA como Inteligência</h4>
                  <p className="text-sm text-muted-foreground">
                    Insights automáticos, detecção de anomalias e recomendações estratégicas.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h4 className="font-semibold">Audit-Ready</h4>
                  <p className="text-sm text-muted-foreground">
                    Trilhas de evidência, versionamento e validação formal para auditores.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Visual Architecture */}
          <div className="relative">
            <div className="bg-card border rounded-2xl p-8 shadow-xl">
              <div className="text-center mb-8">
                <h3 className="font-semibold text-lg">Arquitetura da Plataforma</h3>
                <p className="text-sm text-muted-foreground">Dados → Território → Decisão</p>
              </div>

              {/* Architecture Diagram */}
              <div className="space-y-6">
                {/* Layer 1 - Data Sources */}
                <div className="flex justify-center gap-4">
                  {["Sensores", "ERPs", "Satélite", "APIs"].map((source) => (
                    <div key={source} className="px-3 py-2 bg-muted rounded text-xs font-medium">
                      {source}
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-muted to-primary/50" />
                </div>

                {/* Layer 2 - GIS Core */}
                <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 text-center">
                  <Map className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="font-semibold">GIS Territorial</p>
                  <p className="text-xs text-muted-foreground">Backbone espacial integrador</p>
                </div>

                <div className="flex justify-center gap-8">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-primary/50 to-green-500/50" />
                  <div className="w-0.5 h-8 bg-gradient-to-b from-primary/50 to-blue-500/50" />
                </div>

                {/* Layer 3 - Processing */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                    <BarChart3 className="h-6 w-6 mx-auto mb-2 text-green-500" />
                    <p className="font-medium text-sm">MRV Engine</p>
                    <p className="text-xs text-muted-foreground">Cálculos & Métricas</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
                    <Brain className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                    <p className="font-medium text-sm">IA Analytics</p>
                    <p className="text-xs text-muted-foreground">Insights & Predição</p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-green-500/50 to-purple-500/50" />
                </div>

                {/* Layer 4 - Output */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 text-center">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <p className="font-semibold">Decisão & Compliance</p>
                  <p className="text-xs text-muted-foreground">Dashboards • Relatórios • Auditoria</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
