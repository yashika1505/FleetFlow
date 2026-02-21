import apiClient from "../client";

// Type definitions
export interface Vehicle {
  id: number;
  plate: string;
  model: string;
  type: string;
  capacity: number;
  odometer: number;
  status: string;
}

export interface VehicleCreate {
  plate: string;
  model: string;
  type: string;
  capacity: number;
  odometer: number;
  status: string;
}

export interface VehicleUpdate extends Partial<VehicleCreate> {
  id: number;
}

// API service functions
export const vehicleService = {
  /**
   * Fetch all vehicles
   */
  async getVehicles(): Promise<Vehicle[]> {
    try {
      const response = await apiClient.get<Vehicle[]>("/vehicles");
      return response.data;
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      throw error;
    }
  },

  /**
   * Get a single vehicle by ID
   */
  async getVehicleById(id: number): Promise<Vehicle> {
    try {
      const response = await apiClient.get<Vehicle>(`/vehicles/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching vehicle ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new vehicle
   */
  async addVehicle(vehicle: VehicleCreate): Promise<Vehicle> {
    try {
      const response = await apiClient.post<Vehicle>("/vehicles", vehicle);
      return response.data;
    } catch (error) {
      console.error("Error creating vehicle:", error);
      throw error;
    }
  },

  /**
   * Update an existing vehicle
   */
  async updateVehicle(
    id: number,
    updates: Partial<VehicleCreate>
  ): Promise<Vehicle> {
    try {
      const response = await apiClient.put<Vehicle>(
        `/vehicles/${id}`,
        updates
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating vehicle ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a vehicle
   */
  async deleteVehicle(id: number): Promise<void> {
    try {
      await apiClient.delete(`/vehicles/${id}`);
    } catch (error) {
      console.error(`Error deleting vehicle ${id}:`, error);
      throw error;
    }
  },
};
