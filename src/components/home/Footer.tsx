import { Leaf, MapPin, Mail, Phone, Linkedin, Twitter } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <span className="font-bold text-xl">MRV Territorial</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Plataforma SaaS de Governança Climática baseada em território, 
              com GIS como backbone e IA como motor de analytics.
            </p>
          </div>

          {/* Produto */}
          <div>
            <h4 className="font-semibold mb-4">Produto</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-foreground cursor-pointer">Monitoring Territorial</li>
              <li className="hover:text-foreground cursor-pointer">MRV Analytics</li>
              <li className="hover:text-foreground cursor-pointer">Reporting & Dashboards</li>
              <li className="hover:text-foreground cursor-pointer">Verification & Audit</li>
              <li className="hover:text-foreground cursor-pointer">Governança & Risco</li>
              <li className="hover:text-foreground cursor-pointer">Integrações</li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="font-semibold mb-4">Recursos</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-foreground cursor-pointer">Documentação</li>
              <li className="hover:text-foreground cursor-pointer">API Reference</li>
              <li className="hover:text-foreground cursor-pointer">Blog</li>
              <li className="hover:text-foreground cursor-pointer">Casos de Uso</li>
              <li className="hover:text-foreground cursor-pointer">Webinars</li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                São Paulo, Brasil
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                contato@mrvterritorial.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +55 11 0000-0000
              </li>
            </ul>
            <div className="flex gap-4 mt-4">
              <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2024 MRV Territorial. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <span className="hover:text-foreground cursor-pointer">Privacidade</span>
            <span className="hover:text-foreground cursor-pointer">Termos de Uso</span>
            <span className="hover:text-foreground cursor-pointer">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
