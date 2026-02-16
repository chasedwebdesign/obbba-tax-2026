'use client';

import { useSearchParams } from 'next/navigation';
import { CheckCircle, Download, ShieldAlert, BookOpen, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function Report() {
  const searchParams = useSearchParams();
  
  // 1. READ USER DATA
  const base = Number(searchParams.get('base') || 0);
  const tips = Number(searchParams.get('tips') || 0);
  const overtime = Number(searchParams.get('overtime') || 0);
  const state = searchParams.get('state') || 'US';

  // 2. RUN THE "BRAIN"
  const tipCap = 25000;
  const otCap = 12500;
  
  const tipOverflow = Math.max(0, tips - tipCap);
  const otOverflow = Math.max(0, overtime - otCap);
  
  // Calculate the "Stop Date" (When they hit the cap)
  // If they make $50k tips/year, they hit the $25k cap in June (Month 6).
  const monthsToHitTipCap = tips > 0 ? (tipCap / tips) * 12 : 12;
  const stopMonth = monthsToHitTipCap < 12 
    ? new Date(0, Math.floor(monthsToHitTipCap)).toLocaleString('default', { month: 'long' }) 
    : 'December';

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-2xl print:shadow-none">
      
      {/* --- PAGE 1: THE EXECUTIVE SUMMARY --- */}
      <div className="p-12 border-b-4 border-slate-100 print:break-after-page">
        <div className="flex justify-between items-end mb-10 border-b border-slate-900 pb-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">2026 Strategy Playbook</h1>
            <p className="text-slate-500 font-medium mt-2">Prepared for: {state} Resident • OBBBA Compliance</p>
          </div>
          <div className="text-right">
             <div className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded text-xs uppercase tracking-wider mb-1">Status: Optimized</div>
             <div className="text-sm font-bold text-slate-400">{new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* The Big Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Your Projected Tax-Free Income</h3>
             <div className="flex items-baseline gap-2">
               <span className="text-5xl font-black text-slate-900">${(Math.min(tips, tipCap) + Math.min(overtime, otCap)).toLocaleString()}</span>
               <span className="text-sm font-bold text-emerald-600">Protected</span>
             </div>
             <p className="text-sm text-slate-500 mt-2 leading-relaxed">
               Under OBBBA, this portion of your income is legally shielded from Federal Income Tax.
             </p>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
             <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-4">The "Stop-Work" Alert</h3>
             <div className="flex items-baseline gap-2">
               <span className="text-5xl font-black text-blue-900">{stopMonth}</span>
               <span className="text-sm font-bold text-blue-600">is your Cap Month</span>
             </div>
             <p className="text-sm text-blue-800 mt-2 leading-relaxed">
               Based on your current pace, you will hit the $25,000 tax-free limit in <strong>{stopMonth}</strong>. Every dollar earned after this date is fully taxed.
             </p>
          </div>
        </div>
      </div>

      {/* --- PAGE 2: THE STRATEGY GUIDE (The "Life Changing" Part) --- */}
      <div className="p-12 bg-slate-50 print:bg-white">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-amber-500" />
          Critical Strategy Advisories
        </h2>

        <div className="space-y-8">
          
          {/* Strategy 1: The Service Charge Trap */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">1. The "Auto-Gratuity" Trap</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              <strong>WARNING:</strong> Many employers classify automatic service charges (e.g., "18% added for parties of 6+") as <strong>Wages</strong>, not Tips. 
              Wages are NOT eligible for the $25,000 OBBBA deduction. You could lose thousands if this is misclassified.
            </p>
            <div className="bg-slate-100 p-4 rounded border-l-4 border-blue-500">
              <p className="text-xs font-bold text-blue-500 uppercase mb-1">Script: What to say to your employer</p>
              <p className="text-sm text-slate-700 italic">
                "Hi [Manager], I noticed our POS system labels large party fees as 'Service Charges.' For the new 2026 tax law, I need these recorded specifically as 'Tips' on my pay stub to qualify for the exemption. Can we adjust how this is categorized?"
              </p>
            </div>
          </div>

          {/* Strategy 2: The Audit Log */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">2. The "Good Faith" Audit Log</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              The IRS requires a daily record of tips. If you are audited, they will look for a "gap" between your credit card tips and cash tips. 
              Since you are claiming the max deduction, your audit risk is higher.
            </p>
            <div className="bg-amber-50 p-4 rounded border border-amber-100">
               <h4 className="text-sm font-bold text-amber-800 mb-2">Action Item: Weekly Log Format</h4>
               <div className="grid grid-cols-4 gap-4 text-xs font-mono text-slate-600 border-b border-amber-200 pb-2 mb-2">
                 <span>DATE</span>
                 <span>HOURS</span>
                 <span>CASH TIPS</span>
                 <span>CREDIT TIPS</span>
               </div>
               <div className="grid grid-cols-4 gap-4 text-xs font-mono text-slate-400">
                 <span>MM/DD</span>
                 <span>8.5</span>
                 <span>$____</span>
                 <span>$____</span>
               </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- FOOTER --- */}
      <div className="p-12 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-400 leading-relaxed max-w-2xl mx-auto">
          <strong>LEGAL DISCLAIMER:</strong> This report is a strategic estimation tool, not legal advice. 
          The OBBBA legislation (Tax Cuts and Jobs Act extensions) contains complex phase-out rules for incomes over $75,000. 
          Please present this document to a Certified Public Accountant (CPA) when filing your 2026 return.
        </p>
        <p className="text-xs text-slate-300 mt-4">Generated by 2026TaxCalc.com • Session ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
      </div>

    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-slate-200 py-12 px-4 print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto mb-8 text-center print:hidden">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4 shadow-sm">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Strategy Report Ready</h1>
        <p className="text-slate-500 mt-2">Your playbook has been generated. Please save this immediately.</p>
        
        <div className="mt-6 flex justify-center gap-4">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-emerald-600 text-white font-bold py-3 px-8 rounded-full hover:bg-emerald-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Download className="w-5 h-5" /> Download Official PDF
          </button>
          <Link href="/" className="flex items-center gap-2 bg-white text-slate-700 font-bold py-3 px-6 rounded-full border border-slate-200 hover:bg-slate-50 transition">
            Start Over
          </Link>
        </div>
      </div>
      
      <Suspense fallback={<div className="text-center p-12">Generating Analysis...</div>}>
        <Report />
      </Suspense>
    </main>
  );
}