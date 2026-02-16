'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';

export default function BuyButton() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Payment error. Please try again.');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl p-6 text-white text-center mt-8 shadow-xl">
      <div className="flex justify-center mb-4">
        <div className="bg-emerald-500/20 p-3 rounded-full">
          <Lock className="w-8 h-8 text-emerald-400" />
        </div>
      </div>
      <h3 className="text-xl font-bold mb-2">Save My Official Scenario</h3>
      <p className="text-slate-400 mb-6 text-sm px-4">
        Download a CPA-ready PDF report of this calculation to secure your 2026 savings.
      </p>
      
      <button 
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
      >
        {loading ? 'Processing...' : 'Unlock Full Report ($9)'}
      </button>
      
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
        <span>🔒 Secure 256-bit Encryption</span>
      </div>
    </div>
  );
}