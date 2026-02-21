import { useState } from "react";
import Layout from "@/components/Layout";
import SearchFilterBar from "@/components/SearchFilterBar";
import DataTable, { TableRow, TableCell } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { Plus, Trash2 } from "lucide-react";

const vehicles = [
  { sn: 1, plate: "ABC-1234", model: "Isuzu NQR", type: "Truck", capacity: "5,000 kg", odometer: "45,230 km", status: "Available" },
  { sn: 2, plate: "DEF-5678", model: "Toyota HiAce", type: "Van", capacity: "1,200 kg", odometer: "32,100 km", status: "On Trip" },
  { sn: 3, plate: "GHI-9012", model: "Hino 500", type: "Truck", capacity: "10,000 kg", odometer: "78,500 km", status: "In Shop" },
  { sn: 4, plate: "JKL-3456", model: "Ford Transit", type: "Van", capacity: "1,500 kg", odometer: "21,800 km", status: "Available" },
  { sn: 5, plate: "MNO-7890", model: "Volvo FH16", type: "Truck", capacity: "25,000 kg", odometer: "120,000 km", status: "On Trip" },
];

export default function VehicleRegistry() {
  const [showForm, setShowForm] = useState(false);

  return (
    <Layout>
      <div className="page-container">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Vehicle Registry</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" /> New Vehicle
          </button>
        </div>

        {showForm && (
          <div className="dashboard-card space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {["License Plate Number", "Max Payload", "Initial Odometer", "Type", "Model"].map((label) => (
                <div key={label} className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">{label}</label>
                  <input className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30" />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Save</button>
              <button className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-1">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        )}

        <SearchFilterBar
          searchPlaceholder="Search vehicles..."
          groupByOptions={["Type", "Status", "Model"]}
          filterOptions={["All", "Available", "On Trip", "In Shop"]}
          sortOptions={["Plate", "Model", "Capacity"]}
        />

        <DataTable columns={["S/N", "Plate", "Model", "Type", "Capacity", "Odometer", "Status", "Actions"]}>
          {vehicles.map((v) => (
            <TableRow key={v.plate}>
              <TableCell>{v.sn}</TableCell>
              <TableCell className="font-medium">{v.plate}</TableCell>
              <TableCell>{v.model}</TableCell>
              <TableCell>{v.type}</TableCell>
              <TableCell>{v.capacity}</TableCell>
              <TableCell>{v.odometer}</TableCell>
              <TableCell><StatusBadge status={v.status} /></TableCell>
              <TableCell>
                <button className="text-sm text-primary hover:underline">Edit</button>
              </TableCell>
            </TableRow>
          ))}
        </DataTable>
      </div>
    </Layout>
  );
}
