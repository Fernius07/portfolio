import { useEffect, useState } from 'react';
import { UI_COPY } from './data/fallbackData';
import { usePortfolioData } from './hooks/usePortfolioData';
import NavbarHUD from './components/NavbarHUD';
import FlightProgressHUD from './components/FlightProgressHUD';
import CockpitHero from './components/CockpitHero';
import BoardingPassSection from './components/BoardingPassSection';
import DeparturesBoard from './components/DeparturesBoard';
import AvionicsTelemetry from './components/AvionicsTelemetry';
import FlightLogLinkedin from './components/FlightLogLinkedin';
import CockpitDock from './components/CockpitDock';

export default function App() {
  const [language, setLanguage] = useState(() => localStorage.getItem('cockpit-lang') || 'es');
  const [theme, setTheme] = useState(() => localStorage.getItem('cockpit-theme') || 'night');

  useEffect(() => {
    localStorage.setItem('cockpit-lang', language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    localStorage.setItem('cockpit-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const copy = UI_COPY[language];
  const {
    githubUser,
    flights,
    events,
    linkedin,
    telemetry,
    syncSource,
    loading,
    lastSynced,
    refreshData,
  } = usePortfolioData(language);

  return (
    <div className="cockpit-app">
      <NavbarHUD
        language={language}
        onToggleLanguage={() => setLanguage((prev) => (prev === 'es' ? 'en' : 'es'))}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'night' ? 'day' : 'night'))}
        syncSource={syncSource}
        loading={loading}
        onRefresh={refreshData}
        copy={copy}
      />

      <FlightProgressHUD copy={copy} />

      <main>
        <CockpitHero
          copy={copy}
          githubUser={githubUser}
          telemetry={telemetry}
          theme={theme}
        />

        <BoardingPassSection
          copy={copy}
          language={language}
          linkedin={linkedin}
          telemetry={telemetry}
        />

        <DeparturesBoard copy={copy} flights={flights} />

        <AvionicsTelemetry
          copy={copy}
          language={language}
          telemetry={telemetry}
          events={events}
          theme={theme}
        />

        <FlightLogLinkedin
          copy={copy}
          language={language}
          linkedin={linkedin}
          theme={theme}
        />
      </main>

      <footer
        style={{
          borderTop: '1px solid var(--border-hud)',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <div style={{ color: 'var(--accent-amber)', fontSize: '0.82rem', letterSpacing: '0.14em', marginBottom: '0.45rem' }}>
          {copy.footer.title}
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{copy.footer.copy}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '0.4rem' }}>
          LAST TELEMETRY SYNC: {new Date(lastSynced).toLocaleString()}
        </div>
      </footer>

      <CockpitDock copy={copy} theme={theme} />
    </div>
  );
}
