import { Card } from "@/components/ui/card";
import { useInvoices } from "@/hooks/useInvoices";
import { useClients } from "@/hooks/useClients";
import { generateCashFlowForecast } from "@/lib/aiPredictions";
import { TrendingUp, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";

export const CashFlowForecast = () => {
  const { invoices } = useInvoices();
  const { clients } = useClients();
  
  const forecast = generateCashFlowForecast(invoices, clients);
  const next30Days = forecast.filter(p => {
    const daysUntil = Math.floor((p.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 30 && daysUntil >= 0;
  });
  
  const expectedRevenue = next30Days.reduce((sum, p) => sum + p.amount, 0);

  return (
    <Card className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">💰 Cash Flow Forecast</h3>
      </div>
      
      <div className="mb-6 p-4 bg-primary/10 rounded-lg">
        <p className="text-sm text-muted-foreground mb-1">Expected Revenue (Next 30 Days)</p>
        <p className="text-3xl font-bold text-gradient">${expectedRevenue.toFixed(2)}</p>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground mb-3">
          AI-Predicted Incoming Payments
        </p>
        
        {next30Days.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No payments predicted in the next 30 days
          </p>
        ) : (
          next30Days.slice(0, 5).map((payment) => (
            <div 
              key={payment.invoiceId} 
              className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border hover:bg-card/80 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {format(payment.date, 'MMM dd, yyyy')}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{payment.clientName}</p>
                <p className="text-xs text-muted-foreground">{payment.invoiceNumber}</p>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end mb-1">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="font-semibold">${payment.amount.toFixed(2)}</span>
                </div>
                <span 
                  className={`text-xs px-2 py-1 rounded-full ${
                    payment.confidence > 70 
                      ? 'bg-green-500/20 text-green-600' 
                      : payment.confidence > 50
                      ? 'bg-yellow-500/20 text-yellow-600'
                      : 'bg-red-500/20 text-red-600'
                  }`}
                >
                  {payment.confidence}% confidence
                </span>
              </div>
            </div>
          ))
        )}
        
        {next30Days.length > 5 && (
          <p className="text-xs text-center text-muted-foreground pt-2">
            +{next30Days.length - 5} more predictions
          </p>
        )}
      </div>
    </Card>
  );
};
