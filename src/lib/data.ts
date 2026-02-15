// src/lib/data.ts

export const STATES = [
  "alabama", "alaska", "arizona", "arkansas", "california", "colorado", 
  "connecticut", "delaware", "florida", "georgia", "hawaii", "idaho", 
  "illinois", "indiana", "iowa", "kansas", "kentucky", "louisiana", 
  "maine", "maryland", "massachusetts", "michigan", "minnesota", 
  "mississippi", "missouri", "montana", "nebraska", "nevada", 
  "new-hampshire", "new-jersey", "new-mexico", "new-york", 
  "north-carolina", "north-dakota", "ohio", "oklahoma", "oregon", 
  "pennsylvania", "rhode-island", "south-carolina", "south-dakota", 
  "tennessee", "texas", "utah", "vermont", "virginia", "washington", 
  "west-virginia", "wisconsin", "wyoming"
];

export const JOBS = [
  // Tipped Roles (Direct beneficiaries of "No Tax on Tips")
  "bartender", "server", "waitress", "waiter", "delivery-driver", 
  "uber-driver", "hair-stylist", "barber", "valet", "casino-dealer", 
  "stripper", "dancer", "caddy", "bellhop", "doorman",
  
  // Overtime Heavy Roles (Beneficiaries of "No Tax on Overtime")
  "nurse", "travel-nurse", "police-officer", "firefighter", 
  "paramedic", "factory-worker", "warehouse-associate", 
  "truck-driver", "oil-rig-worker", "construction-worker", 
  "electrician", "plumber", "hvac-technician", "longshoreman",
  
  // Gig Economy
  "instacart-shopper", "doordash-driver", "lyft-driver", 
  "amazon-flex-driver", "freelancer"
];

// Helper to format text (e.g., "new-york" -> "New York")
export const formatText = (slug: string) => {
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};