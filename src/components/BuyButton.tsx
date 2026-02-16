'use client';

import { useState } from 'react';
import { Lock, FileText, ShieldCheck, Zap } from 'lucide-react';

export default function BuyButton({ base, tips, overtime, state }: { base: number, tips: number, overtime: number, state: string }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base, tips, overtime, state }) 
      });
      
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Payment system initializing. Please try again.');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 bg-slate-900 rounded-2xl p-1 shadow-2xl ring-1 ring-slate-800 print:hidden">
      <div className="bg-slate-900 rounded-xl p-6 sm:p-8 text-center">
        
        {/* Discount Badge */}
        <div className="inline-flex items-center gap-1 bg-amber-400 text-amber-900 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full mb-6 animate-pulse">
          <Zap className="w-3 h-3 fill-current" />
          Limited Time Offer
        </div>

        <h3 className="text-2xl font-bold text-white mb-2">
          Get The 2026 Worker's Playbook
        </h3>
        
        <p className="text-slate-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
          Don't guess. Get the <strong>Official Strategy PDF</strong> with your "Stop-Work" dates, Audit-Proof Log, and Tip Protection scripts.
        </p>

        <button 
          onClick={handleCheckout}
          disabled={loading}
          className="group relative w-full flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        >
          {loading ? (
            <span className="animate-pulse">Processing Securely...</span>
          ) : (
            <>
              <Lock className="w-5 h-5 opacity-75 group-hover:opacity-100" />
              <span>Unlock Strategy Guide &mdash; $4.99</span>
            </>
          )}
        </button>

        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-slate-400" /> Secure Stripe Checkout</span>
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Instant PDF Download</span>
        </div>
      </div>
    </div>
  );
}