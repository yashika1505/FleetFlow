import { useState, useEffect, useCallback } from "react";
import { driverService, Driver } from "../api/services";
import { AxiosError } from "axios";
import { getErrorMessage } from "../api/utils";

interface UseFetchDriversResult {
  drivers: Driver[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch drivers from the backend
 */
export const useFetchDrivers = (): UseFetchDriversResult => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDrivers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await driverService.getDrivers();
      setDrivers(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      console.error("Fetch drivers error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  return { drivers, loading, error, refetch: fetchDrivers };
};
