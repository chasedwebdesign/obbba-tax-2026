// src/lib/tax-engine.ts

// 1. Define the "Data Package" shape
export type TaxInputs = {
  income: number;
  tips: number;
  overtime: number;
  state: string;
  filingStatus: 'single' | 'joint';
};

// 2. Define the "Result Package" shape
export type TaxResult = {
  taxWithObbba: number;
  taxWithoutObbba: number;
  savings: number;
  deductibleTips: number;     // The page needs this specifically
  deductibleOvertime: number; // The page needs this specifically
  netPay: number;
  effectiveRate: number;
};

// 3. The Calculator Logic
export const calculateObbbaTax = (inputs: TaxInputs): TaxResult => {
  const { income, tips, overtime, filingStatus } = inputs;

  // Constants (2026 Projected)
  const STANDARD_DEDUCTION = filingStatus === 'single' ? 14600 : 29200;

  // A. OBBBA Logic: Calculate the specific deductions
  // If tips are undefined (safety check), default to 0
  const safeTips = tips || 0;
  const safeOvertime = overtime || 0;
  
  const deductibleTips = Math.min(safeTips, 25000);
  const deductibleOvertime = Math.min(safeOvertime, 12500);

  // B. Calculate Taxable Income
  const grossIncome = income + safeTips + safeOvertime;
  
  // Scenario 1: New OBBBA Method
  const taxableIncomeObbba = Math.max(0, grossIncome - STANDARD_DEDUCTION - deductibleTips - deductibleOvertime);
  
  // Scenario 2: Old Legacy Method
  const taxableIncomeLegacy = Math.max(0, grossIncome - STANDARD_DEDUCTION);

  // C. Federal Tax Function (Simplified 2026 Brackets)
  const calculateFederalTax = (amount: number): number => {
    if (amount <= 11600) return amount * 0.10;
    if (amount <= 47150) return 1160 + (amount - 11600) * 0.12;
    if (amount <= 100525) return 5426 + (amount - 47150) * 0.22;
    return 17168.5 + (amount - 100525) * 0.24;
  };

  const taxWithObbba = calculateFederalTax(taxableIncomeObbba);
  const taxWithoutObbba = calculateFederalTax(taxableIncomeLegacy);

  // D. Return the object exactly as the Page expects it
  return {
    taxWithObbba,
    taxWithoutObbba,
    savings: taxWithoutObbba - taxWithObbba,
    deductibleTips,      // This was likely missing or undefined before
    deductibleOvertime,  // This was likely missing or undefined before
    netPay: grossIncome - taxWithObbba,
    effectiveRate: (taxWithObbba / grossIncome) || 0
  };
};