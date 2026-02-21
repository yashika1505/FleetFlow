import apiClient from "../client";

export interface Expense {
  id: number;
  trip_id: number;
  fuel_cost: number;
  misc_cost: number;
}

export interface ExpenseCreate {
  trip_id: number;
  fuel_cost: number;
  misc_cost: number;
}

export const expenseService = {
  async getExpenses(): Promise<Expense[]> {
    try {
      const response = await apiClient.get<Expense[]>("/expenses");
      return response.data;
    } catch (error) {
      console.error("Error fetching expenses:", error);
      throw error;
    }
  },

  async getExpenseById(id: number): Promise<Expense> {
    try {
      const response = await apiClient.get<Expense>(`/expenses/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching expense ${id}:`, error);
      throw error;
    }
  },

  async addExpense(expense: ExpenseCreate): Promise<Expense> {
    try {
      const response = await apiClient.post<Expense>("/expenses", expense);
      return response.data;
    } catch (error) {
      console.error("Error creating expense:", error);
      throw error;
    }
  },

  async updateExpense(
    id: number,
    updates: Partial<ExpenseCreate>
  ): Promise<Expense> {
    try {
      const response = await apiClient.put<Expense>(`/expenses/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error(`Error updating expense ${id}:`, error);
      throw error;
    }
  },

  async deleteExpense(id: number): Promise<void> {
    try {
      await apiClient.delete(`/expenses/${id}`);
    } catch (error) {
      console.error(`Error deleting expense ${id}:`, error);
      throw error;
    }
  },
};
