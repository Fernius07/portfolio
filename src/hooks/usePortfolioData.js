import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FALLBACK_GITHUB_EVENTS,
  FALLBACK_GITHUB_REPOS,
  FALLBACK_GITHUB_USER,
  FALLBACK_LINKEDIN_PROFILE,
  GITHUB_USERNAME,
  REPO_CURATED_META,
} from '../data/fallbackData';

const CACHE_KEY = 'fernius07_aviation_telemetry_v1';
const CACHE_TTL_MS = 5 * 60 * 1000;

function readStorageCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStorageCache(payload) {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        ...payload,
      })
    );
  } catch {
    // Ignore storage quota errors
  }
}

function deriveFlightStatus(repo) {
  const hasHomepage = Boolean(repo.homepage && repo.homepage.trim().length > 0);
  if (hasHomepage) return 'BOARDING';

  const updatedMs = repo.updated_at ? new Date(repo.updated_at).getTime() : 0;
  const ageDays = (Date.now() - updatedMs) / (1000 * 60 * 60 * 24);
  if (ageDays <= 45) return 'IN FLIGHT';
  return 'LANDED';
}

function buildFlightRecord(repo, index, language) {
  const meta = REPO_CURATED_META[repo.name];
  const flightCode = meta?.flightCode || `IFG-${String(800 + index).padStart(3, '0')}`;
  const status = deriveFlightStatus(repo);
  const sector = meta?.sector || (repo.language === 'Python' || repo.language === 'TypeScript' ? 'fullstack' : 'utilities');

  const liveDesc = repo.description && repo.description.trim().length > 0 ? repo.description.trim() : null;
  const fallbackDesc = meta ? meta[language] || meta.en : null;
  const autoDesc =
    language === 'es'
      ? `Proyecto ${repo.language || 'Software'} sincronizado en vivo desde GitHub.`
      : `${repo.language || 'Software'} repository synced live from GitHub.`;

  const remarks = liveDesc || fallbackDesc || autoDesc;
  const destCode = meta?.destCode || `${(repo.language || 'DEV').slice(0, 3).toUpperCase()} → GH`;

  const tags = Array.from(
    new Set([...(Array.isArray(repo.topics) ? repo.topics : []), ...(meta?.tags || []), repo.language].filter(Boolean))
  ).slice(0, 4);

  return {
    ...repo,
    flightCode,
    status,
    sector,
    destCode,
    remarks,
    tags,
    gate: (repo.language || 'CORE').slice(0, 4).toUpperCase(),
  };
}

