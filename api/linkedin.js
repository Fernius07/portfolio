import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const DEFAULT_LINKEDIN_URL = 'https://www.linkedin.com/in/i%C3%B1igo-fernandez-garcia/';

function mapProxycurlToProfile(raw, baseProfile) {
  const fullName = raw.full_name || `${raw.first_name || ''} ${raw.last_name || ''}`.trim() || baseProfile.fullName;
  const city = [raw.city, raw.state, raw.country_full_name].filter(Boolean).join(', ');

  const experience = Array.isArray(raw.experiences) && raw.experiences.length > 0
    ? raw.experiences.slice(0, 6).map((item, idx) => ({
        id: `li-exp-${idx}`,
        period: `${item.starts_at?.year || '2024'} — ${item.ends_at?.year || 'Presente'}`,
        flightTag: `LI-OPS-${idx + 1}`,
        role: {
          es: item.title || 'Engineering Role',
          en: item.title || 'Engineering Role',
        },
        organization: item.company || 'Organization',
        highlights: {
          es: item.description ? item.description.split('\n').filter(Boolean).slice(0, 3) : baseProfile.experience[0]?.highlights.es || [],
          en: item.description ? item.description.split('\n').filter(Boolean).slice(0, 3) : baseProfile.experience[0]?.highlights.en || [],
        },
      }))
    : baseProfile.experience;

  const education = Array.isArray(raw.education) && raw.education.length > 0
    ? raw.education.slice(0, 4).map((edu, idx) => ({
        id: `li-edu-${idx}`,
        period: `${edu.starts_at?.year || '2023'} — ${edu.ends_at?.year || 'Presente'}`,
        airportCode: 'LEBB · EDU',
        institution: edu.school || 'Universidad de Deusto',
        degree: {
          es: `${edu.degree_name || 'Grado'}${edu.field_of_study ? ` · ${edu.field_of_study}` : ''}`,
          en: `${edu.degree_name || 'Degree'}${edu.field_of_study ? ` · ${edu.field_of_study}` : ''}`,
        },
        focus: {
          es: edu.description || baseProfile.education[0]?.focus.es || '',
          en: edu.description || baseProfile.education[0]?.focus.en || '',
        },
        status: edu.ends_at ? 'COMPLETED' : 'EN ROUTE',
      }))
    : baseProfile.education;

  return {
    ...baseProfile,
    fullName,
    homeAirport: {
      ...baseProfile.homeAirport,
      city: city || baseProfile.homeAirport.city,
    },
    headline: raw.headline
      ? { es: raw.headline, en: raw.headline }
      : baseProfile.headline,
    summary: raw.summary
      ? { es: raw.summary, en: raw.summary }
      : baseProfile.summary,
    experience,
    education,
    lastUpdated: new Date().toISOString(),
    syncMode: 'proxycurl-live',
  };
}

export default async function handler(req, res) {
  let baseProfile = null;
  try {
    const filePath = join(process.cwd(), 'public', 'linkedin-profile.json');
    const rawJson = await readFile(filePath, 'utf8');
    baseProfile = JSON.parse(rawJson);
  } catch {
    baseProfile = {
      fullName: 'Iñigo Fernández García',
      profileUrl: DEFAULT_LINKEDIN_URL,
      experience: [],
      education: [],
      skills: [],
      certifications: [],
      spokenLanguages: [],
    };
  }

  // Option 1: Remote custom JSON URL (e.g. GitHub Gist or private CMS updated from LinkedIn)
  if (process.env.LINKEDIN_JSON_URL) {
    try {
      const remoteRes = await fetch(process.env.LINKEDIN_JSON_URL);
      if (remoteRes.ok) {
        const remoteProfile = await remoteRes.json();
        res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
        return res.status(200).json({
          ...baseProfile,
          ...remoteProfile,
          syncMode: 'remote-json-live',
          lastUpdated: remoteProfile.lastUpdated || new Date().toISOString(),
        });
      }
    } catch {
      // Fall through cleanly to next provider or local JSON
    }
  }

  // Option 2: Proxycurl live LinkedIn profile sync (when PROXYCURL_API_KEY is configured in Vercel)
  if (process.env.PROXYCURL_API_KEY) {
    try {
      const targetUrl = process.env.LINKEDIN_PROFILE_URL || DEFAULT_LINKEDIN_URL;
      const apiRes = await fetch(
        `https://nubela.co/proxycurl/api/v2/linkedin?url=${encodeURIComponent(targetUrl)}&use_cache=if-recent`,
        {
          headers: { Authorization: `Bearer ${process.env.PROXYCURL_API_KEY}` },
        }
      );
      if (apiRes.ok) {
        const raw = await apiRes.json();
        const mapped = mapProxycurlToProfile(raw, baseProfile);
        res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
        return res.status(200).json(mapped);
      }
    } catch {
      // Fall through cleanly to local JSON
    }
  }

  // Option 3: RapidAPI Fresh LinkedIn Profile Data (when RAPIDAPI_LINKEDIN_KEY is configured)
  if (process.env.RAPIDAPI_LINKEDIN_KEY) {
    try {
      const targetUrl = process.env.LINKEDIN_PROFILE_URL || DEFAULT_LINKEDIN_URL;
      const rapidRes = await fetch(
        `https://fresh-linkedin-profile-data.p.rapidapi.com/get-linkedin-profile?linkedin_url=${encodeURIComponent(targetUrl)}&include_skills=true`,
        {
          headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_LINKEDIN_KEY,
            'x-rapidapi-host': 'fresh-linkedin-profile-data.p.rapidapi.com',
          },
        }
      );
      if (rapidRes.ok) {
        const payload = await rapidRes.json();
        const data = payload?.data || payload;
        const mapped = mapProxycurlToProfile(data, baseProfile);
        mapped.syncMode = 'rapidapi-live';
        res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
        return res.status(200).json(mapped);
      }
    } catch {
      // Fall through cleanly to local JSON
    }
  }

  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  return res.status(200).json({
    ...baseProfile,
    syncMode: baseProfile.syncMode || 'linked-json',
  });
}
