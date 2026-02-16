'use client';

import { useState, useEffect } from 'react';
import { Edit2, RefreshCw, Save } from 'lucide-react';
import BuyButton from './BuyButton'; // <--- Import it here now!

// ... (Keep the "calculate" function exactly as it was) ...
const calculate = (base: number, tips: number, overtime: number, stateRate: number) => {
    // ... same math logic ...
    const standardDeduction = 14600;
    const dedTips = Math.min(tips, 25000);
    const dedOvertime = Math.min(overtime, 12500);
    const gross = base + tips + overtime;
    const taxableObbba = Math.max(0, gross - standardDeduction - dedTips - dedOvertime);
    const taxableLegacy = Math.max(0, gross - standardDeduction);
  
    const fed = (amt: number) => {
      if (amt <= 11600) return amt * 0.10;
      if (amt <= 47150) return 1160 + (amt - 11600) * 0.12;
      if (amt <= 100525) return 5426 + (amt - 47150) * 0.22;
      return 17168.5 + (amt - 100525) * 0.24;
    };
  
    const taxNew = fed(taxableObbba) + (taxableObbba * stateRate);
    const taxOld = fed(taxableLegacy) + (taxableLegacy * stateRate);
  
    return {
      savings: taxOld - taxNew,
      deductibleTips: dedTips,
      deductibleOvertime: dedOvertime
    };
};

export default function TaxCalculator({ 
  initialBase, initialTips, initialOvertime, stateName, stateRate 
}: { 
  initialBase: number, initialTips: number, initialOvertime: number, stateName: string, stateRate: number
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [base, setBase] = useState(initialBase);
  const [tips, setTips] = useState(initialTips);
  const [overtime, setOvertime] = useState(initialOvertime);
  
  const [stats, setStats] = useState(calculate(base, tips, overtime, stateRate));

  useEffect(() => {
    setStats(calculate(base, tips, overtime, stateRate));
  }, [base, tips, overtime, stateRate]);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden transition-all duration-300">
        <div className="p-6 md:p-8">
          
          {/* ... (Keep the Header, Edit Button, Big Number, Breakdown Grid, Disclaimer exactly as before) ... */}
           {/* Header with Edit Button */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-400 uppercase tracking-wider">Projected 2026 Savings</h3>
            <p className="text-sm text-slate-400 mt-1">Vs. Previous Tax Code</p>
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            {isEditing ? <><Save className="w-4 h-4" /> Done</> : <><Edit2 className="w-4 h-4" /> Edit My Numbers</>}
          </button>
        </div>

        {/* The Big Number */}
        <div className="text-6xl font-black text-emerald-500 tracking-tight mb-8">
           ${stats.savings.toLocaleString('en-US', { maximumFractionDigits: 0 })}
        </div>

        {/* --- EDIT MODE INPUTS --- */}
        {isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100 animate-in fade-in slide-in-from-top-2">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Base Salary</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input 
                  type="number" 
                  value={base} 
                  onChange={(e) => setBase(Number(e.target.value))} 
                  className="w-full pl-6 pr-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Tips</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input 
                  type="number" 
                  value={tips} 
                  onChange={(e) => setTips(Number(e.target.value))} 
                  className="w-full pl-6 pr-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Overtime</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input 
                  type="number" 
                  value={overtime} 
                  onChange={(e) => setOvertime(Number(e.target.value))} 
                  className="w-full pl-6 pr-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700"
                />
              </div>
            </div>
          </div>
        )}

        {/* Breakdown Grid */}
        <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-8">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Tax-Free Tips</p>
            <p className="text-2xl font-bold text-slate-900">${stats.deductibleTips.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Tax-Free Overtime</p>
            <p className="text-2xl font-bold text-slate-900">${stats.deductibleOvertime.toLocaleString()}</p>
          </div>
        </div>
        </div>

         {/* Disclaimer Strip */}
      <div className="bg-slate-50 px-8 py-4 text-xs text-slate-400 border-t border-slate-100 flex justify-between items-center">
         <span>* Estimates based on {stateName} tax rates.</span>
         {isEditing && <span className="text-blue-600 font-bold flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Live Updating</span>}
      </div>
      </div>

      {/* --- HERE IS THE BUY BUTTON, CONNECTED TO LIVE DATA --- */}
      <BuyButton 
        base={base}
        tips={tips}
        overtime={overtime}
        state={stateName}
      />
    </>
  );
}