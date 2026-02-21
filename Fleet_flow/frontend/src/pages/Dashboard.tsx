import Layout from "@/components/Layout";
import KPICard from "@/components/KPICard";
import SearchFilterBar from "@/components/SearchFilterBar";
import DataTable, { TableRow, TableCell } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { Truck, AlertTriangle, Activity, Package } from "lucide-react";

const trips = [
  { trip: "TR-1001", vehicle: "TRK-A12", driver: "John Smith", status: "In Transit" },
  { trip: "TR-1002", vehicle: "VAN-B03", driver: "Sarah Lee", status: "Delivered" },
  { trip: "TR-1003", vehicle: "TRK-C07", driver: "Mike Brown", status: "Pending" },
  { trip: "TR-1004", vehicle: "TRK-D15", driver: "Lisa Chen", status: "In Transit" },
  { trip: "TR-1005", vehicle: "VAN-E09", driver: "Alex Kim", status: "Completed" },
];

export default function Dashboard() {
  return (
    <Layout>
      <div className="page-container">
        <h1 className="text-xl font-bold text-foreground">Command Center</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Active Fleet" value={42} icon={Truck} color="blue" />
          <KPICard title="Maintenance Alert" value={7} icon={AlertTriangle} color="red" />
          <KPICard title="Utilization Rate" value="87%" icon={Activity} color="green" />
          <KPICard title="Pending Cargo" value={15} icon={Package} color="amber" />
        </div>

        <SearchFilterBar
          searchPlaceholder="Search trips..."
          groupByOptions={["Vehicle", "Driver", "Status"]}
          filterOptions={["All", "In Transit", "Pending", "Delivered", "Completed"]}
          sortOptions={["Newest", "Oldest", "Vehicle"]}
        />

        <DataTable columns={["Trip", "Vehicle", "Driver", "Status"]}>
          {trips.map((t) => (
            <TableRow key={t.trip}>
              <TableCell className="font-medium">{t.trip}</TableCell>
              <TableCell>{t.vehicle}</TableCell>
              <TableCell>{t.driver}</TableCell>
              <TableCell><StatusBadge status={t.status} /></TableCell>
            </TableRow>
          ))}
        </DataTable>
      </div>
    </Layout>
  );
}
