import { InvoiceStatus } from "@/types/invoice";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle, FileEdit } from "lucide-react";

interface StatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = {
    paid: {
      label: "Paid",
      variant: "default" as const,
      icon: CheckCircle2,
      className: "bg-success text-success-foreground hover:bg-success/90",
    },
    pending: {
      label: "Pending",
      variant: "secondary" as const,
      icon: Clock,
      className: "bg-warning text-warning-foreground hover:bg-warning/90",
    },
    overdue: {
      label: "Overdue",
      variant: "destructive" as const,
      icon: AlertCircle,
      className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    },
    draft: {
      label: "Draft",
      variant: "outline" as const,
      icon: FileEdit,
      className: "border-muted-foreground/20 text-muted-foreground",
    },
  };

  const { label, icon: Icon, className: statusClassName } = config[status];

  return (
    <Badge className={`${statusClassName} ${className} flex items-center gap-1 w-fit`}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
};
