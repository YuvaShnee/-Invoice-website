export type InvoiceStatus = "paid" | "pending" | "overdue" | "draft";

export interface PaymentHistory {
  invoiceId: string;
  paidDate: string;
  daysToPay: number;
  amount: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
  paymentHistory?: PaymentHistory[];
  averagePaymentDays?: number;
  reliabilityScore?: number;
  riskScore?: number;
}

export interface TaxRate {
  country: string;
  state?: string;
  rate: number;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  createdAt: string;
}
