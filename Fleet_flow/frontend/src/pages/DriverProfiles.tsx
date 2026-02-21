import { useState } from "react";
import Layout from "@/components/Layout";
import SearchFilterBar from "@/components/SearchFilterBar";
import DataTable, { TableRow, TableCell } from "@/components/DataTable";
import { Loader, AlertCircle, Trash2 } from "lucide-react";
import { useFetchDrivers } from "@/hooks/useFetchDrivers";
import { driverService, DriverCreate } from "@/api/services";
import { getErrorMessage } from "@/api/utils";

function SafetyScore({ score }: { score: number }) {
  const color =
    score >= 90
      ? "text-status-available bg-status-available-bg"
      : score >= 75
      ? "text-status-in-shop bg-status-in-shop-bg"
      : "text-destructive bg-destructive/10";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {score}
    </span>
  );
}

export default function DriverProfiles() {
  const { drivers, loading, error, refetch } = useFetchDrivers();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<DriverCreate>({
    name: "",
    email: "",
    phone: "",
    license_number: "",
    license_expiry: new Date().toISOString().split("T")[0],
  });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.license_number) {
      setSubmitError("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await driverService.addDriver(formData);
      setFormData({
        name: "",
        email: "",
        phone: "",
        license_number: "",
        license_expiry: new Date().toISOString().split("T")[0],
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
    if (!confirm("Are you sure you want to delete this driver?")) return;

    try {
      setIsDeleting(true);
      await driverService.deleteDriver(id);
      await refetch();
      setDeleteId(null);
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
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
          <h1 className="text-xl font-bold text-foreground">Driver Profiles</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {showForm ? "Cancel" : "Add Driver"}
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
            {submitError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
                {submitError}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Driver name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Phone</label>
                  <input
                    type="tel"
                    placeholder="+1234567890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">License Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="DL-XXXX-XXXX"
                    value={formData.license_number}
                    onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">License Expiry</label>
                  <input
                    type="date"
                    value={formData.license_expiry}
                    onChange={(e) => setFormData({ ...formData, license_expiry: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? "Adding..." : "Add Driver"}
              </button>
            </form>
          </div>
        )}

        <SearchFilterBar
          searchPlaceholder="Search drivers..."
          groupByOptions={["License", "Status"]}
          filterOptions={["All", "Active", "Inactive"]}
          sortOptions={["Name", "License Expiry"]}
        />

        <DataTable columns={["Driver ID", "Name", "License", "Expiry", "Email", "Phone", "Actions"]}>
          {drivers.map((d) => (
            <TableRow key={d.id}>
              <TableCell className="font-medium">{d.id}</TableCell>
              <TableCell>{d.name}</TableCell>
              <TableCell>{d.license_number}</TableCell>
              <TableCell>{d.license_expiry}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{d.email}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{d.phone}</TableCell>
              <TableCell>
                <button
                  onClick={() => handleDelete(d.id)}
                  disabled={isDeleting && deleteId === d.id}
                  className="hover:text-destructive transition-colors disabled:opacity-50"
                  title="Delete"
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
