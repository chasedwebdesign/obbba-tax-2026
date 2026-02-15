// src/app/calculator/[state]/[job]/page.tsx
import { STATES, JOBS, formatText } from '@/lib/data';
import { calculateObbbaTax } from '@/lib/tax-engine';
import { Metadata } from 'next';
import Link from 'next/link';

// 1. GENERATE STATIC PARAMS (Stays the same)
export async function generateStaticParams() {
  const params = [];
  for (const state of STATES) {
    for (const job of JOBS) {
      params.push({ state, job });
    }
  }
  return params;
}

// 2. DYNAMIC SEO METADATA (Updated for Next.js 15+)
type Props = {
  params: Promise<{ state: string; job: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params; // <--- This await is the fix
  const stateName = formatText(resolvedParams.state);
  const jobName = formatText(resolvedParams.job);
  
  return {
    title: `${jobName} Tax Calculator ${stateName} 2026 | No Tax on Tips`,
    description: `Are you a ${jobName} in ${stateName}? Calculate your 2026 savings with the new OBBBA Tip and Overtime deductions. Instant & Free.`
  };
}

// 3. THE PAGE UI (Updated to Async Component)
export default async function Page({ params }: Props) {
  const resolvedParams = await params; // <--- This await is the fix
  const stateName = formatText(resolvedParams.state);
  const jobName = formatText(resolvedParams.job);

  // Default "Example" Calculation
  const exampleStats = calculateObbbaTax({
    income: 50000,
    tips: 15000,
    overtime: 5000,
    state: resolvedParams.state,
    filingStatus: 'single'
  });

  return (
    <main className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Breadcrumb Navigation */}
        <div className="text-sm text-slate-500 mb-4">
          <Link href="/" className="hover:underline">Home</Link> &gt; {stateName} &gt; {jobName}
        </div>

        {/* Dynamic Header */}
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
          The 2026 Tax Calculator for <span className="text-blue-600">{jobName}s</span> in {stateName}
        </h1>
        
        <p className="text-lg text-slate-700 mb-8">
          If you work as a <strong>{jobName}</strong> in <strong>{stateName}</strong>, the new "No Tax on Tips" and "No Tax on Overtime" laws (OBBBA) could save you thousands.
        </p>

        {/* The "Hero" Savings Card */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-slate-700">Estimated 2026 Savings</h3>
              <p className="text-sm text-slate-500">Based on avg {jobName} income</p>
            </div>
            <div className="text-5xl font-bold text-green-600 mt-4 md:mt-0">
              ${exampleStats.savings.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Tax-Free Tips</p>
              <p className="text-lg font-bold text-slate-900">${exampleStats.deductibleTips.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Tax-Free Overtime</p>
              <p className="text-lg font-bold text-slate-900">${exampleStats.deductibleOvertime.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-2">Want your exact number?</h3>
          <p className="text-blue-700 mb-4">
            This is an estimate. Enter your exact pay stubs to see precisely what you will owe in April 2026.
          </p>
          <button className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition w-full md:w-auto">
            Calculate My Specific Scenario
          </button>
        </div>

      </div>
    </main>
  );
}