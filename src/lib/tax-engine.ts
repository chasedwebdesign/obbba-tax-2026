import { STATE_TAX_RATES } from './data';

// ... (TaxInputs and TaxResult types stay the same)

export const calculateObbbaTax = (inputs: TaxInputs): TaxResult => {
  const { income, tips, overtime, filingStatus, state } = inputs; // Added state

  // Constants
  const STANDARD_DEDUCTION = filingStatus === 'single' ? 14600 : 29200;
  
  // 1. OBBBA Deductions
  const safeTips = tips || 0;
  const safeOvertime = overtime || 0;
  
  const deductibleTips = Math.min(safeTips, 25000);
  const deductibleOvertime = Math.min(safeOvertime, 12500);

  // 2. Taxable Income
  const grossIncome = income + safeTips + safeOvertime;
  const taxableIncomeObbba = Math.max(0, grossIncome - STANDARD_DEDUCTION - deductibleTips - deductibleOvertime);
  const taxableIncomeLegacy = Math.max(0, grossIncome - STANDARD_DEDUCTION);

  // 3. Federal Tax (Simplified 2026 Brackets)
  const calculateFederalTax = (amount: number): number => {
    if (amount <= 11600) return amount * 0.10;
    if (amount <= 47150) return 1160 + (amount - 11600) * 0.12;
    if (amount <= 100525) return 5426 + (amount - 47150) * 0.22;
    return 17168.5 + (amount - 100525) * 0.24;
  };

  const federalTax = calculateFederalTax(taxableIncomeObbba);
  const federalTaxLegacy = calculateFederalTax(taxableIncomeLegacy);

  // 4. State Tax Calculation (NEW!)
  // We look up the state rate, defaulting to 5% if not found
  const stateRate = STATE_TAX_RATES[state] !== undefined ? STATE_TAX_RATES[state] : 0.05;
  const stateTax = taxableIncomeObbba * stateRate;

  const totalTax = federalTax + stateTax;
  const totalTaxLegacy = federalTaxLegacy + (taxableIncomeLegacy * stateRate);

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