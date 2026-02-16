'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { STATES, JOBS, formatText } from '@/lib/data';
import { Search, TrendingUp, DollarSign, CheckCircle, ArrowRight, ChevronDown, Check } from 'lucide-react';

// --- CUSTOM COMPONENT: SEARCHABLE DROPDOWN (Fixed & Polished) ---
function SearchableSelect({ 
  options, 
  value, 
  onChange, 
  placeholder, 
  icon: Icon 
}: { 
  options: string[], 
  value: string, 
  onChange: (val: string) => void, 
  placeholder: string,
  icon: any
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  // Focus input when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to allow animation to start
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Filter options
  const filteredOptions = options.filter(opt => 
    formatText(opt).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full relative group text-left" ref={wrapperRef}>
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
        {placeholder}
      </label>
      
      <div 
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* The "Display" Box */}
        <div className={`w-full bg-slate-50 text-slate-900 font-bold text-lg md:text-xl py-4 px-4 pl-12 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${isOpen ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-slate-200 hover:border-slate-300'}`}>
          <span className="truncate">{value ? formatText(value) : "Select..."}</span>
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
        </div>
        
        {/* The Icon */}
        <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 transition-colors ${isOpen ? 'text-blue-500' : 'text-slate-400'}`} />

        {/* The Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100 origin-top">
            
            {/* Search Input Area */}
            <div className="p-2 border-b border-slate-100 bg-slate-50/50">
              <input
                ref={inputRef}
                type="text"
                className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Type to search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()} 
              />
            </div>
            
            {/* Options List */}
            <div className="overflow-y-auto max-h-[240px] scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              {filteredOptions.length === 0 ? (
                <div className="p-8 text-sm text-slate-400 text-center flex flex-col items-center gap-2">
                   <Search className="w-4 h-4 opacity-50" />
                   <span>No matches found</span>
                </div>
              ) : (
                filteredOptions.map(opt => (
                  <div
                    key={opt}
                    className={`px-4 py-2.5 cursor-pointer text-sm font-medium transition-colors flex items-center justify-between group ${value === opt ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(opt);
                      setIsOpen(false);
                      setSearch('');
                    }}
                  >
                    <span>{formatText(opt)}</span>
                    {value === opt && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function Home() {
  const router = useRouter();
  const [selectedState, setSelectedState] = useState<string>('nevada');
  const [selectedJob, setSelectedJob] = useState<string>('bartender');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCalculate = () => {
    setIsAnimating(true);
    setTimeout(() => {
      router.push(`/calculator/${selectedState}/${selectedJob}`);
    }, 400);
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      
      {/* --- HERO SECTION --- */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
        
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pt-24 pb-32 relative z-10">
          <div className="flex flex-col items-center text-center">
            
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-800/50 border border-blue-700/50 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm shadow-lg shadow-blue-900/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-blue-100 tracking-wide">UPDATED FOR 2026 OBBBA LEGISLATION</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight drop-shadow-sm">
              Keep Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Hard Earned Money.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl leading-relaxed">
              The new "No Tax on Tips" and "No Tax on Overtime" laws are complex. Our algorithm reveals exactly how much you save.
            </p>

            {/* --- THE UPGRADED SEARCH BOX --- */}
            <div className="w-full max-w-5xl bg-white/10 backdrop-blur-md border border-white/20 p-4 md:p-6 rounded-3xl shadow-2xl ring-1 ring-white/10">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-inner flex flex-col md:flex-row items-center gap-4 md:gap-6">
                
                {/* Searchable State Input */}
                <SearchableSelect 
                  options={STATES} 
                  value={selectedState} 
                  onChange={setSelectedState} 
                  placeholder="Where do you live?"
                  icon={Search}
                />

                {/* Arrow Icon */}
                <div className="hidden md:block text-slate-300 pt-6">
                  <ArrowRight className="w-6 h-6" />
                </div>

                {/* Searchable Job Input */}
                <SearchableSelect 
                  options={JOBS} 
                  value={selectedJob} 
                  onChange={setSelectedJob} 
                  placeholder="What is your job?"
                  icon={DollarSign}
                />

                {/* CTA Button */}
                <div className="w-full md:w-auto pt-6 md:pt-6">
                  <button 
                    onClick={handleCalculate}
                    className={`w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white text-lg font-bold py-4 px-8 rounded-xl shadow-lg shadow-blue-600/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 whitespace-nowrap ${isAnimating ? 'opacity-75 cursor-wait' : ''}`}
                  >
                    {isAnimating ? 'Calculating...' : 'See My Savings'}
                    {!isAnimating && <ArrowRight className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Micro-Copy */}
            <p className="mt-6 text-slate-400 text-sm font-medium">
              <span className="flex items-center gap-2 justify-center">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Free instant analysis 
                <span className="w-1 h-1 bg-slate-600 rounded-full mx-2"></span>
                <CheckCircle className="w-4 h-4 text-emerald-500" /> No sign-up required
              </span>
            </p>

          </div>
        </div>
      </section>

      {/* --- VALUE PROPS --- */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:-translate-y-1 transition-transform duration-300 group">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">No Tax on Tips</h3>
            <p className="text-slate-600 leading-relaxed">
              The first <strong className="text-slate-900">$25,000</strong> of your tips are now 100% federal tax-free. Our calculator handles the complex "AGI phase-out" logic for you.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:-translate-y-1 transition-transform duration-300 group">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Overtime Freedom</h3>
            <p className="text-slate-600 leading-relaxed">
              Working extra hours? The new law exempts up to <strong className="text-slate-900">$12,500</strong> of overtime pay. See how much that extra shift is actually worth.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:-translate-y-1 transition-transform duration-300 group">
             <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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