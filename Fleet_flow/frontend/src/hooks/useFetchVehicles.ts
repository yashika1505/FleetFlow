import { useState, useEffect, useCallback } from "react";
import { vehicleService, Vehicle } from "../api/services";
import { AxiosError } from "axios";

interface UseFetchVehiclesResult {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch vehicles from the backend
 * Handles loading, error, and refetch states
 */
export const useFetchVehicles = (): UseFetchVehiclesResult => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vehicleService.getVehicles();
      setVehicles(data);
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMessage =
        axiosError.response?.data instanceof Object &&
        "detail" in axiosError.response.data
          ? (axiosError.response.data as { detail: string }).detail
          : axiosError.message || "Failed to fetch vehicles";
      setError(errorMessage);
      console.error("Fetch vehicles error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return { vehicles, loading, error, refetch: fetchVehicles };
};
