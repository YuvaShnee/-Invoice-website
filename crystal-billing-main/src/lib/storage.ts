import { Invoice, Client } from "@/types/invoice";

const INVOICES_KEY = "invoices";
const CLIENTS_KEY = "clients";

export const storage = {
  // Invoices
  getInvoices: (): Invoice[] => {
    const data = localStorage.getItem(INVOICES_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveInvoices: (invoices: Invoice[]): void => {
    localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
  },

  addInvoice: (invoice: Invoice): void => {
    const invoices = storage.getInvoices();
    storage.saveInvoices([...invoices, invoice]);
  },

  updateInvoice: (id: string, updates: Partial<Invoice>): void => {
    const invoices = storage.getInvoices();
    const updated = invoices.map((inv) =>
      inv.id === id ? { ...inv, ...updates } : inv
    );
    storage.saveInvoices(updated);
  },

  deleteInvoice: (id: string): void => {
    const invoices = storage.getInvoices();
    storage.saveInvoices(invoices.filter((inv) => inv.id !== id));
  },

  // Clients
  getClients: (): Client[] => {
    const data = localStorage.getItem(CLIENTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveClients: (clients: Client[]): void => {
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
  },

  addClient: (client: Client): void => {
    const clients = storage.getClients();
    storage.saveClients([...clients, client]);
  },

  updateClient: (id: string, updates: Partial<Client>): void => {
    const clients = storage.getClients();
    const updated = clients.map((client) =>
      client.id === id ? { ...client, ...updates } : client
    );
    storage.saveClients(updated);
  },

  deleteClient: (id: string): void => {
    const clients = storage.getClients();
    storage.saveClients(clients.filter((client) => client.id !== id));
  },
};
