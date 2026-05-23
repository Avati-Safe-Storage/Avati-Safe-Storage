import fs from 'fs';
import path from 'path';

// Helper to parse key-value env files
function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf-8');
  const env = {};
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const parts = trimmed.split('=');
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim();
    env[key] = value;
  });
  return env;
}

async function run() {
  const rootDir = process.cwd();
  const devVarsPath = path.join(rootDir, '.dev.vars');
  
  if (!fs.existsSync(devVarsPath)) {
    console.error(`\x1b[31mError: .dev.vars file not found at ${devVarsPath}\x1b[0m`);
    process.exit(1);
  }

  const env = parseEnvFile(devVarsPath);
  const clientId = env.ZOHO_CLIENT_ID;
  const clientSecret = env.ZOHO_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('\x1b[31mError: ZOHO_CLIENT_ID or ZOHO_CLIENT_SECRET is missing from .dev.vars!\x1b[0m');
    process.exit(1);
  }

  // Get code from CLI args
  const code = process.argv[2];
  
  // Resolve redirect URI from multiple potential sources
  const enterpriseEnvPath = path.join(rootDir, 'avati-enterprise', '.env');
  const enterpriseEnv = parseEnvFile(enterpriseEnvPath);
  const redirectUri = process.argv[3] || env.ZOHO_REDIRECT_URI || enterpriseEnv.VITE_ZOHO_REDIRECT_URI || 'http://localhost:5173/auth/zoho/callback';

  if (!code) {
    console.log('\n\x1b[36m=== Zoho Authorization Code Exchange Utility ===\x1b[0m');
    console.log('To exchange a temporary Zoho code for a persistent refresh token, run:');
    console.log('\x1b[33mnode scripts/exchange-code.js <AUTHORIZATION_CODE> [REDIRECT_URI]\x1b[0m\n');
    console.log(`Current Resolved Redirect URI: \x1b[32m${redirectUri}\x1b[0m`);
    console.log('Ensure this redirect URI matches the one authorized in your Zoho API Console.');
    process.exit(0);
  }

  const tokenUrl = 'https://accounts.zoho.in/oauth/v2/token';

  console.log(`\n\x1b[36mExchanging code with Zoho India (${tokenUrl})...\x1b[0m`);

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code: code.trim()
      })
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error('\n\x1b[31m=== Exchange Failed ===\x1b[0m');
      console.error('Zoho Error:', data.error || 'Unknown error');
      console.error('Details:', data);
      console.error('\n\x1b[33mHint: Make sure the authorization code is fresh (expires in 10 minutes) and redirect_uri matches your Zoho API console settings exactly.\x1b[0m\n');
      process.exit(1);
    }

    console.log('\n\x1b[32m=== Exchange Successful! ===\x1b[0m');
    console.log(`Access Token:  ${data.access_token.substring(0, 15)}... (expires in ${data.expires_in}s)`);
    console.log(`Refresh Token: \x1b[35m${data.refresh_token}\x1b[0m`);
    console.log('\n\x1b[36m=== Next Steps ===\x1b[0m');
    console.log('1. Open your \x1b[33m.dev.vars\x1b[0m file.');
    console.log(`2. Replace the line for ZOHO_REFRESH_TOKEN with:\n   \x1b[32mZOHO_REFRESH_TOKEN=${data.refresh_token}\x1b[0m`);
    console.log('3. Restart Wrangler server to load the updated secrets.\n');

  } catch (error) {
    console.error('\x1b[31mNetwork or execution error:\x1b[0m', error);
  }
}

run();
