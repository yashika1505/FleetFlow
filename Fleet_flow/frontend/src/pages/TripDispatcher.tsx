import Layout from "@/components/Layout";
import SearchFilterBar from "@/components/SearchFilterBar";
import DataTable, { TableRow, TableCell } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";

const trips = [
  { type: "Long Haul", origin: "Jakarta", destination: "Surabaya", status: "In Transit" },
  { type: "Local", origin: "Bandung", destination: "Bogor", status: "Delivered" },
  { type: "Express", origin: "Semarang", destination: "Yogyakarta", status: "Pending" },
  { type: "Long Haul", origin: "Medan", destination: "Palembang", status: "Scheduled" },
];

export default function TripDispatcher() {
  return (
    <Layout>
      <div className="page-container">
        <h1 className="text-xl font-bold text-foreground">Trip Dispatcher</h1>

        <SearchFilterBar
          searchPlaceholder="Search trips..."
          groupByOptions={["Fleet Type", "Status"]}
          filterOptions={["All", "In Transit", "Pending", "Delivered", "Scheduled"]}
          sortOptions={["Newest", "Origin", "Destination"]}
        />

        <DataTable columns={["Trip Fleet Type", "Origin", "Destination", "Status"]}>
          {trips.map((t, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">{t.type}</TableCell>
              <TableCell>{t.origin}</TableCell>
              <TableCell>{t.destination}</TableCell>
              <TableCell><StatusBadge status={t.status} /></TableCell>
            </TableRow>
          ))}
        </DataTable>

        <div className="dashboard-card space-y-4">
          <h2 className="text-base font-semibold text-foreground">Dispatch New Trip</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Select Vehicle</label>
              <select className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30">
                <option>TRK-A12</option>
                <option>VAN-B03</option>
                <option>TRK-C07</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Cargo Weight (kg)</label>
              <input type="number" className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Select Driver</label>
              <select className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30">
                <option>John Smith</option>
                <option>Sarah Lee</option>
                <option>Mike Brown</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Origin Address</label>
              <input className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Destination</label>
              <input className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Estimated Fuel Cost</label>
              <input type="number" className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30" />
            </div>
          </div>
          <button className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            Confirm & Dispatch
          </button>
        </div>
      </div>
    </Layout>
  );
}
