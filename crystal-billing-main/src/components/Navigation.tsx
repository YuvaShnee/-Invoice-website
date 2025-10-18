import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Users, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/invoices", label: "Invoices", icon: FileText },
  { to: "/clients", label: "Clients", icon: Users },
  { to: "/create-invoice", label: "New Invoice", icon: PlusCircle },
];

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="glass-card p-4 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="gradient-primary p-2 rounded-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gradient">InvoiceTracker</h1>
        </div>
        
        <div className="flex gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-secondary"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
