import { Invoice } from "@/types/invoice";
import { StatusBadge } from "./StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface InvoiceCardProps {
  invoice: Invoice;
  onView?: (invoice: Invoice) => void;
  onEdit?: (invoice: Invoice) => void;
  onDelete?: (invoice: Invoice) => void;
}

export const InvoiceCard = ({ invoice, onView, onEdit, onDelete }: InvoiceCardProps) => {
  return (
    <Card className="glass-card p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{invoice.invoiceNumber}</h3>
            <p className="text-sm text-muted-foreground">{invoice.clientName}</p>
          </div>
        </div>
        <StatusBadge status={invoice.status} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Issue Date</p>
          <p className="text-sm font-medium">
            {format(new Date(invoice.issueDate), "MMM dd, yyyy")}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Due Date</p>
          <p className="text-sm font-medium">
            {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
          </p>
        </div>
      </div>

      <div className="mb-4 pt-4 border-t border-border">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total Amount</span>
          <span className="text-2xl font-bold text-gradient">
            ${invoice.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        {onView && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(invoice)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        )}
        {onEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(invoice)}
            className="flex-1"
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
        )}
        {onDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(invoice)}
            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  );
};
