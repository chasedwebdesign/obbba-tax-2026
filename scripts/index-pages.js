// scripts/index-pages.js
const { google } = require('googleapis');
const path = require('path');

// --- CONFIGURATION ---
const DOMAIN = 'https://obbba-tax-2026.vercel.app'; // <--- Your Vercel URL
const KEY_PATH = path.join(__dirname, '..', 'service_account.json');

// --- DATA LISTS ---
const STATES = [
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

const JOBS = [
  "bartender", "server", "waitress", "waiter", "delivery-driver", 
  "uber-driver", "hair-stylist", "barber", "valet", "casino-dealer", 
  "stripper", "dancer", "caddy", "bellhop", "doorman",
  "nurse", "travel-nurse", "police-officer", "firefighter", 
  "paramedic", "factory-worker", "warehouse-associate", 
  "truck-driver", "oil-rig-worker", "construction-worker", 
  "electrician", "plumber", "hvac-technician", "longshoreman",
  "instacart-shopper", "doordash-driver", "lyft-driver", 
  "amazon-flex-driver", "freelancer"
];

// --- AUTHENTICATION (The New Method) ---
const auth = new google.auth.GoogleAuth({
  keyFile: KEY_PATH, // <--- This forces it to read the file directly
  scopes: ['https://www.googleapis.com/auth/indexing'],
});

// --- EXECUTION ---
async function main() {
  console.log('🚀 Authenticating with Google...');
  
  // Create the client using the file path
  const client = await auth.getClient();

  // 1. Generate URLs
  let urls = [];
  STATES.forEach(state => {
    JOBS.forEach(job => {
      urls.push(`${DOMAIN}/calculator/${state}/${job}`);
    });
  });

  console.log(`📋 Generated ${urls.length} URLs to index.`);

  // 2. Submit in Batches
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    await submitUrl(client, url);
    // Google Indexing API limit is strictly enforced. 
    // We sleep 600ms to be safe.
    await new Promise(resolve => setTimeout(resolve, 600)); 
  }
  
  console.log('✅ Done!');
}

async function submitUrl(authClient, url) {
  try {
    const result = await authClient.request({
      url: 'https://indexing.googleapis.com/v3/urlNotifications:publish',
      method: 'POST',
      data: {
        url: url,
        type: 'URL_UPDATED'
      }
    });
    console.log(`[${result.status}] Indexed: ${url}`);
  } catch (error) {
    console.error(`❌ Error indexing ${url}:`, error.message);
  }
}

main();