'use client';

import { useState } from 'react';
import { Lock, Zap } from 'lucide-react';

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
    <button 
      onClick={handleCheckout}
      disabled={loading}
      className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-4 rounded-xl shadow-xl shadow-emerald-500/20 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3"
    >
      {loading ? (
        <span className="animate-pulse">Processing...</span>
      ) : (
        <>
          <Zap className="w-5 h-5 fill-slate-900" />
          <span>Confirm & Pay $4.99</span>
        </>
      )}
    </button>
  );
}