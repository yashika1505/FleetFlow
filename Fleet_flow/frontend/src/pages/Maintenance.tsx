import { useState } from "react";
import Layout from "@/components/Layout";
import SearchFilterBar from "@/components/SearchFilterBar";
import DataTable, { TableRow, TableCell } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { Plus } from "lucide-react";

const logs = [
  { id: "MNT-001", vehicle: "TRK-A12", issue: "Oil Change", date: "2025-02-10", status: "Completed", cost: "$120" },
  { id: "MNT-002", vehicle: "VAN-B03", issue: "Brake Pads", date: "2025-02-12", status: "In Shop", cost: "$350" },
  { id: "MNT-003", vehicle: "TRK-C07", issue: "Tire Rotation", date: "2025-02-14", status: "Scheduled", cost: "$80" },
  { id: "MNT-004", vehicle: "TRK-D15", issue: "Engine Check", date: "2025-02-15", status: "Pending", cost: "$500" },
];

export default function Maintenance() {
  const [showForm, setShowForm] = useState(false);

  return (
    <Layout>
      <div className="page-container">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Maintenance</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" /> New Service
          </button>
        </div>

        {showForm && (
          <div className="dashboard-card space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {["Vehicle Name", "Issue / Service", "Date"].map((label) => (
                <div key={label} className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">{label}</label>
                  <input
                    type={label === "Date" ? "date" : "text"}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30"
                  />
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
          searchPlaceholder="Search maintenance logs..."
          groupByOptions={["Vehicle", "Status"]}
          filterOptions={["All", "Completed", "In Shop", "Scheduled", "Pending"]}
          sortOptions={["Date", "Cost", "Vehicle"]}
        />

        <DataTable columns={["Log ID", "Vehicle", "Issue/Service", "Date", "Status", "Cost"]}>
          {logs.map((l) => (
            <TableRow key={l.id}>
              <TableCell className="font-medium">{l.id}</TableCell>
              <TableCell>{l.vehicle}</TableCell>
              <TableCell>{l.issue}</TableCell>
              <TableCell>{l.date}</TableCell>
              <TableCell><StatusBadge status={l.status} /></TableCell>
              <TableCell>{l.cost}</TableCell>
            </TableRow>
          ))}
        </DataTable>
      </div>
    </Layout>
  );
}
