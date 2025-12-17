import { HeroSection } from "@/components/home/HeroSection";
import { PainPointsSection } from "@/components/home/PainPointsSection";
import { SolutionSection } from "@/components/home/SolutionSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { ProductDemoSection } from "@/components/home/ProductDemoSection";
import { ModulesSection } from "@/components/home/ModulesSection";
import { AudienceSection } from "@/components/home/AudienceSection";
import { ImpactSection } from "@/components/home/ImpactSection";
import { DifferentialsSection } from "@/components/home/DifferentialsSection";
import { CTASection } from "@/components/home/CTASection";
import { Footer } from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import { Leaf, Menu, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <span className="font-bold text-xl hidden sm:inline">MRV Territorial</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#produto" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Produto</a>
              <a href="#solucao" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Solução</a>
              <a href="#modulos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Módulos</a>
              <a href="#impacto" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Impacto</a>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/auth")}
                className="hidden sm:inline-flex"
              >
                Entrar
              </Button>
              <Button 
                size="sm" 
                onClick={() => navigate("/dashboard")}
                className="gap-2"
              >
                Acessar Plataforma
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2 border-t mt-4">
              <a href="#produto" className="block py-2 text-sm text-muted-foreground hover:text-foreground">Produto</a>
              <a href="#solucao" className="block py-2 text-sm text-muted-foreground hover:text-foreground">Solução</a>
              <a href="#modulos" className="block py-2 text-sm text-muted-foreground hover:text-foreground">Módulos</a>
              <a href="#impacto" className="block py-2 text-sm text-muted-foreground hover:text-foreground">Impacto</a>
              <div className="pt-2 border-t space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate("/auth")}
                  className="w-full"
                >
                  Entrar
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => navigate("/dashboard")}
                  className="w-full gap-2"
                >
                  Acessar Plataforma
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <HeroSection />
        <PainPointsSection />
        <div id="solucao">
          <SolutionSection />
        </div>
        <HowItWorksSection />
        <div id="produto">
          <ProductDemoSection />
        </div>
        <div id="modulos">
          <ModulesSection />
        </div>
        <AudienceSection />
        <div id="impacto">
          <ImpactSection />
        </div>
        <DifferentialsSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
