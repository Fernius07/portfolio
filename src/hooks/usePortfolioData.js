import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FALLBACK_GITHUB_REPOS,
  FALLBACK_GITHUB_USER,
  FALLBACK_LINKEDIN_PROFILE,
  GITHUB_USERNAME,
  REPO_CURATED_META,
} from '../data/fallbackData';

const CACHE_KEY = 'fernius07_portfolio_v2';
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

function buildProjectRecord(repo, index, language) {
  const meta = REPO_CURATED_META[repo.name];
  const hasHomepage = Boolean(repo.homepage && repo.homepage.trim().length > 0);
  const code = meta?.code || `PRJ-${String(index + 1).padStart(2, '0')}`;
  const isFeatured = Boolean(meta?.featured || hasHomepage || (repo.stargazers_count || 0) > 0);

  const liveDesc = repo.description && repo.description.trim().length > 0 ? repo.description.trim() : null;
  const fallbackDesc = meta ? meta[language] || meta.en : null;
  const autoDesc =
    language === 'es'
      ? `Proyecto ${repo.language || 'de software'} en GitHub.`
      : `${repo.language || 'Software'} project on GitHub.`;

  const summary = liveDesc || fallbackDesc || autoDesc;
  const tags = Array.from(
    new Set([...(Array.isArray(repo.topics) ? repo.topics : []), ...(meta?.tags || []), repo.language].filter(Boolean))
  ).slice(0, 4);

  return {
    ...repo,
    code,
    hasHomepage,
    isFeatured,
    summary,
    tags,
  };
}

export function usePortfolioData(language) {
  const [githubUser, setGithubUser] = useState(FALLBACK_GITHUB_USER);
  const [rawRepos, setRawRepos] = useState(FALLBACK_GITHUB_REPOS);
  const [linkedin, setLinkedin] = useState(FALLBACK_LINKEDIN_PROFILE);
  const [syncSource, setSyncSource] = useState('fallback');
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async (force = false) => {
    if (force) setLoading(true);

    if (!force) {
      const cached = readStorageCache();
      if (cached) {
        if (cached.user) setGithubUser(cached.user);
        if (cached.repos?.length) setRawRepos(cached.repos);
        if (cached.linkedin) setLinkedin(cached.linkedin);
        setSyncSource('cached');
        setLoading(false);
        return;
      }
    }

    let nextUser = null;
    let nextRepos = null;
    let nextLinkedin = null;
    let liveSuccess = false;

    try {
      const apiRes = await fetch('/api/github');
      const contentType = apiRes.headers.get('content-type') || '';
      if (apiRes.ok && contentType.includes('application/json')) {
        const data = await apiRes.json();
        if (data?.user && Array.isArray(data?.repos)) {
          nextUser = data.user;
          nextRepos = data.repos;
          liveSuccess = true;
        }
      }
    } catch {
      // Fall back to direct GitHub REST API locally
    }

    if (!liveSuccess) {
      try {
        const [uRes, rRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`),
        ]);
        if (uRes.ok && rRes.ok) {
          nextUser = await uRes.json();
          nextRepos = await rRes.json();
          liveSuccess = true;
        }
      } catch {
        // Offline or rate-limited -> keep fallback snapshot
      }
    }

    try {
      const liRes = await fetch('/api/linkedin');
      const ct = liRes.headers.get('content-type') || '';
      if (liRes.ok && ct.includes('application/json')) {
        nextLinkedin = await liRes.json();
      } else {
        const localRes = await fetch('/linkedin-profile.json');
        if (localRes.ok) nextLinkedin = await localRes.json();
      }
    } catch {
      try {
        const localRes = await fetch('/linkedin-profile.json');
        if (localRes.ok) nextLinkedin = await localRes.json();
      } catch {
        // Keep fallback LinkedIn object
      }
    }

    if (nextUser) setGithubUser(nextUser);
    if (Array.isArray(nextRepos) && nextRepos.length > 0) setRawRepos(nextRepos);
    if (nextLinkedin) setLinkedin(nextLinkedin);

    if (liveSuccess) {
      writeStorageCache({
        user: nextUser,
        repos: nextRepos,
        linkedin: nextLinkedin || FALLBACK_LINKEDIN_PROFILE,
      });
      setSyncSource('live');
    } else {
      setSyncSource('fallback');
    }

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

  const projects = useMemo(() => {
    const sorted = [...rawRepos].sort((a, b) => {
      const aLive = a.homepage ? 1 : 0;
      const bLive = b.homepage ? 1 : 0;
      if (aLive !== bLive) return bLive - aLive;
      const starDiff = (b.stargazers_count || 0) - (a.stargazers_count || 0);
      if (starDiff !== 0) return starDiff;
      return new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime();
    });
    return sorted.map((repo, idx) => buildProjectRecord(repo, idx, language));
  }, [rawRepos, language]);

  const stats = useMemo(() => {
    const langCounts = {};
    let totalStars = 0;
    let liveDemos = 0;

    rawRepos.forEach((repo) => {
      totalStars += repo.stargazers_count || 0;
      if (repo.homepage && repo.homepage.trim()) liveDemos += 1;
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
      liveDemos,
      totalStars,
      languagesCount: languages.length,
      languages,
    };
  }, [githubUser, rawRepos]);

  return {
    githubUser,
    projects,
    linkedin,
    stats,
    syncSource,
    loading,
    refreshData: () => fetchAll(true),
  };
}
