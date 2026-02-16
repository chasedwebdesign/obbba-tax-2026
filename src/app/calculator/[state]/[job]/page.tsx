import { STATES, JOBS, formatText, getJobProfile, STATE_TAX_RATES } from '@/lib/data';
import { Metadata } from 'next';
import Link from 'next/link';
import TaxCalculator from '@/components/TaxCalculator'; // <--- ONLY this component remains

// 1. GENERATE STATIC PARAMS
export async function generateStaticParams() {
  const params = [];
  for (const state of STATES) {
    for (const job of JOBS) {
      params.push({ state, job });
    }
  }
  return params;
}

// 2. DYNAMIC SEO METADATA
type Props = {
  params: Promise<{ state: string; job: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const stateName = formatText(resolvedParams.state);
  const jobName = formatText(resolvedParams.job);
  
  return {
    title: `${jobName} Tax Calculator ${stateName} 2026 | No Tax on Tips`,
    description: `Are you a ${jobName} in ${stateName}? Calculate your 2026 savings with the new OBBBA Tip and Overtime deductions. Instant & Free.`
  };
}

// 3. THE PAGE UI
export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const stateName = formatText(resolvedParams.state);
  const jobName = formatText(resolvedParams.job);

  // Get Data
  const profile = getJobProfile(resolvedParams.job);
  const stateRate = STATE_TAX_RATES[resolvedParams.state] !== undefined 
    ? STATE_TAX_RATES[resolvedParams.state] 
    : 0.05;

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="text-sm text-slate-400 mb-6 font-medium">
          <Link href="/" className="hover:text-emerald-500 transition">Home</Link> 
          <span className="mx-2">/</span> 
          {stateName} 
          <span className="mx-2">/</span> 
          {jobName}
        </div>

        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
          The 2026 Tax Calculator for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500">{jobName}s</span> in {stateName}
        </h1>
        
        <p className="text-lg text-slate-600 mb-10 leading-relaxed">
          If you work as a <strong>{jobName}</strong> in <strong>{stateName}</strong>, the new 2026 "No Tax on Tips" and "No Tax on Overtime" laws (OBBBA) significantly change your effective tax rate.
        </p>

        {/* Scenario Explanation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-sm text-blue-800 shadow-sm">
           <div className="flex items-start gap-3">
             <div className="mt-1 min-w-[4px] min-h-[4px] rounded-full bg-blue-500" />
             <p>
               <strong>Your Specialized Scenario:</strong> We initialized this calculation for a typical {jobName} in {stateName} earning 
               <span className="font-bold"> ${profile.base.toLocaleString()} base</span>, 
               <span className="font-bold"> ${profile.tips.toLocaleString()} in tips</span>, and 
               <span className="font-bold"> ${profile.overtime.toLocaleString()} in overtime</span>.
             </p>
           </div>
        </div>

        {/* Interactive Calculator (Buy Button is INSIDE here now) */}
        <TaxCalculator 
          initialBase={profile.base}
          initialTips={profile.tips}
          initialOvertime={profile.overtime}
          stateName={stateName}
          stateRate={stateRate}
        />

        {/* NO <BuyButton /> HERE - It was causing the crash! */}

      </div>
    </main>
  );
}