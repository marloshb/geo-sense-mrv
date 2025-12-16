import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, MessageSquare, Shield, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-green-500/10 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-500/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge variant="outline" className="px-4 py-2">
            Próximos Passos
          </Badge>

          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            Transforme sua Governança Climática{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-500">
              Hoje
            </span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Junte-se às organizações líderes que já transformaram dados espaciais 
            em decisões estratégicas, compliance e confiança regulatória.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              <Calendar className="mr-2 h-5 w-5" />
              Agendar Demonstração
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              <MessageSquare className="mr-2 h-5 w-5" />
              Falar com Especialista
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 pt-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-5 w-5 text-green-500" />
              <span>Dados Seguros</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Setup em 2 semanas</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Suporte dedicado</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>ROI em 6 meses</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
