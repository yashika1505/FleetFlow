import apiClient from "../client";

export interface Trip {
  id: number;
  vehicle_id: number;
  driver_id: number;
  origin: string;
  destination: string;
  cargo_weight: number;
  fuel_estimate: number;
  status: string;
}

export interface TripCreate {
  vehicle_id: number;
  driver_id: number;
  origin: string;
  destination: string;
  cargo_weight: number;
  fuel_estimate: number;
  status: string;
}

export const tripService = {
  async getTrips(): Promise<Trip[]> {
    try {
      const response = await apiClient.get<Trip[]>("/trips");
      return response.data;
    } catch (error) {
      console.error("Error fetching trips:", error);
      throw error;
    }
  },

  async getTripById(id: number): Promise<Trip> {
    try {
      const response = await apiClient.get<Trip>(`/trips/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching trip ${id}:`, error);
      throw error;
    }
  },

  async addTrip(trip: TripCreate): Promise<Trip> {
    try {
      const response = await apiClient.post<Trip>("/trips", trip);
      return response.data;
    } catch (error) {
      console.error("Error creating trip:", error);
      throw error;
    }
  },

  async updateTrip(id: number, updates: Partial<TripCreate>): Promise<Trip> {
    try {
      const response = await apiClient.put<Trip>(`/trips/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error(`Error updating trip ${id}:`, error);
      throw error;
    }
  },

  async deleteTrip(id: number): Promise<void> {
    try {
      await apiClient.delete(`/trips/${id}`);
    } catch (error) {
      console.error(`Error deleting trip ${id}:`, error);
      throw error;
    }
  },
};
