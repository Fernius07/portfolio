const GITHUB_USER = process.env.GITHUB_USERNAME || 'Fernius07';

export default async function handler(req, res) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'Fernius07-Aviation-Portfolio',
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const [userRes, reposRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${encodeURIComponent(GITHUB_USER)}`, { headers }),
      fetch(`https://api.github.com/users/${encodeURIComponent(GITHUB_USER)}/repos?per_page=100&sort=updated`, {
        headers,
      }),
      fetch(`https://api.github.com/users/${encodeURIComponent(GITHUB_USER)}/events/public?per_page=20`, {
        headers,
      }),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      return res.status(userRes.status || 502).json({
        error: 'GitHub API unavailable',
        rateLimitRemaining: userRes.headers.get('x-ratelimit-remaining'),
      });
    }

    const [user, repos, events] = await Promise.all([
      userRes.json(),
      reposRes.json(),
      eventsRes.ok ? eventsRes.json() : Promise.resolve([]),
    ]);

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({
      source: 'github-live-api',
      fetchedAt: new Date().toISOString(),
      user,
      repos: Array.isArray(repos) ? repos : [],
      events: Array.isArray(events) ? events : [],
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Failed to sync GitHub telemetry',
      details: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}
