import { useState } from "react";
import Layout from "@/components/Layout";
import SearchFilterBar from "@/components/SearchFilterBar";
import DataTable, { TableRow, TableCell } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { Loader, AlertCircle } from "lucide-react";
import { useFetchTrips } from "@/hooks/useFetchTrips";
import { tripService, TripCreate } from "@/api/services";
import { getErrorMessage } from "@/api/utils";

export default function TripDispatcher() {
  const { trips, loading, error, refetch } = useFetchTrips();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<TripCreate>({
    vehicle_id: 0,
    driver_id: 0,
    origin: "",
    destination: "",
    cargo_weight: 0,
    fuel_estimate: 0,
    status: "Pending",
  });

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.vehicle_id === 0 || formData.driver_id === 0) {
      setSubmitError("Please select a vehicle and driver");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await tripService.addTrip(formData);
      setFormData({
        vehicle_id: 0,
        driver_id: 0,
        origin: "",
        destination: "",
        cargo_weight: 0,
        fuel_estimate: 0,
        status: "Pending",
      });
      await refetch();
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <h1 className="text-xl font-bold text-foreground">Trip Dispatcher</h1>

        {error && (
          <div className="dashboard-card border-l-4 border-destructive bg-destructive/10 p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">{error}</p>
              <button onClick={refetch} className="text-xs text-destructive underline hover:no-underline mt-1">
                Retry
              </button>
            </div>
          </div>
        )}

        <SearchFilterBar
          searchPlaceholder="Search trips..."
          groupByOptions={["Fleet Type", "Status"]}
          filterOptions={["All", "In Transit", "Pending", "Delivered", "Scheduled"]}
          sortOptions={["Newest", "Origin", "Destination"]}
        />

        <DataTable columns={["Trip ID", "Origin", "Destination", "Vehicle", "Driver", "Status"]}>
          {trips.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="font-medium">{t.id}</TableCell>
              <TableCell>{t.origin}</TableCell>
              <TableCell>{t.destination}</TableCell>
              <TableCell>{t.vehicle_id}</TableCell>
              <TableCell>{t.driver_id}</TableCell>
              <TableCell><StatusBadge status={t.status} /></TableCell>
            </TableRow>
          ))}
        </DataTable>

        <div className="dashboard-card space-y-4">
          <h2 className="text-base font-semibold text-foreground">Dispatch New Trip</h2>
          {submitError && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
              {submitError}
            </div>
          )}
          <form onSubmit={handleDispatch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Select Vehicle</label>
                <input
                  type="number"
                  required
                  placeholder="Vehicle ID"
                  value={formData.vehicle_id}
                  onChange={(e) => setFormData({ ...formData, vehicle_id: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Select Driver</label>
                <input
                  type="number"
                  required
                  placeholder="Driver ID"
                  value={formData.driver_id}
                  onChange={(e) => setFormData({ ...formData, driver_id: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Cargo Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.cargo_weight}
                  onChange={(e) => setFormData({ ...formData, cargo_weight: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Origin Address</label>
                <input
                  type="text"
                  required
                  placeholder="Starting point"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Destination</label>
                <input
                  type="text"
                  required
                  placeholder="End point"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Fuel Estimate (Liters)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.fuel_estimate}
                  onChange={(e) => setFormData({ ...formData, fuel_estimate: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30"
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? "Dispatching..." : "Confirm & Dispatch"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
