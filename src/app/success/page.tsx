'use client';

import { CheckCircle, Printer, Download } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-slate-100 py-12 px-4 print:bg-white print:p-0">
      
      {/* --- NON-PRINTABLE HEADER (Hidden when saving to PDF) --- */}
      <div className="max-w-3xl mx-auto mb-8 text-center print:hidden">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Payment Successful!</h1>
        <p className="text-slate-500 mt-2">Thank you for your purchase. Your official scenario report is ready below.</p>
        
        <div className="mt-6 flex justify-center gap-4">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition shadow-lg"
          >
            <Download className="w-5 h-5" /> Download / Print PDF
          </button>
          <Link href="/" className="flex items-center gap-2 bg-white text-slate-700 font-bold py-3 px-6 rounded-lg border border-slate-200 hover:bg-slate-50 transition">
            Run Another Scenario
          </Link>
        </div>
      </div>

      {/* --- THE OFFICIAL REPORT (This is what gets printed) --- */}
      <div className="max-w-3xl mx-auto bg-white p-12 rounded-xl shadow-xl print:shadow-none print:p-0">
        
        {/* Report Header */}
        <div className="border-b-2 border-slate-900 pb-6 mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-extrabold text-slate-900 uppercase tracking-tight">Tax Strategy Report</h2>
            <p className="text-slate-500 mt-1">2026 Fiscal Year Projection • OBBBA Compliance</p>
          </div>
          <div className="text-right">
             <div className="text-sm font-bold text-slate-400 uppercase">Generated On</div>
             <div className="text-lg font-bold text-slate-900">{new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* Report Body */}
        <div className="space-y-8">
          
          <div className="bg-slate-50 p-6 border border-slate-200 rounded-lg print:border-slate-300">
            <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Executive Summary</h3>
            <p className="text-slate-700 leading-relaxed">
              Based on the projected 2026 tax brackets and the One Big Beautiful Bill Act (OBBBA), 
              the taxpayer qualifies for significant deductions on Tip Income (capped at $25,000) 
              and Overtime Pay (capped at $12,500). This report details the effective tax savings.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Income Profile</h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex justify-between border-b border-slate-100 pb-1"><span>Base Salary:</span> <span className="font-mono font-bold">[User Input]</span></li>
                <li className="flex justify-between border-b border-slate-100 pb-1"><span>Tip Income:</span> <span className="font-mono font-bold">[User Input]</span></li>
                <li className="flex justify-between border-b border-slate-100 pb-1"><span>Overtime Pay:</span> <span className="font-mono font-bold">[User Input]</span></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Deduction Strategy</h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex justify-between border-b border-slate-100 pb-1">
                  <span>Tip Deduction Cap:</span> <span className="font-mono font-bold text-green-600">$25,000.00</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 pb-1">
                  <span>Overtime Cap:</span> <span className="font-mono font-bold text-green-600">$12,500.00</span>
                </li>
              </ul>
            </div>
          </div>

          {/* The Big Result */}
          <div className="mt-8 p-8 bg-slate-900 text-white rounded-xl print:bg-slate-100 print:text-slate-900 print:border-2 print:border-slate-900">
            <div className="text-center">
              <h3 className="text-lg font-medium opacity-80 uppercase tracking-widest mb-2">Total Estimated Tax Savings</h3>
              <div className="text-6xl font-black tracking-tighter">
                $ [Calculated]
              </div>
              <p className="text-sm mt-4 opacity-60">
                *Comparison vs. 2025 Legacy Tax Code
              </p>
            </div>
          </div>

          {/* Compliance Footer */}
          <div className="pt-12 mt-12 border-t border-slate-200 text-xs text-slate-400 text-center leading-relaxed">
            <p><strong>DISCLAIMER:</strong> This report is for estimation purposes only and does not constitute legal or financial advice. 
            The OBBBA legislation is subject to change. Please consult a licensed CPA before filing.</p>
            <p className="mt-2">Generated by 2026TaxCalc.com • Official Reference ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
          </div>

        </div>
      </div>
    </main>
  );
}