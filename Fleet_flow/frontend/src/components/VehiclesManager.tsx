import { useState } from "react";
import { useFetchVehicles } from "../hooks/useFetchVehicles";
import { vehicleService, VehicleCreate } from "../api/services";
import { getErrorMessage } from "../api/utils";

/**
 * VehiclesManager Component
 * Demonstrates complete CRUD operations with real backend integration
 * - Fetch: GET /vehicles
 * - Create: POST /vehicles
 * - Update: PUT /vehicles/{id}
 * - Delete: DELETE /vehicles/{id}
 */
export const VehiclesManager = () => {
  const { vehicles, loading, error, refetch } = useFetchVehicles();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState<VehicleCreate>({
    plate: "",
    model: "",
    type: "Truck",
    capacity: 0,
    odometer: 0,
    status: "Active",
  });

  // ==================== FORM HANDLERS ====================

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
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "capacity" || name === "odometer" ? parseFloat(value) : value,
    }));
  };

  // ==================== CREATE VEHICLE ====================
  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // POST /vehicles
      await vehicleService.addVehicle(formData);

      // Show success message (you could use toast here)
      console.log("✓ Vehicle created successfully");

      // Clear form
      resetForm();

      // Refresh the list from backend
      await refetch();
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setSubmitError(`Failed to create vehicle: ${errorMessage}`);
      console.error("Create vehicle error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==================== UPDATE VEHICLE ====================
  const handleUpdateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingId) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // PUT /vehicles/{id}
      await vehicleService.updateVehicle(editingId, formData);

      console.log(`✓ Vehicle ${editingId} updated successfully`);

      resetForm();
      await refetch();
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setSubmitError(`Failed to update vehicle: ${errorMessage}`);
      console.error("Update vehicle error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==================== DELETE VEHICLE ====================
  const handleDeleteVehicle = async (id: number) => {
    if (
      !confirm(
        `Are you sure you want to delete vehicle ${id}? This cannot be undone.`
      )
    ) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // DELETE /vehicles/{id}
      await vehicleService.deleteVehicle(id);

      console.log(`✓ Vehicle ${id} deleted successfully`);

      // Refresh the list
      await refetch();
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setSubmitError(`Failed to delete vehicle: ${errorMessage}`);
      console.error("Delete vehicle error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==================== EDIT VEHICLE ====================
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
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Vehicle Management</h1>

        {/* ==================== ADD/EDIT FORM ==================== */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-blue-500">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {editingId ? `Edit Vehicle #${editingId}` : "Add New Vehicle"}
          </h2>

          {submitError && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              <p className="font-semibold">Error:</p>
              <p>{submitError}</p>
            </div>
          )}

          <form
            onSubmit={editingId ? handleUpdateVehicle : handleAddVehicle}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Plate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Plate *
              </label>
              <input
                type="text"
                name="plate"
                placeholder="e.g., ABC-123"
                value={formData.plate}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model *
              </label>
              <input
                type="text"
                name="model"
                placeholder="e.g., Volvo FH16"
                value={formData.model}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="Truck">Truck</option>
                <option value="Van">Van</option>
                <option value="Car">Car</option>
                <option value="Trailer">Trailer</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity (kg) *
              </label>
              <input
                type="number"
                name="capacity"
                placeholder="e.g., 20000"
                value={formData.capacity}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            {/* Odometer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Odometer (km) *
              </label>
              <input
                type="number"
                name="odometer"
                placeholder="e.g., 15000"
                value={formData.odometer}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="flex-1 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⟳</span>
                    {editingId ? "Updating..." : "Saving..."}
                  </>
                ) : editingId ? (
                  "Update Vehicle"
                ) : (
                  "Save Vehicle"
                )}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 disabled:bg-gray-400 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ==================== FETCH ERROR ==================== */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">Failed to load vehicles</p>
              <p>{error}</p>
            </div>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* ==================== VEHICLES TABLE ==================== */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="inline-block animate-spin text-4xl mb-4">⟳</div>
            <p className="text-gray-600 font-semibold">Loading vehicles...</p>
          </div>
        ) : vehicles.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-200 border-b-2 border-gray-300">
                    <th className="p-4 text-left font-semibold text-gray-800">ID</th>
                    <th className="p-4 text-left font-semibold text-gray-800">Plate</th>
                    <th className="p-4 text-left font-semibold text-gray-800">Model</th>
                    <th className="p-4 text-left font-semibold text-gray-800">Type</th>
                    <th className="p-4 text-left font-semibold text-gray-800">Capacity</th>
                    <th className="p-4 text-left font-semibold text-gray-800">Odometer</th>
                    <th className="p-4 text-left font-semibold text-gray-800">Status</th>
                    <th className="p-4 text-center font-semibold text-gray-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle, idx) => (
                    <tr
                      key={vehicle.id}
                      className={`border-b ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50 transition`}
                    >
                      <td className="p-4 font-semibold text-gray-800">{vehicle.id}</td>
                      <td className="p-4 font-bold text-blue-600">{vehicle.plate}</td>
                      <td className="p-4 text-gray-700">{vehicle.model}</td>
                      <td className="p-4 text-gray-700">{vehicle.type}</td>
                      <td className="p-4 text-gray-700">{vehicle.capacity.toLocaleString()} kg</td>
                      <td className="p-4 text-gray-700">{vehicle.odometer.toLocaleString()} km</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                            vehicle.status === "Active"
                              ? "bg-green-500"
                              : vehicle.status === "Maintenance"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        >
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="p-4 text-center space-x-2">
                        <button
                          onClick={() => handleEditVehicle(vehicle)}
                          disabled={isSubmitting}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 transition text-sm font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteVehicle(vehicle.id)}
                          disabled={isSubmitting}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 transition text-sm font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-100 px-4 py-3 text-sm text-gray-600 font-semibold">
              Total Vehicles: {vehicles.length}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg font-semibold">No vehicles found</p>
            <p className="text-gray-400 mt-2">Add your first vehicle using the form above</p>
          </div>
        )}
      </div>
    </div>
  );
};
