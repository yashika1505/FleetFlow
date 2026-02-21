import apiClient from "../client";

export interface Maintenance {
  id: number;
  vehicle_id: number;
  issue: string;
  date: string;
  status: string;
  cost: number;
}

export interface MaintenanceCreate {
  vehicle_id: number;
  issue: string;
  date: string;
  status: string;
  cost: number;
}

export const maintenanceService = {
  async getMaintenance(): Promise<Maintenance[]> {
    try {
      const response = await apiClient.get<Maintenance[]>("/maintenance");
      return response.data;
    } catch (error) {
      console.error("Error fetching maintenance records:", error);
      throw error;
    }
  },

  async getMaintenanceById(id: number): Promise<Maintenance> {
    try {
      const response = await apiClient.get<Maintenance>(`/maintenance/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching maintenance record ${id}:`, error);
      throw error;
    }
  },

  async addMaintenance(maintenance: MaintenanceCreate): Promise<Maintenance> {
    try {
      const response = await apiClient.post<Maintenance>(
        "/maintenance",
        maintenance
      );
      return response.data;
    } catch (error) {
      console.error("Error creating maintenance record:", error);
      throw error;
    }
  },

  async updateMaintenance(
    id: number,
    updates: Partial<MaintenanceCreate>
  ): Promise<Maintenance> {
    try {
      const response = await apiClient.put<Maintenance>(
        `/maintenance/${id}`,
        updates
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating maintenance record ${id}:`, error);
      throw error;
    }
  },

  async deleteMaintenance(id: number): Promise<void> {
    try {
      await apiClient.delete(`/maintenance/${id}`);
    } catch (error) {
      console.error(`Error deleting maintenance record ${id}:`, error);
      throw error;
    }
  },
};
