import { TaxRate } from "@/types/invoice";

export const TAX_RATES: Record<string, Record<string, number>> = {
  US: {
    CA: 0.0825,  // California
    NY: 0.08875, // New York
    TX: 0.0625,  // Texas
    FL: 0.06,    // Florida
    IL: 0.0625,  // Illinois
    PA: 0.06,    // Pennsylvania
    OH: 0.0575,  // Ohio
    default: 0.06,
  },
  CA: {
    ON: 0.13,    // Ontario HST
    BC: 0.12,    // British Columbia
    QC: 0.14975, // Quebec
    AB: 0.05,    // Alberta GST
    default: 0.05, // GST
  },
  GB: {
    default: 0.20, // UK VAT
  },
  EU: {
    default: 0.21, // Average EU VAT
  },
};

export const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'EU', name: 'European Union' },
];

export const getStatesForCountry = (countryCode: string): { code: string; name: string }[] => {
  if (countryCode === 'US') {
    return [
      { code: 'CA', name: 'California' },
      { code: 'NY', name: 'New York' },
      { code: 'TX', name: 'Texas' },
      { code: 'FL', name: 'Florida' },
      { code: 'IL', name: 'Illinois' },
      { code: 'PA', name: 'Pennsylvania' },
      { code: 'OH', name: 'Ohio' },
    ];
  }
  
  if (countryCode === 'CA') {
    return [
      { code: 'ON', name: 'Ontario' },
      { code: 'BC', name: 'British Columbia' },
      { code: 'QC', name: 'Quebec' },
      { code: 'AB', name: 'Alberta' },
    ];
  }
  
  return [];
};

export interface TaxCalculationResult {
  taxAmount: number;
  taxRate: number;
  total: number;
}

export const calculateTax = (
  amount: number, 
  country: string, 
  state?: string
): TaxCalculationResult => {
  const countryRates = TAX_RATES[country];
  
  if (!countryRates) {
    // No tax for unknown countries
    return {
      taxAmount: 0,
      taxRate: 0,
      total: amount,
    };
  }
  
  const rate = state && countryRates[state] 
    ? countryRates[state] 
    : countryRates.default || 0;
  
  const taxAmount = amount * rate;
  
  return {
    taxAmount,
    taxRate: rate * 100,
    total: amount + taxAmount,
  };
};
