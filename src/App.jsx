import { useEffect, useState } from 'react';
import { UI_COPY } from './data/fallbackData';
import { usePortfolioData } from './hooks/usePortfolioData';
import NavbarHUD from './components/NavbarHUD';
import FlightProgressHUD from './components/FlightProgressHUD';
import CockpitHero from './components/CockpitHero';
import FlightLogLinkedin from './components/FlightLogLinkedin';
import DeparturesBoard from './components/DeparturesBoard';
import BoardingPassSection from './components/BoardingPassSection';
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
  const { githubUser, projects, linkedin, stats, syncSource, loading, refreshData } =
    usePortfolioData(language);

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

      <FlightProgressHUD />

      <main>
        <CockpitHero
          copy={copy}
          githubUser={githubUser}
          stats={stats}
          theme={theme}
        />

        <FlightLogLinkedin
          copy={copy}
          language={language}
          linkedin={linkedin}
          stats={stats}
          theme={theme}
        />

        <DeparturesBoard copy={copy} projects={projects} />

        <BoardingPassSection
          copy={copy}
          language={language}
          linkedin={linkedin}
          stats={stats}
        />
      </main>

      <footer className="clean-footer">
        <div>{copy.footer.copy}</div>
      </footer>

      <CockpitDock copy={copy} theme={theme} />
    </div>
  );
}