export function usePortfolioData(language) {
  const [githubUser, setGithubUser] = useState(FALLBACK_GITHUB_USER);
  const [rawRepos, setRawRepos] = useState(FALLBACK_GITHUB_REPOS);
  const [events, setEvents] = useState(FALLBACK_GITHUB_EVENTS);
  const [linkedin, setLinkedin] = useState(FALLBACK_LINKEDIN_PROFILE);
  const [syncSource, setSyncSource] = useState('fallback');
  const [loading, setLoading] = useState(true);
  const [lastSynced, setLastSynced] = useState(() => new Date().toISOString());

  const fetchAll = useCallback(async (force = false) => {
    if (force) setLoading(true);

    if (!force) {
      const cached = readStorageCache();
      if (cached) {
        if (cached.user) setGithubUser(cached.user);
        if (cached.repos?.length) setRawRepos(cached.repos);
        if (cached.events?.length) setEvents(cached.events);
        if (cached.linkedin) setLinkedin(cached.linkedin);
        setSyncSource('cached');
        setLastSynced(new Date(cached.timestamp).toISOString());
        setLoading(false);
        return;
      }
    }

    let nextUser = null;
    let nextRepos = null;
    let nextEvents = null;
    let nextLinkedin = null;
    let liveSuccess = false;

    // 1. Try Vercel Serverless GitHub API first (/api/github)
    try {
      const apiRes = await fetch('/api/github');
      const contentType = apiRes.headers.get('content-type') || '';
      if (apiRes.ok && contentType.includes('application/json')) {
        const data = await apiRes.json();
        if (data?.user && Array.isArray(data?.repos)) {
          nextUser = data.user;
          nextRepos = data.repos;
          nextEvents = data.events || [];
          liveSuccess = true;
        }
      }
    } catch {
      // Fallback to direct GitHub REST API when running locally under Vite dev
    }

    // 2. Fallback to direct public GitHub API (for `vite dev` or GitHub Pages)
    if (!liveSuccess) {
      try {
        const [uRes, rRes, eRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=15`),
        ]);
        if (uRes.ok && rRes.ok) {
          nextUser = await uRes.json();
          nextRepos = await rRes.json();
          nextEvents = eRes.ok ? await eRes.json() : FALLBACK_GITHUB_EVENTS;
          liveSuccess = true;
        }
      } catch {
        // Offline or rate-limited -> keep fallback snapshot
      }
    }

    // 3. Fetch LinkedIn sync endpoint (/api/linkedin -> /linkedin-profile.json)
    try {
      const liRes = await fetch('/api/linkedin');
      const ct = liRes.headers.get('content-type') || '';
      if (liRes.ok && ct.includes('application/json')) {
        nextLinkedin = await liRes.json();
      } else {
        const localRes = await fetch('/linkedin-profile.json');
        if (localRes.ok) {
          nextLinkedin = await localRes.json();
        }
      }
    } catch {
      try {
        const localRes = await fetch('/linkedin-profile.json');
        if (localRes.ok) {
          nextLinkedin = await localRes.json();
        }
      } catch {
        // Keep fallback LinkedIn object
      }
    }

    if (nextUser) setGithubUser(nextUser);
    if (Array.isArray(nextRepos) && nextRepos.length > 0) setRawRepos(nextRepos);
    if (Array.isArray(nextEvents) && nextEvents.length > 0) setEvents(nextEvents);
    if (nextLinkedin) setLinkedin(nextLinkedin);

    if (liveSuccess) {
      writeStorageCache({
        user: nextUser,
        repos: nextRepos,
        events: nextEvents,
        linkedin: nextLinkedin || FALLBACK_LINKEDIN_PROFILE,
      });
      setSyncSource('live');
    } else {
      setSyncSource('fallback');
    }

    setLastSynced(new Date().toISOString());
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!cancelled) await fetchAll(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchAll]);

  const flights = useMemo(() => {
    const sorted = [...rawRepos].sort((a, b) => {
      const aLive = a.homepage ? 1 : 0;
      const bLive = b.homepage ? 1 : 0;
      if (aLive !== bLive) return bLive - aLive;
      const starDiff = (b.stargazers_count || 0) - (a.stargazers_count || 0);
      if (starDiff !== 0) return starDiff;
      return new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime();
    });
    return sorted.map((repo, idx) => buildFlightRecord(repo, idx, language));
  }, [rawRepos, language]);

  const telemetry = useMemo(() => {
    const langCounts = {};
    let totalStars = 0;
    let totalForks = 0;
    let liveCount = 0;

    rawRepos.forEach((repo) => {
      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;
      if (repo.homepage && repo.homepage.trim()) liveCount += 1;
      if (repo.language) {
        langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
      }
    });

    const totalWithLang = Object.values(langCounts).reduce((sum, val) => sum + val, 0) || 1;
    const languages = Object.entries(langCounts)
      .map(([name, count]) => ({
        name,
        count,
        percent: Math.round((count / totalWithLang) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalRepos: githubUser.public_repos || rawRepos.length,
      liveDeployments: liveCount,
      totalStars,
      totalForks,
      activeLanguagesCount: languages.length,
      languages,
    };
  }, [githubUser, rawRepos]);

  return {
    githubUser,
    flights,
    events,
    linkedin,
    telemetry,
    syncSource,
    loading,
    lastSynced,
    refreshData: () => fetchAll(true),
  };
}
