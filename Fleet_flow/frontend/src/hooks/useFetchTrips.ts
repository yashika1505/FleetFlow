import { useState, useEffect, useCallback } from "react";
import { tripService, Trip } from "../api/services";
import { AxiosError } from "axios";

interface UseFetchTripsResult {
  trips: Trip[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useFetchTrips = (): UseFetchTripsResult => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tripService.getTrips();
      setTrips(data);
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMessage =
        axiosError.response?.data instanceof Object &&
        "detail" in axiosError.response.data
          ? (axiosError.response.data as { detail: string }).detail
          : axiosError.message || "Failed to fetch trips";
      setError(errorMessage);
      console.error("Fetch trips error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return { trips, loading, error, refetch: fetchTrips };
};
