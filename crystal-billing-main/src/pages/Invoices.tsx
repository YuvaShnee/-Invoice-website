import { useState, useMemo } from "react";
import { Navigation } from "@/components/Navigation";
import { InvoiceCard } from "@/components/InvoiceCard";
import { useInvoices } from "@/hooks/useInvoices";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { InvoiceStatus } from "@/types/invoice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Invoices = () => {
  const { invoices, loading, deleteInvoice } = useInvoices();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">("all");

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesSearch =
        invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchQuery, statusFilter]);

  const handleDelete = (invoice: any) => {
    if (confirm(`Are you sure you want to delete ${invoice.invoiceNumber}?`)) {
      deleteInvoice(invoice.id);
      toast.success("Invoice deleted successfully");
    }
  };

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
        <h2 className="text-3xl font-bold mb-2">Invoices</h2>
        <p className="text-muted-foreground">Manage all your invoices in one place.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by invoice number or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
          <SelectTrigger className="w-full md:w-[200px] glass">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={() => navigate("/create-invoice")} className="gradient-primary">
          Create Invoice
        </Button>
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-muted-foreground text-lg">No invoices found.</p>
          <Button onClick={() => navigate("/create-invoice")} className="mt-4">
            Create Your First Invoice
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvoices.map((invoice) => (
            <InvoiceCard
              key={invoice.id}
              invoice={invoice}
              onView={(inv) => toast.info(`Viewing ${inv.invoiceNumber}`)}
              onEdit={(inv) => toast.info(`Editing ${inv.invoiceNumber}`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Invoices;
