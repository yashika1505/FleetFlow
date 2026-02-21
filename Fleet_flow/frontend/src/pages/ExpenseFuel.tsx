import { useState } from "react";
import Layout from "@/components/Layout";
import SearchFilterBar from "@/components/SearchFilterBar";
import DataTable, { TableRow, TableCell } from "@/components/DataTable";
import { Loader, AlertCircle, Trash2 } from "lucide-react";
import { useFetchExpenses } from "@/hooks/useFetchExpenses";
import { expenseService, ExpenseCreate } from "@/api/services";
import { getErrorMessage } from "@/api/utils";

export default function ExpenseFuel() {
  const { expenses, loading, error, refetch } = useFetchExpenses();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ExpenseCreate>({
    trip_id: 0,
    amount: 0,
    category: "",
    description: "",
  });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.trip_id === 0 || !formData.category) {
      setSubmitError("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await expenseService.addExpense(formData);
      setFormData({
        trip_id: 0,
        amount: 0,
        category: "",
        description: "",
      });
      setShowForm(false);
      await refetch();
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      setIsDeleting(true);
      await expenseService.deleteExpense(id);
      await refetch();
      setDeleteId(null);
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="page-container flex items-center justify-center min-h-screen">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Expense & Fuel</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {showForm ? "Cancel" : "New Expense"}
          </button>
        </div>

        {error && (
          <div className="dashboard-card border-l-4 border-destructive bg-destructive/10 p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">{error}</p>
              <button onClick={refetch} className="text-xs text-destructive underline hover:no-underline mt-1">
                Retry
              </button>
            </div>
          </div>
        )}

        {showForm && (
          <div className="dashboard-card space-y-4">
            {submitError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
                {submitError}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Trip ID *</label>
                  <input
                    type="number"
                    required
                    placeholder="Enter trip ID"
                    value={formData.trip_id}
                    onChange={(e) => setFormData({ ...formData, trip_id: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Amount ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30"
                  >
                    <option value="">Select category</option>
                    <option>Fuel</option>
                    <option>Maintenance</option>
                    <option>Toll</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <input
                    type="text"
                    placeholder="Optional notes"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? "Adding..." : "Add Expense"}
              </button>
            </form>
          </div>
        )}

        <SearchFilterBar
          searchPlaceholder="Search expenses..."
          groupByOptions={["Category", "Trip"]}
          filterOptions={["All", "Fuel", "Maintenance", "Toll", "Other"]}
          sortOptions={["Latest", "Highest Cost", "Lowest Cost"]}
        />

        <DataTable columns={["Expense ID", "Trip ID", "Category", "Amount", "Description", "Actions"]}>
          {expenses.map((e) => (
            <TableRow key={e.id}>
              <TableCell className="font-medium">{e.id}</TableCell>
              <TableCell>{e.trip_id}</TableCell>
              <TableCell>{e.category}</TableCell>
              <TableCell className="text-green-600">${e.amount?.toFixed(2)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{e.description}</TableCell>
              <TableCell>
                <button
                  onClick={() => handleDelete(e.id)}
                  disabled={isDeleting && deleteId === e.id}
                  className="hover:text-destructive transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </DataTable>
      </div>
    </Layout>
  );
}
