// test-engine.ts
import { calculateObbbaTax } from './src/lib/tax-engine';

const result = calculateObbbaTax({
  income: 50000,
  tips: 30000,       // Should cap at 25k deduction
  overtime: 15000,   // Should cap at 12.5k deduction
  state: 'NV',
  filingStatus: 'single'
});

console.log("------------------------------------------------");
console.log(`Gross Income: $95,000`);
console.log(`Obbba Tax:    $${result.taxWithObbba.toFixed(2)}`);
console.log(`Legacy Tax:   $${result.taxWithoutObbba.toFixed(2)}`);
console.log(`YOU SAVE:     $${result.savings.toFixed(2)}`);
console.log("------------------------------------------------");