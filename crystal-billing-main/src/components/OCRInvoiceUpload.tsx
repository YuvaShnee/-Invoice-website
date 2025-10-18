import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ExtractedData {
  invoiceNumber?: string;
  issueDate?: string;
  dueDate?: string;
  clientName?: string;
  clientEmail?: string;
  items?: Array<{
    description: string;
    quantity: number;
    rate: number;
  }>;
  subtotal?: number;
  tax?: number;
  total?: number;
  notes?: string;
}

interface OCRInvoiceUploadProps {
  onDataExtracted: (data: ExtractedData) => void;
}

export const OCRInvoiceUpload = ({ onDataExtracted }: OCRInvoiceUploadProps) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState<string>("");

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setLoading(true);
    setStatus('idle');
    setFileName(file.name);
    
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });

      const imageData = reader.result as string;
      
      console.log('Sending image to OCR function...');
      
      // Call edge function
      const { data, error } = await supabase.functions.invoke('extract-invoice-ocr', {
        body: { imageData }
      });

      if (error) throw error;

      if (data.success && data.data) {
        console.log('Extracted data:', data.data);
        setStatus('success');
        toast.success('Invoice data extracted successfully!');
        onDataExtracted(data.data);
      } else {
        throw new Error(data.error || 'Failed to extract data');
      }
      
    } catch (error) {
      console.error('OCR Error:', error);
      setStatus('error');
      toast.error(error instanceof Error ? error.message : 'Failed to extract invoice data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card p-6 mb-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Upload className="h-5 w-5 text-primary" />
          <div>
            <h3 className="text-lg font-semibold">📷 Smart Scan Invoice</h3>
            <p className="text-sm text-muted-foreground">
              Upload invoice image to auto-fill fields using AI
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            className="relative"
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={loading}
            />
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Extracting...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Choose Image
              </>
            )}
          </Button>
          
          {fileName && (
            <span className="text-sm text-muted-foreground">{fileName}</span>
          )}
          
          {status === 'success' && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm">Data extracted!</span>
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="h-4 w-4" />
              <span className="text-sm">Extraction failed</span>
            </div>
          )}
        </div>
        
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            🔍 Analyzing invoice image with AI...
          </div>
        )}
      </div>
    </Card>
  );
};
