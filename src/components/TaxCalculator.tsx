'use client';

import { useState, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { Edit2, Lock, Info, ChevronUp, ChevronDown, Zap, X, TrendingUp, DollarSign } from 'lucide-react';
import BuyButton from './BuyButton';

// --- MATH ENGINE ---
const calculate = (base: number, tips: number, overtime: number, stateRate: number) => {
  const standardDeduction = 14600;
  
  // 1. Snapshot Calc
  // AGGRESSIVE LOGIC: Without the PDF (Audit Log), we assume 90% of tips are disallowed/misclassified.
  // This reflects the high risk of IRS audit failure without proof.
  const misclassifiedTips = tips * 0.90; 
  
  // Taxable Incomes
  const taxableLegacy = Math.max(0, (base + tips + overtime) - standardDeduction);
  const taxableStandard = Math.max(0, (base + tips + overtime) - standardDeduction - (Math.min(misclassifiedTips, 25000)));
  
  const dedTips = Math.min(tips, 25000);
  const dedOvertime = Math.min(overtime, 12500);
  const taxableOptimized = Math.max(0, (base + tips + overtime) - standardDeduction - dedTips - dedOvertime);

  // Federal Tax Brackets
  const fed = (amt: number) => {
    if (amt <= 11600) return amt * 0.10;
    if (amt <= 47150) return 1160 + (amt - 11600) * 0.12;
    if (amt <= 100525) return 5426 + (amt - 47150) * 0.22;
    return 17168.5 + (amt - 100525) * 0.24;
  };

  // Annual Taxes
  const taxLegacy = fed(taxableLegacy) + (taxableLegacy * stateRate);
  const taxStandard = fed(taxableStandard) + (taxableStandard * stateRate);
  const taxOptimized = fed(taxableOptimized) + (taxableOptimized * stateRate);

  // "Value of the Trick" (Difference between Doing it Wrong vs Right)
  const strategyValue = taxStandard - taxOptimized;

  // 2. Ten Year Trend (NET INCOME)
  // We assume a 3% annual raise to show "Career Growth"
  const trend = [];
  
  for (let i = 0; i <= 10; i++) {
    const raiseFactor = Math.pow(1.03, i); // 3% raise per year
    
    // Adjusted Annual Incomes
    const adjBase = base * raiseFactor;
    const adjTips = tips * raiseFactor; // Tips grow too
    const adjOvertime = overtime * raiseFactor;
    
    // Recalculate Taxes for this future year
    // Note: We keep brackets static for simplicity/conservative estimates
    const gross = adjBase + adjTips + adjOvertime;
    
    // Legacy Tax
    const tLeg = fed(Math.max(0, gross - standardDeduction)) + (Math.max(0, gross - standardDeduction) * stateRate);
    
    // Standard Tax (90% Risk)
    const riskTips = Math.min(adjTips * 0.10, 25000); // Only getting 10% benefit
    const tStd = fed(Math.max(0, gross - standardDeduction - riskTips)) + (Math.max(0, gross - standardDeduction - riskTips) * stateRate);
    
    // Optimized Tax (100% Benefit)
    const optTips = Math.min(adjTips, 25000);
    const optOt = Math.min(adjOvertime, 12500);
    const tOpt = fed(Math.max(0, gross - standardDeduction - optTips - optOt)) + (Math.max(0, gross - standardDeduction - optTips - optOt) * stateRate);

    trend.push({ 
      year: i, 
      legacy: Math.round(gross - tLeg), 
      standard: Math.round(gross - tStd), 
      optimized: Math.round(gross - tOpt) 
    });
  }

  // Calculate Total 10-Year Wealth Difference
  const totalLegacy = trend.reduce((acc, curr) => acc + curr.legacy, 0);
  const totalOptimized = trend.reduce((acc, curr) => acc + curr.optimized, 0);
  const finalGap = totalOptimized - totalLegacy;

  return {
    strategyValue,
    trend, 
    finalGap
  };
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl text-xs z-50">
        <p className="font-bold text-slate-400 uppercase tracking-wider mb-2">Year {label} Take-Home Pay</p>
        <div className="space-y-2">
          <p className="text-white font-bold text-sm flex justify-between gap-6 items-center border-l-2 border-indigo-500 pl-2">
            <span>With Strategy:</span>
            <span className="text-indigo-400">${payload[0].value.toLocaleString()}</span>
          </p>
          <p className="text-slate-400 font-medium text-xs flex justify-between gap-6 items-center border-l-2 border-amber-500 pl-2">
            <span>Standard:</span>
            <span>${payload[1].value.toLocaleString()}</span>
          </p>
          <p className="text-slate-500 text-xs flex justify-between gap-6 items-center border-l-2 border-slate-500 pl-2">
            <span>Legacy Code:</span>
            <span>${payload[2].value.toLocaleString()}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function TaxCalculator({ 
  initialBase, initialTips, initialOvertime, stateName, stateRate 
}: { 
  initialBase: number, initialTips: number, initialOvertime: number, stateName: string, stateRate: number
}) {
  const [showInputs, setShowInputs] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [base, setBase] = useState(initialBase);
  const [tips, setTips] = useState(initialTips);
  const [overtime, setOvertime] = useState(initialOvertime);
  
  const stats = useMemo(() => {
    return calculate(base, tips, overtime, stateRate);
  }, [base, tips, overtime, stateRate]);

  // Calculate Domain for Y-Axis (Auto-Zoom)
  const minVal = Math.min(...stats.trend.map(d => d.legacy)) * 0.9;
  const maxVal = Math.max(...stats.trend.map(d => d.optimized)) * 1.05;

  return (
    <>
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative z-10">
        
        {/* --- HEADER --- */}
        <div className="p-8 border-b border-slate-100 bg-white relative z-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                  10-Year Income Projection
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                 <div className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">
                    +${Math.round(stats.finalGap).toLocaleString()}
                 </div>
              </div>
              <div className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
                Extra Take-Home Pay (10 Years)
              </div>
            </div>

            <button 
              onClick={() => setShowInputs(!showInputs)}
              className={`flex items-center gap-2 text-xs font-bold px-5 py-3 rounded-xl transition-all ${showInputs ? 'bg-slate-100 text-slate-600' : 'bg-slate-900 text-white shadow-lg hover:bg-slate-800'}`}
            >
              {showInputs ? (
                <><ChevronUp className="w-4 h-4" /> Hide Inputs</> 
              ) : (
                <><Edit2 className="w-4 h-4" /> Edit My Numbers</>
              )}
            </button>
          </div>
        </div>

        {/* --- SLIDING INPUTS --- */}
        <div className={`bg-slate-50 border-b border-slate-100 transition-all duration-300 ease-in-out overflow-hidden ${showInputs ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group">
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-wider">Base Salary</label>
                <input type="number" value={base} onChange={(e) => setBase(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-700 outline-none focus:border-indigo-500" />
              </div>
              <div className="group">
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-wider">Tips</label>
                <input type="number" value={tips} onChange={(e) => setTips(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-700 outline-none focus:border-indigo-500" />
              </div>
              <div className="group">
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-wider">Overtime</label>
                <input type="number" value={overtime} onChange={(e) => setOvertime(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-700 outline-none focus:border-indigo-500" />
              </div>
            </div>
        </div>

        {/* --- GRAPH AREA --- */}
        <div className="p-8 bg-white relative">
            
            {/* THE "STRATEGY BONUS" CARD (UPDATED) */}
            <div className="bg-slate-900 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
               {/* Shine Effect */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-3xl rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
               
               <div className="relative z-10 flex items-start gap-4">
                 <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400" />
                 </div>
                 <div>
                   <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">
                     Strategy Bonus
                   </div>
                   <div className="text-xs text-slate-400 font-medium max-w-xs leading-relaxed">
                     Without the Audit Log (PDF), risk of deduction failure is 90%.<br/>
                     <strong className="text-white">Your PDF Value:</strong>
                   </div>
                 </div>
               </div>
               
               <div className="relative z-10 text-center md:text-right">
                  <div className="text-3xl font-black text-emerald-400">
                    +${Math.round(stats.strategyValue).toLocaleString()}
                  </div>
                  <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Per Year Saved</div>
               </div>
            </div>

            {/* CHART LEGEND */}
            <div className="flex gap-6 justify-center mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">With Strategy</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Standard</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border border-slate-300 border-dashed"></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Old Laws</span>
              </div>
            </div>

            {/* RECHARTS GRAPH (NET INCOME) */}
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.trend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOptimized" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="year" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10}} 
                    tickFormatter={(val) => `Year ${val}`}
                  />
                  <YAxis 
                    domain={[minVal, 'auto']} // AUTO-ZOOM to show the gap!
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10}} 
                    tickFormatter={(val) => `$${Math.round(val/1000)}k`}
                    width={40}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  {/* 1. Legacy (Grey Dashed) */}
                  <Area 
                    type="monotone" 
                    dataKey="legacy" 
                    stroke="#cbd5e1" 
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    fill="transparent" 
                    activeDot={{ r: 4 }}
                  />

                  {/* 2. Standard (Amber) */}
                  <Area 
                    type="monotone" 
                    dataKey="standard" 
                    stroke="#fbbf24" 
                    strokeWidth={2}
                    fill="transparent" 
                    activeDot={{ r: 4 }}
                  />

                  {/* 3. Optimized (Purple Filled) */}
                  <Area 
                    type="monotone" 
                    dataKey="optimized" 
                    stroke="#4f46e5" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorOptimized)" 
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <p className="text-center text-[10px] text-slate-400 mt-6 italic">
              *Graph projects Annual Net Take-Home Pay (Salary + Tips - Taxes), assuming 3% annual growth.
            </p>
        </div>

        {/* --- BLACK FANCY BUTTON --- */}
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

           <div className="relative z-10">
             <h3 className="text-2xl font-bold text-white mb-2">
               Get The 2026 Worker's Playbook
             </h3>
             <p className="text-slate-400 mb-6 max-w-md mx-auto text-sm">
               Secure your official PDF with "Stop-Work" dates, Audit-Proof Logs, and Tip Protection scripts.
             </p>

             <button 
               onClick={() => setShowModal(true)}
               className="group relative w-full flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-[0_0_20px_rgba(16,185,129,0.3)]"
             >
               <Lock className="w-5 h-5 opacity-75 group-hover:opacity-100" />
               <span>Unlock Strategy Guide &mdash; $4.99</span>
             </button>
             
             <p className="text-xs text-slate-500 mt-4">
               Instant Download • Secure Stripe Checkout
             </p>
           </div>
        </div>

      </div>

      {/* --- MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
               <h3 className="text-lg font-bold text-slate-900">Review Your Numbers</h3>
               <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4">
               <div className="space-y-3">
                 <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-500 text-sm">Base</span><span className="font-bold">${base.toLocaleString()}</span></div>
                 <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-500 text-sm">Tips</span><span className="font-bold">${tips.toLocaleString()}</span></div>
                 <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-500 text-sm">Overtime</span><span className="font-bold">${overtime.toLocaleString()}</span></div>
               </div>
               <BuyButton base={base} tips={tips} overtime={overtime} state={stateName} />
               <button onClick={() => setShowModal(false)} className="w-full text-center text-xs font-bold text-slate-400 mt-2">Go Back</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}