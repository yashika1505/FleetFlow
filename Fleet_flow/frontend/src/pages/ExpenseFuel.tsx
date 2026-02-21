import { useState } from "react";
import Layout from "@/components/Layout";
import SearchFilterBar from "@/components/SearchFilterBar";
import DataTable, { TableRow, TableCell } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { Plus } from "lucide-react";

const expenses = [
  { trip: "TR-1001", driver: "John Smith", distance: "450 km", fuel: "$120", misc: "$25", status: "Paid" },
  { trip: "TR-1002", driver: "Sarah Lee", distance: "180 km", fuel: "$55", misc: "$10", status: "Unpaid" },
  { trip: "TR-1003", driver: "Mike Brown", distance: "620 km", fuel: "$175", misc: "$40", status: "Paid" },
  { trip: "TR-1004", driver: "Lisa Chen", distance: "310 km", fuel: "$90", misc: "$15", status: "Pending" },
];

export default function ExpenseFuel() {
  const [showForm, setShowForm] = useState(false);

  return (
    <Layout>
      <div className="page-container">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Expense & Fuel</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" /> New Expense
          </button>
        </div>

        {showForm && (
          <div className="dashboard-card space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {["Trip ID", "Driver", "Fuel Cost", "Misc Expense"].map((label) => (
                <div key={label} className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">{label}</label>
                  <input className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30" />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Create</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
            </div>
          </div>
        )}

        <SearchFilterBar
          searchPlaceholder="Search expenses..."
          groupByOptions={["Driver", "Status"]}
          filterOptions={["All", "Paid", "Unpaid", "Pending"]}
          sortOptions={["Trip ID", "Fuel Cost", "Distance"]}
        />

        <DataTable columns={["Trip ID", "Driver", "Distance", "Fuel Expense", "Misc Expense", "Status"]}>
          {expenses.map((e) => (
            <TableRow key={e.trip}>
              <TableCell className="font-medium">{e.trip}</TableCell>
              <TableCell>{e.driver}</TableCell>
              <TableCell>{e.distance}</TableCell>
              <TableCell>{e.fuel}</TableCell>
              <TableCell>{e.misc}</TableCell>
              <TableCell><StatusBadge status={e.status} /></TableCell>
            </TableRow>
          ))}
        </DataTable>
      </div>
    </Layout>
  );
}
