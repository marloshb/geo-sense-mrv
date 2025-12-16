import { AppLayout } from "@/components/layout/AppLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { EmissionsChart } from "@/components/dashboard/EmissionsChart";
import { RiskMatrix } from "@/components/dashboard/RiskMatrix";
import { TerritoryOverview } from "@/components/dashboard/TerritoryOverview";
import { AIInsights } from "@/components/dashboard/AIInsights";
import { TerritoryMap } from "@/components/monitoring/TerritoryMap";
import {
  Cloud,
  TreeDeciduous,
  Factory,
  AlertTriangle,
  TrendingDown,
  Globe,
} from "lucide-react";

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral de métricas ambientais e climáticas
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Emissões Totais"
            value="9,750"
            unit="tCO₂e"
            change={-12.5}
            changeLabel="vs. ano anterior"
            icon={<Cloud className="w-5 h-5 text-primary" />}
            variant="success"
          />
          <KPICard
            title="Área Monitorada"
            value="26,040"
            unit="ha"
            change={8.3}
            changeLabel="novos territórios"
            icon={<Globe className="w-5 h-5 text-info" />}
            variant="info"
          />
          <KPICard
            title="Riscos Ativos"
            value="7"
            change={-2}
            changeLabel="vs. mês anterior"
            icon={<AlertTriangle className="w-5 h-5 text-warning" />}
            variant="warning"
          />
          <KPICard
            title="Sequestro de Carbono"
            value="2,340"
            unit="tCO₂e"
            change={15.2}
            changeLabel="acumulado"
            icon={<TreeDeciduous className="w-5 h-5 text-success" />}
            variant="success"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            <EmissionsChart />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TerritoryOverview />
              <RiskMatrix />
            </div>
          </div>

          {/* Right Column - Map & Insights */}
          <div className="space-y-6">
            <TerritoryMap />
            <AIInsights />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
