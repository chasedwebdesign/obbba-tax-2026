const { google } = require('googleapis');

// --- CONFIGURATION ---
const DOMAIN = 'https://obbba-tax-2026.vercel.app'; 

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

// --- AUTHENTICATION (Cloud Compatible) ---
// We try to read the JSON from the Environment Variable first.
let credentials;
try {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  } else {
    // Fallback for local testing if you still have the file
    credentials = require('../service_account.json');
  }
} catch (error) {
  console.error("❌ CRITICAL ERROR: Could not find Google Credentials.");
  console.error("Make sure GOOGLE_SERVICE_ACCOUNT_JSON is set in GitHub Secrets.");
  process.exit(1);
}

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/indexing'],
});

async function main() {
  console.log('🚀 Authenticating with Google...');
  
  const client = await auth.getClient();

  // 1. Generate URLs
  let urls = [];
  STATES.forEach(state => {
    JOBS.forEach(job => {
      // Create the URL (e.g., /calculator/nevada/bartender)
      urls.push(`${DOMAIN}/calculator/${state}/${job}`);
    });
  });

  console.log(`📋 Generated ${urls.length} URLs to index.`);

  // 2. Submit in Batches
  // We use a simple loop to avoid hitting rate limits
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    await submitUrl(client, url);
    
    // Sleep for 1 second every 20 requests to be safe
    if (i % 20 === 0 && i > 0) {
       console.log('zzz Sleeping for rate limits...');
       await new Promise(r => setTimeout(r, 1000));
    }
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
    // Only log success (saves clutter in logs)
    if (result.status === 200) {
      console.log(`Indexed: ${url}`);
    }
  } catch (error) {
    console.error(`❌ Error indexing ${url}:`, error.message);
  }
}

main();