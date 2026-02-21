import { useState } from "react";
import { useFetchVehicles } from "../hooks/useFetchVehicles";
import { vehicleService, VehicleCreate } from "../api/services";
import { AxiosError } from "axios";

/**
 * VehiclesList Component
 * Displays all vehicles, allows adding and deleting vehicles
 */
export const VehiclesList = () => {
  const { vehicles, loading, error, refetch } = useFetchVehicles();
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [formData, setFormData] = useState<VehicleCreate>({
    plate: "",
    model: "",
    type: "Truck",
    capacity: 0,
    odometer: 0,
    status: "Active",
  });

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    setAddError(null);

    try {
      await vehicleService.addVehicle(formData);
      setFormData({
        plate: "",
        model: "",
        type: "Truck",
        capacity: 0,
        odometer: 0,
        status: "Active",
      });
      await refetch(); // Refresh the list
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMessage =
        axiosError.response?.data instanceof Object &&
        "detail" in axiosError.response.data
          ? (axiosError.response.data as { detail: string }).detail
          : "Failed to add vehicle";
      setAddError(errorMessage);
      console.error("Add vehicle error:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteVehicle = async (id: number) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;

    try {
      await vehicleService.deleteVehicle(id);
      await refetch(); // Refresh the list
    } catch (err) {
      console.error("Delete vehicle error:", err);
      alert("Failed to delete vehicle");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">Vehicles</h1>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
          <button
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Add Vehicle Form */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Add New Vehicle</h2>
        {addError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {addError}
          </div>
        )}
        <form onSubmit={handleAddVehicle} className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Plate Number"
            value={formData.plate}
            onChange={(e) =>
              setFormData({ ...formData, plate: e.target.value })
            }
            required
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Model"
            value={formData.model}
            onChange={(e) =>
              setFormData({ ...formData, model: e.target.value })
            }
            required
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Truck</option>
            <option>Van</option>
            <option>Car</option>
          </select>
          <input
            type="number"
            placeholder="Capacity (kg)"
            value={formData.capacity}
            onChange={(e) =>
              setFormData({ ...formData, capacity: Number(e.target.value) })
            }
            required
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Odometer (km)"
            value={formData.odometer}
            onChange={(e) =>
              setFormData({ ...formData, odometer: Number(e.target.value) })
            }
            required
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Active</option>
            <option>Inactive</option>
            <option>Maintenance</option>
          </select>
          <button
            type="submit"
            disabled={isAdding}
            className="col-span-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isAdding ? "Adding..." : "Add Vehicle"}
          </button>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin">
            <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading vehicles...</p>
        </div>
      )}

      {/* Vehicles List */}
      {!loading && vehicles.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-3 text-left">ID</th>
                <th className="border p-3 text-left">Plate</th>
                <th className="border p-3 text-left">Model</th>
                <th className="border p-3 text-left">Type</th>
                <th className="border p-3 text-left">Capacity</th>
                <th className="border p-3 text-left">Odometer</th>
                <th className="border p-3 text-left">Status</th>
                <th className="border p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="border p-3">{vehicle.id}</td>
                  <td className="border p-3 font-semibold">{vehicle.plate}</td>
                  <td className="border p-3">{vehicle.model}</td>
                  <td className="border p-3">{vehicle.type}</td>
                  <td className="border p-3">{vehicle.capacity} kg</td>
                  <td className="border p-3">{vehicle.odometer} km</td>
                  <td className="border p-3">
                    <span
                      className={`px-3 py-1 rounded text-white text-sm ${
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
                  <td className="border p-3 text-center">
                    <button
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!loading && vehicles.length === 0 && !error && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No vehicles found</p>
        </div>
      )}
    </div>
  );
};
