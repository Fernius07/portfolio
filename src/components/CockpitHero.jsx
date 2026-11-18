import { motion } from 'motion/react';
import { ArrowDownRight, Code2, GitBranch, Globe, MapPin, Star, Ticket } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import Radar from './react-bits/Radar/Radar';
import SplitFlapText from './react-bits/SplitFlapText/SplitFlapText';
import BlurText from './react-bits/BlurText/BlurText';
import CountUp from './react-bits/CountUp/CountUp';
import Magnet from './react-bits/Magnet/Magnet';
import StarBorder from './react-bits/StarBorder/StarBorder';
import { LINKEDIN_URL } from '../data/fallbackData';

export default function CockpitHero({ copy, githubUser, stats, theme }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const cards = [
    {
      key: 'repos',
      icon: <GitBranch size={16} color="#38bdf8" />,
      value: stats.totalRepos,
      label: copy.hero.stats.repos,
    },
    {
      key: 'live',
      icon: <Globe size={16} color="#3ef09a" />,
      value: stats.liveDemos,
      label: copy.hero.stats.live,
    },
    {
      key: 'stars',
      icon: <Star size={16} color="#fbbf24" />,
      value: stats.totalStars,
      label: copy.hero.stats.stars,
    },
    {
      key: 'langs',
      icon: <Code2 size={16} color="#a78bfa" />,
      value: stats.languagesCount,
      label: copy.hero.stats.languages,
    },
  ];

  return (
    <section id="home" className="cockpit-hero">
      <div className="hero-radar-layer">
        <Radar
          color={theme === 'night' ? '#3ef09a' : '#0284c7'}
          mode="sweep"
          speed={0.75}
          trail={0.35}
          ringCount={5}
          spokeCount={10}
          targets={6}
          clutter={0.18}
          tilt={20}
          centerX={0.74}
          centerY={0.48}
          gridOpacity={0.55}
          lightMode={theme === 'day'}
        />
      </div>
      <div className="hero-vignette" />

      <div className="hero-content">
        <motion.div
          className="hero-profile-pill"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          {githubUser?.avatar_url && (
            <img
              src={githubUser.avatar_url}
              alt={githubUser.name || 'Fernius07'}
              width={26}
              height={26}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
          )}
          <span>@{githubUser?.login || 'Fernius07'}</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
            <MapPin size={13} /> Bilbao
          </span>
        </motion.div>

        <motion.div
          className="hero-splitflap-wrap"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          <SplitFlapText
            words={copy.hero.callsigns}
            fontSize={40}
            padTo={15}
            flipDuration={0.09}
            stagger={0.04}
            cycleDelay={2800}
            flipsPerChar={5}
            tileColor="#0f172a"
            textColor="#fbbf24"
            tileRadius={8}
            gap={5}
            glare={0.2}
          />
        </motion.div>

        <div className="hero-headline">
          <BlurText
            text={copy.hero.headline}
            delay={55}
            animateBy="words"
            direction="top"
            trigger="load"
          />
        </div>

        <motion.p
          className="hero-subhead"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          {copy.hero.subhead}
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <Magnet padding={60} magnetStrength={2} scale={1.03}>
            <StarBorder
              as="button"
              type="button"
              className="cockpit-cta-btn"
              color="#3ef09a"
              trailColor="#38bdf8"
              backgroundColor="linear-gradient(135deg, #0ea5e9, #10b981)"
              textColor="#03111c"
              duration={3.2}
              radius={12}
              onClick={() => scrollTo('departures')}
            >
              <span>{copy.hero.ctaProjects}</span>
              <ArrowDownRight size={17} />
            </StarBorder>
          </Magnet>

          <Magnet padding={55} magnetStrength={2}>
            <button
              type="button"
              className="cockpit-secondary-btn"
              onClick={() => scrollTo('boarding')}
            >
              <Ticket size={16} />
              <span>{copy.hero.ctaBoarding}</span>
            </button>
          </Magnet>

          <div style={{ display: 'inline-flex', gap: '0.55rem' }}>
            <a
              href={githubUser?.html_url || 'https://github.com/Fernius07'}
              target="_blank"
              rel="noopener noreferrer"
              className="hud-icon-btn"
              style={{ height: '42px', padding: '0 0.85rem', borderRadius: '11px', textDecoration: 'none' }}
              aria-label="GitHub"
            >
              <FaGithub size={17} />
              <span>GitHub</span>
            </a>

            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hud-icon-btn"
              style={{ height: '42px', padding: '0 0.85rem', borderRadius: '11px', textDecoration: 'none' }}
              aria-label="LinkedIn"
            >
              <FaLinkedin size={17} />
              <span>LinkedIn</span>
            </a>
          </div>
        </motion.div>

        <div className="hero-gauges-grid">
          {cards.map((card, i) => (
            <motion.div
              key={card.key}
              className="gauge-card"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.55 + i * 0.06 }}
              whileHover={{ y: -3 }}
            >
              <div className="gauge-top">
                <span className="gauge-label">{card.label}</span>
                {card.icon}
              </div>
              <div className="gauge-number">
                <CountUp to={card.value} duration={1.4} trigger="load" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
