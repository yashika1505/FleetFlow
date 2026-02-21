import { useState } from "react";
import Layout from "@/components/Layout";
import SearchFilterBar from "@/components/SearchFilterBar";
import DataTable, { TableRow, TableCell } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { Plus, Trash2, AlertCircle, Loader } from "lucide-react";
import { useFetchMaintenance } from "@/hooks/useFetchMaintenance";
import { maintenanceService, MaintenanceCreate } from "@/api/services";
import { getErrorMessage } from "@/api/utils";

export default function Maintenance() {
  const { maintenance, loading, error, refetch } = useFetchMaintenance();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<MaintenanceCreate>({
    vehicle_id: 0,
    issue: "",
    date: new Date().toISOString().split("T")[0],
    cost: 0,
    status: "Pending",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.vehicle_id === 0) {
      setSubmitError("Please select a vehicle");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await maintenanceService.addMaintenance(formData);
      setFormData({
        vehicle_id: 0,
        issue: "",
        date: new Date().toISOString().split("T")[0],
        cost: 0,
        status: "Pending",
      });
      setShowForm(false);
      await refetch();
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this maintenance record?")) {
      try {
        await maintenanceService.deleteMaintenance(id);
        await refetch();
      } catch (err) {
        alert("Failed to delete maintenance record: " + getErrorMessage(err));
      }
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
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Maintenance</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" /> New Service
          </button>
        </div>

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

        {showForm && (
          <div className="dashboard-card space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
                  {submitError}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Vehicle ID</label>
                  <input
                    type="number"
                    required
                    value={formData.vehicle_id}
                    onChange={(e) => setFormData({ ...formData, vehicle_id: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Issue/Maintenance Type *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Oil Change, Tire Replacement"
                    value={formData.issue}
                    onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Cost</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
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
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <SearchFilterBar
          searchPlaceholder="Search maintenance logs..."
          groupByOptions={["Vehicle", "Status"]}
          filterOptions={["All", "Completed", "In Shop", "Scheduled", "Pending"]}
          sortOptions={["Date", "Cost", "Vehicle"]}
        />

        <DataTable columns={["ID", "Vehicle ID", "Type", "Date", "Cost", "Status", "Actions"]}>
          {maintenance.map((m) => (
            <TableRow key={m.id}>
              <TableCell className="font-medium">{m.id}</TableCell>
              <TableCell>{m.vehicle_id}</TableCell>
              <TableCell>{m.maintenance_type}</TableCell>
              <TableCell>{m.maintenance_date}</TableCell>
              <TableCell>${m.cost}</TableCell>
              <TableCell><StatusBadge status={m.status} /></TableCell>
              <TableCell>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="text-sm text-destructive hover:underline"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </DataTable>
      </div>
    </Layout>
  );
}
