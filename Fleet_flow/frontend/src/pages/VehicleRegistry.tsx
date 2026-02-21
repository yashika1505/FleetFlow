import { useState } from "react";
import Layout from "@/components/Layout";
import SearchFilterBar from "@/components/SearchFilterBar";
import DataTable, { TableRow, TableCell } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { Plus, Trash2, AlertCircle, Loader } from "lucide-react";
import { useFetchVehicles } from "@/hooks/useFetchVehicles";
import { vehicleService, VehicleCreate } from "@/api/services";
import { getErrorMessage } from "@/api/utils";

export default function VehicleRegistry() {
  const { vehicles, loading, error, refetch } = useFetchVehicles();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Form state
  const [formData, setFormData] = useState<VehicleCreate>({
    plate: "",
    model: "",
    type: "Truck",
    capacity: 0,
    odometer: 0,
    status: "Active",
  });

  // Filter and search
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || v.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      plate: "",
      model: "",
      type: "Truck",
      capacity: 0,
      odometer: 0,
      status: "Active",
    });
    setEditingId(null);
    setSubmitError(null);
    setShowForm(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "capacity" || name === "odometer"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (editingId) {
        // PUT /vehicles/{id}
        await vehicleService.updateVehicle(editingId, formData);
      } else {
        // POST /vehicles
        await vehicleService.addVehicle(formData);
      }

      resetForm();
      await refetch();
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setSubmitError(errorMessage);
      console.error("Save vehicle error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditVehicle = (vehicle: typeof vehicles[0]) => {
    setFormData({
      plate: vehicle.plate,
      model: vehicle.model,
      type: vehicle.type,
      capacity: vehicle.capacity,
      odometer: vehicle.odometer,
      status: vehicle.status,
    });
    setEditingId(vehicle.id);
    setSubmitError(null);
    setShowForm(true);
  };

  const handleDeleteVehicle = async (id: number) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // DELETE /vehicles/{id}
      await vehicleService.deleteVehicle(id);
      await refetch();
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setSubmitError(errorMessage);
      console.error("Delete vehicle error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Vehicle Registry</h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> New Vehicle
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="dashboard-card space-y-4 border-l-4 border-primary">
            <h2 className="font-bold text-foreground">
              {editingId ? `Edit Vehicle #${editingId}` : "Add New Vehicle"}
            </h2>

            {submitError && (
              <div className="p-3 bg-red-100 border border-red-400 rounded text-red-700 text-sm flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Error</p>
                  <p>{submitError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSaveVehicle} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Plate *
                  </label>
                  <input
                    name="plate"
                    type="text"
                    placeholder="e.g., ABC-1234"
                    value={formData.plate}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:opacity-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Model *
                  </label>
                  <input
                    name="model"
                    type="text"
                    placeholder="e.g., Volvo FH16"
                    value={formData.model}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:opacity-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:opacity-50"
                  >
                    <option value="Truck">Truck</option>
                    <option value="Van">Van</option>
                    <option value="Car">Car</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Capacity (kg) *
                  </label>
                  <input
                    name="capacity"
                    type="number"
                    placeholder="e.g., 5000"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:opacity-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Odometer (km) *
                  </label>
                  <input
                    name="odometer"
                    type="number"
                    placeholder="e.g., 45000"
                    value={formData.odometer}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:opacity-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:opacity-50"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <Loader className="h-4 w-4 animate-spin" />}
                  {editingId ? "Update" : "Save"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="dashboard-card border-l-4 border-destructive bg-destructive/10 space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-destructive">Failed to load vehicles</p>
                <p className="text-sm text-destructive/90">{error}</p>
              </div>
            </div>
            <button
              onClick={() => refetch()}
              className="px-3 py-1 text-sm bg-destructive text-destructive-foreground rounded hover:opacity-90"
            >
              Retry
            </button>
          </div>
        )}

        {/* Search and Filters */}
        <SearchFilterBar
          searchPlaceholder="Search by plate or model..."
          onSearch={setSearchTerm}
          filterOptions={["All", "Active", "Inactive", "Maintenance"]}
          onFilter={setFilterStatus}
          sortOptions={["Plate", "Model", "Capacity"]}
        />

        {/* Loading State */}
        {loading && (
          <div className="dashboard-card text-center py-8">
            <Loader className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-foreground/60 mt-4">Loading vehicles...</p>
          </div>
        )}

        {/* Data Table */}
        {!loading && filteredVehicles.length > 0 && (
          <DataTable columns={["ID", "Plate", "Model", "Type", "Capacity", "Odometer", "Status", "Actions"]}>
            {filteredVehicles.map((v) => (
              <TableRow key={v.id}>
                <TableCell>{v.id}</TableCell>
                <TableCell className="font-medium text-primary">{v.plate}</TableCell>
                <TableCell>{v.model}</TableCell>
                <TableCell>{v.type}</TableCell>
                <TableCell>{v.capacity.toLocaleString()} kg</TableCell>
                <TableCell>{v.odometer.toLocaleString()} km</TableCell>
                <TableCell>
                  <StatusBadge status={v.status} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditVehicle(v)}
                      disabled={isSubmitting}
                      className="text-sm text-primary hover:underline disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteVehicle(v.id)}
                      disabled={isSubmitting}
                      className="text-sm text-destructive hover:underline disabled:opacity-50 flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </DataTable>
        )}

        {/* No Results */}
        {!loading && filteredVehicles.length === 0 && !error && (
          <div className="dashboard-card text-center py-8 text-foreground/60">
            <p>
              {vehicles.length === 0
                ? "No vehicles found. Add your first vehicle above."
                : "No vehicles match your search."}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
