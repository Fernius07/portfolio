import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const PROFILE_PATH = join(process.cwd(), 'public', 'linkedin-profile.json');
const GITHUB_USER = process.env.GITHUB_USERNAME || 'Fernius07';

async function main() {
  const currentRaw = await readFile(PROFILE_PATH, 'utf8');
  const current = JSON.parse(currentRaw);

  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'Fernius07-Portfolio-Sync',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const userRes = await fetch(`https://api.github.com/users/${GITHUB_USER}`, { headers });
    if (userRes.ok) {
      const ghUser = await userRes.json();
      if (ghUser.name) current.fullName = ghUser.name;
      if (ghUser.location) current.homeAirport.city = ghUser.location;
    }
  } catch (err) {
    console.warn('GitHub sync skipped:', err.message);
  }

  if (process.env.PROXYCURL_API_KEY) {
    try {
      const url = process.env.LINKEDIN_PROFILE_URL || current.profileUrl;
      const liRes = await fetch(
        `https://nubela.co/proxycurl/api/v2/linkedin?url=${encodeURIComponent(url)}&use_cache=if-recent`,
        { headers: { Authorization: `Bearer ${process.env.PROXYCURL_API_KEY}` } }
      );
      if (liRes.ok) {
        const li = await liRes.json();
        if (li.headline) current.headline = { es: li.headline, en: li.headline };
        if (li.summary) current.summary = { es: li.summary, en: li.summary };
        current.syncMode = 'proxycurl-synced';
      }
    } catch (err) {
      console.warn('LinkedIn Proxycurl sync skipped:', err.message);
    }
  }

  current.lastUpdated = new Date().toISOString();
  await writeFile(PROFILE_PATH, JSON.stringify(current, null, 2) + '\n', 'utf8');
  console.log('Profile telemetry synced:', current.lastUpdated);
}

main();
