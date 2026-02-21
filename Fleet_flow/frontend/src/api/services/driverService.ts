import apiClient from "../client";

export interface Driver {
  id: number;
  name: string;
  license_number: string;
  expiry_date: string;
  status: string;
}

export interface DriverCreate {
  name: string;
  license_number: string;
  expiry_date: string;
  status: string;
}

export const driverService = {
  async getDrivers(): Promise<Driver[]> {
    try {
      const response = await apiClient.get<Driver[]>("/drivers");
      return response.data;
    } catch (error) {
      console.error("Error fetching drivers:", error);
      throw error;
    }
  },

  async getDriverById(id: number): Promise<Driver> {
    try {
      const response = await apiClient.get<Driver>(`/drivers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching driver ${id}:`, error);
      throw error;
    }
  },

  async addDriver(driver: DriverCreate): Promise<Driver> {
    try {
      const response = await apiClient.post<Driver>("/drivers", driver);
      return response.data;
    } catch (error) {
      console.error("Error creating driver:", error);
      throw error;
    }
  },

  async updateDriver(
    id: number,
    updates: Partial<DriverCreate>
  ): Promise<Driver> {
    try {
      const response = await apiClient.put<Driver>(`/drivers/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error(`Error updating driver ${id}:`, error);
      throw error;
    }
  },

  async deleteDriver(id: number): Promise<void> {
    try {
      await apiClient.delete(`/drivers/${id}`);
    } catch (error) {
      console.error(`Error deleting driver ${id}:`, error);
      throw error;
    }
  },
};
