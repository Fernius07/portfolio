import { Moon, Plane, RefreshCw, Sun } from 'lucide-react';

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
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const syncLabel = loading
    ? copy.sync.updating
    : syncSource === 'live'
      ? copy.sync.live
      : syncSource === 'cached'
        ? copy.sync.cached
        : copy.sync.local;

  return (
    <header className="hud-navbar">
      <div className="hud-navbar-inner">
        <a
          href="#home"
          className="hud-brand"
          onClick={(e) => {
            e.preventDefault();
            scrollTo('home');
          }}
        >
          <span className="hud-brand-badge">
            <Plane size={17} />
          </span>
          <span className="hud-brand-meta">
            <span className="hud-callsign">Iñigo Fernández</span>
            <span className="hud-airport">@Fernius07</span>
          </span>
        </a>

        <nav className="hud-nav-links" aria-label="Main navigation">
          {[
            { id: 'home', label: copy.nav.home },
            { id: 'about', label: copy.nav.about },
            { id: 'departures', label: copy.nav.projects },
            { id: 'boarding', label: copy.nav.contact },
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
          <button
            type="button"
            className="sync-pill"
            onClick={onRefresh}
            disabled={loading}
            title={syncLabel}
          >
            <span className="sync-dot" />
            <span>{syncLabel}</span>
            <RefreshCw size={12} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>

          <button
            type="button"
            className="hud-icon-btn"
            onClick={onToggleLanguage}
            aria-label="Toggle language"
          >
            {language === 'es' ? 'ES / EN' : 'EN / ES'}
          </button>

          <button
            type="button"
            className="hud-icon-btn"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'night' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>
    </header>
  );
}
