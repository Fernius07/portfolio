import { BookOpen, Cpu, Plane, PlaneTakeoff, Ticket } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import Dock from './react-bits/Dock/Dock';
import { LINKEDIN_URL } from '../data/fallbackData';

export default function CockpitDock({ copy, theme }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const items = [
    {
      label: copy.nav.cockpit,
      icon: <Plane size={20} />,
      onClick: () => scrollTo('cockpit'),
      active: true,
    },
    {
      label: copy.nav.boarding,
      icon: <Ticket size={20} />,
      onClick: () => scrollTo('boarding'),
    },
    {
      label: copy.nav.departures,
      icon: <PlaneTakeoff size={20} />,
      onClick: () => scrollTo('departures'),
    },
    {
      label: copy.nav.avionics,
      icon: <Cpu size={20} />,
      onClick: () => scrollTo('avionics'),
    },
    {
      label: copy.nav.flightlog,
      icon: <BookOpen size={20} />,
      onClick: () => scrollTo('flightlog'),
    },
    { separator: true },
    {
      label: 'GitHub (@Fernius07)',
      icon: <FaGithub size={20} />,
      onClick: () => window.open('https://github.com/Fernius07', '_blank', 'noopener,noreferrer'),
    },
    {
      label: 'LinkedIn',
      icon: <FaLinkedin size={20} />,
      onClick: () => window.open(LINKEDIN_URL, '_blank', 'noopener,noreferrer'),
    },
  ];

  return (
    <div className="cockpit-dock-wrapper">
      <Dock
        items={items}
        position="bottom"
        theme={theme === 'day' ? 'light' : 'dark'}
        accentColor="#38bdf8"
        baseItemSize={46}
        magnification={64}
        panelHeight={64}
      />
    </div>
  );
}
