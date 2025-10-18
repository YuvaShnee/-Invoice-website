import { KPICard } from "@/components/KPICard";
import { Navigation } from "@/components/Navigation";
import { useInvoices } from "@/hooks/useInvoices";
import { DollarSign, FileText, Clock, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subMonths } from "date-fns";
import { useMemo } from "react";
import { CashFlowForecast } from "@/components/CashFlowForecast";
import { ClientRiskDashboard } from "@/components/ClientRiskDashboard";

const Dashboard = () => {
  const { invoices, loading } = useInvoices();

  const kpis = useMemo(() => {
    const totalRevenue = invoices
      .filter((inv) => inv.status === "paid")
      .reduce((sum, inv) => sum + inv.total, 0);

    const pendingAmount = invoices
      .filter((inv) => inv.status === "pending")
      .reduce((sum, inv) => sum + inv.total, 0);

    const overdueAmount = invoices
      .filter((inv) => inv.status === "overdue")
      .reduce((sum, inv) => sum + inv.total, 0);

    return {
      totalRevenue,
      pendingInvoices: invoices.filter((inv) => inv.status === "pending").length,
      paidInvoices: invoices.filter((inv) => inv.status === "paid").length,
      overdueInvoices: invoices.filter((inv) => inv.status === "overdue").length,
      pendingAmount,
      overdueAmount,
    };
  }, [invoices]);

  const chartData = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), 5 - i);
      return {
        month: format(date, "MMM"),
        revenue: 0,
      };
    });

    invoices
      .filter((inv) => inv.status === "paid")
      .forEach((inv) => {
        const monthIndex = months.findIndex(
          (m) => m.month === format(new Date(inv.issueDate), "MMM")
        );
        if (monthIndex !== -1) {
          months[monthIndex].revenue += inv.total;
        }
      });

    return months;
  }, [invoices]);

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <Navigation />
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <Navigation />

      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Revenue"
          value={`$${kpis.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          trend={{ value: "12.5%", isPositive: true }}
        />
        <KPICard
          title="Pending Invoices"
          value={kpis.pendingInvoices}
          icon={Clock}
          className="hover:shadow-warning/20"
        />
        <KPICard
          title="Paid Invoices"
          value={kpis.paidInvoices}
          icon={FileText}
          trend={{ value: "8.2%", isPositive: true }}
        />
        <KPICard
          title="Overdue"
          value={kpis.overdueInvoices}
          icon={AlertCircle}
          className="hover:shadow-destructive/20"
        />
      </div>

      <Card className="glass-card p-6 mb-8">
        <h3 className="text-xl font-semibold mb-6">Revenue Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" className="text-muted-foreground" />
            <YAxis className="text-muted-foreground" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--primary))", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <CashFlowForecast />
        
        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-muted-foreground">Pending Amount</span>
              <span className="font-semibold text-warning">
                ${kpis.pendingAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-muted-foreground">Overdue Amount</span>
              <span className="font-semibold text-destructive">
                ${kpis.overdueAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Invoices</span>
              <span className="font-semibold">{invoices.length}</span>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClientRiskDashboard />

        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {invoices.slice(0, 5).map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{invoice.invoiceNumber}</p>
                  <p className="text-xs text-muted-foreground">{invoice.clientName}</p>
                </div>
                <span className="text-sm font-semibold">
                  ${invoice.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
