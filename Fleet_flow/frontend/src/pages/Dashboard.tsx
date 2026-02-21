import { useState } from "react";
import Layout from "@/components/Layout";
import KPICard from "@/components/KPICard";
import SearchFilterBar from "@/components/SearchFilterBar";
import DataTable, { TableRow, TableCell } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { Truck, AlertTriangle, Activity, Package, Loader, AlertCircle } from "lucide-react";
import { useFetchTrips } from "@/hooks/useFetchTrips";
import { tripService } from "@/api/services";

export default function Dashboard() {
  const { trips, loading, error, refetch } = useFetchTrips();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch = 
      trip.id.toString().includes(searchTerm.toLowerCase()) ||
      trip.source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destination?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter =
      filterStatus === "All" || trip.status?.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const handleDeleteTrip = async (id: number) => {
    if (confirm("Are you sure you want to delete this trip?")) {
      try {
        await tripService.deleteTrip(id);
        await refetch();
      } catch (err) {
        console.error("Error deleting trip:", err);
        alert("Failed to delete trip");
      }
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
        <h1 className="text-xl font-bold text-foreground">Command Center</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Active Fleet" value={trips.length} icon={Truck} color="blue" />
          <KPICard title="Pending Trips" value={trips.filter(t => t.status === "Pending").length} icon={AlertTriangle} color="red" />
          <KPICard title="In Transit" value={trips.filter(t => t.status === "In Transit").length} icon={Activity} color="green" />
          <KPICard title="Completed" value={trips.filter(t => t.status === "Completed").length} icon={Package} color="amber" />
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

        <SearchFilterBar
          searchPlaceholder="Search trips..."
          groupByOptions={["Vehicle", "Driver", "Status"]}
          filterOptions={["All", "In Transit", "Pending", "Delivered", "Completed"]}
          sortOptions={["Newest", "Oldest", "Vehicle"]}
        />

        <DataTable columns={["Trip ID", "Source", "Destination", "Status", "Actions"]}>
          {filteredTrips.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="font-medium">{t.id}</TableCell>
              <TableCell>{t.source}</TableCell>
              <TableCell>{t.destination}</TableCell>
              <TableCell><StatusBadge status={t.status} /></TableCell>
              <TableCell>
                <button 
                  onClick={() => handleDeleteTrip(t.id)}
                  className="text-sm text-destructive hover:underline"
                >
                  Delete
                </button>
              </TableCell>
            </TableRow>
          ))}
        </DataTable>
      </div>
    </Layout>
  );
}
