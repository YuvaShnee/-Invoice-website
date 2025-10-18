import { Client, Invoice, PaymentHistory } from "@/types/invoice";

export const calculateAveragePaymentDays = (paymentHistory: PaymentHistory[]): number => {
  if (!paymentHistory || paymentHistory.length === 0) return 30; // Default
  
  const totalDays = paymentHistory.reduce((sum, payment) => sum + payment.daysToPay, 0);
  return Math.round(totalDays / paymentHistory.length);
};

export const calculateReliabilityScore = (client: Client): number => {
  const history = client.paymentHistory || [];
  if (history.length === 0) return 50; // Neutral score for new clients
  
  // Score based on payment consistency
  const avgDays = calculateAveragePaymentDays(history);
  const onTimePayments = history.filter(p => p.daysToPay <= 30).length;
  const onTimeRate = onTimePayments / history.length;
  
  // Higher score for faster, more consistent payments
  const speedScore = Math.max(0, 100 - avgDays);
  const consistencyScore = onTimeRate * 100;
  
  return Math.round((speedScore + consistencyScore) / 2);
};

export const calculateRiskScore = (client: Client): number => {
  const reliability = calculateReliabilityScore(client);
  return Math.round(100 - reliability); // Inverse of reliability
};

export const predictPaymentDate = (clientId: string, clients: Client[], invoiceDate: Date): Date => {
  const client = clients.find(c => c.id === clientId);
  
  if (!client || !client.paymentHistory || client.paymentHistory.length === 0) {
    // Default prediction: 30 days
    const predicted = new Date(invoiceDate);
    predicted.setDate(predicted.getDate() + 30);
    return predicted;
  }
  
  const avgDays = calculateAveragePaymentDays(client.paymentHistory);
  const predicted = new Date(invoiceDate);
  predicted.setDate(predicted.getDate() + avgDays);
  
  return predicted;
};

export const calculateConfidenceScore = (client: Client): number => {
  const history = client.paymentHistory || [];
  
  if (history.length === 0) return 30; // Low confidence for new clients
  if (history.length < 3) return 50;
  if (history.length < 5) return 70;
  
  // Higher confidence with more history and consistent behavior
  const reliability = calculateReliabilityScore(client);
  return Math.min(95, Math.round(reliability * 0.8 + history.length * 2));
};

export interface PredictedPayment {
  invoiceId: string;
  invoiceNumber: string;
  clientName: string;
  date: Date;
  amount: number;
  confidence: number;
}

export const generateCashFlowForecast = (invoices: Invoice[], clients: Client[]): PredictedPayment[] => {
  const pendingInvoices = invoices.filter(inv => inv.status === 'pending' || inv.status === 'overdue');
  
  const predictions = pendingInvoices.map(invoice => {
    const client = clients.find(c => c.id === invoice.clientId);
    const predictedDate = predictPaymentDate(invoice.clientId, clients, new Date(invoice.dueDate));
    const confidence = client ? calculateConfidenceScore(client) : 30;
    
    return {
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      clientName: invoice.clientName,
      date: predictedDate,
      amount: invoice.total,
      confidence,
    };
  });
  
  // Sort by predicted date
  return predictions.sort((a, b) => a.date.getTime() - b.date.getTime());
};

export const updatePaymentHistory = (client: Client, invoice: Invoice, paidDate: Date): Client => {
  const issueDate = new Date(invoice.issueDate);
  const daysToPay = Math.floor((paidDate.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const newPayment: PaymentHistory = {
    invoiceId: invoice.id,
    paidDate: paidDate.toISOString(),
    daysToPay,
    amount: invoice.total,
  };
  
  const updatedHistory = [...(client.paymentHistory || []), newPayment];
  
  return {
    ...client,
    paymentHistory: updatedHistory,
    averagePaymentDays: calculateAveragePaymentDays(updatedHistory),
    reliabilityScore: calculateReliabilityScore({ ...client, paymentHistory: updatedHistory }),
    riskScore: calculateRiskScore({ ...client, paymentHistory: updatedHistory }),
  };
};
