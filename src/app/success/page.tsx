'use client';

import { useSearchParams } from 'next/navigation';
import { CheckCircle, Download, Shield, FileText, Calendar, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function Report() {
  const searchParams = useSearchParams();
  
  // 1. READ DATA
  const base = Number(searchParams.get('base') || 0);
  const tips = Number(searchParams.get('tips') || 0);
  const overtime = Number(searchParams.get('overtime') || 0);
  const state = searchParams.get('state') || 'US';

  // 2. CALCULATE LIMITS
  const tipCap = 25000;
  const otCap = 12500;
  
  // "Stop Work" Math
  const monthlyTipPace = tips / 12;
  const monthsUntilCap = monthlyTipPace > 0 ? tipCap / monthlyTipPace : 12;
  const stopDate = new Date();
  stopDate.setMonth(stopDate.getMonth() + Math.floor(monthsUntilCap));
  const stopMonthName = monthsUntilCap < 12 ? stopDate.toLocaleString('default', { month: 'long' }) : 'December';

  // 10-Year Wealth Projection (Simplified for Receipt)
  // Assuming $1,500/yr savings * 10 years * 1.05 growth
  const estimatedAnnualSavings = (tips * 0.15); // Rough est of 15% tax savings
  const tenYearValue = estimatedAnnualSavings * 12; // Rough 10y multiplier

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-2xl print:shadow-none print:max-w-none">
      
      {/* --- PAGE 1: EXECUTIVE SUMMARY --- */}
      <div className="p-12 print:p-0 print:break-after-page relative overflow-hidden">
        
        {/* Watermark for Print */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-100 font-black text-9xl -rotate-45 pointer-events-none select-none z-0">
          CONFIDENTIAL
        </div>

        {/* Header */}
        <div className="relative z-10 border-b-4 border-slate-900 pb-8 mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">Tax Strategy<br/>Playbook 2026</h1>
            <p className="text-slate-500 font-bold mt-4 tracking-widest uppercase text-sm">OBBBA Compliance & Optimization Record</p>
          </div>
          <div className="text-right">
             <div className="inline-block bg-slate-900 text-white font-bold px-4 py-2 rounded mb-2">ID: {Math.random().toString(36).substring(7).toUpperCase()}</div>
             <div className="text-slate-400 font-medium">{new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* The "Big Win" Box */}
        <div className="relative z-10 bg-slate-50 border border-slate-200 p-8 rounded-xl mb-12">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Projected 10-Year Wealth Impact</h3>
           <div className="flex items-baseline gap-4">
             <span className="text-6xl font-black text-emerald-600">+${Math.round(tenYearValue).toLocaleString()}</span>
             <span className="text-slate-500 font-medium">Estimated Net Growth</span>
           </div>
           <p className="text-sm text-slate-500 mt-4 leading-relaxed max-w-2xl">
             Based on your income profile of <strong>${(base+tips+overtime).toLocaleString()}</strong>, utilizing the strategies in this document 
             to reclassify Service Charges as Tips and cap Overtime strategically is projected to retain significant wealth over the next decade.
           </p>
        </div>

        {/* The "Stop Work" Calendar */}
        <div className="relative z-10 grid grid-cols-2 gap-8 mb-12">
           <div className="border-l-4 border-indigo-500 pl-6">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-indigo-500" />
                <span className="text-xs font-bold text-indigo-500 uppercase">Tip Cap Date</span>
              </div>
              <div className="text-3xl font-black text-slate-900">{stopMonthName} 15th</div>
              <p className="text-xs text-slate-500 mt-1">
                You will hit the $25,000 tax-free limit around this date. Income earned after this is fully taxable.
              </p>
           </div>
           <div className="border-l-4 border-amber-500 pl-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-bold text-amber-500 uppercase">Audit Risk Level</span>
              </div>
              <div className="text-3xl font-black text-slate-900">MODERATE</div>
              <p className="text-xs text-slate-500 mt-1">
                Because you are claiming the max deduction, you <strong>MUST</strong> use the Audit Log on Page 3.
              </p>
           </div>
        </div>

      </div>

      {/* --- PAGE 2: THE SCRIPT (The "Trick") --- */}
      <div className="p-12 print:p-0 print:break-after-page bg-slate-50 print:bg-white">
        <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-4">
          <FileText className="w-8 h-8 text-slate-400" />
          The Classification Script
        </h2>
        
        <p className="text-slate-700 mb-8 leading-relaxed">
          <strong>The Problem:</strong> Many POS systems (Toast, Clover, Aloha) default large party fees to "Service Charge." 
          Legally, a Service Charge is <strong>Wages</strong> (fully taxed). A Tip is <strong>Gratuity</strong> (Tax-Free up to $25k).
        </p>

        <div className="bg-white border-2 border-dashed border-slate-300 p-8 rounded-xl relative">
          <div className="absolute top-0 right-0 bg-slate-200 text-slate-500 text-[10px] font-bold px-2 py-1 uppercase rounded-bl">Manager Script</div>
          
          <h3 className="text-lg font-bold text-slate-900 mb-4">Request for Payroll Adjustment</h3>
          <p className="font-serif text-lg text-slate-800 italic leading-relaxed">
            "Hi [Manager Name], I’m reviewing my pay stubs for the new tax year. I noticed our auto-grat is listed as a 'Service Charge.' 
            <br/><br/>
            To qualify for the 2026 Tax Exemptions, these need to be recorded as 'Tips' since the guest has the option to modify them. 
            Can we update the POS setting to categorize these as Tips, or can I get a written confirmation that these are voluntary gratuities for my tax records?"
          </p>
        </div>
        <p className="text-xs text-center text-slate-400 mt-4">^ Cut out or screenshot this card.</p>
      </div>

      {/* --- PAGE 3: THE AUDIT LOG --- */}
      <div className="p-12 print:p-0">
        <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-4">
          <Shield className="w-8 h-8 text-slate-400" />
          Daily Tip Compliance Log
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          <strong>INSTRUCTIONS:</strong> Print this page. Fill it out daily. If audited, this document is your primary defense to prove your tips are real and not under-reported.
        </p>

        {/* The Grid */}
        <div className="border-2 border-slate-900">
          <div className="grid grid-cols-5 bg-slate-900 text-white font-bold text-xs uppercase p-2">
            <div>Date</div>
            <div>Shift Hours</div>
            <div>Cash Tips</div>
            <div>Credit Tips</div>
            <div>Manager Initials</div>
          </div>
          {/* Generate 14 Rows */}
          {[...Array(14)].map((_, i) => (
            <div key={i} className="grid grid-cols-5 border-b border-slate-200 text-sm h-10 items-center">
              <div className="border-r border-slate-200 h-full pl-2 pt-2 text-slate-400">/ / 26</div>
              <div className="border-r border-slate-200 h-full"></div>
              <div className="border-r border-slate-200 h-full"></div>
              <div className="border-r border-slate-200 h-full"></div>
              <div className="h-full"></div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-xs text-slate-400 text-center">
          <p>Generated by 2026TaxCalc.com • Not Legal Advice • Consult a CPA</p>
        </div>
      </div>

    </div>
  );
}

// WRAPPER
export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-slate-200 py-12 px-4 print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto mb-8 text-center print:hidden">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4 shadow-sm">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Payment Successful</h1>
        <p className="text-slate-500 mt-2">Your Strategy Playbook is ready. Please print or save as PDF immediately.</p>
        
        <div className="mt-6 flex justify-center gap-4">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-emerald-600 text-white font-bold py-3 px-8 rounded-full hover:bg-emerald-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Download className="w-5 h-5" /> Download / Print PDF
          </button>
          <Link href="/" className="flex items-center gap-2 bg-white text-slate-700 font-bold py-3 px-6 rounded-full border border-slate-200 hover:bg-slate-50 transition">
            Start Over
          </Link>
        </div>
      </div>
      
      <Suspense fallback={<div className="text-center p-12">Generating Report...</div>}>
        <Report />
      </Suspense>
    </main>
  );
}