import { STATE_TAX_RATES } from './data';

// --- TYPE DEFINITIONS ---
export type TaxInputs = {
  income: number;
  tips: number;
  overtime: number;
  filingStatus: 'single' | 'joint';
  state: string; // We need this to look up state tax rates
};

export type TaxResult = {
  taxWithObbba: number;
  taxWithoutObbba: number;
  savings: number;
  deductibleTips: number;
  deductibleOvertime: number;
  netPay: number;
  effectiveRate: number;
};

// --- THE CALCULATION ENGINE ---
export const calculateObbbaTax = (inputs: TaxInputs): TaxResult => {
  const { income, tips, overtime, filingStatus, state } = inputs;

  // Constants
  const STANDARD_DEDUCTION = filingStatus === 'single' ? 14600 : 29200;
  
  // 1. OBBBA Deductions (The "Magic" of the new law)
  const safeTips = tips || 0;
  const safeOvertime = overtime || 0;
  
  const deductibleTips = Math.min(safeTips, 25000);
  const deductibleOvertime = Math.min(safeOvertime, 12500);

  // 2. Taxable Income Calculations
  const grossIncome = income + safeTips + safeOvertime;
  
  // New Way: Subtract Tips & Overtime caps
  const taxableIncomeObbba = Math.max(0, grossIncome - STANDARD_DEDUCTION - deductibleTips - deductibleOvertime);
  
  // Old Way: Standard taxable income
  const taxableIncomeLegacy = Math.max(0, grossIncome - STANDARD_DEDUCTION);

  // 3. Federal Tax Logic (Projected 2026 Brackets)
  const calculateFederalTax = (amount: number): number => {
    if (amount <= 11600) return amount * 0.10;
    if (amount <= 47150) return 1160 + (amount - 11600) * 0.12;
    if (amount <= 100525) return 5426 + (amount - 47150) * 0.22;
    return 17168.5 + (amount - 100525) * 0.24;
  };

  const federalTax = calculateFederalTax(taxableIncomeObbba);
  const federalTaxLegacy = calculateFederalTax(taxableIncomeLegacy);

  // 4. State Tax Calculation
  // Look up the specific state rate, default to 5% if something goes wrong
  const stateRate = STATE_TAX_RATES[state] !== undefined ? STATE_TAX_RATES[state] : 0.05;
  
  const stateTax = taxableIncomeObbba * stateRate;
  const stateTaxLegacy = taxableIncomeLegacy * stateRate;

  // 5. Final Totals
  const totalTax = federalTax + stateTax;
  const totalTaxLegacy = federalTaxLegacy + stateTaxLegacy;

  return {
    taxWithObbba: totalTax,
    taxWithoutObbba: totalTaxLegacy,
    savings: totalTaxLegacy - totalTax,
    deductibleTips,
    deductibleOvertime,
    netPay: grossIncome - totalTax,
    effectiveRate: (totalTax / grossIncome) || 0
  };
};