// src/lib/data.ts

// 1. STATE TAX RATES (Averages for 2026 estimation)
export const STATE_TAX_RATES: Record<string, number> = {
  "alabama": 0.04, "alaska": 0.00, "arizona": 0.025, "arkansas": 0.049,
  "california": 0.093, "colorado": 0.044, "connecticut": 0.06, "delaware": 0.05,
  "florida": 0.00, "georgia": 0.0549, "hawaii": 0.09, "idaho": 0.058,
  "illinois": 0.0495, "indiana": 0.0315, "iowa": 0.057, "kansas": 0.057,
  "kentucky": 0.04, "louisiana": 0.0425, "maine": 0.058, "maryland": 0.0575,
  "massachusetts": 0.05, "michigan": 0.0425, "minnesota": 0.07, "mississippi": 0.05,
  "missouri": 0.048, "montana": 0.059, "nebraska": 0.0584, "nevada": 0.00,
  "new-hampshire": 0.00, "new-jersey": 0.06, "new-mexico": 0.059, "new-york": 0.065,
  "north-carolina": 0.045, "north-dakota": 0.02, "ohio": 0.035, "oklahoma": 0.0475,
  "oregon": 0.08, "pennsylvania": 0.0307, "rhode-island": 0.0599, "south-carolina": 0.064,
  "south-dakota": 0.00, "tennessee": 0.00, "texas": 0.00, "utah": 0.0465,
  "vermont": 0.07, "virginia": 0.0575, "washington": 0.00, "west-virginia": 0.05,
  "wisconsin": 0.053, "wyoming": 0.00
};

export const STATES = Object.keys(STATE_TAX_RATES);

// 2. JOB PROFILES (The "Brain")
// We define "Archetypes" so a Nurse looks different than a Bartender.
type JobProfile = {
  base: number;      // Base Salary
  tips: number;      // Average Tips
  overtime: number;  // Average Overtime Pay
};

export const JOB_PROFILES: Record<string, JobProfile> = {
  // High Tips, Low Base
  "bartender": { base: 32000, tips: 45000, overtime: 2000 },
  "server": { base: 28000, tips: 38000, overtime: 1500 },
  "waitress": { base: 28000, tips: 38000, overtime: 1500 },
  "waiter": { base: 28000, tips: 38000, overtime: 1500 },
  "casino-dealer": { base: 35000, tips: 55000, overtime: 5000 },
  "stripper": { base: 15000, tips: 85000, overtime: 0 },
  "valet": { base: 25000, tips: 20000, overtime: 1000 },
  "bellhop": { base: 26000, tips: 18000, overtime: 2000 },
  
  // High Overtime, High Base
  "nurse": { base: 82000, tips: 0, overtime: 18000 },
  "travel-nurse": { base: 110000, tips: 0, overtime: 25000 },
  "police-officer": { base: 65000, tips: 0, overtime: 15000 },
  "firefighter": { base: 58000, tips: 0, overtime: 22000 },
  "paramedic": { base: 48000, tips: 0, overtime: 14000 },
  "longshoreman": { base: 60000, tips: 0, overtime: 40000 },
  "oil-rig-worker": { base: 75000, tips: 0, overtime: 35000 },
  
  // Gig / Driving (Mixed)
  "uber-driver": { base: 45000, tips: 8000, overtime: 0 },
  "delivery-driver": { base: 35000, tips: 12000, overtime: 0 },
  "hair-stylist": { base: 30000, tips: 22000, overtime: 0 },
  "electrician": { base: 62000, tips: 2000, overtime: 12000 },
  "plumber": { base: 60000, tips: 1000, overtime: 15000 },
};

export const JOBS = Object.keys(JOB_PROFILES);

// Fallback for jobs we missed (generic average)
export const DEFAULT_PROFILE: JobProfile = { base: 50000, tips: 5000, overtime: 5000 };

export const getJobProfile = (job: string): JobProfile => {
  return JOB_PROFILES[job] || DEFAULT_PROFILE;
};

export const formatText = (slug: string) => {
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};