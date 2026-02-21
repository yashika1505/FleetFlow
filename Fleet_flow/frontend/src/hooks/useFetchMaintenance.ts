import { useState, useEffect, useCallback } from "react";
import { maintenanceService, Maintenance } from "../api/services";
import { AxiosError } from "axios";

interface UseFetchMaintenanceResult {
  maintenance: Maintenance[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useFetchMaintenance = (): UseFetchMaintenanceResult => {
  const [maintenance, setMaintenance] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaintenance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await maintenanceService.getMaintenance();
      setMaintenance(data);
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMessage =
        axiosError.response?.data instanceof Object &&
        "detail" in axiosError.response.data
          ? (axiosError.response.data as { detail: string }).detail
          : axiosError.message || "Failed to fetch maintenance";
      setError(errorMessage);
      console.error("Fetch maintenance error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMaintenance();
  }, [fetchMaintenance]);

  return { maintenance, loading, error, refetch: fetchMaintenance };
};
