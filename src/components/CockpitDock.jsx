import { Plane, PlaneTakeoff, Ticket, User } from 'lucide-react';
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
      label: copy.nav.home,
      icon: <Plane size={19} />,
      onClick: () => scrollTo('home'),
      active: true,
    },
    {
      label: copy.nav.about,
      icon: <User size={19} />,
      onClick: () => scrollTo('about'),
    },
    {
      label: copy.nav.projects,
      icon: <PlaneTakeoff size={19} />,
      onClick: () => scrollTo('departures'),
    },
    {
      label: copy.nav.contact,
      icon: <Ticket size={19} />,
      onClick: () => scrollTo('boarding'),
    },
    { separator: true },
    {
      label: 'GitHub',
      icon: <FaGithub size={19} />,
      onClick: () => window.open('https://github.com/Fernius07', '_blank', 'noopener,noreferrer'),
    },
    {
      label: 'LinkedIn',
      icon: <FaLinkedin size={19} />,
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
        baseItemSize={44}
        magnification={60}
        panelHeight={60}
      />
    </div>
  );
}
