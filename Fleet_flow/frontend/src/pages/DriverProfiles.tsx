import Layout from "@/components/Layout";
import SearchFilterBar from "@/components/SearchFilterBar";
import DataTable, { TableRow, TableCell } from "@/components/DataTable";

const drivers = [
  { name: "John Smith", license: "DL-2024-001", expiry: "2026-08-15", completion: "96%", safety: 92, complaints: 1 },
  { name: "Sarah Lee", license: "DL-2024-002", expiry: "2025-12-20", completion: "89%", safety: 78, complaints: 3 },
  { name: "Mike Brown", license: "DL-2024-003", expiry: "2026-03-10", completion: "94%", safety: 88, complaints: 2 },
  { name: "Lisa Chen", license: "DL-2024-004", expiry: "2027-01-05", completion: "98%", safety: 95, complaints: 0 },
  { name: "Alex Kim", license: "DL-2024-005", expiry: "2025-06-30", completion: "82%", safety: 65, complaints: 5 },
];

function SafetyScore({ score }: { score: number }) {
  const color =
    score >= 90
      ? "text-status-available bg-status-available-bg"
      : score >= 75
      ? "text-status-in-shop bg-status-in-shop-bg"
      : "text-destructive bg-destructive/10";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {score}
    </span>
  );
}

export default function DriverProfiles() {
  return (
    <Layout>
      <div className="page-container">
        <h1 className="text-xl font-bold text-foreground">Driver Profiles</h1>

        <SearchFilterBar
          searchPlaceholder="Search drivers..."
          groupByOptions={["License", "Safety Score"]}
          filterOptions={["All", "Active", "Expired"]}
          sortOptions={["Name", "Safety Score", "Complaints"]}
        />

        <DataTable columns={["Name", "License Number", "Expiry", "Completion Rate", "Safety Score", "Complaints"]}>
          {drivers.map((d) => (
            <TableRow key={d.license}>
              <TableCell className="font-medium">{d.name}</TableCell>
              <TableCell>{d.license}</TableCell>
              <TableCell>{d.expiry}</TableCell>
              <TableCell>{d.completion}</TableCell>
              <TableCell><SafetyScore score={d.safety} /></TableCell>
              <TableCell>{d.complaints}</TableCell>
            </TableRow>
          ))}
        </DataTable>
      </div>
    </Layout>
  );
}
