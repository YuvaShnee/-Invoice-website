import { Card } from "@/components/ui/card";
import { useClients } from "@/hooks/useClients";
import { calculateRiskScore, calculateReliabilityScore, calculateAveragePaymentDays } from "@/lib/aiPredictions";
import { AlertTriangle, TrendingUp, Clock } from "lucide-react";

export const ClientRiskDashboard = () => {
  const { clients } = useClients();
  
  const clientsWithScores = clients.map(client => ({
    ...client,
    riskScore: calculateRiskScore(client),
    reliabilityScore: calculateReliabilityScore(client),
    averagePaymentDays: calculateAveragePaymentDays(client.paymentHistory || []),
  })).sort((a, b) => b.riskScore - a.riskScore); // Sort by highest risk first

  return (
    <Card className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">📊 Client Intelligence</h3>
      </div>
      
      <div className="space-y-3">
        {clientsWithScores.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No client data available yet
          </p>
        ) : (
          clientsWithScores.map((client) => (
            <div 
              key={client.id} 
              className="p-4 bg-card/50 rounded-lg border border-border hover:bg-card/80 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold mb-1">{client.name}</h4>
                  <p className="text-xs text-muted-foreground">{client.email}</p>
                </div>
                
                <span 
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    client.riskScore > 70 
                      ? 'bg-red-500/20 text-red-600' 
                      : client.riskScore > 40
                      ? 'bg-yellow-500/20 text-yellow-600'
                      : 'bg-green-500/20 text-green-600'
                  }`}
                >
                  Risk: {client.riskScore}%
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Avg. Payment</p>
                    <p className="text-sm font-medium">{client.averagePaymentDays} days</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Reliability</p>
                    <p className="text-sm font-medium">{client.reliabilityScore}/100</p>
                  </div>
                </div>
              </div>
              
              {(client.paymentHistory?.length || 0) > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Based on {client.paymentHistory?.length} payment{client.paymentHistory?.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
