import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, MapPin, TrendingUp, Shield, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-green-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <Badge variant="outline" className="px-4 py-2 text-sm border-primary/30 bg-primary/5">
              <Leaf className="w-4 h-4 mr-2 text-green-500" />
              Plataforma MRV Territorial
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Governança Climática{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-500">
                Baseada em Território
              </span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
              Transforme dados espaciais em decisões estratégicas, compliance regulatório 
              e confiança institucional. MRV + GIS + IA em uma única plataforma.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8 py-6">
                Solicitar Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" onClick={() => navigate("/dashboard")}>
                <Play className="mr-2 h-5 w-5" />
                Explorar Plataforma
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-5 w-5 text-green-500" />
                <span>IFRS S2 Ready</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                <span>GIS Nativo</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <span>IA Analytics</span>
              </div>
            </div>
          </div>

          {/* Right Visual - Interactive Dashboard Preview */}
          <div className="relative">
            <div className="relative bg-card/80 backdrop-blur-sm border rounded-2xl shadow-2xl p-6 transform hover:scale-[1.02] transition-transform duration-500">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold">Dashboard Territorial</h3>
                  <p className="text-sm text-muted-foreground">Visão em tempo real</p>
                </div>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                  Live
                </Badge>
              </div>

              {/* Mock Map */}
              <div className="relative h-48 bg-gradient-to-br from-green-900/30 via-blue-900/20 to-primary/20 rounded-lg mb-4 overflow-hidden">
                <div className="absolute inset-0 opacity-50">
                  <svg viewBox="0 0 400 200" className="w-full h-full">
                    <path d="M50,100 Q100,50 150,80 T250,60 T350,90" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" />
                    <circle cx="80" cy="90" r="8" fill="hsl(var(--primary))" opacity="0.7" />
                    <circle cx="150" cy="70" r="12" fill="#22c55e" opacity="0.7" />
                    <circle cx="250" cy="55" r="10" fill="#f59e0b" opacity="0.7" />
                    <circle cx="320" cy="85" r="6" fill="hsl(var(--primary))" opacity="0.7" />
                  </svg>
                </div>
                <div className="absolute top-3 left-3 bg-background/90 backdrop-blur px-3 py-1.5 rounded text-xs font-medium">
                  18 Territórios Ativos
                </div>
                <div className="absolute bottom-3 right-3 bg-background/90 backdrop-blur px-3 py-1.5 rounded text-xs">
                  Área: 45.230 km²
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-primary/10 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-primary">2.4M</p>
                  <p className="text-xs text-muted-foreground">tCO₂e/ano</p>
                </div>
                <div className="bg-green-500/10 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-500">-12%</p>
                  <p className="text-xs text-muted-foreground">vs. Ano Anterior</p>
                </div>
                <div className="bg-blue-500/10 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-500">98%</p>
                  <p className="text-xs text-muted-foreground">Compliance</p>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-card border rounded-lg shadow-lg p-3 animate-bounce">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium">Insight IA</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Anomalia detectada</p>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-card border rounded-lg shadow-lg p-3">
              <p className="text-xs font-medium">Último Update</p>
              <p className="text-xs text-muted-foreground">há 2 minutos</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
