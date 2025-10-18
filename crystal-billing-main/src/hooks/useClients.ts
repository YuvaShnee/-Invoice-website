import { useState, useEffect } from "react";
import { Client } from "@/types/invoice";
import { storage } from "@/lib/storage";
import { sampleClients } from "@/lib/sampleData";

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize with sample data if empty
    const storedClients = storage.getClients();
    if (storedClients.length === 0) {
      storage.saveClients(sampleClients);
      setClients(sampleClients);
    } else {
      setClients(storedClients);
    }
    setLoading(false);
  }, []);

  const addClient = (client: Client) => {
    storage.addClient(client);
    setClients([...clients, client]);
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    storage.updateClient(id, updates);
    setClients(
      clients.map((client) => (client.id === id ? { ...client, ...updates } : client))
    );
  };

  const deleteClient = (id: string) => {
    storage.deleteClient(id);
    setClients(clients.filter((client) => client.id !== id));
  };

  return {
    clients,
    loading,
    addClient,
    updateClient,
    deleteClient,
  };
};
