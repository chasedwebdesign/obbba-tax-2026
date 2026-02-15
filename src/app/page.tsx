'use client'; // This creates interactive magic

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { STATES, JOBS, formatText } from '@/lib/data';
import { Search, TrendingUp, DollarSign, CheckCircle, ArrowRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [selectedState, setSelectedState] = useState<string>('nevada');
  const [selectedJob, setSelectedJob] = useState<string>('bartender');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCalculate = () => {
    setIsAnimating(true);
    // Simulate a brief "processing" moment for dopamine effect
    setTimeout(() => {
      router.push(`/calculator/${selectedState}/${selectedJob}`);
    }, 400);
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      
      {/* --- HERO SECTION --- */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pt-24 pb-32 relative z-10">
          <div className="flex flex-col items-center text-center">
            
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-800/50 border border-blue-700/50 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-blue-100 tracking-wide">UPDATED FOR 2026 OBBBA LEGISLATION</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Keep Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Hard Earned Money.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl leading-relaxed">
              The new "No Tax on Tips" and "No Tax on Overtime" laws are complex. Our algorithm reveals exactly how much you save.
            </p>

            {/* --- THE DOPAMINE SEARCH BOX --- */}
            <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md border border-white/20 p-4 md:p-6 rounded-3xl shadow-2xl ring-1 ring-white/10">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-inner flex flex-col md:flex-row items-center gap-4 md:gap-6">
                
                {/* State Input */}
                <div className="w-full relative group">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Where do you live?</label>
                  <div className="relative">
                    <select 
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 font-bold text-lg md:text-xl py-4 px-4 pl-12 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none appearance-none transition-all cursor-pointer hover:border-slate-300"
                    >
                      {STATES.map(s => <option key={s} value={s}>{formatText(s)}</option>)}
                    </select>
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                </div>

                {/* Arrow Icon (Desktop Only) */}
                <div className="hidden md:block text-slate-300 pt-6">
                  <ArrowRight className="w-6 h-6" />
                </div>

                {/* Job Input */}
                <div className="w-full relative group">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">What is your job?</label>
                  <div className="relative">
                    <select 
                      value={selectedJob}
                      onChange={(e) => setSelectedJob(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 font-bold text-lg md:text-xl py-4 px-4 pl-12 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none appearance-none transition-all cursor-pointer hover:border-slate-300"
                    >
                      {JOBS.map(j => <option key={j} value={j}>{formatText(j)}</option>)}
                    </select>
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                </div>

                {/* CTA Button */}
                <div className="w-full md:w-auto pt-6 md:pt-6"> {/* Align with inputs */}
                  <button 
                    onClick={handleCalculate}
                    className={`w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white text-lg font-bold py-4 px-8 rounded-xl shadow-lg shadow-blue-600/30 transition-all transform active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap ${isAnimating ? 'opacity-75 cursor-wait' : ''}`}
                  >
                    {isAnimating ? 'Calculating...' : 'See My Savings'}
                    {!isAnimating && <ArrowRight className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Micro-Copy */}
            <p className="mt-6 text-slate-400 text-sm">
              <span className="flex items-center gap-2 justify-center">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Free instant analysis 
                <span className="w-1 h-1 bg-slate-600 rounded-full mx-2"></span>
                <CheckCircle className="w-4 h-4 text-emerald-500" /> No sign-up required
              </span>
            </p>

          </div>
        </div>
      </section>

      {/* --- VALUE PROPS (Dopamine Triggers) --- */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">No Tax on Tips</h3>
            <p className="text-slate-600 leading-relaxed">
              The first <strong className="text-slate-900">$25,000</strong> of your tips are now 100% federal tax-free. Our calculator handles the complex "AGI phase-out" logic for you.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Overtime Freedom</h3>
            <p className="text-slate-600 leading-relaxed">
              Working extra hours? The new law exempts up to <strong className="text-slate-900">$12,500</strong> of overtime pay. See how much that extra shift is actually worth.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
             <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <Search className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">State-Specific</h3>
            <p className="text-slate-600 leading-relaxed">
              Federal laws are one thing, but State taxes are another. We calculate the <strong>exact blend</strong> for all 50 states to give you the real "Net Pay" number.
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}