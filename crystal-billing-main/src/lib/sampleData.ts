import { Invoice, Client, InvoiceStatus, PaymentHistory } from "@/types/invoice";

export const sampleClients: Client[] = [
  {
    id: "1",
    name: "Acme Corporation",
    email: "contact@acme.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business St, New York, NY 10001",
    createdAt: "2024-01-15T10:00:00Z",
    paymentHistory: [
      { invoiceId: "1", paidDate: "2024-09-28T00:00:00Z", daysToPay: 27, amount: 7150 },
      { invoiceId: "6", paidDate: "2024-09-10T00:00:00Z", daysToPay: 26, amount: 2200 },
    ],
    averagePaymentDays: 26.5,
    reliabilityScore: 87,
    riskScore: 13,
  },
  {
    id: "2",
    name: "TechStart Inc",
    email: "info@techstart.io",
    phone: "+1 (555) 234-5678",
    address: "456 Innovation Ave, San Francisco, CA 94102",
    createdAt: "2024-02-10T14:30:00Z",
    paymentHistory: [],
    averagePaymentDays: 30,
    reliabilityScore: 50,
    riskScore: 50,
  },
  {
    id: "3",
    name: "Global Dynamics",
    email: "billing@globaldynamics.com",
    phone: "+1 (555) 345-6789",
    address: "789 Enterprise Blvd, Chicago, IL 60601",
    createdAt: "2024-01-20T09:15:00Z",
    paymentHistory: [],
    averagePaymentDays: 30,
    reliabilityScore: 50,
    riskScore: 50,
  },
  {
    id: "4",
    name: "Creative Studios",
    email: "hello@creativestudios.com",
    phone: "+1 (555) 456-7890",
    address: "321 Design Lane, Los Angeles, CA 90001",
    createdAt: "2024-03-05T16:45:00Z",
    paymentHistory: [
      { invoiceId: "4", paidDate: "2024-10-05T00:00:00Z", daysToPay: 25, amount: 6050 },
    ],
    averagePaymentDays: 25,
    reliabilityScore: 85,
    riskScore: 15,
  },
  {
    id: "5",
    name: "NextGen Solutions",
    email: "contact@nextgen.tech",
    phone: "+1 (555) 567-8901",
    address: "654 Future St, Austin, TX 78701",
    createdAt: "2024-02-28T11:20:00Z",
    paymentHistory: [
      { invoiceId: "10", paidDate: "2024-10-02T00:00:00Z", daysToPay: 27, amount: 12650 },
    ],
    averagePaymentDays: 27,
    reliabilityScore: 86,
    riskScore: 14,
  },
];

const generateInvoice = (
  id: string,
  invoiceNumber: string,
  clientId: string,
  clientName: string,
  status: InvoiceStatus,
  issueDate: string,
  dueDate: string,
  items: { description: string; quantity: number; rate: number }[]
): Invoice => {
  const invoiceItems = items.map((item, index) => ({
    id: `${id}-item-${index}`,
    ...item,
    amount: item.quantity * item.rate,
  }));

  const subtotal = invoiceItems.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return {
    id,
    invoiceNumber,
    clientId,
    clientName,
    status,
    issueDate,
    dueDate,
    items: invoiceItems,
    subtotal,
    tax,
    total,
    createdAt: issueDate,
  };
};

export const sampleInvoices: Invoice[] = [
  generateInvoice(
    "1",
    "INV-001",
    "1",
    "Acme Corporation",
    "paid",
    "2024-09-01T00:00:00Z",
    "2024-09-30T00:00:00Z",
    [
      { description: "Website Design", quantity: 1, rate: 5000 },
      { description: "Logo Design", quantity: 1, rate: 1500 },
    ]
  ),
  generateInvoice(
    "2",
    "INV-002",
    "2",
    "TechStart Inc",
    "pending",
    "2024-09-15T00:00:00Z",
    "2024-10-15T00:00:00Z",
    [
      { description: "Mobile App Development", quantity: 80, rate: 150 },
      { description: "Testing & QA", quantity: 20, rate: 100 },
    ]
  ),
  generateInvoice(
    "3",
    "INV-003",
    "3",
    "Global Dynamics",
    "overdue",
    "2024-08-01T00:00:00Z",
    "2024-08-31T00:00:00Z",
    [
      { description: "Consulting Services", quantity: 40, rate: 200 },
    ]
  ),
  generateInvoice(
    "4",
    "INV-004",
    "4",
    "Creative Studios",
    "paid",
    "2024-09-10T00:00:00Z",
    "2024-10-10T00:00:00Z",
    [
      { description: "Brand Identity Package", quantity: 1, rate: 3500 },
      { description: "Social Media Graphics", quantity: 10, rate: 200 },
    ]
  ),
  generateInvoice(
    "5",
    "INV-005",
    "5",
    "NextGen Solutions",
    "pending",
    "2024-09-20T00:00:00Z",
    "2024-10-20T00:00:00Z",
    [
      { description: "Cloud Infrastructure Setup", quantity: 1, rate: 4000 },
      { description: "Security Audit", quantity: 1, rate: 2500 },
    ]
  ),
  generateInvoice(
    "6",
    "INV-006",
    "1",
    "Acme Corporation",
    "paid",
    "2024-08-15T00:00:00Z",
    "2024-09-15T00:00:00Z",
    [
      { description: "SEO Optimization", quantity: 1, rate: 2000 },
    ]
  ),
  generateInvoice(
    "7",
    "INV-007",
    "2",
    "TechStart Inc",
    "draft",
    "2024-09-25T00:00:00Z",
    "2024-10-25T00:00:00Z",
    [
      { description: "API Integration", quantity: 30, rate: 180 },
    ]
  ),
  generateInvoice(
    "8",
    "INV-008",
    "3",
    "Global Dynamics",
    "pending",
    "2024-09-18T00:00:00Z",
    "2024-10-18T00:00:00Z",
    [
      { description: "Database Design", quantity: 1, rate: 3000 },
      { description: "Data Migration", quantity: 1, rate: 2000 },
    ]
  ),
  generateInvoice(
    "9",
    "INV-009",
    "4",
    "Creative Studios",
    "overdue",
    "2024-07-20T00:00:00Z",
    "2024-08-20T00:00:00Z",
    [
      { description: "Video Production", quantity: 1, rate: 8000 },
    ]
  ),
  generateInvoice(
    "10",
    "INV-010",
    "5",
    "NextGen Solutions",
    "paid",
    "2024-09-05T00:00:00Z",
    "2024-10-05T00:00:00Z",
    [
      { description: "DevOps Setup", quantity: 60, rate: 175 },
      { description: "Documentation", quantity: 20, rate: 100 },
    ]
  ),
];
