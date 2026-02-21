import { useState, useEffect, useCallback } from "react";
import { expenseService, Expense } from "../api/services";
import { AxiosError } from "axios";

interface UseFetchExpensesResult {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useFetchExpenses = (): UseFetchExpensesResult => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await expenseService.getExpenses();
      setExpenses(data);
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMessage =
        axiosError.response?.data instanceof Object &&
        "detail" in axiosError.response.data
          ? (axiosError.response.data as { detail: string }).detail
          : axiosError.message || "Failed to fetch expenses";
      setError(errorMessage);
      console.error("Fetch expenses error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return { expenses, loading, error, refetch: fetchExpenses };
};
