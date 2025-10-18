import { useState, useEffect } from "react";
import { Invoice } from "@/types/invoice";
import { storage } from "@/lib/storage";
import { sampleInvoices } from "@/lib/sampleData";
import { updatePaymentHistory } from "@/lib/aiPredictions";

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize with sample data if empty
    const storedInvoices = storage.getInvoices();
    if (storedInvoices.length === 0) {
      storage.saveInvoices(sampleInvoices);
      setInvoices(sampleInvoices);
    } else {
      setInvoices(storedInvoices);
    }
    setLoading(false);
  }, []);

  const addInvoice = (invoice: Invoice) => {
    storage.addInvoice(invoice);
    setInvoices([...invoices, invoice]);
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    const invoice = invoices.find(inv => inv.id === id);
    
    // If status changed to 'paid', update client payment history
    if (invoice && updates.status === 'paid' && invoice.status !== 'paid') {
      const clients = storage.getClients();
      const client = clients.find(c => c.id === invoice.clientId);
      
      if (client) {
        const updatedClient = updatePaymentHistory(client, invoice, new Date());
        storage.updateClient(client.id, updatedClient);
      }
    }
    
    storage.updateInvoice(id, updates);
    setInvoices(
      invoices.map((inv) => (inv.id === id ? { ...inv, ...updates } : inv))
    );
  };

  const deleteInvoice = (id: string) => {
    storage.deleteInvoice(id);
    setInvoices(invoices.filter((inv) => inv.id !== id));
  };

  return {
    invoices,
    loading,
    addInvoice,
    updateInvoice,
    deleteInvoice,
  };
};
