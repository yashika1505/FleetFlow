import Layout from "@/components/Layout";
import KPICard from "@/components/KPICard";
import DataTable, { TableRow, TableCell } from "@/components/DataTable";
import { DollarSign, TrendingUp, Activity } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const fuelData = [
  { month: "Jan", efficiency: 8.2 },
  { month: "Feb", efficiency: 8.5 },
  { month: "Mar", efficiency: 7.9 },
  { month: "Apr", efficiency: 8.8 },
  { month: "May", efficiency: 9.1 },
  { month: "Jun", efficiency: 8.7 },
];

const costData = [
  { vehicle: "TRK-A12", cost: 4500 },
  { vehicle: "TRK-C07", cost: 3800 },
  { vehicle: "VAN-B03", cost: 3200 },
  { vehicle: "TRK-D15", cost: 2900 },
  { vehicle: "VAN-E09", cost: 2100 },
];

const financials = [
  { month: "January", revenue: "$52,000", fuel: "$12,400", maintenance: "$3,200", profit: "$36,400" },
  { month: "February", revenue: "$48,500", fuel: "$11,800", maintenance: "$5,100", profit: "$31,600" },
  { month: "March", revenue: "$55,200", fuel: "$13,100", maintenance: "$2,800", profit: "$39,300" },
  { month: "April", revenue: "$61,000", fuel: "$14,200", maintenance: "$4,500", profit: "$42,300" },
];

export default function Analytics() {
  return (
    <Layout>
      <div className="page-container">
        <h1 className="text-xl font-bold text-foreground">Analytics</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KPICard title="Total Fuel Cost" value="$51,500" icon={DollarSign} color="purple" />
          <KPICard title="Fleet ROI" value="24.3%" icon={TrendingUp} color="teal" />
          <KPICard title="Utilization Rate" value="87%" icon={Activity} color="blue" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="dashboard-card">
            <h3 className="text-sm font-semibold text-foreground mb-4">Fuel Efficiency Trend (km/L)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={fuelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 92%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215 16% 47%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215 16% 47%)" />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid hsl(214 20% 92%)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                />
                <Line type="monotone" dataKey="efficiency" stroke="hsl(217 91% 60%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(217 91% 60%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard-card">
            <h3 className="text-sm font-semibold text-foreground mb-4">Top 5 Costliest Vehicles</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 92%)" />
                <XAxis dataKey="vehicle" tick={{ fontSize: 12 }} stroke="hsl(215 16% 47%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215 16% 47%)" />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid hsl(214 20% 92%)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                />
                <Bar dataKey="cost" fill="hsl(217 91% 60%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-foreground text-center mb-4">Financial Summary of Month</h3>
          <DataTable columns={["Month", "Revenue", "Fuel Cost", "Maintenance Cost", "Total Profit"]}>
            {financials.map((f) => (
              <TableRow key={f.month}>
                <TableCell className="font-medium">{f.month}</TableCell>
                <TableCell>{f.revenue}</TableCell>
                <TableCell>{f.fuel}</TableCell>
                <TableCell>{f.maintenance}</TableCell>
                <TableCell className="font-semibold">{f.profit}</TableCell>
              </TableRow>
            ))}
          </DataTable>
        </div>
      </div>
    </Layout>
  );
}
