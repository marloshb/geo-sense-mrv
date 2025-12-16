import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { month: "Jan", escopo1: 4200, escopo2: 2400, meta: 6000 },
  { month: "Fev", escopo1: 3800, escopo2: 2100, meta: 5800 },
  { month: "Mar", escopo1: 4100, escopo2: 2300, meta: 5600 },
  { month: "Abr", escopo1: 3600, escopo2: 1900, meta: 5400 },
  { month: "Mai", escopo1: 3400, escopo2: 1800, meta: 5200 },
  { month: "Jun", escopo1: 3200, escopo2: 1700, meta: 5000 },
  { month: "Jul", escopo1: 3000, escopo2: 1600, meta: 4800 },
  { month: "Ago", escopo1: 2900, escopo2: 1500, meta: 4600 },
  { month: "Set", escopo1: 2800, escopo2: 1400, meta: 4400 },
  { month: "Out", escopo1: 2700, escopo2: 1350, meta: 4200 },
  { month: "Nov", escopo1: 2600, escopo2: 1300, meta: 4000 },
  { month: "Dez", escopo1: 2500, escopo2: 1250, meta: 3800 },
];

export const EmissionsChart = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Emissões de GEE (tCO₂e)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorEscopo1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorEscopo2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="escopo1"
              name="Escopo 1"
              stroke="hsl(var(--chart-1))"
              fillOpacity={1}
              fill="url(#colorEscopo1)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="escopo2"
              name="Escopo 2"
              stroke="hsl(var(--chart-2))"
              fillOpacity={1}
              fill="url(#colorEscopo2)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="meta"
              name="Meta"
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="5 5"
              fill="none"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
