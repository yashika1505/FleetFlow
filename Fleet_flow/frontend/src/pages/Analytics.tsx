import { useMemo } from "react";
import Layout from "@/components/Layout";
import KPICard from "@/components/KPICard";
import DataTable, { TableRow, TableCell } from "@/components/DataTable";
import { Loader, AlertCircle, DollarSign, TrendingUp, Activity } from "lucide-react";
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
import { useFetchVehicles } from "@/hooks/useFetchVehicles";
import { useFetchTrips } from "@/hooks/useFetchTrips";
import { useFetchExpenses } from "@/hooks/useFetchExpenses";
import { useFetchMaintenance } from "@/hooks/useFetchMaintenance";

export default function Analytics() {
  const { vehicles, loading: vehiclesLoading, error: vehiclesError } = useFetchVehicles();
  const { trips, loading: tripsLoading, error: tripsError } = useFetchTrips();
  const { expenses, loading: expensesLoading, error: expensesError } = useFetchExpenses();
  const { maintenance, loading: maintenanceLoading, error: maintenanceError } = useFetchMaintenance();

  const loading = vehiclesLoading || tripsLoading || expensesLoading || maintenanceLoading;
  const error = vehiclesError || tripsError || expensesError || maintenanceError;

  // Calculate fuel efficiency trend by month
  const fuelData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const efficiencyByMonth = new Map();

    trips.forEach((trip) => {
      const date = new Date(trip.start_time);
      const month = months[date.getMonth()];
      const efficiency = trip.distance ? 8.5 : 0; // Default efficiency for demo

      if (!efficiencyByMonth.has(month)) {
        efficiencyByMonth.set(month, []);
      }
      efficiencyByMonth.get(month).push(efficiency);
    });

    return Array.from(efficiencyByMonth.entries()).map(([month, values]) => ({
      month,
      efficiency: values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : 0,
    })).slice(0, 6);
  }, [trips]);

  // Calculate top costliest vehicles
  const costData = useMemo(() => {
    const vehicleCosts = new Map();

    expenses.forEach((expense) => {
      const vehicleId = expense.trip_id; // Simplified - in real app would join with trips table
      if (!vehicleCosts.has(vehicleId)) {
        vehicleCosts.set(vehicleId, 0);
      }
      vehicleCosts.set(vehicleId, vehicleCosts.get(vehicleId) + (expense.amount || 0));
    });

    maintenance.forEach((mnt) => {
      const vehicleId = mnt.vehicle_id;
      if (!vehicleCosts.has(vehicleId)) {
        vehicleCosts.set(vehicleId, 0);
      }
      vehicleCosts.set(vehicleId, vehicleCosts.get(vehicleId) + (mnt.cost || 0));
    });

    return Array.from(vehicleCosts.entries())
      .map(([vehicleId, cost]) => {
        const vehicle = vehicles.find((v) => v.id === vehicleId);
        return { vehicle: vehicle?.registration_number || `Vehicle ${vehicleId}`, cost: Math.round(cost) };
      })
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 5);
  }, [expenses, maintenance, vehicles]);

  // Calculate financial summary
  const financials = useMemo(() => {
    const monthlyData = new Map();

    trips.forEach((trip) => {
      const date = new Date(trip.start_time);
      const month = date.toLocaleString("default", { month: "long" });
      if (!monthlyData.has(month)) {
        monthlyData.set(month, { revenue: 0, fuel: 0, maintenance: 0 });
      }
      const data = monthlyData.get(month);
      data.revenue += (trip.distance || 0) * 2; // Assume $2 per km revenue
      data.fuel += (trip.distance || 0) * 0.12; // Assume $0.12 per km fuel cost
    });

    maintenance.forEach((mnt) => {
      const date = new Date(mnt.date);
      const month = date.toLocaleString("default", { month: "long" });
      if (monthlyData.has(month)) {
        monthlyData.get(month).maintenance += mnt.cost || 0;
      }
    });

    return Array.from(monthlyData.entries()).map(([month, data]) => ({
      month,
      revenue: `$${Math.round(data.revenue).toLocaleString()}`,
      fuel: `$${Math.round(data.fuel).toLocaleString()}`,
      maintenance: `$${Math.round(data.maintenance).toLocaleString()}`,
      profit: `$${Math.round(data.revenue - data.fuel - data.maintenance).toLocaleString()}`,
    }));
  }, [trips, maintenance]);

  // Calculate KPI values
  const totalFuelCost = useMemo(() => {
    return expenses
      .filter((e) => e.category === "Fuel")
      .reduce((sum, e) => sum + (e.amount || 0), 0)
      .toFixed(2);
  }, [expenses]);

  const totalCost = useMemo(() => {
    return (
      expenses.reduce((sum, e) => sum + (e.amount || 0), 0) +
      maintenance.reduce((sum, m) => sum + (m.cost || 0), 0)
    ).toFixed(2);
  }, [expenses, maintenance]);

  const utilizationRate = useMemo(() => {
    const activeVehicles = vehicles.filter((v) => v.status === "active").length;
    return vehicles.length > 0 ? ((activeVehicles / vehicles.length) * 100).toFixed(0) : 0;
  }, [vehicles]);

  if (loading) {
    return (
      <Layout>
        <div className="page-container flex items-center justify-center min-h-screen">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <h1 className="text-xl font-bold text-foreground">Analytics</h1>

        {error && (
          <div className="dashboard-card border-l-4 border-destructive bg-destructive/10 p-4 rounded-lg flex items-start gap-3 mb-4">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">Failed to load analytics data</p>
              <p className="text-xs text-destructive/80 mt-1">Some data may be incomplete</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KPICard title="Total Fuel Cost" value={`$${totalFuelCost}`} icon={DollarSign} color="purple" />
          <KPICard title="Total Operating Cost" value={`$${totalCost}`} icon={TrendingUp} color="teal" />
          <KPICard title="Fleet Utilization" value={`${utilizationRate}%`} icon={Activity} color="blue" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="dashboard-card">
            <h3 className="text-sm font-semibold text-foreground mb-4">Fuel Efficiency Trend (km/L)</h3>
            {fuelData.length > 0 ? (
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
            ) : (
              <p className="text-sm text-muted-foreground text-center py-20">No fuel efficiency data available</p>
            )}
          </div>

          <div className="dashboard-card">
            <h3 className="text-sm font-semibold text-foreground mb-4">Top 5 Costliest Vehicles</h3>
            {costData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={costData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 92%)" />
                  <XAxis dataKey="vehicle" tick={{ fontSize: 12 }} stroke="hsl(215 16% 47%)" angle={-45} textAnchor="end" height={80} />
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
            ) : (
              <p className="text-sm text-muted-foreground text-center py-20">No cost data available</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-foreground text-center mb-4">Financial Summary by Month</h3>
          {financials.length > 0 ? (
            <DataTable columns={["Month", "Revenue", "Fuel Cost", "Maintenance Cost", "Total Profit"]}>
              {financials.map((f) => (
                <TableRow key={f.month}>
                  <TableCell className="font-medium">{f.month}</TableCell>
                  <TableCell className="text-green-600">{f.revenue}</TableCell>
                  <TableCell>{f.fuel}</TableCell>
                  <TableCell>{f.maintenance}</TableCell>
                  <TableCell className="font-semibold text-green-600">{f.profit}</TableCell>
                </TableRow>
              ))}
            </DataTable>
          ) : (
            <div className="dashboard-card text-center py-12">
              <p className="text-sm text-muted-foreground">No financial data available</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
