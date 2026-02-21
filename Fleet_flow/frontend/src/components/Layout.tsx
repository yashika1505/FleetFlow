import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Truck,
  Navigation,
  Wrench,
  DollarSign,
  Users,
  BarChart3,
  Menu,
  X,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Vehicle Registry", path: "/vehicles", icon: Truck },
  { label: "Trip Dispatcher", path: "/trips", icon: Navigation },
  { label: "Maintenance", path: "/maintenance", icon: Wrench },
  { label: "Expense & Fuel", path: "/expenses", icon: DollarSign },
  { label: "Driver Profiles", path: "/drivers", icon: Users },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <span className="text-lg font-bold tracking-tight text-foreground">
            Fleet Flow
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-4.5 w-4.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-5 py-3 max-w-[1400px] mx-auto">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-semibold text-foreground"
          >
            <Menu className="h-5 w-5" />
            <span>Fleet Flow</span>
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/auth")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-destructive/30 text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
            <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity">
              JD
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main>{children}</main>
    </div>
  );
}
