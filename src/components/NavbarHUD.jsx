import { useEffect, useState } from 'react';
import { Moon, Plane, Radio, RefreshCw, Sun } from 'lucide-react';

export default function NavbarHUD({
  language,
  onToggleLanguage,
  theme,
  onToggleTheme,
  syncSource,
  loading,
  onRefresh,
  copy,
}) {
  const [zuluTime, setZuluTime] = useState(() => new Date().toISOString().slice(11, 19));

  useEffect(() => {
    const id = setInterval(() => {
      setZuluTime(new Date().toISOString().slice(11, 19));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const syncLabel =
    syncSource === 'live'
      ? copy.hud.syncLive
      : syncSource === 'cached'
        ? copy.hud.syncCached
        : copy.hud.syncFallback;

  return (
    <header className="hud-navbar">
      <div className="hud-navbar-inner">
        <a href="#cockpit" className="hud-brand" onClick={(e) => { e.preventDefault(); scrollTo('cockpit'); }}>
          <span className="hud-brand-badge">
            <Plane size={18} />
          </span>
          <span className="hud-brand-meta">
            <span className="hud-callsign">FERNIUS07 // LEBB</span>
            <span className="hud-airport">BILBAO FLIGHT DECK</span>
          </span>
        </a>

        <nav className="hud-nav-links" aria-label="Main navigation">
          {[
            { id: 'cockpit', label: copy.nav.cockpit },
            { id: 'boarding', label: copy.nav.boarding },
            { id: 'departures', label: copy.nav.departures },
            { id: 'avionics', label: copy.nav.avionics },
            { id: 'flightlog', label: copy.nav.flightlog },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              className="hud-nav-btn"
              onClick={() => scrollTo(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hud-controls">
          <span className="hud-clock-pill" title="UTC / Zulu Time">
            <Radio size={13} />
            <span>{zuluTime}Z</span>
          </span>

          <button
            type="button"
            className="sync-pill"
            onClick={onRefresh}
            disabled={loading}
            title={copy.hud.resync}
          >
            <span className="sync-dot" />
            <span>{loading ? copy.hud.syncing : syncLabel}</span>
            <RefreshCw size={12} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>

          <button
            type="button"
            className="hud-icon-btn"
            onClick={onToggleLanguage}
            aria-label="Toggle language"
          >
            {language === 'es' ? 'ES → EN' : 'EN → ES'}
          </button>

          <button
            type="button"
            className="hud-icon-btn"
            onClick={onToggleTheme}
            aria-label="Toggle cockpit lighting"
          >
            {theme === 'night' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>
    </header>
  );
}
