import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { useInvoices } from "@/hooks/useInvoices";
import { useClients } from "@/hooks/useClients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { InvoiceItem, InvoiceStatus } from "@/types/invoice";
import { OCRInvoiceUpload } from "@/components/OCRInvoiceUpload";
import { calculateTax, COUNTRIES, getStatesForCountry } from "@/lib/taxCalculation";
import { Textarea } from "@/components/ui/textarea";

const CreateInvoice = () => {
  const navigate = useNavigate();
  const { addInvoice } = useInvoices();
  const { clients } = useClients();

  const [formData, setFormData] = useState({
    clientId: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    status: "draft" as InvoiceStatus,
    notes: "",
    country: "US",
    state: "CA",
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", description: "", quantity: 1, rate: 0, amount: 0 },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), description: "", quantity: 1, rate: 0, amount: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          updated.amount = updated.quantity * updated.rate;
          return updated;
        }
        return item;
      })
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxCalculation = calculateTax(subtotal, formData.country, formData.state);
  const tax = taxCalculation.taxAmount;
  const total = taxCalculation.total;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientId || !formData.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const client = clients.find((c) => c.id === formData.clientId);
    if (!client) {
      toast.error("Please select a valid client");
      return;
    }

    const invoice = {
      id: Date.now().toString(),
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      clientId: formData.clientId,
      clientName: client.name,
      status: formData.status,
      issueDate: formData.issueDate,
      dueDate: formData.dueDate,
      items,
      subtotal,
      tax,
      total,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
    };

    addInvoice(invoice);
    toast.success("Invoice created successfully!");
    navigate("/invoices");
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <Navigation />

      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate("/invoices")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Invoices
        </Button>
        <h2 className="text-3xl font-bold mb-2">Create Invoice</h2>
        <p className="text-muted-foreground">Fill in the details to create a new invoice.</p>
      </div>

      <OCRInvoiceUpload 
        onDataExtracted={(data) => {
          // Auto-fill form fields from OCR
          if (data.invoiceNumber) {
            // Could update invoice number if needed
          }
          if (data.issueDate) {
            setFormData(prev => ({ ...prev, issueDate: data.issueDate! }));
          }
          if (data.dueDate) {
            setFormData(prev => ({ ...prev, dueDate: data.dueDate! }));
          }
          if (data.notes) {
            setFormData(prev => ({ ...prev, notes: data.notes! }));
          }
          
          // Try to match client
          if (data.clientName) {
            const matchedClient = clients.find(c => 
              c.name.toLowerCase().includes(data.clientName!.toLowerCase())
            );
            if (matchedClient) {
              setFormData(prev => ({ ...prev, clientId: matchedClient.id }));
            } else {
              toast.info(`Client "${data.clientName}" not found. Please select from dropdown.`);
            }
          }
          
          // Fill in items
          if (data.items && data.items.length > 0) {
            setItems(data.items.map((item, idx) => ({
              id: Date.now().toString() + idx,
              description: item.description,
              quantity: item.quantity,
              rate: item.rate,
              amount: item.quantity * item.rate,
            })));
          }
        }}
      />

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <Card className="glass-card p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Invoice Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client">Client *</Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) => setFormData({ ...formData, clientId: value })}
              >
                <SelectTrigger id="client">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: InvoiceStatus) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="issueDate">Issue Date *</Label>
              <Input
                id="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Tax Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="country">Country *</Label>
              <Select
                value={formData.country}
                onValueChange={(value) => setFormData({ ...formData, country: value, state: "" })}
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {getStatesForCountry(formData.country).length > 0 && (
              <div>
                <Label htmlFor="state">State/Province</Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) => setFormData({ ...formData, state: value })}
                >
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {getStatesForCountry(formData.country).map((state) => (
                      <SelectItem key={state.code} value={state.code}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Tax Rate: {taxCalculation.taxRate.toFixed(2)}%
          </p>
        </Card>

        <Card className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Line Items</h3>
            <Button type="button" onClick={addItem} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-12 md:col-span-5">
                  <Label>Description</Label>
                  <Input
                    placeholder="Item description"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value))}
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <Label>Rate ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value))}
                  />
                </div>
                <div className="col-span-3 md:col-span-2">
                  <Label>Amount</Label>
                  <Input value={`$${item.amount.toFixed(2)}`} disabled />
                </div>
                <div className="col-span-1">
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Tax ({taxCalculation.taxRate.toFixed(2)}%):
                  </span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t border-border">
                  <span>Total:</span>
                  <span className="text-gradient">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6 mb-6">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Additional notes or terms..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
          />
        </Card>

        <div className="flex gap-4">
          <Button type="submit" className="gradient-primary">
            Create Invoice
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/invoices")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;
