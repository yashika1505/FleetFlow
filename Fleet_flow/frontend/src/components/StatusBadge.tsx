const statusStyles: Record<string, string> = {
  Available: "bg-status-available-bg text-status-available",
  "On Trip": "bg-status-on-trip-bg text-status-on-trip",
  "In Shop": "bg-status-in-shop-bg text-status-in-shop",
  Pending: "bg-status-pending-bg text-status-pending",
  Completed: "bg-status-completed-bg text-status-completed",
  "In Transit": "bg-status-on-trip-bg text-status-on-trip",
  Scheduled: "bg-status-pending-bg text-status-pending",
  Delivered: "bg-status-completed-bg text-status-completed",
  Paid: "bg-status-completed-bg text-status-completed",
  Unpaid: "bg-status-in-shop-bg text-status-in-shop",
};

export default function StatusBadge({ status }: { status: string }) {
  const style = statusStyles[status] || "bg-muted text-muted-foreground";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {status}
    </span>
  );
}
